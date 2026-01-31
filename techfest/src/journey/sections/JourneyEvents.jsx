import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { UI_BEATS, applyExitBehavior, resetTimelineForEntry } from "../UIDirector"
import { applyDeviceMotionScaling } from "../DeviceDirector"

export default function JourneyEvents() {
  const sectionRef = useRef(null)
  const linesRef = useRef([])

  useEffect(() => {
    let tl = null
    let st = null
    let ctx = null
    
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const cards = gsap.utils.toArray(".events-arc-card")
        
        if (cards.length === 0) return

      // ===== PHASE 10: CINEMATIC UI AUTHORING - Staged Gallery Focus =====
      // All cards visible together with editorial rhythm
      
      const beats = UI_BEATS.EVENTS
      
      // CINEMATIC: Cards enter from LEFT and RIGHT (2 from each side)
      // Initial state: cards hidden with lateral offset
      // Cards 0,1 (left side), Cards 2,3 (right side)
      if (cards[0]) gsap.set(cards[0], { opacity: 0, x: -120, scale: 0.9 })
      if (cards[1]) gsap.set(cards[1], { opacity: 0, x: -120, scale: 0.9 })
      if (cards[2]) gsap.set(cards[2], { opacity: 0, x: 120, scale: 0.9 })
      if (cards[3]) gsap.set(cards[3], { opacity: 0, x: 120, scale: 0.9 })

      // Master Timeline - CINEMATIC LEFT/RIGHT ENTRY (FASTER)
      tl = gsap.timeline({ paused: true })
      
      // PHASE 11: Apply device motion scaling
      applyDeviceMotionScaling(tl)

      // Cards 0,1 enter from LEFT - REDUCED DURATION AND DELAYS
      if (cards[0]) {
        tl.to(cards[0], {
          opacity: beats.visualHierarchy.supporting.opacity, // 0.85
          x: 0,
          scale: beats.visualHierarchy.supporting.scale, // 0.96
          duration: 0.5, // Reduced from 0.8 to 0.5
          ease: "power2.out"
        }, 0.0)
      }
      
      if (cards[1]) {
        tl.to(cards[1], {
          opacity: beats.visualHierarchy.supporting.opacity,
          x: 0,
          scale: beats.visualHierarchy.supporting.scale,
          duration: 0.5, // Reduced from 0.8 to 0.5
          ease: "power2.out"
        }, 0.05) // Reduced from 0.1 to 0.05
      }

      // Cards 2,3 enter from RIGHT - REDUCED DURATION AND DELAYS
      if (cards[2]) {
        tl.to(cards[2], {
          opacity: beats.visualHierarchy.supporting.opacity,
          x: 0,
          scale: beats.visualHierarchy.supporting.scale,
          duration: 0.5, // Reduced from 0.8 to 0.5
          ease: "power2.out"
        }, 0.0)
      }
      
      if (cards[3]) {
        tl.to(cards[3], {
          opacity: beats.visualHierarchy.supporting.opacity,
          x: 0,
          scale: beats.visualHierarchy.supporting.scale,
          duration: 0.5, // Reduced from 0.8 to 0.5
          ease: "power2.out"
        }, 0.05) // Reduced from 0.1 to 0.05
      }

      // Active card (first one) scales to dominant after entry - FASTER
      if (cards[0]) {
        tl.to(cards[0], {
          scale: beats.visualHierarchy.active.scale,   // 1.0
          opacity: beats.visualHierarchy.active.opacity, // 1.0
          duration: 0.3, // Reduced from 0.4 to 0.3
          ease: "power2.out"
        }, 0.55) // Reduced from 0.9 to 0.55 (after cards settle faster)
      }

      // ScrollTrigger - Pin section with exit grammar
      st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 20%",
        end: "bottom 30%",
        pin: beats.pin, // true from UIDirector
        onEnter: () => {
          resetTimelineForEntry(tl)
          tl.play()
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

  const tracks = [
    { title: "AI", accent: "#3B82F6" },
    { title: "WEB", accent: "#8B5CF6" },
    { title: "CLOUD", accent: "#EC4899" },
    { title: "SECURITY", accent: "#22C55E" }
  ]

  return (
    <section ref={sectionRef} id="journey-events" className="relative min-h-[160vh] w-full px-6 md:px-10 py-28">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 section-stack">
          <p className="text-xs tracking-[0.35em] uppercase text-cyan-300">Milestone 02</p>
          <h2 className="text-4xl md:text-6xl uppercase section-title" style={{ fontFamily: "var(--font-display)" }}>
            Mission Curve
          </h2>
          <p className="text-base md:text-lg text-slate-300 section-body">
            Four tracks emerge together at the curve, framing the journey’s core domains.
          </p>
        </div>

        <div className="relative flex justify-center">
          <div className="relative w-full max-w-5xl h-[420px]">
            {/* Track lines removed - clean card layout */}
            <div className="absolute inset-0 flex items-center justify-center gap-6">
              {tracks.map((track, index) => (
                <div
                  key={track.title}
                  className="events-arc-card"
                >
                  <div
                    className="px-6 py-4 rounded-xl"
                    style={{
                      background: "rgba(6, 16, 26, 0.75)",
                      border: `1px solid ${track.accent}66`,
                      boxShadow: "0 12px 28px rgba(0,0,0,0.4)"
                    }}
                  >
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Track</p>
                    <h3 className="text-xl uppercase" style={{ color: track.accent, fontFamily: "var(--font-display)" }}>
                      {track.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
