import { Canvas, useThree } from "@react-three/fiber"
import { useEffect } from "react"
import Camera from "./Camera"
import Lights from "./Lights"
import Car from "./Car"
import Road from "./Road"
import City from "./City"

/**
 * Scene Content - All 3D objects
 * Uses frameloop="demand" for performance
 */
function SceneContent({ scrollProgress }) {
  const { invalidate } = useThree()

  useEffect(() => {
    // Invalidate (re-render) when scroll changes
    invalidate()
  }, [scrollProgress, invalidate])

  return (
    <>
      <Camera scrollProgress={scrollProgress} />
      <Lights />
      <fog attach="fog" args={["#070617", 8, 25]} />
      <Car scrollProgress={scrollProgress} />
      <Road scrollProgress={scrollProgress} />
      <City scrollProgress={scrollProgress} />
    </>
  )
}

/**
 * Scene Component - Canvas Wrapper
 * 
 * HERO CAMERA CONTRACT:
 * - Car centered horizontally (X: 0)
 * - Car positioned lower in frame (Y: 0.3)
 * - Camera slightly higher than journey phase (Y: 2.8 vs 2.2)
 * - Camera behind car (Z: 6)
 * - No movement on initial load
 * - Car lights visible, body in shadow (presence mode)
 * 
 * Z-INDEX LAYERING:
 * - z-0: Background
 * - z-[2]: This canvas (below content)
 * - z-10: Content
 * - z-20: Header
 */
export default function Scene({ scrollProgress }) {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 2, // Above background (z-0) and vignette (z-1), below content (z-10)
        opacity: 1,
        transition: "opacity 0.5s ease"
      }}
    >
      <Canvas
        frameloop="always"
        camera={{ 
          position: [0, 2.8, 6], // Higher Y for Hero phase (2.8 vs 2.2)
          fov: 75 
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <SceneContent scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}
