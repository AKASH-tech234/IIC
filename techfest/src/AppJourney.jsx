import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import useLenis from "./hooks/useLenis"
import Car from "./journey/components/Car"
import BackgroundEnvironment from "./journey/components/BackgroundEnvironment"
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

  useEffect(() => {
    const ctx = gsap.context(() => {
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

        // Glow color changes with environment
        if (carGlow) {
          ScrollTrigger.create({
            trigger: mainRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress
              
              let glowColor = "rgba(56, 189, 248, 0.4)"
              
              if (progress > 0.2 && progress < 0.4) {
                glowColor = "rgba(59, 130, 246, 0.4)"
              } else if (progress >= 0.4 && progress < 0.6) {
                glowColor = "rgba(168, 85, 247, 0.4)"
              } else if (progress >= 0.6 && progress < 0.8) {
                glowColor = "rgba(34, 197, 94, 0.4)"
              } else if (progress >= 0.8) {
                glowColor = "rgba(139, 92, 246, 0.5)"
              }
              
              gsap.to(carGlow, {
                background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                duration: 0.5
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
      className="relative w-full bg-[#050510] text-white overflow-x-hidden"
    >
      {/* Fixed Background with Parallax */}
      <BackgroundEnvironment />

      {/* Fixed Car */}
      <Car />

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
