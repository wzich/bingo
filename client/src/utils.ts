import { TileData } from "./types.ts";

export const checkBingo = (tiles: TileData[]) => {
  const winningLines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12],
  ];
  return tiles.length
    ? winningLines.some((line) => line.every((idx) => tiles[idx].completed))
    : false;
};

export const getBoard = async (
  { nickname, game_id }: { nickname: string; game_id: string },
) => {
  try {
    const response = await fetch(
      `http://localhost:8000/board/${game_id}/${nickname}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      console.error(response);
    }
  } catch (e) {
    console.error(e);
  }
};
