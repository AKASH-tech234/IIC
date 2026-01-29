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

      gsap.fromTo(".event-lane",
        { opacity: 0, x: -50, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".events-grid",
            start: "top 70%",
            end: "top 30%",
            scrub: 1
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const events = [
    {
      title: "Hackathons & Coding Sprints",
      icon: "💻",
      description: "Build solutions, compete, collaborate"
    },
    {
      title: "Robotics & Hardware Challenges",
      icon: "🤖",
      description: "Engineer physical systems and compete"
    },
    {
      title: "AI & Emerging Technologies",
      icon: "🧠",
      description: "Explore ML, AI, and cutting-edge tech"
    },
    {
      title: "Design & Problem Solving",
      icon: "🎨",
      description: "Creative solutions for real problems"
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
        <div className="mb-6 flex items-center gap-4">
          <div className="w-12 h-[2px] bg-gradient-to-r from-blue-500 to-transparent" />
          <span className="text-blue-400 text-sm font-mono tracking-wider uppercase">Milestone 02</span>
        </div>

        {/* Heading */}
        <h2 className="events-heading text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-16 leading-tight text-center">
          Paths of
          <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Innovation
          </span>
        </h2>

        {/* Events Grid - "Road Lanes" */}
        <div className="events-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <div
              key={index}
              className="event-lane group relative p-8 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-lg backdrop-blur-sm transition-all duration-500 hover:border-blue-400/50 hover:bg-blue-500/5"
            >
              {/* Lane number */}
              <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-blue-500/10 border border-blue-400/30 rounded text-blue-400 text-xs font-mono">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Icon */}
              <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
                {event.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {event.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed">
                {event.description}
              </p>

              {/* Lane marker line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-400/50 to-blue-500/0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
