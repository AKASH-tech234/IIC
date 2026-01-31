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
import { BRAND_COLORS, getAccentColor } from "../styles/identity.tokens"
import { getFogDensity, needsContrastBoost } from "../journey/SceneDirector"

/**
 * Scene Content - All 3D objects
 * Uses frameloop="demand" for performance
 */
/**
 * Get segment-based visual configuration
 * PHASE 8: Now reads from BRAND_COLORS identity tokens
 */
function getSegmentVisualConfig(segmentId) {
  // Base fog color from identity tokens
  const baseFog = BRAND_COLORS.semantic.fog
  
  const configs = {
    HERO: { fogColor: baseFog, fogBlend: 0.03, groundIntensity: 0.08, horizonIntensity: 0 },
    TURN_1: { fogColor: baseFog, fogBlend: 0.04, groundIntensity: 0.09, horizonIntensity: 0.05 },
    EVENTS: { fogColor: baseFog, fogBlend: 0.15, groundIntensity: 0.18, horizonIntensity: 0.65 },
    TURN_2: { fogColor: baseFog, fogBlend: 0.05, groundIntensity: 0.10, horizonIntensity: 0.08 },
    FINAL: { fogColor: baseFog, fogBlend: 0.06, groundIntensity: 0.12, horizonIntensity: 0.15 }
  }
  return configs[segmentId] || configs.HERO
}

