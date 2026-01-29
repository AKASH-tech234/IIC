import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Journey Events Section
 * 
 * Content:
 * - Heading: Paths of Innovation
 * - Event blocks: Hackathons, Robotics, AI, Design
 * 
 * Visual State:
 * - Road splits briefly into lanes
 * - Icons/minimal UI elements appear beside road
 */
export default function JourneyEvents() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".events-heading",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            scrub: 1
          }
        }
      )

      // Lanes light up sequentially
      gsap.fromTo(".road-lane",
        { 
          opacity: 0.2,
          scaleY: 0,
          transformOrigin: "bottom"
        },
        {
          opacity: 1,
          scaleY: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".road-lanes-container",
            start: "top 70%",
            end: "top 30%",
            scrub: 1
          }
        }
      )

      // Cards rise from road surface
      gsap.fromTo(".event-card",
        { opacity: 0, y: 100, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".road-lanes-container",
            start: "top 60%",
            end: "top 25%",
            scrub: 1
          }
        }
      )

      // Sparks when lanes activate
      ScrollTrigger.create({
        trigger: ".road-lanes-container",
        start: "top 60%",
        onEnter: () => {
          const lanes = document.querySelectorAll(".road-lane")
          lanes.forEach((lane, i) => {
            setTimeout(() => {
              // Create spark effect
              const spark = document.createElement("div")
              spark.className = "lane-spark"
              spark.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 50%;
                width: 4px;
                height: 4px;
                background: ${events[i].laneColor};
                border-radius: 50%;
                box-shadow: 0 0 20px ${events[i].laneColor};
              `
              lane.appendChild(spark)
              
              gsap.fromTo(spark,
                { y: 0, opacity: 1, scale: 1 },
                { 
                  y: -50, 
                  opacity: 0, 
                  scale: 3,
                  duration: 0.8,
                  ease: "power2.out",
                  onComplete: () => spark.remove()
                }
              )
            }, i * 200)
          })
        }
      })

      // Update accent color
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          gsap.to(":root", {
            "--accent-color": "#3B82F6", // Blue
            duration: 0.8
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const events = [
    {
      title: "AI & ML",
      icon: "🧠",
      description: "Explore ML, AI, and cutting-edge tech",
      laneColor: "#3B82F6"
    },
    {
      title: "Robotics",
      icon: "🤖",
      description: "Engineer physical systems",
      laneColor: "#8B5CF6"
    },
    {
      title: "Hackathon",
      icon: "💻",
      description: "24-hour coding sprint",
      laneColor: "#EC4899"
    },
    {
      title: "Design",
      icon: "🎨",
      description: "Creative problem solving",
      laneColor: "#22D3EE"
    }
  ]

  return (
    <section
      ref={sectionRef}
      id="journey-events"
      className="relative min-h-screen w-full flex flex-col justify-center px-6 py-32"
    >
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* Section marker */}
        <div className="mb-6 flex items-center gap-4 justify-center">
          <div 
            className="w-12 h-[2px]"
            style={{
              background: "linear-gradient(to right, var(--accent-color), transparent)"
            }}
          />
          <span 
            className="text-sm font-mono tracking-wider uppercase"
            style={{ color: "var(--accent-color)" }}
          >
            Milestone 02
          </span>
          <div 
            className="w-12 h-[2px]"
            style={{
              background: "linear-gradient(to left, var(--accent-color), transparent)"
            }}
          />
        </div>

        {/* Heading */}
        <h2 
          className="events-heading text-5xl sm:text-6xl md:text-7xl font-bold mb-20 leading-tight text-center"
          style={{ color: "var(--text-primary)" }}
        >
          Paths of
          <span 
            className="block mt-2"
            style={{
              background: "linear-gradient(to right, var(--accent-blue), var(--accent-cyan))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Innovation
          </span>
        </h2>

        {/* Road Lanes Layout */}
        <div className="road-lanes-container relative">
          {/* Text label */}
          <div className="text-center mb-8">
            <p 
              className="text-sm font-mono tracking-wider uppercase"
              style={{ color: "var(--text-tertiary)" }}
            >
              Choose Your Path
            </p>
          </div>

          {/* Lanes */}
          <div className="relative h-[400px] grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {events.map((event, index) => (
              <div
                key={index}
                className="road-lane relative"
              >
                {/* Glowing lane */}
                <div 
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: `linear-gradient(to top, ${event.laneColor}15, transparent)`,
                    border: `2px solid ${event.laneColor}40`,
                    boxShadow: `0 0 30px ${event.laneColor}20`
                  }}
                />

                {/* Lane marker */}
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-full"
                  style={{
                    background: `linear-gradient(to top, ${event.laneColor}, transparent)`,
                    opacity: 0.3
                  }}
                />

                {/* Event Card - Floats above lane */}
                <div 
                  className="event-card absolute top-8 left-1/2 -translate-x-1/2 w-[90%] p-6 rounded-lg"
                  style={{
                    background: "rgba(10, 15, 25, 0.9)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: `1px solid ${event.laneColor}60`,
                    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px ${event.laneColor}20`
                  }}
                >
                  {/* Icon */}
                  <div className="text-4xl mb-3 text-center">
                    {event.icon}
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-lg font-bold mb-2 text-center"
                    style={{ color: event.laneColor }}
                  >
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p 
                    className="text-xs leading-relaxed text-center"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {event.description}
                  </p>

                  {/* Lane indicator at bottom */}
                  <div className="mt-4 flex justify-center">
                    <div 
                      className="w-8 h-1 rounded-full"
                      style={{ 
                        background: event.laneColor,
                        boxShadow: `0 0 10px ${event.laneColor}`
                      }}
                    />
                  </div>
                </div>

                {/* Lane number badge at bottom */}
                <div 
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center rounded-full text-xs font-mono font-bold"
                  style={{
                    background: `${event.laneColor}20`,
                    border: `1px solid ${event.laneColor}`,
                    color: event.laneColor,
                    boxShadow: `0 0 15px ${event.laneColor}40`
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
