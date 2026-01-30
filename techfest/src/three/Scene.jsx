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
 * Sits behind all UI content (z-index: 0)
 * Only active for Hero → Schedule sections
 * Uses demand-based rendering for performance
 */
export default function Scene({ scrollProgress }) {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 5, // Above shader, below content
        opacity: 1,
        transition: "opacity 0.5s ease"
      }}
    >
      <Canvas
        frameloop="always"
        camera={{ position: [0, 2.2, 6], fov: 75 }}
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
