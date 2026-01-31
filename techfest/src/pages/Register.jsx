import { useAuth0 } from "@auth0/auth0-react"

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
    <main className="min-h-screen bg-[#05030b] text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-24">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
              Auth0 Registration
            </p>
            <h1 className="mt-3 text-4xl font-semibold">Register for TechFest</h1>
            <p className="mt-3 max-w-xl text-white/70">
              Create your account to access exclusive TechFest updates
              and event registration.
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
          {isLoading ? (
            <p className="text-white/70">Loading authentication...</p>
          ) : isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-xl font-semibold text-white">
                Welcome, {user?.name || user?.email}!
              </p>
              <pre className="max-h-72 overflow-auto rounded-lg bg-black/50 p-4 text-xs text-white/70">
                {JSON.stringify(user, null, 2)}
              </pre>
              <button
                type="button"
                className="rounded-full border border-white/30 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  Error: {error.message}
                </p>
              )}
              <p className="text-white/70">
                Register using Auth0 to continue. You can also login if you
                already have an account.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  className="rounded-full border border-cyan-400/60 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-400/10"
                  onClick={signup}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  className="rounded-full border border-white/30 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
                  onClick={() => loginWithRedirect()}
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
