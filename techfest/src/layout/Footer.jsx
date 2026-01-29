/**
 * Footer Component
 * 
 * Contains:
 * - Event information
 * - Contact details
 * - Social media links
 * - Quick links
 */
export default function Footer() {
  const socialLinks = [
    { name: "Twitter", url: "#", icon: "X" },
    { name: "Instagram", url: "#", icon: "IG" },
    { name: "LinkedIn", url: "#", icon: "in" },
    { name: "GitHub", url: "#", icon: "GH" }
  ]

  const quickLinks = [
    { name: "About", url: "#foundation" },
    { name: "Events", url: "#engineering" },
    { name: "Schedule", url: "#software" },
    { name: "Sponsors", url: "#" },
    { name: "FAQs", url: "#" }
  ]

  return (
    <footer className="relative z-20 w-full bg-[#0B0E14] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              MNNIT <span className="text-cyan-400">TECHSUMMIT</span> 2026
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              A three-day technology summit celebrating innovation, engineering, and collaboration 
              at MNNIT Allahabad.
            </p>
            <div className="space-y-2 text-sm text-gray-500 font-mono">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400">📅</span>
                <span>March 18–20, 2026</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400">📍</span>
                <span>MNNIT Allahabad, Prayagraj, India</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400">✉️</span>
                <span>techsummit@mnnit.ac.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="w-10 h-10 flex items-center justify-center border border-white/20 rounded text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-all duration-200 hover:bg-cyan-400/5 text-xs font-mono"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-6">
              Follow us for updates, announcements, and behind-the-scenes content.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>
            © 2026 MNNIT Allahabad. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Code of Conduct</a>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500 opacity-50" />
      </div>
    </footer>
  )
}
