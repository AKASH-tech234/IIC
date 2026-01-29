import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * Software Section (Chapter 3)
 * 
 * Content from spec:
 * - Heading: Code. Collaborate. Create.
 * - Body: Hackathons and software workshops...
 * - Timeline preview: Day 1, Day 2, Day 3
 * - CTA: Join the Hackathon
 * 
 * Innovation Core behavior:
 * - Glow: Neon Green (#22C55E)
 * - Scale: slightly smaller than chapter 2
 * - Pulsing effect
 * - Tooltip: COLLABORATE
 */
export default function Software() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate content on scroll
      gsap.fromTo(".software-heading",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 40%",
            scrub: 1
          }
        }
      )

      gsap.fromTo(".software-body",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "top 30%",
            scrub: 1
          }
        }
      )

      // Timeline items staggered
      gsap.fromTo(".timeline-item",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".timeline-preview",
            start: "top 75%",
            end: "top 40%",
            scrub: 1
          }
        }
      )

      gsap.fromTo(".software-cta",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: ".software-cta",
            start: "top 85%",
            end: "top 65%",
            scrub: 1
          }
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const timeline = [
    {
      day: "Day 1",
      title: "Inauguration & Workshops",
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
      id="software"
      className="story-section relative min-h-screen w-full py-32 px-6"
      data-color="green"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 60%)"
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="w-full md:w-1/2 md:pr-16">
          
          {/* Section Label */}
          <div className="mb-4 font-mono text-sm text-green-400/70 tracking-widest">
            // CHAPTER 03
          </div>

          {/* Heading */}
          <h2 className="software-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            <span className="text-green-400">Code.</span> Collaborate.
            <span className="block">Create.</span>
          </h2>

          {/* Body Text */}
          <p className="software-body text-lg text-gray-400 leading-relaxed mb-10 border-l-2 border-green-500/30 pl-6">
            Hackathons and software workshops drive collaborative problem-solving. Participants build full-stack applications, automate systems, and solve meaningful problems under real constraints.
          </p>

        </div>

        {/* Timeline Preview */}
        <div className="timeline-preview mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {timeline.map((item, index) => (
            <div 
              key={index}
              className="timeline-item relative p-6 bg-white/[0.02] border border-green-500/20 rounded-lg backdrop-blur-sm"
            >
              {/* Day badge */}
              <div className="inline-block px-3 py-1 mb-4 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-xs font-mono tracking-wider">
                {item.day}
              </div>

              <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>

              <ul className="space-y-2">
                {item.events.map((event, eventIndex) => (
                  <li key={eventIndex} className="flex items-center gap-3 text-gray-400 text-sm">
                    <span className="w-1.5 h-1.5 bg-green-400/60 rounded-full shrink-0" />
                    {event}
                  </li>
                ))}
              </ul>

              {/* Connection line between cards */}
              {index < timeline.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-[2px] bg-gradient-to-r from-green-500/50 to-transparent" />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <button className="software-cta px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-medium tracking-wide rounded transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400">
            Join the Hackathon
          </button>
        </div>
      </div>

      {/* Abstract Shape - Code/Binary Pattern */}
      <div className="hidden md:block absolute right-[8%] top-1/4 opacity-10 font-mono text-green-400 text-xs leading-loose">
        <div>01001001</div>
        <div>01101110</div>
        <div>01101110</div>
        <div>01101111</div>
        <div>01110110</div>
        <div>01100001</div>
        <div>01110100</div>
        <div>01100101</div>
      </div>

      {/* Abstract circles */}
      <div className="hidden md:block absolute right-[15%] bottom-1/4 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(34,197,94,0.5)" strokeWidth="1" strokeDasharray="5 3" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="1" />
          <circle cx="50" cy="50" r="15" fill="rgba(34,197,94,0.1)" />
        </svg>
      </div>
    </section>
  )
}
