import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { roadSegments } from "./curveUtils"
import { BRAND_COLORS } from "../styles/identity.tokens"

export const ROAD_RADIUS = 2.8
const LINE_RADIUS = 0.08
const CENTER_RADIUS = 0.08
const SEGMENTS_PER_CURVE = 100

// Compute and store Frenet frames for each segment
const segmentFramesMap = {}
roadSegments.forEach(segment => {
  const rawFrames = segment.curve.computeFrenetFrames(SEGMENTS_PER_CURVE, false)
  segmentFramesMap[segment.id] = {
    tangents: rawFrames.tangents,
    normals: rawFrames.normals.map(n => n.clone().multiplyScalar(-1)), // FLIP normals
    binormals: rawFrames.binormals
  }
})

export function getSegmentFrames(segmentId) {
  return segmentFramesMap[segmentId]
}

/**
 * Road Component - SINGLE SOURCE OF TRUTH
 * 
 * Built on masterRoadCurve - NEVER rebuilds
 * Car and camera sample this same curve
 * Road geometry is static, movement is via curve progress
 */
export default function Road({ 
  motionDensity, 
  activePhase, 
  activeAccent, 
  scrollProgress, 
  currentSegment,
  // Phase 5: UI ↔ World coupling signals
  sectionPulse,
  cardChangeSignal
}) {
  const lineMaterialRef = useRef()
  const roadMaterialRef = useRef()
  const centerLineRef = useRef()
  
  // Phase 5: Pulse tracking with timestamps
  const pulseStartTimeRef = useRef(0)
  const lastPulseSectionRef = useRef(null)
  const cardPulseStartTimeRef = useRef(0)
  const lastCardIndexRef = useRef(null)

  useFrame(({ clock }) => {
    const phase = activePhase.current || "HERO"
    const progress = scrollProgress?.current || 0
    const distance = currentSegment?.current?.distance || 0
    const now = clock.elapsedTime

    // ===== PHASE 5: SECTION PULSE DETECTION =====
    // Detect new section pulse and start pulse animation
    if (sectionPulse?.current && sectionPulse.current !== lastPulseSectionRef.current) {
      pulseStartTimeRef.current = now
      lastPulseSectionRef.current = sectionPulse.current
      sectionPulse.current = null // Reset pulse flag (consumed by Three.js)
    }

    // ===== PHASE 5: CARD CHANGE PULSE DETECTION =====
    if (cardChangeSignal?.current !== null && cardChangeSignal.current !== lastCardIndexRef.current) {
      cardPulseStartTimeRef.current = now
      lastCardIndexRef.current = cardChangeSignal.current
      cardChangeSignal.current = null // Reset signal flag
    }

    // ROAD CONTINUITY - Center line intensifies before turns
    if (centerLineRef.current) {
      let targetIntensity = 0.6
      
      // ===== PHASE 5: CENTERLINE PULSE (0.6 → 1.2 → 0.6 over 140ms) =====
      const timeSincePulse = (now - pulseStartTimeRef.current) * 1000 // Convert to ms
      if (timeSincePulse < 140) {
        // Pulse animation: 0-50ms rise, 50-140ms fall
        if (timeSincePulse < 50) {
          // Rise phase: exponential ease out
          const t = timeSincePulse / 50
          const eased = 1 - Math.pow(1 - t, 3) // Ease out cubic
          targetIntensity = 0.6 + (1.2 - 0.6) * eased
        } else {
          // Fall phase: exponential ease in
          const t = (timeSincePulse - 50) / 90
          const eased = Math.pow(t, 2) // Ease in quad
          targetIntensity = 1.2 - (1.2 - 0.6) * eased
        }
      } else if (progress < 0.05) {
        // Moment of arrival
        targetIntensity = (progress / 0.05) * 0.6
      } else if (distance > 180 && distance < 200) {
        // Before TURN_1
        targetIntensity = 0.6 + ((distance - 180) / 20) * 0.2
      } else if (distance > 680 && distance < 700) {
        // Before TURN_2
        targetIntensity = 0.6 + ((distance - 680) / 20) * 0.2
      } else if (phase === "EVENTS_SIDE_PROFILE") {
        targetIntensity = 0.9
      }
      
      centerLineRef.current.emissiveIntensity += (targetIntensity - centerLineRef.current.emissiveIntensity) * 0.1
    }

    if (lineMaterialRef.current && activeAccent.current) {
      const isEvent = phase === "EVENTS_SIDE_PROFILE"
      let emissiveIntensity = isEvent ? 1.0 : 0.7
      
      // ===== PHASE 5: CARD CHANGE - GLOW TIGHTEN (80ms pulse) =====
      const timeSinceCardPulse = (now - cardPulseStartTimeRef.current) * 1000
      if (timeSinceCardPulse < 80) {
        // Brief intensity boost on card change
        const t = timeSinceCardPulse / 80
        const eased = Math.sin(t * Math.PI) // Smooth pulse in/out
        const boost = eased * 0.3 // +30% peak intensity
        emissiveIntensity += boost
      }
      
      lineMaterialRef.current.emissive.set(activeAccent.current)
      lineMaterialRef.current.color.set(activeAccent.current)
      lineMaterialRef.current.emissiveIntensity = emissiveIntensity
    }

    if (roadMaterialRef.current) {
      roadMaterialRef.current.roughness = 0.9
      const baseIntensity = phase === "EVENTS_SIDE_PROFILE" ? 0.14 : phase === "FORWARD_CONTENT" ? 0.07 : 0.1
      roadMaterialRef.current.emissiveIntensity = baseIntensity
    }
  })

  // Build geometry for EACH segment - true forward journey
  const geometries = useMemo(() => {
    const roadGeos = []
    const lineGeos = []
    const centerGeos = []
    const edgeGeos = []
    
    roadSegments.forEach(segment => {
      roadGeos.push(new THREE.TubeGeometry(segment.curve, SEGMENTS_PER_CURVE, ROAD_RADIUS, 12, false))
      lineGeos.push(new THREE.TubeGeometry(segment.curve, SEGMENTS_PER_CURVE, LINE_RADIUS, 8, false))
      centerGeos.push(new THREE.TubeGeometry(segment.curve, SEGMENTS_PER_CURVE, CENTER_RADIUS, 8, false))
      edgeGeos.push(new THREE.TubeGeometry(segment.curve, SEGMENTS_PER_CURVE, 0.12, 8, false))
    })
    
    console.log('Road geometries created -', roadSegments.length, 'segments')
    return { roadGeos, lineGeos, centerGeos, edgeGeos }
  }, [])

  useEffect(() => {
    return () => {
      geometries.roadGeos.forEach(g => g.dispose())
      geometries.lineGeos.forEach(g => g.dispose())
      geometries.centerGeos.forEach(g => g.dispose())
      geometries.edgeGeos.forEach(g => g.dispose())
    }
  }, [geometries])

  return (
    <group position={[0, 0, 0]}>
      {/* Render each segment sequentially */}
      {roadSegments.map((segment, i) => (
        <group key={segment.id}>
          {/* PHASE 8: Road materials from identity tokens */}
          <mesh geometry={geometries.roadGeos[i]}>
            <meshStandardMaterial
              ref={i === 0 ? roadMaterialRef : null}
              color={BRAND_COLORS.semantic.roadSurface}
              metalness={0.35}
              roughness={0.85}
              emissive={BRAND_COLORS.semantic.road}
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh geometry={geometries.lineGeos[i]}>
            <meshStandardMaterial
              ref={i === 0 ? lineMaterialRef : null}
              color={BRAND_COLORS.semantic.road}
              emissive={BRAND_COLORS.semantic.road}
              emissiveIntensity={0.7}
            />
          </mesh>
          <mesh geometry={geometries.centerGeos[i]} position={[0, 0.08, 0]}>
            <meshStandardMaterial
              ref={i === 0 ? centerLineRef : null}
              color={BRAND_COLORS.base.text}
              emissive={BRAND_COLORS.base.text}
              emissiveIntensity={0.6}
              toneMapped={false}
            />
          </mesh>
          <mesh geometry={geometries.edgeGeos[i]} position={[-2.6, 0, 0]}>
            <meshStandardMaterial
              color={BRAND_COLORS.semantic.city}
              emissive={BRAND_COLORS.semantic.city}
              emissiveIntensity={0.08}
              transparent
              opacity={0.08}
            />
          </mesh>
          <mesh geometry={geometries.edgeGeos[i]} position={[2.6, 0, 0]}>
            <meshStandardMaterial
              color={BRAND_COLORS.semantic.city}
              emissive={BRAND_COLORS.semantic.city}
              emissiveIntensity={0.08}
              transparent
              opacity={0.08}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
