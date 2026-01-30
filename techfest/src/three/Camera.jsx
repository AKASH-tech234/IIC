import { useEffect, useMemo, useRef } from "react"
import { useThree } from "@react-three/fiber"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { buildRoadCurve } from "./curveUtils"

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

  const straightCurve = useMemo(() => buildRoadCurve("STRAIGHT"), [])
  const turnCurve = useMemo(() => buildRoadCurve("TURN"), [])

  const heroPosition = useMemo(() => new THREE.Vector3(0, 2.8, 6), [])
  const heroLookAt = useMemo(() => new THREE.Vector3(0, 1.2, 0), [])
  const exitPosition = useMemo(() => new THREE.Vector3(0, 2.5, 5.5), [])
  const exitLookAt = useMemo(() => new THREE.Vector3(0, 1.1, 0), [])

  useFrame(() => {
    const phase = activePhase.current || "HERO"
    const phaseProgressValue = phaseProgress.current || 0

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

    const curveProgress = phaseProgressValue
    const curve = phase === "EVENTS_SIDE_PROFILE" || phase === "ROTATE_TO_SIDE" ? turnCurve : straightCurve

    const point = curve.getPoint(curveProgress)

    const turnBlend = phase === "ROTATE_TO_SIDE" ? phaseProgressValue : phase === "ROTATE_FORWARD" ? 1 - phaseProgressValue : phase === "EVENTS_SIDE_PROFILE" ? 1 : 0
    const zoomOut = turnBlend * turnBlend * (3 - 2 * turnBlend)

    const baseOffset = phase === "EVENTS_SIDE_PROFILE" ? new THREE.Vector3(4, 3.0, 0) : new THREE.Vector3(0, 2.2, 0)
    const zoomOffset = phase === "EVENTS_SIDE_PROFILE" ? new THREE.Vector3(3.2, 3.0, 0) : new THREE.Vector3(0, 2.8 + zoomOut * 0.6, 6.0 + zoomOut * 3.0)

    const desiredPosition = phase === "ROTATE_TO_SIDE" || phase === "ROTATE_FORWARD"
      ? point.clone().add(new THREE.Vector3(0, zoomOffset.y, zoomOffset.z))
      : point.clone().add(baseOffset)
    const lookAtPoint = curve.getPoint(Math.min(1, curveProgress + 0.02))

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
    camera.lookAt(lookAtPoint)
  })

  return null
}
