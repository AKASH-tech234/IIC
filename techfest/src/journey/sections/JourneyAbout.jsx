import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function JourneyAbout() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".timeline-card")

      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 70%",
          end: "bottom 40%",
          onEnter: () => gsap.to(card, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power2.out" }),
          onLeave: () => gsap.to(card, { opacity: 0, y: 10, filter: "blur(4px)", duration: 0.6, ease: "power2.out" }),
          onEnterBack: () => gsap.to(card, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power2.out" }),
          onLeaveBack: () => gsap.to(card, { opacity: 0, y: 10, filter: "blur(4px)", duration: 0.6, ease: "power2.out" })
        })
      })
    }, sectionRef)

    return () => ctx.revert()
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
                    <p className="mt-4 text-sm text-slate-200 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ) : (
                  <div className="text-left">
                    <h3 className="text-2xl uppercase" style={{ color: item.accent, fontFamily: "var(--font-display)" }}>
                      {item.title}
                    </h3>
                    <p className="mt-4 text-base text-slate-200 leading-relaxed max-w-sm">
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
