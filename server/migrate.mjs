import { readFile, readdir } from "node:fs/promises";
import pg from "pg";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required in the server environment.");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 10_000, ssl: process.env.PGSSL === "require" ? { rejectUnauthorized: true } : undefined });
try {
  const client = await pool.connect();
  try {
    await client.query("CREATE TABLE IF NOT EXISTS attendwise_schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
    const files = (await readdir(new URL("../database/migrations/", import.meta.url))).filter((name) => /^\d+_.*\.sql$/.test(name)).sort();
    const tables = await client.query("SELECT to_regclass('public.schools') AS schools");
    if (tables.rows[0].schools) {
      await client.query("INSERT INTO attendwise_schema_migrations(name) VALUES ('001_initial_schema.sql') ON CONFLICT DO NOTHING");
    }
    for (const name of files) {
      const exists = await client.query("SELECT 1 FROM attendwise_schema_migrations WHERE name=$1", [name]);
      if (exists.rowCount) continue;
      const sql = (await readFile(new URL(`../database/migrations/${name}`, import.meta.url), "utf8")).replace(/^\uFEFF/, "");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO attendwise_schema_migrations(name) VALUES ($1)", [name]);
        await client.query("COMMIT");
        console.log(`Applied ${name}.`);
      } catch (error) { await client.query("ROLLBACK"); throw error; }
    }
  } finally { client.release(); }
} catch (error) {
  console.error("Database migration failed; DATABASE_URL was not printed.");
  console.error(`Error type: ${error?.constructor?.name ?? "unknown"}; code: ${error?.code ?? "not provided"}.`);
  process.exitCode = 1;
} finally { await pool.end(); }
