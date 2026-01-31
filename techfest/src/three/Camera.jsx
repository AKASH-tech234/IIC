import { useMemo, useRef } from "react"
import { useThree } from "@react-three/fiber"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { masterRoadCurve } from "./curveUtils"

/**
 * Dynamic Chase Camera
 * 
 * ANCHORED to car position - never leads, always follows
 * Camera reads car position and applies local offset
 * Creates cinematic forward motion effect
 */
export default function Camera({ activePhase, phaseProgress, carRef }) {
  const { camera } = useThree()
  const lastPhaseRef = useRef(null)
  const lockedPoseRef = useRef(null)

  const heroPosition = useMemo(() => new THREE.Vector3(0, 2.8, 6), [])
  const heroLookAt = useMemo(() => new THREE.Vector3(0, 0.8, -10), [])
  const exitPosition = useMemo(() => new THREE.Vector3(0, 2.5, 5.5), [])
  const exitLookAt = useMemo(() => new THREE.Vector3(0, 0.8, -8), [])

  useFrame(() => {
    // CRITICAL: Camera MUST read carRef EVERY FRAME
    if (!carRef || !carRef.current) return

    const phase = activePhase.current || "HERO"
    const carPosition = carRef.current.position

    // FOV shift
    const targetFOV = phase === "EVENTS_SIDE_PROFILE" ? 38 : 50
    camera.fov += (targetFOV - camera.fov) * 0.08
    camera.updateProjectionMatrix()

    // Track phase changes
    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase
      lockedPoseRef.current = null
    }

    // FIXED LOCAL OFFSET - no mode switching
    let localOffset
    if (phase === "EVENTS_SIDE_PROFILE") {
      localOffset = new THREE.Vector3(4, 2.7, 0)
    } else {
      localOffset = new THREE.Vector3(0, 2.2, 6) // Always behind car
    }

    // Camera target = car position + offset (NEVER independent)
    const cameraTarget = carPosition.clone().add(localOffset)

    // EVENTS lock
    if (phase === "EVENTS_SIDE_PROFILE") {
      if (!lockedPoseRef.current) {
        lockedPoseRef.current = {
          position: cameraTarget.clone(),
          lookAt: carPosition.clone()
        }
      }
      camera.position.lerp(lockedPoseRef.current.position, 0.08)
      camera.lookAt(lockedPoseRef.current.lookAt)
      return
    }

    // Smooth follow - ALWAYS lerp, NEVER set directly
    camera.position.lerp(cameraTarget, 0.08)
    camera.lookAt(carPosition)
  })

  return null
}
