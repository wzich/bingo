import { Hono } from "jsr:@hono/hono";
import { cors } from "jsr:@hono/hono/cors";
import { Database } from "jsr:@db/sqlite";

const app = new Hono();
const db = new Database(":memory:");

// Create GAME with cols GAME_ID, NAME
db.exec(
  "CREATE TABLE IF NOT EXISTS game (game_id STRING PRIMARY KEY, name TEXT not null)",
);
// Create TILE with cols TILE_ID, GAME_ID, VALUE, COMPLETED
db.exec(
  "CREATE TABLE IF NOT EXISTS tile (tile_id INTEGER PRIMARY KEY AUTOINCREMENT, game_id INTEGER not null, value TEXT not null, completed BOOLEAN)",
);
// Create PLAYER with cols PLAYER_ID, NAME
db.exec(
  "CREATE TABLE IF NOT EXISTS player (player_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT not null)",
);
// Create BOARD with cols BOARD_TILE_ID, GAME_ID, BOARD_ID, PLAYER_ID, TILE_ID
db.exec(
  "CREATE TABLE IF NOT EXISTS board (game_id STRING not null, board_id STRING not null, player_id INTEGER not null, tile_id INTEGER not null)",
);

app.use("/*", cors());

app.post("/game", async (c) => {
  const body = await c.req.json();
  if (body.tiles.length < 16) {
    return c.json({
      "status": "failed",
      "message": "Please provide at least 16 options",
    });
  }
  const tiles = body.tiles;
  const game_id = crypto.randomUUID().substring(0, 8);
  const name = game_id;
  const make_game = db.prepare(
    "INSERT INTO game (game_id, name) VALUES (:game_id, :name)",
  ).all({ game_id, name });
  db.transaction(() => {
    for (const tile of tiles) {
      db.prepare(
        "INSERT INTO tile (game_id, value, completed) VALUES (:game_id, :tile, 0)",
      ).all({ game_id, tile });
    }
  })();

  return make_game
    ? c.json({ status: "success", game_id })
    : c.json({ status: "failed" });
});

app.get("/board/:game_id/:player_id", async (c) => {
  const game_id = await c.req.param("game_id");
  const player_id = await c.req.param("player_id");

  function getBoard(
    { game_id, player_id }: { game_id: string; player_id: string },
  ) {
    return db.prepare(
      "SELECT * FROM board INNER JOIN tile ON board.tile_id = tile.tile_id WHERE board.game_id = :game_id AND board.player_id = :player_id",
    ).all({ game_id, player_id });
  }

  const existing_board = getBoard({ game_id, player_id });
  if (existing_board.length != 0) {
    return c.json(existing_board);
  }

  const board_id = crypto.randomUUID().substring(0, 8);
  db.prepare(
    "INSERT INTO board (board_id, game_id, player_id, tile_id) SELECT :board_id, :game_id, :player_id, tile_id FROM tile INNER JOIN game ON game.game_id = tile.game_id WHERE game.game_id = :game_id ORDER BY RANDOM() LIMIT 16;",
  ).all({ board_id, player_id, game_id });
  const player_board = getBoard({ game_id, player_id });
  return c.json(player_board);
});

app.put("/toggle-tile/:game_id/:tile_id", async (c) => {
  const game_id = await c.req.param("game_id");
  const tile_id = await c.req.param("tile_id");

  const toggleTile = db.prepare(
    `UPDATE tile
        SET completed = CASE WHEN completed = 1 THEN 0 ELSE 1 END
        WHERE game_id = :game_id AND tile_id = :tile_id`,
  ).all({ game_id, tile_id });
  // TODO: verify success or return failure message
  return c.json({
    status: "success",
    message: "Tile toggled successfully",
    data: toggleTile,
  });
});

// Debug routes
app.get("/show-boards", (c) => {
  const response = db.prepare("SELECT * FROM board").all();
  return c.json(response);
});

app.get("/list-tiles", (c) => {
  const stmt = db.prepare("SELECT * FROM tile").all();
  return c.json(stmt);
});

app.get("/list-games", (c) => {
  const games = db.prepare("SELECT * FROM game").all();
  return c.json(games);
});

Deno.serve(app.fetch);
