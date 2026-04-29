import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import cookie from "@fastify/cookie";
import session from "@fastify/session";
import rateLimit from "@fastify/rate-limit";
import { env } from "./env.js";
import { prisma } from "./db.js";
import { startBot } from "./discord/bot.js";
import { initializeDatabase } from "./db-init.js";

const app = Fastify({ logger: true });

await app.register(helmet, { contentSecurityPolicy: false });
await app.register(cors, { origin: true, credentials: true });
await app.register(cookie);
await app.register(rateLimit, { max: 100, timeWindow: "1 minute" });
await app.register(session, {
  secret: env.SESSION_SECRET,
  cookie: { secure: env.NODE_ENV === "production", httpOnly: true, sameSite: "lax" }
});

app.get("/health", async () => ({ ok: true }));

app.get("/auth/discord", async (_req, reply) => {
  const params = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    redirect_uri: env.DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify guilds"
  });
  return reply.redirect(`https://discord.com/oauth2/authorize?${params.toString()}`);
});

app.get("/api/guilds/:guildId/config", async (req, reply) => {
  const params = req.params as { guildId: string };
  const cfg = await prisma.guildConfig.findUnique({ where: { guildId: params.guildId } });
  if (!cfg) return reply.code(404).send({ error: "Config not found" });
  return cfg;
});

app.put("/api/guilds/:guildId/config", async (req, reply) => {
  const params = req.params as { guildId: string };
  const body = req.body as any;
  const next = await prisma.guildConfig.upsert({
    where: { guildId: params.guildId },
    create: {
      guildId: params.guildId,
      modules: body.modules ?? {},
      moderation: body.moderation ?? {},
      automod: body.automod ?? {},
      tickets: body.tickets ?? {},
      leveling: body.leveling ?? {},
      logging: body.logging ?? {},
      welcome: body.welcome ?? {}
    },
    update: body
  });

  await prisma.auditLog.create({
    data: {
      guildId: params.guildId,
      actorUserId: body.actorUserId ?? "unknown",
      action: "GUILD_CONFIG_UPDATED",
      after: next as unknown as object
    }
  });

  return reply.send({ success: true, config: next });
});

const run = async () => {
  await initializeDatabase();
  await startBot();
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
};

run().catch(async (err) => {
  app.log.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
