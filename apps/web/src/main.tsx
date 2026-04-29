import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <main style={{ fontFamily: "Inter, sans-serif", maxWidth: 980, margin: "2rem auto" }}>
      <h1>sal_bot Control Panel</h1>
      <p>Eigenständiges Dashboard für Moderation, Automod, Tickets, Leveling und Logging.</p>
      <section>
        <h2>Sicherheitsprinzipien</h2>
        <ul>
          <li>Discord OAuth2 Login + serverseitige Rechteprüfung</li>
          <li>Audit-Logs für jede Konfigurationsänderung</li>
          <li>CSRF/XSS/Rate-Limit Schutz im API-Layer</li>
        </ul>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
