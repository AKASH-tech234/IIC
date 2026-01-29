/**
 * Journey Footer
 * 
 * Content:
 * - Copyright © 2026 MNNIT TechSummit • MNNIT Allahabad
 * - Contact: techsummit@mnnit.ac.in
 * - Social: Instagram • LinkedIn • Facebook
 */
export default function JourneyFooter() {
  return (
    <footer className="relative z-20 w-full bg-[#0a0e1a] border-t border-white/10 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Main content */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-4">
            MNNIT <span className="text-cyan-400">TECHSUMMIT</span> 2026
          </h3>
          
          <p className="text-gray-400 mb-6">
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
