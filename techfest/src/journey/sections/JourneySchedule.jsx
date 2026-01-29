import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

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

      gsap.fromTo(".milestone-marker",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 70%",
            end: "top 25%",
            scrub: 1
          }
        }
      )
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

  return (
    <section
      ref={sectionRef}
      id="journey-schedule"
      className="relative min-h-screen w-full flex flex-col justify-center px-6 py-32"
    >
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        
        {/* Section marker */}
        <div className="mb-6 flex items-center gap-4 justify-center">
          <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-purple-500" />
          <span className="text-purple-400 text-sm font-mono tracking-wider uppercase">Milestone 03</span>
          <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-purple-500" />
        </div>

        {/* Heading */}
        <h2 className="schedule-heading text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-20 leading-tight text-center">
          Milestones
          <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ahead
          </span>
        </h2>

        {/* Timeline - Road Markers */}
        <div className="timeline-container relative">
          
          {/* Central road line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500/50 via-purple-400/50 to-purple-500/50" />

          {/* Timeline items */}
          <div className="space-y-16">
            {schedule.map((item, index) => (
              <div
                key={index}
                className={`milestone-marker relative flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Marker dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-purple-500 border-4 border-[#050510] rounded-full z-10">
                  <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping opacity-75" />
                </div>

                {/* Content card */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <div className="inline-block px-4 py-1 mb-3 bg-purple-500/20 border border-purple-400/30 rounded-full">
                    <span className="text-purple-400 text-sm font-mono tracking-wider">
                      {item.day}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">{item.title}</h3>
                  <ul className={`space-y-2 ${index % 2 === 0 ? 'md:items-end' : 'md:items-start'} flex flex-col`}>
                    {item.events.map((event, eventIndex) => (
                      <li key={eventIndex} className="flex items-center gap-3 text-gray-400">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
