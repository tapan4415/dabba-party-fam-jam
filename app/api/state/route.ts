import { env } from "cloudflare:workers";

const createSql = `CREATE TABLE IF NOT EXISTS live_game_state (
  room TEXT PRIMARY KEY NOT NULL,
  payload TEXT NOT NULL,
  updated_at INTEGER NOT NULL
)`;

async function ready() {
  if (!env.DB) throw new Error("Shared game database is unavailable");
  await env.DB.prepare(createSql).run();
  return env.DB;
}

export async function GET() {
  const db = await ready();
  const row = await db.prepare("SELECT payload, updated_at updatedAt FROM live_game_state WHERE room = ?")
    .bind("main").first<{payload:string;updatedAt:number}>();
  return Response.json(row ? { state: JSON.parse(row.payload), updatedAt: row.updatedAt } : { state: null, updatedAtAt: 0 });
}

export async function POST(request: Request) {
  const db = await ready();
  const state = await request.json();
  const payload = JSON.stringify(state);
  if (payload.length > 500_000) return Response.json({error:"State is too large"},{status:413});
  const updatedAt = Date.now();
  await db.prepare("INSERT INTO live_game_state (room, payload, updated_at) VALUES (?, ?, ?) ON CONFLICT(room) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at")
    .bind("main", payload, updatedAt).run();
  return Response.json({ok:true,updatedAtAt:updatedAt});
}
