import { motion } from "framer-motion"
import WorldMap from "../../components/ui/world-map"

/**
 * Journey Footer
 * 
 * Content:
 * - World Map showing MNNIT location and connections
 * - Copyright © 2026 MNNIT TechSummit • MNNIT Allahabad
 * - Contact: techsummit@mnnit.ac.in
 * - Social: Instagram • LinkedIn • Facebook
 */
export default function JourneyFooter() {
  return (
    <footer className="relative z-20 w-full bg-[#0a0e1a] border-t border-white/10 py-16">
      <div className="w-full px-6 md:px-8 max-w-[1400px] mx-auto section-stack">
        
        {/* World Map Section */}
        <div className="mb-16">
          <div className="text-center mb-8 section-stack">
            <p className="text-sm font-mono tracking-wider uppercase text-cyan-400 mb-2">
              Global Reach
            </p>
            <h3 className="text-3xl md:text-4xl font-bold text-white section-title">
              Join Participants from{" "}
              {"Across India".split("").map((char, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h3>
            <p className="text-gray-400 mt-2 section-body">
              MNNIT Allahabad welcomes innovators and tech enthusiasts from every corner of India
            </p>
          </div>
          <WorldMap
            dots={[
              {
                start: { lat: 25.4919, lng: 81.8639 }, // MNNIT Allahabad
                end: { lat: 28.6139, lng: 77.209 }, // New Delhi
              },
              {
                start: { lat: 25.4919, lng: 81.8639 }, // MNNIT Allahabad
                end: { lat: 19.076, lng: 72.8777 }, // Mumbai
              },
              {
                start: { lat: 25.4919, lng: 81.8639 }, // MNNIT Allahabad
                end: { lat: 12.9716, lng: 77.5946 }, // Bangalore
              },
              {
                start: { lat: 25.4919, lng: 81.8639 }, // MNNIT Allahabad
                end: { lat: 22.5726, lng: 88.3639 }, // Kolkata
              },
              {
                start: { lat: 25.4919, lng: 81.8639 }, // MNNIT Allahabad
                end: { lat: 13.0827, lng: 80.2707 }, // Chennai
              },
            ]}
            lineColor="#22D3EE"
          />
        </div>

        {/* Main content */}
        <div className="text-center mb-8 section-stack">
          <h3 className="text-3xl font-bold text-white mb-2 section-title">
            MNNIT <span className="text-cyan-400">TECHSUMMIT</span> 2026
          </h3>
          
          <p className="text-gray-400 section-body">
            A journey through innovation, collaboration, and technology
          </p>

          {/* Contact */}
          <div className="mb-6">
            <span className="text-gray-500 text-sm font-mono">Contact:</span>
            <a 
              href="mailto:techsummit@mnnit.ac.in" 
              className="block text-cyan-400 hover:text-cyan-300 transition-colors mt-1"
            >
              techsummit@mnnit.ac.in
            </a>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-8">
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
              Instagram
            </a>
            <span className="text-gray-600">•</span>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
              LinkedIn
            </a>
            <span className="text-gray-600">•</span>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
              Facebook
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

        {/* Copyright */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2026 MNNIT TechSummit • MNNIT Allahabad</p>
        </div>

        {/* Decorative line */}
        <div className="mt-8 flex justify-center">
          <div className="w-24 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-50" />
        </div>
      </div>
    </footer>
  )
}
