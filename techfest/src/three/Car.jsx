import { useRef, forwardRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { masterRoadCurve } from "./curveUtils"
import { roadFrames, ROAD_RADIUS } from "./Road"

/**
 * 3D Sports Car Component - Scroll-Driven Animation
 * 
 * Features:
 * - Low-poly sports car geometry
 * - Wheels rotate based on scroll progress
 * - Forward tilt when scrolling
 * - Subtle vibration effect
 * - Neon accents and emissive headlights
 */
const Car = forwardRef(({ scrollProgress, motionDensity, activePhase, phaseProgress, activeCardIndex, activeAccent, textPhase }, ref) => {
  const carRef = ref || useRef()
  const frontLeftWheelRef = useRef()
  const frontRightWheelRef = useRef()
  const rearLeftWheelRef = useRef()
  const rearRightWheelRef = useRef()

  // Refs for dynamic material updates
  const bodyMaterialRef = useRef()
  const cabinMaterialRef = useRef()
  const headlightRefs = useRef([])
  const underglowRef = useRef()

  const lastPhaseRef = useRef(null)
  const lockedPoseRef = useRef(null)
  const lastCardIndexRef = useRef(activeCardIndex?.current ?? 0)

  useFrame(() => {
    if (!carRef.current) return

    const progress = scrollProgress.current || 0
    const density = motionDensity.current || 0
    const phase = activePhase.current || "HERO"
    const phaseProgressValue = phaseProgress.current || 0

    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase
      lockedPoseRef.current = null
    }

    const isHeroPhase = phase === "HERO"
    const isEventsPhase = phase === "EVENTS_SIDE_PROFILE"
    const isTurningPhase = phase === "ROTATE_TO_SIDE" || phase === "ROTATE_FORWARD"
    const isTextHold = textPhase?.current === "HOLD"

    // SINGLE SOURCE OF TRUTH - sample master curve
    const t = THREE.MathUtils.clamp(phaseProgressValue, 0, 0.98)
    const curvePoint = masterRoadCurve.getPointAt(t)
    
    // Get Frenet frame with INTERPOLATION for smooth motion
    const f = t * (roadFrames.normals.length - 1)
    const i0 = Math.floor(f)
    const i1 = Math.min(i0 + 1, roadFrames.normals.length - 1)
    const lerpT = f - i0
    
    const normal = roadFrames.normals[i0].clone().lerp(roadFrames.normals[i1], lerpT).normalize()
    const tangent = roadFrames.tangents[i0].clone().lerp(roadFrames.tangents[i1], lerpT).normalize()
    
    // Lift car ABOVE tube surface using normal (NOT world Y)
    const CAR_CLEARANCE = 0.35
    const basePosition = curvePoint.clone().add(
      normal.clone().multiplyScalar(ROAD_RADIUS + CAR_CLEARANCE)
    )

    const lerpSpeed = isTextHold ? 0.03 : phase === "ROTATE_TO_SIDE" || phase === "EVENTS_SIDE_PROFILE" ? 0.05 : 0.12

    if (isEventsPhase) {
      // EVENTS GALLERY HOLD - Lock position completely, no forward motion
      if (!lockedPoseRef.current) {
        lockedPoseRef.current = {
          position: basePosition.clone(),
          normal: normal.clone(),
          tangent: tangent.clone()
        }
      }
      // Freeze position - no lerp, direct copy
      carRef.current.position.copy(lockedPoseRef.current.position)
      carRef.current.up.copy(lockedPoseRef.current.normal)
      
      const lookAtTarget = lockedPoseRef.current.position.clone().add(lockedPoseRef.current.tangent)
      carRef.current.lookAt(lookAtTarget)
    } else {
      // Reset locked pose when leaving events
      lockedPoseRef.current = null
      
      carRef.current.position.lerp(basePosition, lerpSpeed)
      carRef.current.up.lerp(normal, lerpSpeed)
      
      const lookAtTarget = basePosition.clone().add(tangent)
      carRef.current.lookAt(lookAtTarget)
    }

    // Subtle vibration along the normal (not world Y)
    const vibrationIntensity = isEventsPhase ? 0.003 : isHeroPhase ? 0.01 : 0.02
    const vibration = Math.sin(Date.now() * 0.002) * vibrationIntensity
    const vibrationOffset = normal.clone().multiplyScalar(vibration)
    carRef.current.position.add(vibrationOffset)

    // Wheels stop during HERO and EVENTS phases
    const curveSlowdown = phase === "ROTATE_TO_SIDE" || phase === "EVENTS_SIDE_PROFILE" ? 0.4 : 1
    const wheelRotation = isHeroPhase || isEventsPhase ? 0 : (progress - 0.05) * Math.PI * 14 * curveSlowdown
    if (frontLeftWheelRef.current) frontLeftWheelRef.current.rotation.x = wheelRotation
    if (frontRightWheelRef.current) frontRightWheelRef.current.rotation.x = wheelRotation
    if (rearLeftWheelRef.current) rearLeftWheelRef.current.rotation.x = wheelRotation
    if (rearRightWheelRef.current) rearRightWheelRef.current.rotation.x = wheelRotation

    const accentColor = activeAccent.current || "#00E5FF"
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.opacity = isHeroPhase ? 0.3 : Math.min(1, 0.3 + (progress - 0.05) * 10)
      bodyMaterialRef.current.transparent = true
      bodyMaterialRef.current.emissive.set(accentColor)
    }
    if (cabinMaterialRef.current) {
      cabinMaterialRef.current.opacity = isHeroPhase ? 0.3 : Math.min(1, 0.3 + (progress - 0.05) * 10)
      cabinMaterialRef.current.transparent = true
    }

    headlightRefs.current.forEach(light => {
      if (light) {
        const shimmer = isEventsPhase ? 0.3 + Math.sin(Date.now() * 0.001) * 0.1 : 0
        light.emissiveIntensity = isHeroPhase ? 2.5 : 2.0 + shimmer
        light.emissive.set(accentColor)
      }
    })

    if (underglowRef.current) {
      const breathe = isEventsPhase ? 0.1 + Math.sin(Date.now() * 0.0012) * 0.1 : 0
      underglowRef.current.emissive.set(accentColor)
      underglowRef.current.color.set(accentColor)
      underglowRef.current.emissiveIntensity = isHeroPhase ? 0.3 : 0.5 + density * 0.2 + breathe
      underglowRef.current.opacity = isHeroPhase ? 0.2 : 0.3
    }

    if (activeCardIndex && lastCardIndexRef.current !== activeCardIndex.current) {
      lastCardIndexRef.current = activeCardIndex.current
      carRef.current.position.y -= 0.04
    }

    // DEBUG: Log car position vs road end
    if (Math.random() < 0.01) { // Log occasionally to avoid spam
      const roadEndZ = masterRoadCurve.points[masterRoadCurve.points.length - 1].z
      console.log('CAR Z:', carRef.current.position.z.toFixed(1), 'ROAD END Z:', roadEndZ.toFixed(1), 'CAR POS:', carRef.current.position.x.toFixed(1), carRef.current.position.y.toFixed(1), carRef.current.position.z.toFixed(1))
    }
  })

  return (
    <group ref={carRef} position={[0, 0, 0]}>
      {/* Main Body - Sports Car Shape */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[1.4, 0.35, 2.8]} />
        <meshStandardMaterial 
          ref={bodyMaterialRef}
          color="#1a1f3a" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#22D3EE"
          emissiveIntensity={0.05}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Cabin/Roof - Lower and sleeker */}
      <mesh position={[0, 0.45, -0.2]} castShadow>
        <boxGeometry args={[1.0, 0.3, 1.4]} />
        <meshStandardMaterial 
          ref={cabinMaterialRef}
          color="#0f1729" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#3B82F6"
          emissiveIntensity={0.03}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Front Spoiler */}
      <mesh position={[0, 0.05, 1.5]}>
        <boxGeometry args={[1.3, 0.1, 0.2]} />
        <meshStandardMaterial 
          color="#22D3EE" 
          metalness={1} 
          roughness={0.1}
          emissive="#22D3EE"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Rear Spoiler */}
      <mesh position={[0, 0.7, -1.3]}>
        <boxGeometry args={[1.2, 0.08, 0.3]} />
        <meshStandardMaterial 
          color="#8B5CF6" 
          metalness={1} 
          roughness={0.1}
          emissive="#8B5CF6"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Front Left Wheel */}
      <group ref={frontLeftWheelRef} position={[-0.65, -0.15, 0.9]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.25, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Rim */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.26, 16]} />
          <meshStandardMaterial 
            color="#22D3EE" 
            metalness={1} 
            roughness={0.1}
            emissive="#22D3EE"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Front Right Wheel */}
      <group ref={frontRightWheelRef} position={[0.65, -0.15, 0.9]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.25, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.26, 16]} />
          <meshStandardMaterial 
            color="#22D3EE" 
            metalness={1} 
            roughness={0.1}
            emissive="#22D3EE"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Rear Left Wheel */}
      <group ref={rearLeftWheelRef} position={[-0.65, -0.15, -0.9]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.25, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.26, 16]} />
          <meshStandardMaterial 
            color="#22D3EE" 
            metalness={1} 
            roughness={0.1}
            emissive="#22D3EE"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Rear Right Wheel */}
      <group ref={rearRightWheelRef} position={[0.65, -0.15, -0.9]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.25, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.26, 16]} />
          <meshStandardMaterial 
            color="#22D3EE" 
            metalness={1} 
            roughness={0.1}
            emissive="#22D3EE"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Headlights - Emissive Glow (ALWAYS BRIGHT - Presence Mode) */}
      <mesh position={[0.35, 0.1, 1.42]}>
        <boxGeometry args={[0.2, 0.12, 0.08]} />
        <meshStandardMaterial 
          ref={(el) => {
            if (el && !headlightRefs.current.includes(el)) {
              headlightRefs.current[0] = el
            }
          }}
          color="#22D3EE" 
          emissive="#22D3EE" 
          emissiveIntensity={2.5}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[-0.35, 0.1, 1.42]}>
        <boxGeometry args={[0.2, 0.12, 0.08]} />
        <meshStandardMaterial 
          ref={(el) => {
            if (el && !headlightRefs.current.includes(el)) {
              headlightRefs.current[1] = el
            }
          }}
          color="#22D3EE" 
          emissive="#22D3EE" 
          emissiveIntensity={2.5}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* Tail Lights */}
      <mesh position={[0.4, 0.15, -1.42]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial 
          color="#EC4899" 
          emissive="#EC4899" 
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[-0.4, 0.15, -1.42]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial 
          color="#EC4899" 
          emissive="#EC4899" 
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Side Accent Lines */}
      <mesh position={[0.72, 0.2, 0]}>
        <boxGeometry args={[0.02, 0.08, 2.2]} />
        <meshStandardMaterial 
          color="#22D3EE" 
          emissive="#22D3EE" 
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[-0.72, 0.2, 0]}>
        <boxGeometry args={[0.02, 0.08, 2.2]} />
        <meshStandardMaterial 
          color="#22D3EE" 
          emissive="#22D3EE" 
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Underglow Effect - Subtle in Hero, stronger in Journey */}
      <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 2.8]} />
        <meshStandardMaterial 
          ref={underglowRef}
          color="#22D3EE"
          emissive="#22D3EE"
          emissiveIntensity={0.3}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  )
})

export default Car