function SceneContent({ 
  scrollProgress, 
  scrollVelocity, 
  motionDensity, 
  activePhase, 
  phaseProgress, 
  activeCardIndex, 
  activeAccent, 
  textPhase,
  // Phase 5: UI ↔ World coupling signals
  sectionActive,
  sectionPulse,
  cardChangeSignal,
  finalCTAActive
}) {
  const { invalidate } = useThree()
  const carRef = useRef() // Shared ref for Car and Camera coordination
  const currentSegmentRef = useRef({ id: "HERO", localT: 0 })
  const horizonGlowRef = useRef()

  useEffect(() => {
    // Invalidate (re-render) when scroll changes
    invalidate()
  }, [scrollProgress, invalidate])

  const fogRef = useRef()

  const horizonColor = useRef(BRAND_COLORS.semantic.fog)
  
  // Phase 5: Horizon glow pulse tracking
  const horizonPulseStartTimeRef = useRef(0)
  const lastHorizonSectionRef = useRef(null)
  const baseHorizonIntensityRef = useRef(0)

  useFrame(({ clock }) => {
    if (!fogRef.current) return
    
    // Read current segment from car
    let segmentId = "HERO"
    if (carRef.current && carRef.current.currentSegmentRef) {
      currentSegmentRef.current = carRef.current.currentSegmentRef.current
      segmentId = currentSegmentRef.current.id
    }
    
    // PHASE 8: Get accent from identity tokens
    const phaseId = activePhase.current || "HERO"
    const accent = activeAccent.current || getAccentColor(phaseId)
    const progress = scrollProgress.current || 0
    const now = clock.elapsedTime
    
    // ===== PHASE 5: HORIZON GLOW PULSE DETECTION =====
    // Detect new section pulse and trigger horizon response
    if (sectionPulse?.current && sectionPulse.current !== lastHorizonSectionRef.current) {
      horizonPulseStartTimeRef.current = now
      lastHorizonSectionRef.current = sectionPulse.current
      // Note: Don't reset sectionPulse here, let Road.jsx consume it
    }
    
    // SEGMENT-BASED VISUAL IDENTITY
    const config = getSegmentVisualConfig(segmentId)
    
    let baseFogColor = new THREE.Color(config.fogColor)
    let fogBlend = config.fogBlend
    let horizonIntensity = config.horizonIntensity
    
    const accentColor = new THREE.Color(accent)
    baseFogColor.lerp(accentColor, fogBlend)
    fogRef.current.color = baseFogColor

    // PHASE 8: Horizon colors from identity tokens
    const horizonBase = new THREE.Color(BRAND_COLORS.accents.primary)
    const horizonAccent = new THREE.Color(accent)
    
    // MOMENT OF ARRIVAL - Horizon glow ramps up on first scroll
    let finalHorizonIntensity = horizonIntensity
    if (progress < 0.05) {
      finalHorizonIntensity = horizonIntensity * (progress / 0.05)
    }
    
    // Store base intensity for pulse calculation
    baseHorizonIntensityRef.current = finalHorizonIntensity
    
    // ===== PHASE 5: HORIZON GLOW PULSE (+8-10% boost for 150ms, then 200ms return) =====
    const timeSinceHorizonPulse = (now - horizonPulseStartTimeRef.current) * 1000 // Convert to ms
    if (timeSinceHorizonPulse < 350) {
      // Total duration: 150ms rise + 200ms fall
      if (timeSinceHorizonPulse < 150) {
        // Rise phase: boost intensity by 8-10%
        const t = timeSinceHorizonPulse / 150
        const eased = 1 - Math.pow(1 - t, 2) // Ease out quad
        const boost = eased * 0.09 // +9% peak boost
        finalHorizonIntensity = baseHorizonIntensityRef.current + boost
      } else {
        // Fall phase: smooth return to baseline
        const t = (timeSinceHorizonPulse - 150) / 200
        const eased = Math.pow(t, 2) // Ease in quad
        const boost = (1 - eased) * 0.09
        finalHorizonIntensity = baseHorizonIntensityRef.current + boost
      }
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
        finalCTAActive={finalCTAActive}
        scrollVelocity={scrollVelocity}
      />
      <Lights />
      {/* AMPLIFIED: Reduce ambient during EVENTS for spotlight effect */}
      <ambientLight intensity={isEventsPhase ? 0.35 : 0.6} />
      {/* PHASE 8: Light colors from identity tokens */}
      <directionalLight 
        position={[50, 80, 20]} 
        color={BRAND_COLORS.accents.primary} 
        intensity={1.2}
        castShadow={false}
      />
      <directionalLight 
        position={[-40, 30, -100]} 
        color={BRAND_COLORS.accents.secondary} 
        intensity={0.6}
        castShadow={false}
      />
      {/* AMPLIFIED: Boost edge light during EVENTS for drama */}
      <directionalLight 
        position={[0, 20, -400]} 
        color={BRAND_COLORS.accents.primary} 
        intensity={isEventsPhase ? 0.6 : 0.3}
        castShadow={false}
      />
      <Ground 
        activePhase={activePhase} 
        scrollProgress={scrollProgress}
        sectionPulse={sectionPulse}
      />
      <Sky horizonColor={horizonColor.current} />
      {/* PHASE 8: Fog color from identity tokens */}
      <fog ref={fogRef} attach="fog" args={[BRAND_COLORS.semantic.fog, 60, 400]} />
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
        cardChangeSignal={cardChangeSignal}
      />
      <Road 
        motionDensity={motionDensity}
        activePhase={activePhase}
        activeAccent={activeAccent}
        scrollProgress={scrollProgress}
        currentSegment={currentSegmentRef}
        sectionPulse={sectionPulse}
        cardChangeSignal={cardChangeSignal}
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
export default function Scene({ 
  scrollProgress, 
  scrollVelocity, 
  motionDensity, 
  activePhase, 
  phaseProgress, 
  activeCardIndex, 
  activeAccent, 
  textPhase,
  // Phase 5: UI ↔ World coupling signals
  sectionActive,
  sectionPulse,
  cardChangeSignal,
  finalCTAActive
}) {
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
          sectionActive={sectionActive}
          sectionPulse={sectionPulse}
          cardChangeSignal={cardChangeSignal}
          finalCTAActive={finalCTAActive}
        />
      </Canvas>
    </div>
  )
}
