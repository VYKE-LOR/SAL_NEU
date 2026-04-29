import React from "react";
import { createRoot } from "react-dom/client";

const API_BASE = "http://localhost:4000";

function App() {
  return (
    <main style={{ fontFamily: "Inter, sans-serif", maxWidth: 980, margin: "2rem auto" }}>
      <h1>sal_bot Control Panel</h1>
      <p>Eigenständiges Dashboard für Moderation, Automod, Tickets, Leveling und Logging.</p>
      <a href={`${API_BASE}/auth/discord`} style={{ display: "inline-block", padding: "10px 14px", background: "#5865F2", color: "white", borderRadius: 8, textDecoration: "none" }}>
        Mit Discord anmelden
      </a>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
