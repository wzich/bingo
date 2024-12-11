import { useState } from "react";

type TileData = {
  value: string;
  completed: boolean;
};

export const Tile = (
  { value, completed, onClick }: {
    value: string;
    completed: boolean;
    onClick: (value: string) => void;
  },
) => {
  return (
    <div
      onClick={() => onClick(value)}
      className={`aspect-square flex p-4 justify-center items-center rounded-md font-bold uppercase text-slate-800 transition-colors select-none cursor-default + ${
        completed ? "bg-green-400" : "bg-slate-200"
      } + ${/\p{Extended_Pictographic}/u.test(value) ? "text-8xl" : "text-md"}`}
    >
      {value}
    </div>
  );
};

export const Board = ({ tiles }: { tiles: string[] }) => {
  const startingState = tiles.map((tile) => ({
    value: tile,
    completed: false,
  }));
  const [boardState, setBoardState] = useState(startingState);

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

  function checkBingo(tiles: TileData[]) {
    return winningLines.some((line) =>
      line.every((idx) => tiles[idx].completed)
    );
  }

  const handleTileClick = (value: string) => {
    const nextState = boardState.map((tile: TileData) =>
      tile.value == value
        ? { ...tile, completed: !tile.completed }
        : { ...tile }
    );
    setBoardState(nextState);
    if (checkBingo(nextState)) {
      alert("Bingo!");
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {boardState.map((tile: TileData) => (
        <Tile
          value={tile.value}
          completed={tile.completed}
          key={tile.value}
          onClick={handleTileClick}
        />
      ))}
    </div>
  );
};
