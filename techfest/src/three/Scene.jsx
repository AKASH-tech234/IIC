import { Canvas, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import Camera from "./Camera"
import Lights from "./Lights"
import Car from "./Car"
import Road from "./Road"
import City from "./City"
import Sky from "./Sky"
import Ground from "./Ground"

/**
 * Scene Content - All 3D objects
 * Uses frameloop="demand" for performance
 */
function SceneContent({ scrollProgress, scrollVelocity, motionDensity, activePhase, phaseProgress, activeCardIndex, activeAccent, textPhase }) {
  const { invalidate } = useThree()
  const carRef = useRef() // Shared ref for Car and Camera coordination
  const horizonGlowRef = useRef()

  useEffect(() => {
    // Invalidate (re-render) when scroll changes
    invalidate()
  }, [scrollProgress, invalidate])

  const fogRef = useRef()

  const horizonColor = useRef("#04202A")

  useEffect(() => {
    if (!fogRef.current) return
    const accent = activeAccent.current || "#070617"
    const phase = activePhase.current || "HERO"
    const progress = scrollProgress.current || 0
    
    // Phase-based fog color grading with spotlight dimming
    let baseFogColor
    let fogBlend
    let horizonIntensity
    
    if (phase === "HERO") {
      // Colder, darker
      baseFogColor = new THREE.Color("#0A1022")
      fogBlend = 0.03
      horizonIntensity = 0
    } else if (phase === "EVENTS_SIDE_PROFILE") {
      // AMPLIFIED: Much darker sky for contrast (-12%)
      baseFogColor = new THREE.Color("#050812")
      fogBlend = 0.15
      horizonIntensity = 0.65 // +60% glow intensity
    } else if (phase === "FORWARD_CONTENT") {
      // Brighter, hopeful
      baseFogColor = new THREE.Color("#0F1A33")
      fogBlend = 0.05
      horizonIntensity = 0.1
    } else {
      // Transition phases
      baseFogColor = new THREE.Color("#0A1022")
      fogBlend = 0.06
      horizonIntensity = 0.05
    }
    
    const accentColor = new THREE.Color(accent)
    baseFogColor.lerp(accentColor, fogBlend)
    fogRef.current.color = baseFogColor

    const horizonBase = new THREE.Color("#00E5FF")
    const horizonAccent = new THREE.Color(accent)
    
    // MOMENT OF ARRIVAL - Horizon glow ramps up on first scroll
    let finalHorizonIntensity = horizonIntensity
    if (progress < 0.05) {
      finalHorizonIntensity = horizonIntensity * (progress / 0.05)
    }
    
    horizonBase.lerp(horizonAccent, finalHorizonIntensity)
    horizonColor.current = `#${horizonBase.getHexString()}`
  }, [activeAccent, activePhase, scrollProgress])

  // Phase-based lighting drama
  const phase = activePhase.current || "HERO"
  const isEventsPhase = phase === "EVENTS_SIDE_PROFILE"
  
  return (
    <>
      <Camera 
        activePhase={activePhase}
        phaseProgress={phaseProgress}
        carRef={carRef}
      />
      <Lights />
      {/* AMPLIFIED: Reduce ambient during EVENTS for spotlight effect */}
      <ambientLight intensity={isEventsPhase ? 0.35 : 0.6} />
      <directionalLight 
        position={[50, 80, 20]} 
        color="#88ccff" 
        intensity={1.2}
        castShadow={false}
      />
      <directionalLight 
        position={[-40, 30, -100]} 
        color="#3355ff" 
        intensity={0.6}
        castShadow={false}
      />
      {/* AMPLIFIED: Boost edge light during EVENTS for drama */}
      <directionalLight 
        position={[0, 20, -400]} 
        color="#5588BB" 
        intensity={isEventsPhase ? 0.6 : 0.3}
        castShadow={false}
      />
      <Ground activePhase={activePhase} scrollProgress={scrollProgress} />
      <Sky horizonColor={horizonColor.current} />
      <fog ref={fogRef} attach="fog" args={["#0A1022", 60, 400]} />
      <Car 
        ref={carRef}
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        motionDensity={motionDensity}
        activePhase={activePhase}
        phaseProgress={phaseProgress}
        activeCardIndex={activeCardIndex}
        activeAccent={activeAccent}
        textPhase={textPhase}
      />
      <Road 
        motionDensity={motionDensity}
        activePhase={activePhase}
        activeAccent={activeAccent}
        scrollProgress={scrollProgress}
      />
      <City 
        motionDensity={motionDensity}
        activeAccent={activeAccent}
        activePhase={activePhase}
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
export default function Scene({ scrollProgress, scrollVelocity, motionDensity, activePhase, phaseProgress, activeCardIndex, activeAccent, textPhase }) {
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
          position: [0, 2.7, 7], // Medium zoom between initial (6) and zoomed out (8)
          fov: 60
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.1
          console.log('Scene created - fog and tone mapping enabled')
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
          textPhase={textPhase}
        />
      </Canvas>
    </div>
  )
}
