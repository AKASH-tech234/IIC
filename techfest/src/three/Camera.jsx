import { useRef } from "react"
import { useThree } from "@react-three/fiber"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

/**
 * Dynamic Chase Camera
 * 
 * ANCHORED to car position - never leads, always follows
 * Camera reads car position and applies local offset
 * Creates cinematic forward motion effect
 */
export default function Camera({ activePhase, carRef, currentSegment }) {
  const { camera } = useThree()
  const lastPhaseRef = useRef(null)
  const lockedPoseRef = useRef(null)

  useFrame(() => {
    // CRITICAL: Camera MUST read carRef EVERY FRAME
    if (!carRef || !carRef.current) return

    const phase = activePhase.current || "HERO"
    const carPosition = carRef.current.position
    const segmentId = currentSegment?.current?.id || "HERO"
    const localT = currentSegment?.current?.localT || 0

    // SEGMENT-AWARE FOV MICRO-BEATS
    let targetFOV = 50
    if (segmentId === "TURN_1" && localT < 0.3) {
      targetFOV = 55 // Slight zoom-out before curve
    } else if (segmentId === "EVENTS") {
      targetFOV = 38 // Compression for gallery
    } else if (segmentId === "TURN_2") {
      targetFOV = 52 // Gentle recovery
    } else if (segmentId === "FINAL") {
      targetFOV = 50 // Stable approach
    }
    
    camera.fov += (targetFOV - camera.fov) * 0.08
    camera.updateProjectionMatrix()

    // Track phase changes
    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase
      lockedPoseRef.current = null
    }

    // FIXED LOCAL OFFSET - adjusts per phase for visibility
    let localOffset
    if (phase === "EVENTS_SIDE_PROFILE") {
      // Side-top view during EVENTS for car visibility during color changes
      localOffset = new THREE.Vector3(6, 4, 2)
    } else {
      localOffset = new THREE.Vector3(0, 2.2, 6) // Always behind car
    }

    // Camera target = car position + offset (NEVER independent)
    const cameraTarget = carPosition.clone().add(localOffset)

    // Smooth follow - ALWAYS lerp, supports reverse scrolling
    camera.position.lerp(cameraTarget, 0.08)
    camera.lookAt(carPosition)
    
    // Track phase changes
    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase
    }
  })

  return null
}
