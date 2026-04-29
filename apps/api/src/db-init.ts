import { execSync } from "node:child_process";
import { prisma } from "./db.js";

export async function initializeDatabase() {
  try {
    execSync("npx prisma db push --schema ../../prisma/schema.prisma --skip-generate", {
      stdio: "inherit",
      cwd: process.cwd()
    });
  } catch (error) {
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
