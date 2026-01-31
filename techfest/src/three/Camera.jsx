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
    const phase = activePhase.current || "HERO"
    const phaseProgressValue = phaseProgress.current || 0
    
    // HERO OVERRIDE - Cinematic intro framing
    if (phase === "HERO") {
      camera.position.lerp(new THREE.Vector3(0, 5.5, 12), 0.08)
      camera.lookAt(0, 2.5, -20)
      return
    }

    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase
      lockedPoseRef.current = null
    }

    if (phase === "FORWARD_CONTENT") {
      camera.position.lerp(exitPosition, 0.08)
      camera.lookAt(exitLookAt)
      return
    }

    // CAMERA ANCHORED TO CAR - read car position directly
    if (!carRef || !carRef.current) return

    const carPosition = carRef.current.position
    const carRotation = carRef.current.rotation

    // Local offset based on phase
    const turnBlend = phase === "ROTATE_TO_SIDE" ? phaseProgressValue : phase === "ROTATE_FORWARD" ? 1 - phaseProgressValue : phase === "EVENTS_SIDE_PROFILE" ? 1 : 0
    const zoomOut = turnBlend * turnBlend * (3 - 2 * turnBlend)

    let localOffset
    if (phase === "EVENTS_SIDE_PROFILE") {
      localOffset = new THREE.Vector3(4, 3.0, 0) // Side view
    } else if (phase === "ROTATE_TO_SIDE" || phase === "ROTATE_FORWARD") {
      localOffset = new THREE.Vector3(0, 2.8 + zoomOut * 0.6, 6.0 + zoomOut * 3.0) // Zoomed out
    } else {
      localOffset = new THREE.Vector3(0, 2.2, 6) // Default follow cam
    }

    // Apply offset in world space
    const desiredPosition = carPosition.clone().add(localOffset)

    if (phase === "EVENTS_SIDE_PROFILE") {
      if (!lockedPoseRef.current) {
        lockedPoseRef.current = {
          position: desiredPosition.clone(),
          lookAt: carPosition.clone()
        }
      }

      camera.position.lerp(lockedPoseRef.current.position, 0.08)
      camera.lookAt(lockedPoseRef.current.lookAt)
      return
    }

    // Smooth follow
    camera.position.lerp(desiredPosition, 0.1)
    camera.lookAt(carPosition)
  })

  return null
}
