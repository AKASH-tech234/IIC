import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { UI_BEATS, applyExitBehavior, resetTimelineForEntry } from "../UIDirector"

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
      
      // Initial state: all cards hidden, no Y offset
      gsap.set(cards, { opacity: 0, scale: 0.9, filter: "blur(4px)" })
      gsap.set(linesRef.current, { strokeDashoffset: 200 })

      // Master Timeline - Staged focus with beats
      tl = gsap.timeline({ paused: true })

      // Beat 0.0s: All cards appear together (supporting opacity)
      tl.to(cards, {
        opacity: beats.visualHierarchy.supporting.opacity, // 0.85 - all cards supporting
        scale: beats.visualHierarchy.supporting.scale,     // 0.96 - subtle scale
        filter: "blur(0px)", // No blur on final state
        duration: 0.8,
        stagger: 0.08, // Very tight stagger - feel simultaneous
        ease: "power2.out"
      }, beats.timing.allCards)

      // Beat 0.20s: Active card (first) scales to dominant
      tl.to(cards[0], {
        scale: beats.visualHierarchy.active.scale,   // 1.0
        opacity: beats.visualHierarchy.active.opacity, // 1.0
        duration: 0.4,
        ease: "power2.out"
      }, beats.timing.activeCard)

      // Lines draw in sync with card reveals
      tl.to(linesRef.current, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: "power1.inOut"
      }, beats.timing.allCards + 0.4)

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
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" fill="none">
              {tracks.map((track, index) => (
                <path
                  key={track.title}
                  ref={(el) => (linesRef.current[index] = el)}
                  d={`M400 320 L${200 + index * 140} 140`}
                  stroke={track.accent}
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeDasharray="200"
                />
              ))}
            </svg>

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
