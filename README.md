# sal_bot

sal_bot ist eine eigenständige All-in-One-Plattform für Discord-Server: Bot + API + Webpanel.

## Architektur & Tech-Entscheidungen
- **TypeScript End-to-End** für konsistente Typen.
- **discord.js v14** für moderne Discord-Interaktionen.
- **Fastify API** für Performance + Security-Middleware.
- **Prisma ORM** für migrationsarme Entwicklung und späteren DB-Wechsel.
- **MySQL/MariaDB lokal (phpMyAdmin-verwaltet)** für einfache lokale Tests.
- **React + Vite** für ein schnelles, modernes Webpanel.

## Lokale Datenbank mit phpMyAdmin (MySQL/MariaDB)
> phpMyAdmin ist nur die Oberfläche. sal_bot verbindet sich direkt mit MySQL/MariaDB.

### 1) Datenbank in phpMyAdmin anlegen
1. phpMyAdmin öffnen (z. B. `http://localhost/phpmyadmin`).
2. Neue Datenbank erstellen: `sal_bot` (utf8mb4 / utf8mb4_unicode_ci).
3. User mit Rechten auf diese DB nutzen (z. B. `root` lokal oder eigener User).

### 2) ENV setzen
```bash
cp .env.example .env
```
Dann in `.env` eintragen:
- `DB_HOST` (z. B. `127.0.0.1`)
- `DB_PORT` (z. B. `3306`)
- `DB_NAME` (z. B. `sal_bot`)
- `DB_USER`
- `DB_PASSWORD`

Optional kann stattdessen `DATABASE_URL` gesetzt werden.

### 3) Auto-Setup beim Start
Beim API-Start wird automatisch:
- das Prisma-Schema per `prisma db push` synchronisiert,
- fehlende Tabellen erstellt,
- und bei leerer DB Basisdaten (Beispiel-GuildConfig + AuditLog) eingefügt.

Damit sind **keine manuellen SQL-Importe** für lokale Tests nötig.

## Projektstart
```bash
npm install
npm run dev
```

## Wichtige Endpunkte
- `GET /health`
- `GET /api/guilds/:guildId/config`
- `PUT /api/guilds/:guildId/config`

## Sicherheit (Foundation)
- Session-Cookies (`HttpOnly`, `SameSite`)
- Helmet + Rate-Limit
- Keine Secrets im Code
- Audit-Logs für Konfigurationsänderungen

## Hinweis auf Produktionsbetrieb
Für Produktion nur ENV ändern (z. B. Managed MySQL/MariaDB + neue Credentials). Die Datenbankschicht bleibt über Prisma entkoppelt und ist nicht an phpMyAdmin gebunden.


## ENV-Hinweis
Die echte Konfiguration muss in `apps/api/.env` liegen. Für den Start aus dem Root-Workspace lädt die API diese Datei automatisch vor der Zod-Validierung.

## Lokale URLs
- API: `http://localhost:4000`
- Webpanel (Vite): `http://localhost:5173`
- Discord Login startet vom Webpanel und leitet auf `http://localhost:4000/auth/discord` weiter.

## Troubleshooting
- Fehler `@prisma/client did not initialize yet`:
  1. `npm install`
  2. `npm run prisma:generate -w apps/api`
  3. `npm run dev`
- Login-Button im Webpanel nutzt `http://localhost:4000/auth/discord`. Wenn "Verbindung abgelehnt" erscheint, läuft die API nicht oder Port 4000 ist belegt.
