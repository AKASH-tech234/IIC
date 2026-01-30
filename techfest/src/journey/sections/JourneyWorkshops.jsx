import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PinContainer } from "../../components/ui/3d-pin"

/**
 * Journey Workshops Section
 * 
 * Content:
 * - Heading: Build Along the Way
 * - Text about workshops and hackathons
 * 
 * Visual State:
 * - Car speed slightly increases
 * - Subtle motion blur effect
 */
export default function JourneyWorkshops() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Speed up effect for car
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          const car = document.querySelector("#car")
          const speedLines = document.querySelector("#speed-lines")
          
          if (car) {
            gsap.to(car, {
              rotateZ: -2,
              duration: 0.8,
              ease: "power2.out"
            })
          }
          
          if (speedLines) {
            gsap.to(speedLines, {
              opacity: 0.8,
              scaleX: 1.5,
              duration: 0.8,
              ease: "power2.out"
            })
          }
        },
        onLeave: () => {
          const car = document.querySelector("#car")
          const speedLines = document.querySelector("#speed-lines")
          
          if (car) {
            gsap.to(car, {
              rotateZ: 0,
              duration: 0.8
            })
          }
          
          if (speedLines) {
            gsap.to(speedLines, {
              opacity: 0,
              scaleX: 1,
              duration: 0.8
            })
          }
        },
        onLeaveBack: () => {
          const car = document.querySelector("#car")
          const speedLines = document.querySelector("#speed-lines")
          
          if (car) {
            gsap.to(car, {
              rotateZ: 0,
              duration: 0.8
            })
          }
          
          if (speedLines) {
            gsap.to(speedLines, {
              opacity: 0,
              scaleX: 1,
              duration: 0.8
            })
          }
        }
      })

      gsap.fromTo(".workshops-heading",
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            scrub: 1
          }
        }
      )

      gsap.fromTo(".workshops-content",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "top 25%",
            scrub: 1
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="journey-workshops"
      className="relative min-h-screen w-full flex items-center py-32"
    >
      {/* Content Container */}
      <div className="relative z-10 w-full px-6 md:px-8">
        
        {/* Section marker with motion */}
        <div className="mb-6 flex items-center gap-4">
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
            Milestone 04 • ACCELERATING
          </span>
          <div className="flex gap-1">
            <div 
              className="w-1 h-4 animate-pulse"
              style={{ backgroundColor: "var(--accent-color)" }}
            />
            <div 
              className="w-1 h-6 animate-pulse"
              style={{ backgroundColor: "var(--accent-color)", animationDelay: "0.1s" }}
            />
            <div 
              className="w-1 h-8 animate-pulse"
              style={{ backgroundColor: "var(--accent-color)", animationDelay: "0.2s" }}
            />
          </div>
        </div>

        {/* Heading with speed emphasis */}
        <h2 
          className="workshops-heading text-5xl sm:text-6xl md:text-7xl font-bold mb-8 leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Build Along
          <span 
            className="block mt-2"
            style={{ 
              color: "var(--accent-color)",
              filter: "drop-shadow(0 0 20px var(--accent-color))"
            }}
          >
            the Way
          </span>
        </h2>

        {/* Content with speed lines in background */}
        <div className="workshops-content relative space-y-6">
          {/* Speed lines background effect */}
          <div className="absolute -left-20 top-0 bottom-0 w-40 opacity-20 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute h-[2px] w-full"
                style={{
                  top: `${i * 15}%`,
                  background: `linear-gradient(to right, transparent, var(--accent-color), transparent)`,
                  animation: `speed-line ${0.8 + i * 0.1}s linear infinite`
                }}
              />
            ))}
          </div>

          <p 
            className="text-xl leading-relaxed border-l-4 pl-6"
            style={{ 
              color: "var(--text-secondary)",
              borderColor: "var(--accent-color)"
            }}
          >
            Hands-on workshops and high-energy hackathons encourage participants to build real solutions, 
            collaborate in teams, and learn from mentors.
          </p>
          
          <p 
            className="text-lg leading-relaxed pl-6"
            style={{ color: "var(--text-tertiary)" }}
          >
            From ideation to implementation, every step of the journey is designed to push boundaries 
            and accelerate learning through practical application.
          </p>

          {/* 3D Pin Workshop Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {[
              {
                title: "AI & Machine Learning",
                description: "Build intelligent systems with hands-on ML projects",
                icon: "🧠",
                color: "#8B5CF6"
              },
              {
                title: "Web3 & Blockchain",
                description: "Dive into decentralized applications and smart contracts",
                icon: "⛓️",
                color: "#EC4899"
              },
              {
                title: "IoT & Robotics",
                description: "Create connected devices and autonomous systems",
                icon: "🤖",
                color: "#22D3EE"
              },
              {
                title: "Full-Stack Development",
                description: "Master modern web development from frontend to backend",
                icon: "💻",
                color: "#A855F7"
              }
            ].map((workshop, i) => (
              <PinContainer
                key={i}
                title={workshop.title}
                href="#"
                containerClassName="workshops-pin-card"
              >
                <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 w-[20rem] h-[20rem]">
                  <div className="text-5xl mb-4">{workshop.icon}</div>
                  <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                    {workshop.title}
                  </h3>
                  <div className="text-base !m-0 !p-0 font-normal">
                    <span className="text-slate-500">
                      {workshop.description}
                    </span>
                  </div>
                  <div 
                    className="flex flex-1 w-full rounded-lg mt-4"
                    style={{
                      background: `linear-gradient(to bottom right, ${workshop.color}, transparent)`
                    }}
                  />
                </div>
              </PinContainer>
            ))}
          </div>
        </div>

        {/* Enhanced speed indicator */}
        <div 
          className="mt-12 flex items-center gap-4 pl-6"
          style={{ color: "var(--accent-color)" }}
        >
          <div className="flex gap-1">
            <div 
              className="w-1 h-4 animate-pulse"
              style={{ backgroundColor: "var(--accent-color)" }}
            />
            <div 
              className="w-1 h-6 animate-pulse"
              style={{ backgroundColor: "var(--accent-color)", animationDelay: "0.1s" }}
            />
            <div 
              className="w-1 h-8 animate-pulse"
              style={{ backgroundColor: "var(--accent-color)", animationDelay: "0.2s" }}
            />
            <div 
              className="w-1 h-10 animate-pulse"
              style={{ backgroundColor: "var(--accent-color)", animationDelay: "0.3s" }}
            />
          </div>
          <span className="text-xs font-mono tracking-wider uppercase font-bold">
            HIGH VELOCITY MODE
          </span>
          <div className="flex-1 h-[2px] relative overflow-hidden">
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, var(--accent-color), transparent)`,
                animation: "slide-right 1s linear infinite"
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
