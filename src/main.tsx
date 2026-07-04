import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

// Catch any unhandled errors before or during hydration
window.addEventListener("error", (event) => {
  const errorContainer = document.getElementById("error-fallback") || document.createElement("div");
  errorContainer.id = "error-fallback";
  errorContainer.style.position = "fixed";
  errorContainer.style.inset = "0";
  errorContainer.style.background = "#0f172a";
  errorContainer.style.color = "#f8fafc";
  errorContainer.style.padding = "24px";
  errorContainer.style.fontFamily = "monospace";
  errorContainer.style.zIndex = "999999";
  errorContainer.style.overflow = "auto";
  errorContainer.innerHTML = `
    <div style="max-w: 600px; margin: 40px auto; background: #1e293b; border: 1px solid #ef4444; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
      <h2 style="margin-top: 0; color: #ef4444; font-size: 16px; font-weight: bold; border-bottom: 1px solid #334155; padding-bottom: 12px; display: flex; align-items: center; gap: 8px;">
        ⚠️ CRITICAL FAULT INTERCEPTOR ACTIVE
      </h2>
      <p style="font-size: 12px; margin: 12px 0 6px 0;"><strong>Exception:</strong> ${event.message}</p>
      <p style="font-size: 10px; color: #94a3b8; margin: 0 0 12px 0;"><strong>Source:</strong> ${event.filename}:${event.lineno}:${event.colno}</p>
      <pre style="background: #020617; padding: 12px; border-radius: 6px; font-size: 10px; color: #cbd5e1; overflow-x: auto; max-height: 200px;">${event.error ? event.error.stack : 'No stack trace available'}</pre>
      <button onclick="window.location.reload()" style="margin-top: 12px; background: #6366f1; color: white; border: 0; padding: 8px 16px; border-radius: 6px; font-weight: bold; font-size: 11px; cursor: pointer;">
        REBOOT SYSTEM NODE
      </button>
    </div>
  `;
  document.body.appendChild(errorContainer);
});

try {
  ReactDOM.createRoot(
    document.getElementById("root")!
  ).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error: any) {
  const errorContainer = document.createElement("div");
  errorContainer.style.position = "fixed";
  errorContainer.style.inset = "0";
  errorContainer.style.background = "#0f172a";
  errorContainer.style.color = "white";
  errorContainer.style.padding = "24px";
  errorContainer.style.fontFamily = "monospace";
  errorContainer.style.zIndex = "999999";
  errorContainer.innerHTML = `
    <div style="max-w: 600px; margin: 40px auto; background: #1e293b; border: 1px solid #ef4444; padding: 24px; border-radius: 12px;">
      <h2 style="color: #ef4444; margin-top: 0;">⚠️ MOUNT FAILURE CRITICAL</h2>
      <p><strong>Message:</strong> ${error.message}</p>
      <pre style="background: #020617; padding: 12px; border-radius: 6px; color: #cbd5e1; overflow-x: auto;">${error.stack}</pre>
    </div>
  `;
  document.body.appendChild(errorContainer);
}