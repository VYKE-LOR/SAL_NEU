import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  DISCORD_REDIRECT_URI: z.string().url(),
  DISCORD_BOT_TOKEN: z.string(),
  DISCORD_GUILD_INTENTS: z.string().default("Guilds,GuildMessages,MessageContent,GuildMembers,GuildVoiceStates")
});

export const env = envSchema.parse(process.env);
