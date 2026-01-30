import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

/**
 * 3D Car Component
 * 
 * Phase 1: Placeholder box geometry
 * Phase 2: GLTF model (when available)
 * 
 * Position: Stays centered [0, 0.5, 0]
 * Motion: Subtle vibration only
 */
export default function Car({ scrollProgress }) {
  const carRef = useRef()

  useFrame(() => {
    if (!carRef.current) return
    
    const progress = scrollProgress.current || 0
    
    // Subtle vibration (engine idle)
    carRef.current.position.y = 0.5 + Math.sin(progress * 20) * 0.03
    
    // Slight rotation (movement feel)
    carRef.current.rotation.z = Math.sin(progress * 10) * 0.01
  })

  return (
    <group ref={carRef} position={[0, 0.5, 0]}>
      {/* Placeholder Car Body (low-poly sports car shape) */}
      
      {/* Main Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.4, 2.4]} />
        <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Roof/Cabin */}
      <mesh position={[0, 0.3, -0.2]}>
        <boxGeometry args={[0.8, 0.3, 1.2]} />
        <meshStandardMaterial color="#0F172A" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Front Wheels */}
      <mesh position={[-0.5, -0.2, 0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
      <mesh position={[0.5, -0.2, 0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
        <meshStandardMaterial color="#020617" />
      </mesh>

      {/* Rear Wheels */}
      <mesh position={[-0.5, -0.2, -0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
      <mesh position={[0.5, -0.2, -0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
        <meshStandardMaterial color="#020617" />
      </mesh>

      {/* Headlights (Emissive) */}
      <mesh position={[0.3, 0, 1.2]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial 
          color="#22D3EE" 
          emissive="#22D3EE" 
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[-0.3, 0, 1.2]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial 
          color="#22D3EE" 
          emissive="#22D3EE" 
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  )
}
