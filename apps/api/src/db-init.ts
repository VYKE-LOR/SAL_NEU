import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prismaSchemaPath = path.resolve(__dirname, "../../../prisma/schema.prisma");

function ensurePrismaClientGenerated() {
  try {
    execSync(`npx prisma generate --schema "${prismaSchemaPath}"`, { stdio: "inherit" });
  } catch {
    throw new Error("Prisma Client konnte nicht generiert werden. Führe `npm install` erneut aus und prüfe Prisma-Abhängigkeiten.");
  }
}

export async function initializeDatabase() {
  ensurePrismaClientGenerated();

  try {
    execSync(`npx prisma db push --schema "${prismaSchemaPath}" --skip-generate`, {
      stdio: "inherit"
    });
  } catch {
    throw new Error(
      "Datenbankschema konnte nicht vorbereitet werden. Prüfe MySQL/MariaDB Zugangsdaten und ob der Datenbankserver läuft."
    );
  }

  const existing = await prisma.guildConfig.count();
  if (existing === 0) {
    await prisma.guildConfig.create({
      data: {
        guildId: "example-guild",
        modules: { moderation: true, automod: true, tickets: true, leveling: true, logging: true },
        moderation: { warnThresholds: [3, 5, 7], defaultTimeoutMinutes: 30 },
        automod: { antiSpam: true, linkFilter: false, inviteFilter: true },
        tickets: { enabled: true, defaultCategoryName: "Support", supportRoleIds: [] },
        leveling: { enabled: true, xpPerMessageMin: 8, xpPerMessageMax: 15 },
        logging: { enabled: true, modLogChannelId: null, auditLogChannelId: null },
        welcome: { enabled: true, channelId: null, message: "Willkommen {user}!" }
      }
    });

    await prisma.auditLog.create({
      data: {
        guildId: "example-guild",
        actorUserId: "system",
        action: "BOOTSTRAP_DEFAULT_DATA",
        after: { note: "Default-Daten für lokale Entwicklung erzeugt" }
      }
    });
  }
}
