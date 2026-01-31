import { Canvas, useThree, useFrame } from "@react-three/fiber"
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
/**
 * Get segment-based visual configuration
 */
function getSegmentVisualConfig(segmentId) {
  const configs = {
    HERO: { fogColor: "#0A1022", fogBlend: 0.03, groundIntensity: 0.08, horizonIntensity: 0 },
    TURN_1: { fogColor: "#0B1228", fogBlend: 0.04, groundIntensity: 0.09, horizonIntensity: 0.05 },
    EVENTS: { fogColor: "#0C1430", fogBlend: 0.15, groundIntensity: 0.18, horizonIntensity: 0.65 },
    TURN_2: { fogColor: "#0A0F20", fogBlend: 0.05, groundIntensity: 0.10, horizonIntensity: 0.08 },
    FINAL: { fogColor: "#0D1835", fogBlend: 0.06, groundIntensity: 0.12, horizonIntensity: 0.15 }
  }
  return configs[segmentId] || configs.HERO
}

function SceneContent({ scrollProgress, scrollVelocity, motionDensity, activePhase, phaseProgress, activeCardIndex, activeAccent, textPhase }) {
  const { invalidate } = useThree()
  const carRef = useRef() // Shared ref for Car and Camera coordination
  const currentSegmentRef = useRef({ id: "HERO", localT: 0 })
  const horizonGlowRef = useRef()

  useEffect(() => {
    // Invalidate (re-render) when scroll changes
    invalidate()
  }, [scrollProgress, invalidate])

  const fogRef = useRef()

  const horizonColor = useRef("#04202A")

  useFrame(() => {
    if (!fogRef.current) return
    
    // Read current segment from car
    let segmentId = "HERO"
    if (carRef.current && carRef.current.currentSegmentRef) {
      currentSegmentRef.current = carRef.current.currentSegmentRef.current
      segmentId = currentSegmentRef.current.id
    }
    
    const accent = activeAccent.current || "#070617"
    const progress = scrollProgress.current || 0
    
    // SEGMENT-BASED VISUAL IDENTITY
    const config = getSegmentVisualConfig(segmentId)
    
    let baseFogColor = new THREE.Color(config.fogColor)
    let fogBlend = config.fogBlend
    let horizonIntensity = config.horizonIntensity
    
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
  })

  // Phase-based lighting drama
  const phase = activePhase.current || "HERO"
  const isEventsPhase = phase === "EVENTS_SIDE_PROFILE"
  
  return (
    <>
      <Camera 
        activePhase={activePhase}
        carRef={carRef}
        currentSegment={currentSegmentRef}
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
        currentSegment={currentSegmentRef}
      />
      <City 
        motionDensity={motionDensity}
        activeAccent={activeAccent}
        activePhase={activePhase}
        currentSegment={currentSegmentRef}
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
          position: [0, 3.5, 10], // Zoomed out start for better overview
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
