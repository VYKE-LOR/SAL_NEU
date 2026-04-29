import { config } from 'dotenv';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiRoot = path.resolve(__dirname, '..');
const envPath = path.join(apiRoot, '.env');
const envExamplePath = path.join(apiRoot, '.env.example');

config({ path: envPath });
if (!process.env.DB_HOST && !process.env.DATABASE_URL) {
  config({ path: envExamplePath, override: false });
}

if (!process.env.DATABASE_URL) {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const name = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const pass = process.env.DB_PASSWORD ?? '';

  if (!host || !port || !name || !user) {
    console.error('Prisma ENV Fehler: DATABASE_URL fehlt und DB_* Variablen sind unvollständig. Bitte apps/api/.env prüfen.');
    process.exit(1);
  }

  process.env.DATABASE_URL = `mysql://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${name}`;
}

const prismaArgs = process.argv.slice(2);
if (prismaArgs.length === 0) {
  console.error('Usage: node scripts/prisma-runner.mjs <prisma-args...>');
  process.exit(1);
}

const result = spawnSync('npx', ['prisma', ...prismaArgs, '--schema', '../../prisma/schema.prisma'], {
  stdio: 'inherit',
  cwd: apiRoot,
  env: process.env,
  shell: true
});

process.exit(result.status ?? 1);
