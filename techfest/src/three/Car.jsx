import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

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
export default function Car({ scrollProgress }) {
  const carRef = useRef()
  const frontLeftWheelRef = useRef()
  const frontRightWheelRef = useRef()
  const rearLeftWheelRef = useRef()
  const rearRightWheelRef = useRef()
  
  // Refs for dynamic material updates
  const bodyMaterialRef = useRef()
  const cabinMaterialRef = useRef()
  const headlightRefs = useRef([])
  const underglowRef = useRef()

  useFrame(() => {
    if (!carRef.current) return
    
    const progress = scrollProgress.current || 0
    
    // HERO PHASE: Presence Mode (progress < 0.05)
    // Car is background presence - lights ON, body subtle
    const isHeroPhase = progress < 0.05
    
    // CINEMATIC LIGHTING: Lights visible first, body emerges later
    // Hero (0-5%): Body dark, lights bright (presence)
    // Journey (5%+): Body becomes visible, motion begins
    const bodyOpacity = isHeroPhase ? 0.3 : Math.min(1, 0.3 + (progress - 0.05) * 10)
    const lightIntensity = isHeroPhase ? 2.5 : 2.0
    
    // FORWARD MOTION - Car moves toward camera as you scroll
    // Hero phase: car stays distant (z = -8)
    // Journey phase: car moves forward (z = -8 to +2)
    const forwardMotion = isHeroPhase ? -8 : -8 + ((progress - 0.05) * 10.5)
    carRef.current.position.z = forwardMotion
    
    // Subtle vibration (engine idle) - minimal in Hero
    const vibrationIntensity = isHeroPhase ? 0.01 : 0.02
    const vibration = Math.sin(Date.now() * 0.002) * vibrationIntensity
    carRef.current.position.y = 0.3 + vibration
    
    // Forward tilt when scrolling (speed effect) - none in Hero
    const tilt = isHeroPhase ? 0 : Math.sin(progress * 5) * 0.05
    carRef.current.rotation.x = tilt * 0.5
    
    // Wheel rotation based on scroll - minimal in Hero
    const wheelRotation = isHeroPhase ? 0 : (progress - 0.05) * Math.PI * 20
    if (frontLeftWheelRef.current) frontLeftWheelRef.current.rotation.x = wheelRotation
    if (frontRightWheelRef.current) frontRightWheelRef.current.rotation.x = wheelRotation
    if (rearLeftWheelRef.current) rearLeftWheelRef.current.rotation.x = wheelRotation
    if (rearRightWheelRef.current) rearRightWheelRef.current.rotation.x = wheelRotation
    
    // DYNAMIC MATERIAL UPDATES: Lights first, body later
    // Update body materials opacity
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.opacity = bodyOpacity
      bodyMaterialRef.current.transparent = true
    }
    if (cabinMaterialRef.current) {
      cabinMaterialRef.current.opacity = bodyOpacity
      cabinMaterialRef.current.transparent = true
    }
    
    // Update headlight intensity (always bright)
    headlightRefs.current.forEach(light => {
      if (light) light.emissiveIntensity = lightIntensity
    })
    
    // Update underglow (subtle in Hero, stronger in Journey)
    if (underglowRef.current) {
      underglowRef.current.emissiveIntensity = isHeroPhase ? 0.3 : 0.5
      underglowRef.current.opacity = isHeroPhase ? 0.2 : 0.3
    }
  })

  return (
    <group ref={carRef} position={[0, 0.3, 0]}>
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
}
