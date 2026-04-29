# sal_bot

sal_bot ist eine eigenständige All-in-One-Plattform für Discord-Server: Bot + API + Webpanel.

## Architektur & Tech-Entscheidungen

- **TypeScript End-to-End**: einheitliche Typen, geringere Fehlerquote.
- **discord.js v14**: stabile Basis für Slash Commands, Buttons, Select Menus, Modals, Embeds und Event-Handling.
- **Fastify API**: hoher Durchsatz, Plugin-Ökosystem für Security (Helmet, Rate-Limits, Session/Cookies).
- **PostgreSQL + Prisma**: verlässliche Persistenz für Guild-Konfigurationen, Cases, Audit-Logs und Statistiken.
- **React + Vite Webpanel**: schnelle Entwicklungszyklen und moderner Admin-Bereich.
- **Modulorientierung**: jedes Funktionspaket (Moderation, Ticket, Leveling, Logging …) getrennt aktivierbar.

## Feature-Abdeckung (Foundation)

Bereitgestellt als produktionsnahe Basis mit erweiterbarer Struktur:

- Discord Bot Foundation
  - Slash Commands (`/ping`, `/userinfo`)
  - Event Listener (`guildMemberAdd`, Interactions)
  - Embed-Antworten
  - zentrale Start-/Fehlerstruktur
- Webpanel Foundation
  - Admin UI Startseite
  - API-Integration vorbereitet
- API Foundation
  - Guild-Konfiguration lesen/schreiben
  - Audit-Log bei Änderungen
  - Session/Cookie + Helmet + Rate Limit
- Persistenz
  - `GuildConfig`, `AuditLog`, `ModerationCase`

## Modul-Design (für Ausbau)

Jedes Modul wird als `enabled + config` je Guild modelliert:

- Moderation (warn/timeout/kick/ban/purge/cases)
- Automod (spam/link/invite/caps/mentions/raid + escalation)
- Tickets (panel/types/transcript/rating/stats)
- Leveling (xp/voice/roles/leaderboard)
- Welcome/Goodbye
- Reaction/Self roles
- Giveaways
- Custom Commands + Auto-Responder
- Embed Builder
- Logging
- Stats
- Music (source-abstraction)
- Social Alerts
- Utility
- Premium flags (Feature Gating)

## Sicherheit

- Discord OAuth2-only Auth (in der nächsten Ausbaustufe API-Routen `auth/*` ergänzen)
- Serverseitige Autorisierung pro Aktion
- HttpOnly Session-Cookies
- CSP/Headers via Helmet
- Rate-Limits
- Audit-Log aller Panel-Änderungen
- Keine Secrets im Code (`.env`)

## Setup

1. Dependencies installieren

```bash
npm install
```

2. Umgebungsvariablen setzen

```bash
cp .env.example .env
```

3. Datenbank migrieren

```bash
npm run prisma:generate -w apps/api
npm run prisma:migrate -w apps/api
```

4. Entwicklung starten

```bash
npm run dev
```

- API: `http://localhost:4000`
- Web: Standard Vite Port

## Deployment-Hinweise

- Reverse Proxy (Nginx/Caddy) vor API/Web
- HTTPS erzwingen
- `NODE_ENV=production`
- Rotierende Session Secrets
- Managed PostgreSQL + tägliche Backups
- Optional Redis für Queue/Rate/Cache
- Horizontal skalieren: Bot Worker + API getrennt deployen

## Sicherheits-Checkliste

- [ ] Discord OAuth2 Redirect URI exakt gesetzt
- [ ] Session Secret >= 32 Zeichen
- [ ] DB-Zugriff nur private network
- [ ] keine `.env` im Repo
- [ ] Log-Redaction für sensible Felder
- [ ] Rollen-/Admin-Prüfung serverseitig erzwungen
- [ ] Audit-Logs aufbewahren und monitoren

## .env Beispiel

Siehe `.env.example`.
