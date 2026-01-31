export default function DashboardComingSoon() {
  return (
    <main className="min-h-screen bg-[#05030b] text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-24">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
              Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-semibold">Coming Soon</h1>
            <p className="mt-3 max-w-xl text-white/70">
              We are preparing a personalized TechFest dashboard experience. Check
              back shortly for updates, schedules, and your registrations.
            </p>
          </div>
          <a
            href="/"
            className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
          >
            Back Home
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <div className="space-y-4">
            <p className="text-lg text-white/80">
              We are polishing the experience before launch.
            </p>
            <ul className="space-y-2 text-sm text-white/60">
              <li>• Personalized schedule and agenda.</li>
              <li>• Real-time event updates.</li>
              <li>• Access to exclusive attendee resources.</li>
            </ul>
            <div className="flex flex-wrap gap-4">
              <a
                href="/register"
                className="rounded-full border border-cyan-400/60 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-400/10"
              >
                Register Now
              </a>
              <a
                href="/"
                className="rounded-full border border-white/30 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
              >
                Explore TechFest
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
