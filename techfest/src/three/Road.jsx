import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

/**
 * Road Component
 * 
 * Long plane that moves backward to create illusion of forward motion
 * PlaneGeometry: [5, 200]
 * Moves: z = scrollProgress * 80
 */
export default function Road({ scrollProgress }) {
  const roadRef = useRef()

  useFrame(() => {
    if (!roadRef.current) return
    
    const progress = scrollProgress.current || 0
    
    // Move road backward (creates forward motion illusion)
    roadRef.current.position.z = progress * 80
  })

  return (
    <mesh 
      ref={roadRef}
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, 0, -50]}
    >
      <planeGeometry args={[5, 200]} />
      <meshStandardMaterial 
        color="#0C1222"
        metalness={0.3}
        roughness={0.8}
      />
      
      {/* Road center line (emissive) */}
      <mesh position={[0, 0, 0.01]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.1, 200]} />
        <meshStandardMaterial 
          color="#7C3AED"
          emissive="#7C3AED"
          emissiveIntensity={0.5}
        />
      </mesh>
    </mesh>
  )
}
