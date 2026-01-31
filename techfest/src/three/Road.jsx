import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { roadSegments } from "./curveUtils"

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
export default function Road({ motionDensity, activePhase, activeAccent, scrollProgress }) {
  const lineMaterialRef = useRef()
  const roadMaterialRef = useRef()
  const centerLineRef = useRef()

  useFrame(() => {
    const phase = activePhase.current || "HERO"
    const progress = scrollProgress?.current || 0

    // MOMENT OF ARRIVAL - Center line activates progressively on first scroll
    if (centerLineRef.current) {
      let targetIntensity
      if (progress < 0.05) {
        // Ramp up from 0 to base during first 5% scroll
        targetIntensity = (progress / 0.05) * 0.6
      } else if (phase === "EVENTS_SIDE_PROFILE") {
        targetIntensity = 0.9
      } else {
        targetIntensity = 0.6
      }
      centerLineRef.current.emissiveIntensity += (targetIntensity - centerLineRef.current.emissiveIntensity) * 0.1
    }

    if (lineMaterialRef.current && activeAccent.current) {
      const isEvent = phase === "EVENTS_SIDE_PROFILE"
      const emissiveIntensity = isEvent ? 1.0 : 0.7
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
          <mesh geometry={geometries.roadGeos[i]}>
            <meshStandardMaterial
              ref={i === 0 ? roadMaterialRef : null}
              color="#111111"
              metalness={0.35}
              roughness={0.85}
              emissive="#00E5FF"
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh geometry={geometries.lineGeos[i]}>
            <meshStandardMaterial
              ref={i === 0 ? lineMaterialRef : null}
              color="#00E5FF"
              emissive="#00E5FF"
              emissiveIntensity={0.7}
            />
          </mesh>
          <mesh geometry={geometries.centerGeos[i]} position={[0, 0.08, 0]}>
            <meshStandardMaterial
              ref={i === 0 ? centerLineRef : null}
              color="#FFFFFF"
              emissive="#FFFFFF"
              emissiveIntensity={0.6}
              toneMapped={false}
            />
          </mesh>
          <mesh geometry={geometries.edgeGeos[i]} position={[-2.6, 0, 0]}>
            <meshStandardMaterial
              color="#1A2A3A"
              emissive="#1A2A3A"
              emissiveIntensity={0.08}
              transparent
              opacity={0.08}
            />
          </mesh>
          <mesh geometry={geometries.edgeGeos[i]} position={[2.6, 0, 0]}>
            <meshStandardMaterial
              color="#1A2A3A"
              emissive="#1A2A3A"
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
