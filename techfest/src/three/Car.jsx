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

  useFrame(() => {
    if (!carRef.current) return
    
    const progress = scrollProgress.current || 0
    
    // FORWARD MOTION - Car moves toward camera as you scroll
    // At 0% scroll: car is far (z = -20)
    // At 100% scroll: car is close (z = 2)
    const forwardMotion = -20 + (progress * 22) // Moves from -20 to +2
    carRef.current.position.z = forwardMotion
    
    // Subtle vibration (engine idle)
    const vibration = Math.sin(progress * 40) * 0.02
    carRef.current.position.y = 0.3 + vibration
    
    // Forward tilt when scrolling (speed effect)
    const tilt = Math.sin(progress * 5) * 0.05
    carRef.current.rotation.x = tilt * 0.5
    
    // Wheel rotation based on scroll (gives sense of movement)
    // Positive = forward, negative = reverse
    const wheelRotation = progress * Math.PI * 20
    if (frontLeftWheelRef.current) frontLeftWheelRef.current.rotation.x = wheelRotation
    if (frontRightWheelRef.current) frontRightWheelRef.current.rotation.x = wheelRotation
    if (rearLeftWheelRef.current) rearLeftWheelRef.current.rotation.x = wheelRotation
    if (rearRightWheelRef.current) rearRightWheelRef.current.rotation.x = wheelRotation
  })

  return (
    <group ref={carRef} position={[0, 0.3, 0]}>
      {/* Main Body - Sports Car Shape */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[1.4, 0.35, 2.8]} />
        <meshStandardMaterial 
          color="#1a1f3a" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#22D3EE"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Cabin/Roof - Lower and sleeker */}
      <mesh position={[0, 0.45, -0.2]} castShadow>
        <boxGeometry args={[1.0, 0.3, 1.4]} />
        <meshStandardMaterial 
          color="#0f1729" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#3B82F6"
          emissiveIntensity={0.03}
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

      {/* Headlights - Emissive Glow */}
      <mesh position={[0.35, 0.1, 1.42]}>
        <boxGeometry args={[0.2, 0.12, 0.08]} />
        <meshStandardMaterial 
          color="#22D3EE" 
          emissive="#22D3EE" 
          emissiveIntensity={2}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[-0.35, 0.1, 1.42]}>
        <boxGeometry args={[0.2, 0.12, 0.08]} />
        <meshStandardMaterial 
          color="#22D3EE" 
          emissive="#22D3EE" 
          emissiveIntensity={2}
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

      {/* Underglow Effect */}
      <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 2.8]} />
        <meshStandardMaterial 
          color="#22D3EE"
          emissive="#22D3EE"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}
