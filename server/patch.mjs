import { readFile } from "node:fs/promises";
import pg from "pg";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 10000 });
try {
  const client = await pool.connect();
  try {
    const exists = await client.query("SELECT to_regclass('public.students') AS students");
    if (!exists.rows[0].students) throw new Error("Initial schema is missing. Run npm run db:migrate first.");
    const migration = (await readFile(new URL("../database/migrations/002_remove_school_student_id.sql", import.meta.url), "utf8")).replace(/^\uFEFF/, "");
    await client.query(migration);
    console.log("Migration 002 applied: external Student ID column removed.");
  } finally { client.release(); }
} catch (error) {
  console.error("Migration failed; DATABASE_URL was not printed.");
  console.error(error instanceof Error ? error.message : "Unknown database error");
  process.exitCode = 1;
} finally { await pool.end(); }
