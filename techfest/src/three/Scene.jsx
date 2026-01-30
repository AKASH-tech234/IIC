import { Canvas, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import Camera from "./Camera"
import Lights from "./Lights"
import Car from "./Car"
import Road from "./Road"
import City from "./City"
import Sky from "./Sky"

/**
 * Scene Content - All 3D objects
 * Uses frameloop="demand" for performance
 */
function SceneContent({ scrollProgress, scrollVelocity, motionDensity, activePhase, phaseProgress, activeCardIndex, activeAccent }) {
  const { invalidate } = useThree()

  useEffect(() => {
    // Invalidate (re-render) when scroll changes
    invalidate()
  }, [scrollProgress, invalidate])

  const fogRef = useRef()

  const horizonColor = useRef("#04202A")

  useEffect(() => {
    if (!fogRef.current) return
    const accent = activeAccent.current || "#070617"
    const base = new THREE.Color("#03050B")
    const accentColor = new THREE.Color(accent)
    const phase = activePhase.current || "HERO"
    const blend = phase === "EVENTS_SIDE_PROFILE" ? 0.22 : 0.06
    base.lerp(accentColor, blend)
    fogRef.current.color = base

    const horizonBase = new THREE.Color("#083042")
    const horizonAccent = new THREE.Color(accent)
    horizonBase.lerp(horizonAccent, phase === "EVENTS_SIDE_PROFILE" ? 0.3 : 0.05)
    horizonColor.current = `#${horizonBase.getHexString()}`
  }, [activeAccent, activePhase])

  return (
    <>
      <Camera 
        activePhase={activePhase}
        phaseProgress={phaseProgress}
      />
      <Lights />
      <Sky horizonColor={horizonColor.current} />
      <fog ref={fogRef} attach="fog" args={["#05080F", 12, 160]} />
      <Car 
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        motionDensity={motionDensity}
        activePhase={activePhase}
        phaseProgress={phaseProgress}
        activeCardIndex={activeCardIndex}
        activeAccent={activeAccent}
      />
      <Road 
        motionDensity={motionDensity}
        activePhase={activePhase}
        phaseProgress={phaseProgress}
        activeCardIndex={activeCardIndex}
        activeAccent={activeAccent}
      />
      <City 
        motionDensity={motionDensity}
        activeAccent={activeAccent}
      />
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
export default function Scene({ scrollProgress, scrollVelocity, motionDensity, activePhase, phaseProgress, activeCardIndex, activeAccent }) {
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
        <SceneContent 
          scrollProgress={scrollProgress}
          scrollVelocity={scrollVelocity}
          motionDensity={motionDensity}
          activePhase={activePhase}
          phaseProgress={phaseProgress}
          activeCardIndex={activeCardIndex}
          activeAccent={activeAccent}
        />
      </Canvas>
    </div>
  )
}
