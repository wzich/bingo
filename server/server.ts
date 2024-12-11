import { Hono } from "jsr:@hono/hono";
import { Database } from "jsr:@db/sqlite";

const app = new Hono();
const db = new Database(":memory:");
db.exec(
  "CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT not null, tiles TEXT not null)",
);

app.get("/", (c) => c.text("Hello, World!"));
app.post("/create-game", async (c) => {
  const body = await c.req.json();
  console.log(body);
  const stmt = db.prepare(
    "INSERT INTO games (name, tiles) VALUES (:name, :tiles)",
  );
  const changes = stmt.all({
    name: crypto.randomUUID().substring(0, 8),
    tiles: JSON.stringify(body.tiles),
  });
  return changes ? c.json({ status: "success" }) : c.json({ status: "failed" });
});

app.get("/games", (c) => {
  const stmt = db.prepare("SELECT id, name, tiles FROM games");
  const rows = stmt.all();
  console.log(rows);
  const response = rows.map((row) => ({
    ...row,
    tiles: JSON.parse(row.tiles),
  }));
  return c.json(response);
});

Deno.serve(app.fetch);
