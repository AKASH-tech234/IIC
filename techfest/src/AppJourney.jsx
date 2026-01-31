import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import useLenis from "./hooks/useLenis"
import Scene from "./three/Scene"
import Navbar from "./layout/Navbar"
import Car from "./journey/components/Car"
import BackgroundEnvironment from "./journey/components/BackgroundEnvironment"
import CustomCursor from "./components/cursor/CustomCursor"
import JourneyHero from "./journey/sections/JourneyHero"
import JourneyAbout from "./journey/sections/JourneyAbout"
import JourneyEvents from "./journey/sections/JourneyEvents"
import JourneySchedule from "./journey/sections/JourneySchedule"
import JourneyWorkshops from "./journey/sections/JourneyWorkshops"
import JourneyFinalCTA from "./journey/sections/JourneyFinalCTA"
import JourneyFooter from "./journey/sections/JourneyFooter"
import DebugVisualMode from "./journey/utils/DebugVisualMode"
import { resolveDeviceProfile, logDeviceProfile } from "./journey/DeviceDirector"
gsap.registerPlugin(ScrollTrigger)

/**
 * MNNIT TechSummit 2026 - Journey Through Innovation
 * 
 * Car-based scroll narrative where:
 * - Car stays at bottom-center (fixed)
 * - Background moves horizontally (parallax)
 * - Environments change with scroll
 * - Content reveals in sync with journey
 * 
 * Architecture:
 * - Car: Fixed position component with subtle motion
 * - Background: Multi-layer parallax system
 * - Sections: Milestone-based content reveals
 * - ScrollTrigger: Orchestrates all motion
 */
