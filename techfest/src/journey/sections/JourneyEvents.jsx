import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function JourneyEvents() {
  const sectionRef = useRef(null)
  const linesRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".events-arc-card")

      // ===== PHASE 7: TRUE GALLERY MODE - NO Y MOTION =====
      // All cards visible together, scale + opacity hierarchy ONLY
      
      // Initial state: all cards hidden, no Y offset
      gsap.set(cards, { opacity: 0, scale: 0.9, filter: "blur(4px)" })
      gsap.set(linesRef.current, { strokeDashoffset: 200 })

      // Master Timeline - Cards enter TOGETHER
      const tl = gsap.timeline({ paused: true })

      // Cards reveal together with slight stagger
      tl.to(cards, {
        opacity: 1,
        scale: 1.0,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.08, // Very tight stagger - feel simultaneous
        ease: "power2.out"
      })

      // Lines draw in sync
      tl.to(linesRef.current, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: "power1.inOut"
      }, "-=0.4") // Overlap with card reveal

      // ScrollTrigger - Pin section, play timeline on enter
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 20%",
        end: "bottom 30%",
        pin: true,
        onEnter: () => tl.play(),
        onLeaveBack: () => tl.reverse()
      })

      // Visual Hierarchy on scroll within pinned section (optional future enhancement)
      // Currently all cards maintain equal prominence (gallery mode)
      
    }, sectionRef)

    return () => ctx.revert()
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
