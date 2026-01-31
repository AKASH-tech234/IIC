import AppJourney from "./AppJourney"
import RegisterPage from "./pages/Register"
import DashboardPage from "./pages/Dashboard"



export default function App() {
  const pathname = window.location.pathname
  const isRegisterPage = pathname === "/register"
  const isDashboardPage = pathname === "/dashboard"

  if (isRegisterPage) {
    return <RegisterPage />
  }

  if (isDashboardPage) {
    return <DashboardPage />
  }

  return <AppJourney />
}
