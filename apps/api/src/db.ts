import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

process.env.DATABASE_URL = env.DATABASE_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prismaSchemaPath = path.resolve(__dirname, "../../../prisma/schema.prisma");

try {
  execSync(`npx prisma generate --schema "${prismaSchemaPath}"`, { stdio: "inherit" });
} catch {
  throw new Error("Prisma Client konnte nicht initialisiert werden. Bitte `npm install` und anschließend `npm run dev` erneut ausführen.");
}

export const prisma = new PrismaClient();
