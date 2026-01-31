import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { UI_BEATS, applyExitBehavior, resetTimelineForEntry } from "../UIDirector"
import { applyDeviceMotionScaling } from "../DeviceDirector"

/**
 * Journey Final CTA Section
 * 
 * Content:
 * - Heading: Reach the Future
 * - Text and CTA: Get Your Pass
 * 
 * Visual State:
 * - Arrival at destination
 * - Background calms
 * - Car comes to rest
 */
export default function JourneyFinalCTA() {
  const sectionRef = useRef(null)

  useEffect(() => {
    let tl = null
    let st = null
    let ctx = null
    
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
      // ===== PHASE 10: CINEMATIC UI AUTHORING - End Frame =====
      // Master timeline with calm arrival beats (no scrub, authored timing)
      
      const beats = UI_BEATS.FINAL
      
      // Initial state - NO BLUR
      gsap.set(".final-cta-badge", { opacity: 0, scale: 1.05 })
      gsap.set(".final-cta-heading", { opacity: 0 })
      gsap.set(".final-cta-text", { opacity: 0 })
      gsap.set(".final-cta-button", { opacity: 0 })

      // Master Timeline - ARRIVAL AND STILLNESS (NO DIRECTIONAL MOTION)
      tl = gsap.timeline({ paused: true })
      
      // PHASE 11: Apply device motion scaling
      applyDeviceMotionScaling(tl)
      
      // Beat 0.0s: Headline - opacity only (NO MOVEMENT)
      tl.fromTo(".final-cta-heading", {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.8,
        ease: "power1.inOut"
      }, 0.0)

      // Beat 0.35s: CTA - opacity only (large pause after headline)
      tl.fromTo(".final-cta-button", {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.6,
        ease: "power1.inOut"
      }, 0.35)

      // Beat 0.65s: Badge - scale settle (1.05 → 1.0) LAST
      tl.fromTo(".final-cta-badge", {
        opacity: 0,
        scale: 1.05
      }, {
        opacity: 1,
        scale: 1.0, // Settle down (arrival feel)
        duration: 0.8,
        ease: "expo.out" // Slow, calm easing
      }, 0.65)

      // Text appears with headline (not animated separately, just set visible)
      tl.to(".final-cta-text", {
        opacity: 1,
        duration: 0.7,
        ease: "power1.inOut"
      }, 0.15)

      // ScrollTrigger with exit grammar
      st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        onEnter: () => {
          resetTimelineForEntry(tl)
          tl.play()
          
          // Update to lime accent
          document.documentElement.style.setProperty("--accent-color", "#22C55E") // Lime
          
          // Slow down car on arrival
          const car = document.querySelector("#car")
          if (car) {
            gsap.to(car, {
              rotateZ: 0,
              duration: 1,
              ease: "power2.out"
            })
          }
        },
        onLeaveBack: () => {
          applyExitBehavior(tl) // Exit 30% faster
        }
      })

      }, sectionRef)
    }, 100)

    // PHASE 10: Lifecycle safety - kill timeline and ScrollTrigger on unmount
    return () => {
      clearTimeout(timer)
      if (tl) tl.kill()
      if (st) st.kill()
      if (ctx) ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="journey-final-cta"
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-32"
    >
      {/* Content Container */}
      <div className="relative z-10 w-full px-6 md:px-8 text-center">
        
        {/* Badge */}
        <div className="final-cta-badge inline-block mb-8">
          <div className="px-6 py-2 border-2 border-white/30 rounded-full bg-white/5 backdrop-blur-sm">
            <span className="text-white/80 text-sm font-mono tracking-[0.3em] uppercase">
              Destination Reached
            </span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="final-cta-heading text-6xl sm:text-7xl md:text-8xl text-white mb-8 optical-margin-heading">
          Reach the
          <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Future
          </span>
        </h2>

        {/* Text */}
        <p className="final-cta-text text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 body-supporting optical-margin-body">
          Join MNNIT TechSummit 2026 and be part of a journey driven by innovation, collaboration, and impact.
        </p>

        {/* CTA Button */}
        <button className="final-cta-button group relative px-12 py-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold text-xl tracking-wide rounded-lg overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-[0_0_60px_rgba(56,189,248,0.8)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050510]">
          <span className="relative z-10">Get Your Pass</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Shine effect */}
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </button>

        {/* Meta info */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            <span>March 18–20, 2026</span>
          </div>
          <div className="hidden sm:block w-[1px] h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span>MNNIT Allahabad</span>
          </div>
          <div className="hidden sm:block w-[1px] h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <span>500+ Innovators</span>
          </div>
        </div>
      </div>

      {/* Horizon glow - Open highway feel */}
      <div className="absolute inset-0 z-0">
        {/* Horizon glow */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{
            background: "linear-gradient(to top, rgba(34, 197, 94, 0.2), transparent)"
          }}
        />
        
        {/* Radial center glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)"
          }}
        />

        {/* Fewer building silhouettes (open highway) */}
        <div className="absolute bottom-0 left-0 right-0 h-32 flex justify-around items-end opacity-10">
          {[20, 30, 25].map((height, i) => (
            <div
              key={i}
              className="w-16"
              style={{
                height: `${height}%`,
                background: "var(--bg-city-shadow)"
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
