import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CookiesProvider } from "react-cookie";
import { ToastProvider } from "./context/ToastContext.jsx";
import CookieConsentBanner from "./components/CookieConsentBanner.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <CookiesProvider>
        <ToastProvider>
          <AuthProvider>
            <App />
            <CookieConsentBanner />
          </AuthProvider>
        </ToastProvider>
      </CookiesProvider>
    </HashRouter>
  </StrictMode>,
);
