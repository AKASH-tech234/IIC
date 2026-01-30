import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function JourneyEvents() {
  const sectionRef = useRef(null)
  const linesRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".events-arc-card")

      gsap.set(cards, { opacity: 0, y: 20 })
      gsap.set(linesRef.current, { strokeDashoffset: 200 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 55%",
        end: "bottom 50%",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const reveal = gsap.utils.clamp(0, 1, progress * 1.2)

          cards.forEach((card, index) => {
            gsap.to(card, {
              opacity: reveal,
              y: 0,
              duration: 0.4,
              delay: index * 0.1
            })
          })

          linesRef.current.forEach((line) => {
            if (line) {
              line.style.strokeDashoffset = `${200 - 200 * reveal}`
            }
          })
        }
      })
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
                  d={`M400 320 C${320 + index * 40} 260 ${260 + index * 80} 200 ${180 + index * 140} 120`}
                  stroke={track.accent}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="200"
                />
              ))}
            </svg>

            <div className="absolute inset-0 flex items-center justify-center gap-6">
              {tracks.map((track, index) => (
                <div
                  key={track.title}
                  className="events-arc-card"
                  style={{
                    transform: `translateY(${index % 2 === 0 ? -40 : 40}px)`
                  }}
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
