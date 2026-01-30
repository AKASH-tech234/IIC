import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExpandableCards } from "../../components/ui/expandable-cards"

/**
 * Journey About Section
 * 
 * Content:
 * - Heading: The Journey Begins
 * - Text about MNNIT TechSummit platform
 * 
 * Visual State:
 * - Environment shifts from open road to city lights
 * - Background parallax increases
 */
export default function JourneyAbout() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Glass card slides in from right
      gsap.fromTo(".glass-card",
        { opacity: 0, x: 100, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            scrub: 1
          }
        }
      )

      // Heading reveal
      gsap.fromTo(".about-heading",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            end: "top 35%",
            scrub: 1
          }
        }
      )

      // Update car underglow to match section accent
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          gsap.to(":root", {
            "--accent-color": "#22D3EE", // Cyan
            duration: 0.8
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Expandable cards data
  const whyAttendCards = [
    {
      title: "Why Attend?",
      description: "Discover the benefits",
      src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
      ctaText: "Learn More",
      ctaLink: "#",
      content: () => (
        <p>
          TechSummit 2026 brings together the brightest minds in technology. Whether you're a student, 
          developer, or entrepreneur, you'll find opportunities to learn, network, and showcase your skills.
          <br /><br />
          Experience keynote sessions from industry leaders, participate in competitive hackathons, 
          and gain hands-on experience through interactive workshops.
        </p>
      ),
    },
    {
      title: "Who Should Come?",
      description: "Open to all tech enthusiasts",
      src: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400",
      ctaText: "Join Us",
      ctaLink: "#",
      content: () => (
        <p>
          This event is designed for students, developers, designers, and innovators of all skill levels.
          <br /><br />
          Whether you're just starting your tech journey or you're an experienced professional, 
          there's something for everyone - from beginner-friendly workshops to advanced technical challenges.
        </p>
      ),
    },
    {
      title: "What to Expect?",
      description: "3 days of innovation",
      src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400",
      ctaText: "View Schedule",
      ctaLink: "#",
      content: () => (
        <p>
          Expect three action-packed days filled with learning, building, and networking opportunities.
          <br /><br />
          Day 1: Opening ceremonies, keynotes, and workshops<br />
          Day 2: 24-hour hackathon and technical challenges<br />
          Day 3: Project presentations, demos, and awards ceremony
        </p>
      ),
    },
    {
      title: "Prizes & Perks",
      description: "Win exciting rewards",
      src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400",
      ctaText: "See Prizes",
      ctaLink: "#",
      content: () => (
        <p>
          Compete for cash prizes, internship opportunities, and exclusive swag from our sponsors.
          <br /><br />
          Winners of the main hackathon will receive up to ₹1,00,000 in prizes, along with 
          mentorship opportunities and fast-track interviews with leading tech companies.
        </p>
      ),
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="journey-about"
      className="relative min-h-screen w-full flex items-center py-32"
    >
      {/* Content Container */}
      <div className="relative z-10 w-full px-6 md:px-8">
        {/* Expandable Cards */}
        <ExpandableCards cards={whyAttendCards} />
        
        {/* Divider */}
        <div className="my-12 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* About Content */}
        
        {/* Section marker */}
        <div className="mb-8 flex items-center gap-4">
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
            Milestone 01
          </span>
        </div>

        {/* Glass Card */}
        <div 
          className="about-content glass-card relative p-8 md:p-12 rounded-lg overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(34, 211, 238, 0.05)`
          }}
        >
          {/* Neon border glow - animated trace */}
          <div 
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              border: `1px solid var(--accent-color)`,
              opacity: 0.3,
              animation: "border-trace 3s linear infinite"
            }}
          />

          {/* Heading */}
          <h2 
            className="about-heading text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            The Journey
            <span 
              className="block mt-2"
              style={{ color: "var(--accent-color)" }}
            >
              Begins
            </span>
          </h2>

          {/* Content */}
          <div className="space-y-6">
            <p 
              className="text-xl leading-relaxed border-l-4 pl-6"
              style={{ 
                color: "var(--text-secondary)",
                borderColor: "var(--accent-color)",
                borderOpacity: 0.5
              }}
            >
              MNNIT TechSummit is a platform where students, developers, and innovators come together 
              to explore technology through hands-on experiences, competitions, and collaboration.
            </p>
            
            <p 
              className="text-lg leading-relaxed pl-6"
              style={{ color: "var(--text-tertiary)" }}
            >
              Our journey spans three days of intense learning, building, and connecting with like-minded 
              individuals who share a passion for technology and innovation.
            </p>
          </div>

          {/* Decorative elements */}
          <div className="mt-8 flex gap-3 pl-6">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--accent-color)" }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ 
                backgroundColor: "var(--accent-color)",
                opacity: 0.6,
                animationDelay: "0.2s"
              }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ 
                backgroundColor: "var(--accent-color)",
                opacity: 0.3,
                animationDelay: "0.4s"
              }}
            />
          </div>

          {/* Corner accents */}
          <div 
            className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 opacity-30"
            style={{ borderColor: "var(--accent-color)" }}
          />
          <div 
            className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 opacity-30"
            style={{ borderColor: "var(--accent-color)" }}
          />
        </div>
      </div>
    </section>
  )
}
