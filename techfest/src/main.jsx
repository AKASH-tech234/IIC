import React from "react"
import ReactDOM from "react-dom/client"
import { Auth0Provider } from "@auth0/auth0-react"
import App from "./App"
import "./index.css"
import "./styles/typography.css"
import { applyCSSVariables } from "./styles/identity.tokens"

// PHASE 8: Apply identity token CSS variables on startup
applyCSSVariables()

const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: redirectUri }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
)
