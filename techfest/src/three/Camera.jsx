import { useEffect } from "react"
import { useThree } from "@react-three/fiber"

/**
 * Fixed Third-Person Cinematic Camera
 * 
 * Position: [0, 2.2, 6]
 * LookAt: [0, 1.2, 0]
 * Minor adjustments on scroll only
 */
export default function Camera({ scrollProgress }) {
  const { camera } = useThree()
  const baseZ = 6
  const baseY = 2.2

  useEffect(() => {
    // Minor camera movement based on scroll
    const progress = scrollProgress.current || 0
    
    camera.position.z = baseZ - progress * 0.6
    camera.position.y = baseY + progress * 0.2
    camera.position.x = 0
    
    // Always look at car area
    camera.lookAt(0, 1.2, 0)
  })

  return null
}
