import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { masterRoadCurve } from "./curveUtils"

export const ROAD_RADIUS = 2.8
const LINE_RADIUS = 0.08
const CENTER_RADIUS = 0.08
const TUBE_SEGMENTS = 500

// Compute Frenet frames for car positioning
// NOTE: TubeGeometry uses inverted normals, we need to flip them
const rawFrames = masterRoadCurve.computeFrenetFrames(TUBE_SEGMENTS, false)
export const roadFrames = {
  tangents: rawFrames.tangents,
  normals: rawFrames.normals.map(n => n.clone().multiplyScalar(-1)), // FLIP normals
  binormals: rawFrames.binormals
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

  // Build geometry ONCE on master curve
  const roadGeometry = useMemo(() => {
    const geom = new THREE.TubeGeometry(masterRoadCurve, TUBE_SEGMENTS, ROAD_RADIUS, 12, false)
    const curveLength = masterRoadCurve.getLength()
    const endZ = masterRoadCurve.points[masterRoadCurve.points.length - 1].z
    console.log('Road geometry created - curve length:', curveLength.toFixed(1), 'end Z:', endZ.toFixed(1))
    return geom
  }, [])
  const lineGeometry = useMemo(() => new THREE.TubeGeometry(masterRoadCurve, TUBE_SEGMENTS, LINE_RADIUS, 8, false), [])
  const centerGeometry = useMemo(() => {
    const geom = new THREE.TubeGeometry(masterRoadCurve, TUBE_SEGMENTS, CENTER_RADIUS, 8, false)
    console.log('Center line geometry created - radius:', CENTER_RADIUS, 'segments:', TUBE_SEGMENTS)
    return geom
  }, [])
  const edgeGeometry = useMemo(() => new THREE.TubeGeometry(masterRoadCurve, TUBE_SEGMENTS, 0.12, 8, false), [])

  useEffect(() => () => roadGeometry.dispose(), [roadGeometry])
  useEffect(() => () => lineGeometry.dispose(), [lineGeometry])
  useEffect(() => () => centerGeometry.dispose(), [centerGeometry])
  useEffect(() => () => edgeGeometry.dispose(), [edgeGeometry])

  return (
    <group position={[0, 0, 0]}>
      <mesh geometry={roadGeometry}>
        <meshStandardMaterial
          ref={roadMaterialRef}
          color="#111111"
          metalness={0.35}
          roughness={0.85}
          emissive="#00E5FF"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh geometry={lineGeometry}>
        <meshStandardMaterial
          ref={lineMaterialRef}
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={0.7}
        />
      </mesh>
      {/* Center line - white stripe with spotlight boost */}
      <mesh geometry={centerGeometry} position={[0, 0.08, 0]}>
        <meshStandardMaterial
          ref={centerLineRef}
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={0.6}
          toneMapped={false}
        />
      </mesh>
      <mesh geometry={edgeGeometry} position={[-2.6, 0, 0]}>
        <meshStandardMaterial
          color="#1A2A3A"
          emissive="#1A2A3A"
          emissiveIntensity={0.08}
          transparent
          opacity={0.08}
        />
      </mesh>
      <mesh geometry={edgeGeometry} position={[2.6, 0, 0]}>
        <meshStandardMaterial
          color="#1A2A3A"
          emissive="#1A2A3A"
          emissiveIntensity={0.08}
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  )
}