export default function AppJourney() {
  useLenis()
  
  // PHASE 11: Initialize DeviceDirector early (cache device profile)
  useEffect(() => {
    resolveDeviceProfile()
    logDeviceProfile()
  }, [])
  
  const mainRef = useRef(null)
  const progressRef = useRef(0)
  const velocityRef = useRef(0)
  const motionDensityRef = useRef(0)
  const phaseRef = useRef("HERO")
  const phaseProgressRef = useRef(0)
  const activeCardIndexRef = useRef(0)
  const accentRef = useRef("#00E5FF")
  const lastScrollRef = useRef(0)
  const lastTimeRef = useRef(0)
  const lastPhaseIdRef = useRef("HERO")
  const textPhaseRef = useRef("ENTER")

  // ===== PHASE 5: UI ↔ WORLD COUPLING SIGNALS =====
  // Signal refs for Three.js world reactions
  const sectionActiveRef = useRef("HERO") // Current active section ID
  const sectionPulseRef = useRef(null) // Temporary flag for section enter pulse
  const cardChangeSignalRef = useRef(null) // Flag for EVENTS card transitions
  const finalCTAActiveRef = useRef(false) // Boolean for FINAL CTA state
  const lastPulseTimeRef = useRef(0) // Debounce timestamp for pulses

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ===== SCROLL PROGRESS TRACKING =====
      const phases = [
        { id: "HERO", start: 0.0, end: 0.12 },
        { id: "ROTATE_TO_SIDE", start: 0.12, end: 0.28 },
        { id: "EVENTS_SIDE_PROFILE", start: 0.28, end: 0.62 },
        { id: "ROTATE_FORWARD", start: 0.62, end: 0.78 },
        { id: "FORWARD_CONTENT", start: 0.78, end: 1.0 }
      ]

      const easeOutQuad = (value) => 1 - (1 - value) * (1 - value)

      // Cinematic pacing system - adds holds and slowdowns at key moments
      const applyCinematicPacing = (progress, holds = []) => {
        for (const { start, end, strength } of holds) {
          if (progress >= start && progress <= end) {
            const local = (progress - start) / (end - start)
            const eased = local * local * (3 - 2 * local) // Smoothstep
            return start + eased * (end - start) * strength + start * (1 - strength)
          }
        }
        return progress
      }

      // Define cinematic holds
      const cinematicHolds = [
        { start: 0.32, end: 0.42, strength: 0.4 }, // EVENTS entry - slow reveal
        { start: 0.55, end: 0.62, strength: 0.6 }, // EVENTS exit - readable
        { start: 0.85, end: 0.95, strength: 0.5 }  // FINAL CTA - smooth approach
      ]

      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const now = performance.now()
          const scrollY = self.scroll()
          const lastScroll = lastScrollRef.current
          const lastTime = lastTimeRef.current || now
          const deltaScroll = Math.abs(scrollY - lastScroll)
          const deltaTime = Math.max(16, now - lastTime)
          const rawVelocity = Math.min(1, deltaScroll / deltaTime / 1.2)
          const easedVelocity = easeOutQuad(rawVelocity)

          progressRef.current = progress
          velocityRef.current = easedVelocity
          motionDensityRef.current = easeOutQuad(easedVelocity)
          lastScrollRef.current = scrollY
          lastTimeRef.current = now

          // Apply cinematic pacing before calculating phase progress
          const pacedProgress = applyCinematicPacing(progress, cinematicHolds)
          
          const activePhase = phases.find((phase) => pacedProgress >= phase.start && pacedProgress < phase.end) || phases[phases.length - 1]
          const phaseRange = activePhase.end - activePhase.start
          const phaseProgress = phaseRange > 0 ? (pacedProgress - activePhase.start) / phaseRange : 0

          if (phaseRef.current !== activePhase.id) {
            phaseRef.current = activePhase.id
          }

          if (lastPhaseIdRef.current !== activePhase.id) {
            lastPhaseIdRef.current = activePhase.id
          }

          if (phaseProgress < 0.25) {
            textPhaseRef.current = "ENTER"
          } else if (phaseProgress < 0.75) {
            textPhaseRef.current = "HOLD"
          } else {
            textPhaseRef.current = "EXIT"
          }

          phaseProgressRef.current = Math.min(1, Math.max(0, phaseProgress))

          let activeCardIndex = 0
          if (progress >= 0.28 && progress < 0.62) {
            const cardProgress = (progress - 0.28) / 0.34
            activeCardIndex = Math.min(3, Math.max(0, Math.floor(cardProgress * 4)))
          }

          if (activeCardIndexRef.current !== activeCardIndex) {
            activeCardIndexRef.current = activeCardIndex
            // Signal card change to Three.js world
            const now = performance.now()
            if (now - lastPulseTimeRef.current > 300) {
              cardChangeSignalRef.current = activeCardIndex
              lastPulseTimeRef.current = now
              if (import.meta.env.DEV) {
                console.log("🎨 CARD CHANGE →", activeCardIndex)
              }
            }
          }

          // ===== PHASE 5: EMIT SECTION SIGNALS =====
          // Detect section transitions and emit pulse signals
          if (lastPhaseIdRef.current !== activePhase.id) {
            const now = performance.now()
            // Debounce: only emit pulse if 300ms have passed since last pulse
            if (now - lastPulseTimeRef.current > 300) {
              sectionActiveRef.current = activePhase.id
              sectionPulseRef.current = activePhase.id
              lastPulseTimeRef.current = now
              
              if (import.meta.env.DEV) {
                console.log("🎬 SECTION ENTER →", activePhase.id)
              }
            }
            lastPhaseIdRef.current = activePhase.id
          }

          // Detect FINAL CTA section (FORWARD_CONTENT phase)
          if (activePhase.id === "FORWARD_CONTENT" && !finalCTAActiveRef.current) {
            finalCTAActiveRef.current = true
            if (import.meta.env.DEV) {
              console.log("🏁 FINAL CTA ACTIVE")
            }
          } else if (activePhase.id !== "FORWARD_CONTENT" && finalCTAActiveRef.current) {
            finalCTAActiveRef.current = false
          }

          if (import.meta.env.DEV) {
            console.debug("JourneyPhase", {
              phase: activePhase.id,
              phaseProgress: phaseProgressRef.current.toFixed(2),
              activeCardIndex
            })
          }
        }
      })

      // ===== PARALLAX SYSTEM =====
      // Get all background layers
      const layers = gsap.utils.toArray(".bg-layer")
      
      layers.forEach(layer => {
        const speed = parseFloat(layer.dataset.speed) || 1
        const distance = 100 * speed // percentage to move
        
        gsap.to(layer, {
          x: `-${distance}%`,
          ease: "none",
          scrollTrigger: {
            trigger: mainRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5
          }
        })
      })

      // ===== ENVIRONMENT TRANSITIONS =====
      // Fade background gradient overlay based on scroll
      const bgContainer = document.querySelector("#background-container")
      if (bgContainer) {
        // Create overlay for environment transitions
        const overlay = document.createElement("div")
        overlay.id = "env-overlay"
        overlay.className = "absolute inset-0 pointer-events-none transition-colors duration-1000"
        bgContainer.appendChild(overlay)

        // Transition through environments
        ScrollTrigger.create({
          trigger: mainRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress

            // Environment color shifts
            if (progress < 0.2) {
              // Dawn/Morning - Cyan tints
              overlay.style.backgroundColor = `rgba(56, 189, 248, ${progress * 0.05})`
            } else if (progress < 0.4) {
              // Midday - Blue tints
              overlay.style.backgroundColor = `rgba(59, 130, 246, ${(progress - 0.2) * 0.1})`
            } else if (progress < 0.6) {
              // Evening - Purple tints
              overlay.style.backgroundColor = `rgba(168, 85, 247, ${(progress - 0.4) * 0.1})`
            } else if (progress < 0.8) {
              // Night - Green tints
              overlay.style.backgroundColor = `rgba(34, 197, 94, ${(progress - 0.6) * 0.1})`
            } else {
              // Future - Multi color
              overlay.style.backgroundColor = `rgba(139, 92, 246, ${(progress - 0.8) * 0.15})`
            }
          }
        })
      }

      // ===== ACCENT COLOR SYSTEM =====
      ScrollTrigger.create({
        trigger: mainRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          let accentColor = "#00E5FF"

          if (progress >= 0.28 && progress < 0.37) {
            accentColor = "#3B82F6"
          } else if (progress >= 0.37 && progress < 0.46) {
            accentColor = "#8B5CF6"
          } else if (progress >= 0.46 && progress < 0.55) {
            accentColor = "#EC4899"
          } else if (progress >= 0.55 && progress < 0.62) {
            accentColor = "#22C55E"
          } else if (progress >= 0.78) {
            accentColor = "#00F5E5" // Warmer teal for FINAL (+5% hue shift)
          }

          if (accentRef.current !== accentColor) {
            accentRef.current = accentColor
            document.documentElement.style.setProperty("--accent-color", accentColor)
          }
        }
      })

      // ===== CAR REACTIONS =====
      // 2D car is hidden; keep placeholder for future fallback

      ScrollTrigger.refresh()
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <main 
      ref={mainRef}
      className="relative text-white"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {/* Glass Navbar */}
      <Navbar />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* ===== UNIFIED BACKGROUND SYSTEM ===== */}
      {/* Z-INDEX LAYERING (Bottom to Top):
           z-0: Tron void background
           z-[1]: Vignette overlay  
           z-[2]: Three.js Scene (rendered in Scene.jsx with z-0 internally)
           z-10: Scrollable content
           z-20: Header/Navbar
      */}
      
      {/* Tron Void Background - Consistent across entire page */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(
              1200px 600px at 25% 35%,
              rgba(0, 229, 255, 0.06),
              transparent 60%
            ),
            linear-gradient(
              180deg,
              #020205 0%,
              #04030a 40%,
              #020205 100%
            )
          `
        }}
      />

      {/* Vignette - Cinematic darkness framing for content/car contrast */}
      <div 
        className="fixed inset-0 z-[5] pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              rgba(0, 0, 0, 0) 35%,
              rgba(0, 0, 0, 0.4) 70%,
              rgba(0, 0, 0, 0.7) 100%
            )
          `
        }}
      />

      {/* Three.js Scene - Above unified background, behind content */}
      {/* Scene.jsx internally uses z-0, positioned here at z-[2] layer */}
      <Scene 
        scrollProgress={progressRef}
        scrollVelocity={velocityRef}
        motionDensity={motionDensityRef}
        activePhase={phaseRef}
        phaseProgress={phaseProgressRef}
        activeCardIndex={activeCardIndexRef}
        activeAccent={accentRef}
        textPhase={textPhaseRef}
        // Phase 5: UI ↔ World coupling signals
        sectionActive={sectionActiveRef}
        sectionPulse={sectionPulseRef}
        cardChangeSignal={cardChangeSignalRef}
        finalCTAActive={finalCTAActiveRef}
      />

      {/* Fixed Background with Parallax - Hidden (using unified background instead) */}
      <div style={{ display: "none" }}>
        <BackgroundEnvironment />
      </div>

      {/* Fixed Car - Hidden (replaced by 3D) */}
      <div style={{ display: "none" }}>
        <Car />
      </div>

      {/* Scrollable Content - Above all backgrounds */}
      <div className="relative z-10">
        
        {/* Hero Section */}
        <JourneyHero />

        {/* About Section */}
        <JourneyAbout />

        {/* Events Section */}
        <JourneyEvents activeCardIndexRef={activeCardIndexRef} />

        {/* Schedule Section */}
        <JourneySchedule />

        {/* Workshops Section */}
        <JourneyWorkshops />

        {/* Final CTA Section */}
        <JourneyFinalCTA />

        {/* Footer */}
        <JourneyFooter />

      </div>

      {/* PHASE 9: Debug Visual Mode - TEMPORARY (remove after validation) */}
      {/* Usage: Add ?debug=visual to URL */}
      <DebugVisualMode activePhase={phaseRef} />
    </main>
  )
}
