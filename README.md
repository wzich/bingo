# Bingo

> Live-synced custom bingo games. Make a game with your own tiles and race
> against friends to get bingo. When you cross off a tile, it'll be cross off on
> everyone else's boards, too.

### Gameplay

On the landing page, provide at least sixteen options for tile values. A unique
game link will be generated. Everyone joins with a nickname and gets a
randomized board. When any player crosses off a tile, it'll update everyone
else's board. The first to get four in a row wind bingo!

# Development

### Tools

This game is built using [Deno](https://deno.land) and TypeScript.

##### Front-End

React, Vite, Tailwind CSS.

##### Back-End

Hono

### Development

**Prerequisites:** Install
[Deno](https://docs.deno.com/runtime/getting_started/installation/)

1. Clone the repository
2. Install dependencies for back-end: `deno install` from `server/`
3. Install dependencies for front-end: `deno install` from `client/`
4. Run server with inside `server/` with `deno task dev`
5. Run client from inside `client/` with `deno task dev`
