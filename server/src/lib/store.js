// Simple JSON-file storage so the project runs with zero setup.
// For production, swap these two functions for a real database
// (MongoDB, PostgreSQL, Supabase...) without touching the routes.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../../data');

// Serialize writes per file so two requests never overwrite each other
const queues = new Map();

async function readAll(name) {
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, `${name}.json`), 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

export function insert(name, record) {
  const prev = queues.get(name) || Promise.resolve();
  const next = prev.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const rows = await readAll(name);
    rows.push(record);
    await fs.writeFile(path.join(DATA_DIR, `${name}.json`), JSON.stringify(rows, null, 2));
    return record;
  });
  queues.set(name, next.catch(() => {}));
  return next;
}

export async function findOne(name, predicate) {
  const rows = await readAll(name);
  return rows.find(predicate) || null;
}
