import { useEffect, useMemo, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const ROAD_RADIUS = 2.4
const LINE_RADIUS = 0.08
const TUBE_SEGMENTS = 160

const buildCurve = (profile) => {
  if (profile === "TURN") {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -18),
      new THREE.Vector3(0, 0, -36),
      new THREE.Vector3(4, 0, -54),
      new THREE.Vector3(10, 0, -72),
      new THREE.Vector3(18, 0, -90),
      new THREE.Vector3(26, 0, -108),
      new THREE.Vector3(34, 0, -126)
    ])
  }

  if (profile === "POST_TURN") {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -24),
      new THREE.Vector3(0, 0, -48),
      new THREE.Vector3(0, 0, -72),
      new THREE.Vector3(0, 0, -96),
      new THREE.Vector3(0, 0, -120)
    ])
  }

  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -24),
    new THREE.Vector3(0, 0, -48),
    new THREE.Vector3(0, 0, -72),
    new THREE.Vector3(0, 0, -96),
    new THREE.Vector3(0, 0, -120)
  ])
}

/**
 * Road Component
 *
 * TubeGeometry-based curved road.
 * - Geometry rebuilds only on phase transitions.
 * - No world translation (movement handled via curve parameter for car/camera).
 */
export default function Road({ motionDensity, activePhase, activeAccent }) {
  const lineMaterialRef = useRef()
  const roadMaterialRef = useRef()
  const lastPhaseRef = useRef(activePhase.current)
  const [curveProfile, setCurveProfile] = useState("HERO_STRAIGHT")

  useFrame(() => {
    const phase = activePhase.current || "HERO"
    const density = motionDensity.current || 0

    let nextProfile = "HERO_STRAIGHT"
    if (phase === "ROTATE_TO_SIDE" || phase === "EVENTS_SIDE_PROFILE") {
      nextProfile = "TURN"
    } else if (phase === "ROTATE_FORWARD") {
      nextProfile = "POST_TURN"
    } else if (phase === "FORWARD_CONTENT") {
      nextProfile = "POST_TURN"
    }

    if (lastPhaseRef.current !== phase) {
      lastPhaseRef.current = phase
      setCurveProfile(nextProfile)
    }

    if (lineMaterialRef.current && activeAccent.current) {
      const emissiveIntensity = 0.35 + density * 0.4
      lineMaterialRef.current.emissive.set(activeAccent.current)
      lineMaterialRef.current.color.set(activeAccent.current)
      lineMaterialRef.current.emissiveIntensity = emissiveIntensity
    }

    if (roadMaterialRef.current) {
      roadMaterialRef.current.roughness = 0.85 - density * 0.2
    }
  })

  const curve = useMemo(() => buildCurve(curveProfile), [curveProfile])
  const roadGeometry = useMemo(() => new THREE.TubeGeometry(curve, TUBE_SEGMENTS, ROAD_RADIUS, 12, false), [curve])
  const lineGeometry = useMemo(() => new THREE.TubeGeometry(curve, TUBE_SEGMENTS, LINE_RADIUS, 8, false), [curve])

  useEffect(() => () => roadGeometry.dispose(), [roadGeometry])
  useEffect(() => () => lineGeometry.dispose(), [lineGeometry])

  return (
    <group position={[0, -0.05, 0]}>
      <mesh geometry={roadGeometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          ref={roadMaterialRef}
          color="#0C1222"
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>
      <mesh geometry={lineGeometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          ref={lineMaterialRef}
          color="#7C3AED"
          emissive="#7C3AED"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}
