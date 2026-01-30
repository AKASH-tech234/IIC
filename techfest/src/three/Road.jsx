import { useEffect, useMemo, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { buildRoadCurve } from "./curveUtils"

const ROAD_RADIUS = 2.8
const LINE_RADIUS = 0.08
const CENTER_RADIUS = 0.05
const TUBE_SEGMENTS = 200

/**
 * Road Component
 *
 * TubeGeometry-based curved road.
 * - Geometry rebuilds only on phase transitions.
 * - No world translation (movement handled via curve parameter for car/camera).
 */
export default function Road({ motionDensity, activePhase, activeAccent }) {
  const lineMaterialRef = useRef()
  const centerMaterialRef = useRef()
  const roadMaterialRef = useRef()
  const lastPhaseRef = useRef(activePhase.current)
  const [curveProfile, setCurveProfile] = useState("HERO_STRAIGHT")

  useFrame(() => {
    const phase = activePhase.current || "HERO"
    const density = motionDensity.current || 0

    let nextProfile = "STRAIGHT"
    if (phase === "ROTATE_TO_SIDE" || phase === "EVENTS_SIDE_PROFILE") {
      nextProfile = "TURN"
    } else if (phase === "ROTATE_FORWARD" || phase === "FORWARD_CONTENT") {
      nextProfile = "POST_TURN"
    }

    if (lastPhaseRef.current !== phase) {
      lastPhaseRef.current = phase
      setCurveProfile(nextProfile)
    }

    if (lineMaterialRef.current && activeAccent.current) {
      const isEvent = phase === "EVENTS_SIDE_PROFILE"
      const emissiveIntensity = isEvent ? 1.0 : 0.7
      lineMaterialRef.current.emissive.set(activeAccent.current)
      lineMaterialRef.current.color.set(activeAccent.current)
      lineMaterialRef.current.emissiveIntensity = emissiveIntensity
    }

    if (centerMaterialRef.current) {
      centerMaterialRef.current.emissiveIntensity = phase === "EVENTS_SIDE_PROFILE" ? 0.9 : 0.4
    }

    if (roadMaterialRef.current) {
      roadMaterialRef.current.roughness = 0.9
      roadMaterialRef.current.emissiveIntensity = phase === "EVENTS_SIDE_PROFILE" ? 0.14 : 0.1
    }
  })

  const curve = useMemo(() => buildRoadCurve(curveProfile), [curveProfile])
  const roadGeometry = useMemo(() => new THREE.TubeGeometry(curve, TUBE_SEGMENTS, ROAD_RADIUS, 12, false), [curve])
  const lineGeometry = useMemo(() => new THREE.TubeGeometry(curve, TUBE_SEGMENTS, LINE_RADIUS, 8, false), [curve])
  const centerGeometry = useMemo(() => new THREE.TubeGeometry(curve, TUBE_SEGMENTS, CENTER_RADIUS, 8, false), [curve])
  const edgeGeometry = useMemo(() => new THREE.TubeGeometry(curve, TUBE_SEGMENTS, 0.12, 8, false), [curve])

  useEffect(() => () => roadGeometry.dispose(), [roadGeometry])
  useEffect(() => () => lineGeometry.dispose(), [lineGeometry])
  useEffect(() => () => centerGeometry.dispose(), [centerGeometry])
  useEffect(() => () => edgeGeometry.dispose(), [edgeGeometry])

  return (
    <group position={[0, -0.02, 0]}>
      <mesh geometry={roadGeometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          ref={roadMaterialRef}
          color="#05070D"
          metalness={0.1}
          roughness={0.9}
          emissive="#00E5FF"
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh geometry={lineGeometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          ref={lineMaterialRef}
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={0.7}
        />
      </mesh>
      <mesh geometry={centerGeometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          ref={centerMaterialRef}
          color="#EAFBFF"
          emissive="#EAFBFF"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh geometry={edgeGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[-2.6, 0, 0]}>
        <meshStandardMaterial
          color="#1A2A3A"
          emissive="#1A2A3A"
          emissiveIntensity={0.08}
          transparent
          opacity={0.08}
        />
      </mesh>
      <mesh geometry={edgeGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[2.6, 0, 0]}>
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
