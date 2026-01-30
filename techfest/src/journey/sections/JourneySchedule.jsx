import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Carousel, Card } from "../../components/ui/apple-cards-carousel"

/**
 * Journey Schedule Section
 * 
 * Content:
 * - Heading: Milestones Ahead
 * - Timeline: Day 1, Day 2, Day 3
 * 
 * Visual State:
 * - Road markers appear
 * - Background transitions smoothly
 */
export default function JourneySchedule() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".schedule-heading",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            scrub: 1
          }
        }
      )

      // Road markers pass beneath (move up)
      gsap.fromTo(".road-marker",
        { opacity: 0, y: 200 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.3,
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 70%",
            end: "top 20%",
            scrub: 1
          }
        }
      )

      // Timeline text fades in after marker passes
      gsap.fromTo(".timeline-content",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.3,
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 60%",
            end: "top 15%",
            scrub: 1
          }
        }
      )

      // Update accent color
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          gsap.to(":root", {
            "--accent-color": "#8B5CF6", // Purple
            duration: 0.8
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const schedule = [
    {
      day: "Day 1",
      title: "Opening & Foundations",
      events: ["Opening Ceremony", "Keynote Sessions", "Technical Workshops"]
    },
    {
      day: "Day 2",
      title: "Hackathon Sprint",
      events: ["24-Hour Hackathon", "Engineering Challenges", "Live Coding Battles"]
    },
    {
      day: "Day 3",
      title: "Finals & Awards",
      events: ["Final Presentations", "Project Demos", "Awards Ceremony"]
    }
  ]

  // Apple Cards Carousel data
  const scheduleCards = schedule.map((item, index) => ({
    category: item.day,
    title: item.title,
    src: index === 0 
      ? "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800" 
      : index === 1 
      ? "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800"
      : "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800",
    content: (
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">
            {item.title}
          </span>{" "}
          - Experience the best of MNNIT TechSummit 2026
        </p>
        <div className="mt-8 space-y-4">
          {item.events.map((event, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ 
                background: index === 0 ? '#8B5CF6' : index === 1 ? '#A855F7' : '#EC4899' 
              }} />
              <p className="text-neutral-700 dark:text-neutral-300 text-lg">{event}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Join hundreds of students, developers, and innovators in this immersive experience.
          </p>
        </div>
      </div>
    ),
  }))

  const cards = scheduleCards.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ))

  return (
    <section
      ref={sectionRef}
      id="journey-schedule"
      className="relative min-h-screen w-full flex flex-col justify-center px-6 py-32"
    >
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        
        {/* Section marker */}
        <div className="mb-6 flex items-center gap-4 justify-center">
          <div 
            className="w-12 h-[2px]"
            style={{
              background: "linear-gradient(to right, transparent, var(--accent-color))"
            }}
          />
          <span 
            className="text-sm font-mono tracking-wider uppercase"
            style={{ color: "var(--accent-color)" }}
          >
            Milestone 03
          </span>
          <div 
            className="w-12 h-[2px]"
            style={{
              background: "linear-gradient(to left, transparent, var(--accent-color))"
            }}
          />
        </div>

        {/* Heading */}
        <h2 
          className="schedule-heading text-5xl sm:text-6xl md:text-7xl font-bold mb-12 leading-tight text-center"
          style={{ color: "var(--text-primary)" }}
        >
          Milestones
          <span 
            className="block mt-2"
            style={{
              background: "linear-gradient(to right, var(--accent-purple), var(--accent-magenta))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Ahead
          </span>
        </h2>

        {/* Apple Cards Carousel - Interactive Schedule */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <p 
              className="text-sm font-mono tracking-wider uppercase mb-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              Interactive Timeline
            </p>
            <p 
              className="text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              Swipe through the 3-day journey
            </p>
          </div>
          <Carousel items={cards} />
        </div>

        {/* Timeline - Large Road Markers */}
        <div className="timeline-container relative space-y-24">
          {schedule.map((item, index) => (
            <div
              key={index}
              className="relative"
            >
              {/* Large Road Marker */}
              <div className="road-marker flex justify-center mb-8">
                <div 
                  className="relative px-12 py-6 rounded-lg"
                  style={{
                    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))",
                    border: "2px solid",
                    borderImage: "linear-gradient(to right, var(--accent-purple), var(--accent-magenta)) 1",
                    boxShadow: `0 0 40px ${index === 0 ? '#8B5CF6' : index === 1 ? '#A855F7' : '#EC4899'}30`
                  }}
                >
                  {/* Day badge */}
                  <div 
                    className="text-6xl md:text-8xl font-black text-center"
                    style={{
                      background: "linear-gradient(to right, var(--accent-purple), var(--accent-magenta))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: `drop-shadow(0 0 20px ${index === 0 ? '#8B5CF6' : index === 1 ? '#A855F7' : '#EC4899'})`
                    }}
                  >
                    {item.day.toUpperCase()}
                  </div>

                  {/* Road marker lines */}
                  <div className="absolute top-0 left-0 w-full h-1">
                    <div 
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(to right, transparent, ${index === 0 ? '#8B5CF6' : index === 1 ? '#A855F7' : '#EC4899'}, transparent)`
                      }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1">
                    <div 
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(to right, transparent, ${index === 0 ? '#8B5CF6' : index === 1 ? '#A855F7' : '#EC4899'}, transparent)`
                      }}
                    />
                  </div>

                  {/* Distance marker dots */}
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        background: index === 0 ? '#8B5CF6' : index === 1 ? '#A855F7' : '#EC4899',
                        boxShadow: `0 0 10px ${index === 0 ? '#8B5CF6' : index === 1 ? '#A855F7' : '#EC4899'}`
                      }}
                    />
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        background: index === 0 ? '#8B5CF6' : index === 1 ? '#A855F7' : '#EC4899',
                        boxShadow: `0 0 10px ${index === 0 ? '#8B5CF6' : index === 1 ? '#A855F7' : '#EC4899'}`,
                        opacity: 0.6
                      }}
                    />
                  </div>
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        background: index === 0 ? '#8B5CF6' : index === 1 ? '#A855F7' : '#EC4899',
                        boxShadow: `0 0 10px ${index === 0 ? '#8B5CF6' : index === 1 ? '#A855F7' : '#EC4899'}`
                      }}
                    />
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        background: index === 0 ? '#8B5CF6' : index === 1 ? '#A855F7' : '#EC4899',
                        boxShadow: `0 0 10px ${index === 0 ? '#8B5CF6' : index === 1 ? '#A855F7' : '#EC4899'}`,
                        opacity: 0.6
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Timeline Content - Fades in after marker passes */}
              <div className="timeline-content max-w-2xl mx-auto">
                <h3 
                  className="text-3xl md:text-4xl font-bold mb-6 text-center"
                  style={{
                    color: index === 0 ? '#8B5CF6' : index === 1 ? '#A855F7' : '#EC4899'
                  }}
                >
                  {item.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {item.events.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="p-4 rounded-lg text-center"
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: `1px solid ${index === 0 ? '#8B5CF6' : index === 1 ? '#A855F7' : '#EC4899'}40`
                      }}
                    >
                      <p 
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {event}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting line to next marker */}
              {index < schedule.length - 1 && (
                <div className="flex justify-center mt-16">
                  <div 
                    className="w-[2px] h-16"
                    style={{
                      background: `linear-gradient(to bottom, ${index === 0 ? '#8B5CF6' : index === 1 ? '#A855F7' : '#EC4899'}, transparent)`,
                      opacity: 0.3
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
