import { useMemo, useRef } from "react"
import { useThree } from "@react-three/fiber"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { masterRoadCurve } from "./curveUtils"

/**
 * Dynamic Chase Camera
 * 
 * Follows the car as it moves forward
 * Zooms in closer at footer (end of scroll)
 * Creates cinematic forward motion effect
 */
export default function Camera({ activePhase, phaseProgress }) {
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
    
    // During journey - ensure camera stays BEHIND and BELOW car
    const clampedCameraY = Math.min(camera.position.y, 4.5) // Prevent camera going above car

    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase
      lockedPoseRef.current = null
    }

    if (phase === "HERO") {
      camera.position.copy(heroPosition)
      camera.lookAt(heroLookAt)
      return
    }

    if (phase === "FORWARD_CONTENT") {
      camera.position.lerp(exitPosition, 0.08)
      camera.lookAt(exitLookAt)
      return
    }

    // Sample master curve - BEHIND car for follow cam
    const FOLLOW_OFFSET = 0.045 // Camera trails car by ~30-40 world units
    const carT = THREE.MathUtils.clamp(phaseProgressValue, 0, 0.98)
    const camT = Math.max(carT - FOLLOW_OFFSET, 0)
    const point = masterRoadCurve.getPointAt(camT)

    const turnBlend = phase === "ROTATE_TO_SIDE" ? phaseProgressValue : phase === "ROTATE_FORWARD" ? 1 - phaseProgressValue : phase === "EVENTS_SIDE_PROFILE" ? 1 : 0
    const zoomOut = turnBlend * turnBlend * (3 - 2 * turnBlend)

    const baseOffset = phase === "EVENTS_SIDE_PROFILE" ? new THREE.Vector3(4, 3.0, 0) : new THREE.Vector3(0, 2.2, 0)
    const zoomOffset = phase === "EVENTS_SIDE_PROFILE" ? new THREE.Vector3(3.2, 3.0, 0) : new THREE.Vector3(0, 2.8 + zoomOut * 0.6, 6.0 + zoomOut * 3.0)

    const desiredPosition = phase === "ROTATE_TO_SIDE" || phase === "ROTATE_FORWARD"
      ? point.clone().add(new THREE.Vector3(0, zoomOffset.y, zoomOffset.z))
      : point.clone().add(baseOffset)
    const lookAtPoint = masterRoadCurve.getPointAt(Math.min(0.98, carT))

    if (phase === "EVENTS_SIDE_PROFILE") {
      if (!lockedPoseRef.current) {
        lockedPoseRef.current = {
          position: desiredPosition.clone(),
          lookAt: lookAtPoint.clone()
        }
      }

      camera.position.lerp(lockedPoseRef.current.position, 0.08)
      camera.lookAt(lockedPoseRef.current.lookAt)
      return
    }

    camera.position.lerp(desiredPosition, 0.1)
    camera.position.y = Math.min(camera.position.y, 4.5) // Clamp Y to stay below car
    camera.lookAt(lookAtPoint)
  })

  return null
}
