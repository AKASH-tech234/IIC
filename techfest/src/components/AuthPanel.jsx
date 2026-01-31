import { useAuth0 } from "@auth0/auth0-react"

export default function AuthPanel() {
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

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/15 bg-black/40 px-5 py-4 text-sm text-white/80 shadow-lg">
        Loading authentication...
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-black/40 px-5 py-4 text-sm text-white/80 shadow-lg backdrop-blur">
      {isAuthenticated ? (
        <div className="space-y-3">
          <div>
            <p className="text-base font-semibold text-white">
              Logged in as {user?.email ?? user?.name}
            </p>
            <p className="text-xs text-white/70">Auth0 User Profile</p>
          </div>
          <pre className="max-h-60 overflow-auto rounded-lg bg-black/50 p-3 text-xs text-white/70">
            {JSON.stringify(user, null, 2)}
          </pre>
          <button
            type="button"
            className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              Error: {error.message}
            </p>
          )}
          <p className="text-sm text-white/80">Sign in to register for TechFest.</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
              onClick={signup}
            >
              Signup
            </button>
            <button
              type="button"
              className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
              onClick={() => loginWithRedirect()}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
