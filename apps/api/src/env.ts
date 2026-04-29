import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiRoot = path.resolve(__dirname, "..");
const envPath = path.join(apiRoot, ".env");

if (existsSync(envPath)) {
  dotenv.config({ path: envPath, override: false });
} else {
  dotenv.config();
}

const baseSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DB_HOST: z.string().default("127.0.0.1"),
  DB_PORT: z.coerce.number().default(3306),
  DB_NAME: z.string().default("sal_bot"),
  DB_USER: z.string().default("root"),
  DB_PASSWORD: z.string().default(""),
  DATABASE_URL: z.string().optional(),
  SESSION_SECRET: z.string().min(32),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),
  DISCORD_REDIRECT_URI: z.string().url(),
  DISCORD_BOT_TOKEN: z.string().min(1)
});

const parsed = baseSchema.safeParse(process.env);
if (!parsed.success) {
  const missing = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
  throw new Error(
    `ENV_VALIDATION_ERROR: Fehlende/ungültige Variablen: ${missing}. ` +
      `Lege die Datei apps/api/.env an (z. B. aus apps/api/.env.example) und starte erneut.`
  );
}

const computedDbUrl =
  parsed.data.DATABASE_URL ??
  `mysql://${encodeURIComponent(parsed.data.DB_USER)}:${encodeURIComponent(parsed.data.DB_PASSWORD)}@${parsed.data.DB_HOST}:${parsed.data.DB_PORT}/${parsed.data.DB_NAME}`;

export const env = {
  ...parsed.data,
  DATABASE_URL: computedDbUrl
};
