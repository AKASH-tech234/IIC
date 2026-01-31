import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

/**
 * Glass Morphism Navbar
 * 
 * Features:
 * - Glassmorphism effect (blur + transparency)
 * - Scroll-based background opacity
 * - Mobile responsive with hamburger menu
 * - Matches aurora shader aesthetic
 */
export default function GlassNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "#journey-hero" },
    { name: "About", href: "#journey-about" },
    { name: "Events", href: "#journey-events" },
    { name: "Schedule", href: "#journey-schedule" },
    { name: "Contact", href: "#footer" }
  ]

  const ctaClasses =
    "px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105"

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-3" : "py-5"
      }`}
      style={{
        background: isScrolled
          ? "linear-gradient(to bottom, rgba(0, 20, 30, 0.75), rgba(0, 20, 30, 0.25))"
          : "linear-gradient(to bottom, rgba(0, 20, 30, 0.6), rgba(0, 20, 30, 0.15))",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0, 255, 255, 0.08)",
        boxShadow: isScrolled ? "0 8px 32px rgba(0, 0, 0, 0.25)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#journey-hero"
          className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
          style={{ letterSpacing: "-0.02em" }}
        >
          NEXUS DRIVE
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-sm font-medium transition-all duration-300 hover:text-cyan-400"
              style={{
                color: "rgba(237, 233, 254, 0.8)",
                letterSpacing: "0.05em",
              }}
            >
              {link.name}
            </a>
          ))}

          {/* CTA Button */}
          <a
            href="/register"
            className={ctaClasses}
            style={{
              background:
                "linear-gradient(to right, rgba(34, 211, 238, 0.8), rgba(59, 130, 246, 0.8))",
              color: "white",
              boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)",
            }}
          >
            Register Now
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            color: "rgba(237, 233, 254, 0.9)",
          }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden mt-4 mx-4 p-6 rounded-2xl"
          style={{
            background: "rgba(7, 6, 23, 0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-base font-medium transition-colors hover:text-cyan-400"
                style={{
                  color: "rgba(237, 233, 254, 0.8)",
                  letterSpacing: "0.05em",
                }}
              >
                {link.name}
              </a>
            ))}

            <a
              href="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-2 px-6 py-3 rounded-lg font-semibold text-center"
              style={{
                background:
                  "linear-gradient(to right, rgba(34, 211, 238, 0.8), rgba(59, 130, 246, 0.8))",
                color: "white",
                boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)",
              }}
            >
              Register Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
