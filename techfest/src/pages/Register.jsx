import { useAuth0 } from "@auth0/auth0-react"
import CustomCursor from "../components/cursor/CustomCursor"

export default function RegisterPage() {
  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect,
    logout,
    user,
  } = useAuth0()

  const signup = () =>
    loginWithRedirect({ authorizationParams: { screen_hint: "signup" } })

  const handleLogout = () =>
    logout({ logoutParams: { returnTo: window.location.origin } })

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
                Registration Portal
              </p>
            </div>
            <h1 className="text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                Join TechFest
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-white/60 leading-relaxed">
              Create your account to unlock exclusive access to workshops, networking events, and cutting-edge technology showcases.
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

        {/* Main Auth Card */}
        <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-white/5 via-cyan-400/5 to-white/5 p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Glowing corner accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/20 blur-[100px] rounded-full" />
          
          <div className="relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-400" />
                <p className="text-white/60">Initializing secure authentication...</p>
              </div>
            ) : isAuthenticated ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-transparent" />
                  <h2 className="text-2xl font-semibold text-white">Authentication Successful</h2>
                </div>
                
                <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-6 backdrop-blur-sm">
                  <p className="text-xl font-semibold text-white mb-2">
                    Welcome, {user?.name || user?.email}!
                  </p>
                  <p className="text-sm text-white/60">
                    Your account is now active and ready for TechFest events.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
                  <p className="text-sm text-white/50 mb-3 uppercase tracking-wide">User Profile Data</p>
                  <pre className="max-h-64 overflow-auto rounded-lg bg-black/50 p-4 text-xs text-white/70 font-mono">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href="/dashboard"
                    className="group relative rounded-lg border border-cyan-400/60 bg-cyan-400/10 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-cyan-100 backdrop-blur-sm transition-all hover:border-cyan-300 hover:bg-cyan-400/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                  >
                    <span className="relative z-10">Go to Dashboard</span>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <button
                    type="button"
                    className="rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-transparent" />
                  <h2 className="text-2xl font-semibold text-white">Create Your Account</h2>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-400/40 bg-red-400/10 p-4 backdrop-blur-sm">
                    <p className="text-sm text-red-200">
                      <span className="font-semibold">Authentication Error:</span> {error.message}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-white/70 leading-relaxed">
                    Secure authentication powered by Auth0. Your credentials are encrypted and protected with industry-standard security protocols.
                  </p>
                  
                  <div className="space-y-3 py-4">
                    {[
                      "Access exclusive workshops and events",
                      "Personalized event recommendations",
                      "Networking opportunities with speakers",
                      "Digital certificates and achievements",
                      "Real-time event notifications"
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 text-white/60">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    type="button"
                    className="group relative rounded-lg border border-cyan-400/60 bg-cyan-400/10 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-cyan-100 backdrop-blur-sm transition-all hover:border-cyan-300 hover:bg-cyan-400/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                    onClick={signup}
                  >
                    <span className="relative z-10">Sign Up Now</span>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
                    onClick={() => loginWithRedirect()}
                  >
                    Already Have Account? Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/40">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <span>Secured by Auth0 • Enterprise-grade encryption</span>
        </div>
      </div>
    </main>
    </>
  )
}
