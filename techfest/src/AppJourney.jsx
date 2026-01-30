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
  const mainRef = useRef(null)
  const progressRef = useRef(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ===== SCROLL PROGRESS TRACKING =====
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress
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

      // ===== CAR REACTIONS =====
      const car = document.querySelector("#car")
      const carGlow = car?.querySelector("div")

      // Initial scroll tilt
      if (car) {
        gsap.to(car, {
          rotateZ: -1,
          scrollTrigger: {
            trigger: mainRef.current,
            start: "top top",
            end: "10% top",
            scrub: 1
          }
        })

        gsap.to(car, {
          rotateZ: 0,
          scrollTrigger: {
            trigger: mainRef.current,
            start: "10% top",
            end: "15% top",
            scrub: 1
          }
        })

        // Underglow color changes with environment + sync accent color
        if (carGlow) {
          ScrollTrigger.create({
            trigger: mainRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress
              
              let accentColor = "#22D3EE" // Cyan
              
              if (progress > 0.2 && progress < 0.4) {
                accentColor = "#3B82F6" // Blue
              } else if (progress >= 0.4 && progress < 0.6) {
                accentColor = "#8B5CF6" // Purple
              } else if (progress >= 0.6 && progress < 0.8) {
                accentColor = "#EC4899" // Magenta
              } else if (progress >= 0.8) {
                accentColor = "#22C55E" // Lime
              }
              
              // Update CSS variable for global accent
              gsap.to(":root", {
                "--accent-color": accentColor,
                duration: 0.8
              })
              
              // Update underglow
              gsap.to(carGlow, {
                background: `radial-gradient(ellipse, ${accentColor} 0%, transparent 70%)`,
                duration: 0.8
              })
            }
          })
        }
      }

      ScrollTrigger.refresh()
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <main 
      ref={mainRef}
      className="relative w-full text-white overflow-x-hidden"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {/* Glass Navbar */}
      <Navbar />

      {/* Three.js Scene - Behind everything */}
      <Scene scrollProgress={progressRef} />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Fixed Background with Parallax - Hidden (using shader + 3D instead) */}
      <div style={{ display: "none" }}>
        <BackgroundEnvironment />
      </div>

      {/* Fixed Car - Hidden (replaced by 3D) */}
      <div style={{ display: "none" }}>
        <Car />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        
        {/* Hero Section */}
        <JourneyHero />

        {/* About Section */}
        <JourneyAbout />

        {/* Events Section */}
        <JourneyEvents />

        {/* Schedule Section */}
        <JourneySchedule />

        {/* Workshops Section */}
        <JourneyWorkshops />

        {/* Final CTA Section */}
        <JourneyFinalCTA />

        {/* Footer */}
        <JourneyFooter />

      </div>
    </main>
  )
}
