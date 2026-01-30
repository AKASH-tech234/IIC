import { useEffect } from "react"
import { useThree } from "@react-three/fiber"
import { useFrame } from "@react-three/fiber"

/**
 * Dynamic Chase Camera
 * 
 * Follows the car as it moves forward
 * Zooms in closer at footer (end of scroll)
 * Creates cinematic forward motion effect
 */
export default function Camera({ scrollProgress }) {
  const { camera } = useThree()

  useFrame(() => {
    const progress = scrollProgress.current || 0
    
    // Camera follows car's Z position but stays behind it
    // At 0%: camera at z = 6, car at z = -20 (far away)
    // At 100%: camera at z = 4, car at z = 2 (close up)
    const cameraZ = 6 - (progress * 2) // Moves from 6 to 4
    const cameraY = 2.2 - (progress * 0.5) // Lowers slightly from 2.2 to 1.7
    
    // Smooth camera movement
    camera.position.z += (cameraZ - camera.position.z) * 0.1
    camera.position.y += (cameraY - camera.position.y) * 0.1
    camera.position.x = 0
    
    // Look at car position (which changes with scroll)
    const carZ = -20 + (progress * 22)
    camera.lookAt(0, 0.5, carZ)
  })

  return null
}
