import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Journey Events Section
 * 
 * Side-profile card sequence aligned with the 3D rotation phase.
 * Cards translate on X only, one visible at a time.
 */
export default function JourneyEvents({ activeCardIndexRef }) {
  const sectionRef = useRef(null)
  const lastIndexRef = useRef(-1)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".events-card")
      const totalCards = cards.length

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          cards.forEach((card, index) => {
            const cardProgress = gsap.utils.clamp(0, 1, (progress * totalCards) - index)
            const enter = gsap.utils.interpolate(220, 0, Math.min(cardProgress / 0.5, 1))
            const exit = gsap.utils.interpolate(0, -220, Math.max((cardProgress - 0.5) / 0.5, 0))
            const x = cardProgress <= 0.5 ? enter : exit
            const opacity = cardProgress <= 0.5
              ? gsap.utils.interpolate(0, 1, cardProgress / 0.5)
              : gsap.utils.interpolate(1, 0, (cardProgress - 0.5) / 0.5)

            gsap.set(card, {
              x,
              opacity,
              zIndex: Math.round(opacity * 10)
            })
          })
        }
      })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const activeIndex = Math.min(totalCards - 1, Math.floor(self.progress * totalCards))
          const activeCard = cards[activeIndex]

          if (activeCard?.dataset?.accent) {
            document.documentElement.style.setProperty("--accent-color", activeCard.dataset.accent)
          }

          if (activeCardIndexRef && lastIndexRef.current !== activeIndex) {
            lastIndexRef.current = activeIndex
            activeCardIndexRef.current = activeIndex
          }
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const events = [
    {
      title: "AI",
      description: "Models, intelligence, and applied ML systems.",
      accent: "#3B82F6"
    },
    {
      title: "Robotics",
      description: "Build physical systems with precise control.",
      accent: "#8B5CF6"
    },
    {
      title: "Hackathon",
      description: "Prototype fast, ship bold solutions in 24 hours.",
      accent: "#EC4899"
    },
    {
      title: "Design",
      description: "Human-first systems and creative problem solving.",
      accent: "#22C55E"
    }
  ]

  return (
    <section
      ref={sectionRef}
      id="journey-events"
      className="relative min-h-[160vh] w-full flex items-center py-32"
    >
      <div className="relative z-10 w-full px-6 md:px-8">
        <div className="mb-10 flex items-center gap-4 justify-center">
          <div 
            className="w-12 h-[2px]"
            style={{ background: "linear-gradient(to right, var(--accent-color), transparent)" }}
          />
          <span 
            className="text-xs tracking-[0.3em] uppercase"
            style={{
              color: "var(--accent-color)",
              fontFamily: "var(--font-body)"
            }}
          >
            Milestone 02
          </span>
          <div 
            className="w-12 h-[2px]"
            style={{ background: "linear-gradient(to left, var(--accent-color), transparent)" }}
          />
        </div>

        <div className="text-center mb-16">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.2em]"
            style={{
              fontFamily: "var(--font-display)",
              color: "#FFFFFF"
            }}
          >
            Events In Motion
          </h2>
          <p
            className="mt-6 text-base md:text-lg"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(255,255,255,0.7)"
            }}
          >
            Each track appears beside the car as a milestone in the journey.
          </p>
        </div>

        <div className="relative flex justify-end">
          <div className="relative h-[360px] w-full max-w-[520px]">
            {events.map((event, index) => (
              <div
                key={event.title}
                className="events-card absolute inset-0 flex items-center justify-end"
                data-accent={event.accent}
                style={{
                  transform: "translateX(220px)",
                  opacity: 0
                }}
              >
                <div
                  className="w-full rounded-2xl px-8 py-10"
                  style={{
                    background: "rgba(8, 12, 20, 0.9)",
                    border: `1px solid ${event.accent}60`,
                    boxShadow: `0 20px 60px rgba(0,0,0,0.4)`
                  }}
                >
                  <p
                    className="text-xs tracking-[0.35em] uppercase"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: event.accent
                    }}
                  >
                    Track 0{index + 1}
                  </p>
                  <h3
                    className="mt-4 text-3xl uppercase tracking-[0.15em]"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#FFFFFF"
                    }}
                  >
                    {event.title}
                  </h3>
                  <p
                    className="mt-4 text-base leading-relaxed"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "rgba(255,255,255,0.7)"
                    }}
                  >
                    {event.description}
                  </p>
                  <div
                    className="mt-6 h-[2px] w-20"
                    style={{ background: event.accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
