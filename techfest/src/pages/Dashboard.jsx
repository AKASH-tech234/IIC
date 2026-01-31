import CustomCursor from "../components/cursor/CustomCursor"

export default function DashboardComingSoon() {
  return (
    <>
      <CustomCursor />
      <main className="min-h-screen bg-gradient-to-b from-[#05070D] via-[#0A1022] to-[#05070D] text-white relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00E5FF08_1px,transparent_1px),linear-gradient(to_bottom,#00E5FF08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-24">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between gap-4">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/40 bg-cyan-400/5 px-4 py-2 backdrop-blur-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                Dashboard
              </p>
            </div>
            <h1 className="text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                Welcome Back
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-white/60 leading-relaxed">
              Your personalized TechFest command center. Track registrations, access exclusive content, and stay updated with real-time event information.
            </p>
          </div>
          <a
            href="/"
            className="group rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-all hover:border-cyan-400/60 hover:bg-cyan-400/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
          >
            <span className="flex items-center gap-2">
              ← Back Home
            </span>
          </a>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Schedule", icon: "📅", href: "/#schedule" },
            { label: "Events", icon: "🎯", href: "/#events" },
            { label: "Workshops", icon: "🛠️", href: "/#workshops" },
            { label: "Register", icon: "✨", href: "/register" }
          ].map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="group relative rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] text-center"
            >
              <div className="text-3xl mb-2">{link.icon}</div>
              <p className="text-sm font-semibold text-white/80 group-hover:text-cyan-300 transition-colors">{link.label}</p>
            </a>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Events Registered", value: "0", icon: "🎫" },
            { label: "Sessions Attended", value: "0", icon: "✓" },
            { label: "Days Until Summit", value: "TBA", icon: "⏱️" }
          ].map((stat, i) => (
            <div key={i} className="group relative rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/50">{stat.label}</p>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <p className="text-4xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-white/5 via-cyan-400/5 to-white/5 p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Glowing corner accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/20 blur-[100px] rounded-full" />
          
          <div className="relative space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-transparent" />
              <h2 className="text-2xl font-semibold text-white">System Status</h2>
            </div>
            
            <p className="text-lg text-white/70 leading-relaxed">
              Dashboard initialization in progress. We're building something extraordinary for you.
            </p>
            
            <div className="space-y-3 py-4">
              {[
                "Personalized event schedule and agenda",
                "Real-time notifications and updates",
                "Exclusive attendee resources and materials",
                "Networking and collaboration tools",
                "Certificate and achievement tracking"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-white/60">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="/register"
                className="group relative rounded-lg border border-cyan-400/60 bg-cyan-400/10 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-cyan-100 backdrop-blur-sm transition-all hover:border-cyan-300 hover:bg-cyan-400/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
              >
                <span className="relative z-10">Register for Events</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="/"
                className="rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
              >
                Explore TechFest Journey
              </a>
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <p className="mt-8 text-center text-sm text-white/40">
          Full dashboard features will be available soon. Stay tuned.
        </p>
      </div>
    </main>
    </>
  )
}
