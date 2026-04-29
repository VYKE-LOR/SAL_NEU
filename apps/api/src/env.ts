import { z } from "zod";

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
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  DISCORD_REDIRECT_URI: z.string().url(),
  DISCORD_BOT_TOKEN: z.string()
});

const parsed = baseSchema.parse(process.env);
const computedDbUrl = parsed.DATABASE_URL ??
  `mysql://${encodeURIComponent(parsed.DB_USER)}:${encodeURIComponent(parsed.DB_PASSWORD)}@${parsed.DB_HOST}:${parsed.DB_PORT}/${parsed.DB_NAME}`;

export const env = {
  ...parsed,
  DATABASE_URL: computedDbUrl
};
