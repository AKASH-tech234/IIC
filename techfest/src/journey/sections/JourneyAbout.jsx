import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { UI_BEATS, applyExitBehavior, resetTimelineForEntry } from "../UIDirector"

export default function JourneyAbout() {
  const sectionRef = useRef(null)

  useEffect(() => {
    let tl = null
    let st = null
    let ctx = null
    
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const cards = gsap.utils.toArray(".timeline-card")
        
        if (cards.length === 0) return

      // ===== PHASE 10: CINEMATIC UI AUTHORING - Editorial Beats =====
      // Master timeline with explicit beat offsets (no stagger utilities)
      
      const beats = UI_BEATS.ABOUT
      
      // Initial state - NO BLUR
      gsap.set(cards, { opacity: 0 })

      // Master Timeline - Editorial beats with ALTERNATING SIDE ENTRY
      tl = gsap.timeline({ paused: true })

      // Beat 0.0s: Headline (dominant element claims frame) - NO MOVEMENT
      if (cards[0]) {
        tl.fromTo(cards[0], {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        }, beats.timing.headline)
      }

      // Beat 0.25s: Point 1 - Enter from LEFT (x: -24 → 0) - NO BLUR
      if (cards[1]) {
        tl.fromTo(cards[1], {
          opacity: 0,
          x: -24
        }, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out"
        }, beats.timing.point1)
      }

      // Beat 0.45s: Point 2 - Enter from RIGHT (x: +24 → 0) - NO BLUR
      if (cards[2]) {
        tl.fromTo(cards[2], {
          opacity: 0,
          x: 24
        }, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out"
        }, beats.timing.point2)
      }

      // Beat 0.65s: Point 3 - Enter from LEFT (x: -24 → 0) - NO BLUR
      if (cards[3]) {
        tl.fromTo(cards[3], {
          opacity: 0,
          x: -24
        }, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out"
        }, beats.timing.point3)
      }

      // ScrollTrigger with exit grammar
      st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
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

  const timeline = [
    {
      title: "Why Attend",
      description: "Explore future-facing tech, hands-on labs, and visionary speakers who shape the next decade of innovation.",
      accent: "#22D3EE",
      card: true
    },
    {
      title: "Who Should Come",
      description: "Builders, designers, researchers, and founders ready to collaborate and move the tech frontier forward.",
      accent: "#60A5FA",
      card: true
    },
    {
      title: "What to Expect",
      description: "Three days of innovation challenges, immersive showcases, and high-energy collaborations.",
      accent: "#A78BFA",
      card: false
    }
  ]

  return (
    <section ref={sectionRef} id="journey-about" className="relative min-h-[140vh] w-full px-6 md:px-10 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 section-stack">
          <p className="text-xs tracking-[0.35em] uppercase text-cyan-300">Milestone 03</p>
          <h2 className="text-4xl md:text-6xl uppercase section-title" style={{ fontFamily: "var(--font-display)" }}>
            About The Summit
          </h2>
          <p className="text-base md:text-lg text-slate-300 section-body">
            The journey shifts inward. Here’s why the summit matters and who it’s built for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10">
          <div className="flex flex-col gap-8 text-left">
            {timeline.map((item, index) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full" style={{ background: item.accent }} />
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">0{index + 1}</p>
                  <p className="text-lg text-white" style={{ fontFamily: "var(--font-display)" }}>{item.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-10">
            {timeline.map((item, index) => (
              <div
                key={item.title}
                className="timeline-card opacity-0 translate-y-[10px]"
                style={{ maxWidth: "520px" }}
              >
                {item.card ? (
                  <div
                    className="rounded-2xl px-8 py-6"
                    style={{
                      background: "linear-gradient(90deg, rgba(5, 20, 30, 0.85), rgba(5, 20, 30, 0))",
                      border: `1px solid ${item.accent}33`
                    }}
                  >
                    <h3 className="text-xl uppercase" style={{ color: item.accent, fontFamily: "var(--font-display)" }}>
                      {item.title}
                    </h3>
                    <p className="mt-4 text-sm text-slate-200 body-supporting optical-margin-body">
                      {item.description}
                    </p>
                  </div>
                ) : (
                  <div className="text-left">
                    <h3 className="text-2xl uppercase" style={{ color: item.accent, fontFamily: "var(--font-display)" }}>
                      {item.title}
                    </h3>
                    <p className="mt-4 text-base text-slate-200 max-w-sm body-supporting optical-margin-body">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
