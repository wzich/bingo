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
      `https://bingo-api.zich.wtf/board/${game_id}/${nickname}`,
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

export interface GameEvent {
  type: string;
  data?: {
    tile_id: number;
    completed: boolean;
  };
}

export const adaptFontSize = (text: string) => {
  if (
    /\p{Extended_Pictographic}/u.test(text) && /^[^a-zA-Z0-9]*$/u.test(text)
  ) {
    return "md:text-8xl text-4xl";
  } else if (text.length < 6) {
    return "md:text-4xl text-2xl";
  } else if (text.length < 8) {
    return "md:text-2xl text-xl";
  } else if (text.length < 10) {
    return "md:text-xl text-lg";
  } else if (text.length < 15) {
    return "md:text-lg text-sm";
  } else if (text.length < 25) {
    return "md:text-md text-xs";
  } else if (text.length < 45) {
    return "md:text-sm text-[6px]";
  } else {
    return "md:text-xs text-xs";
  }
};
