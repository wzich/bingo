import { TileData } from "../types.ts";

export const Tile = (
  { value, completed, tile_id, onClick }: {
    value: string;
    completed: boolean;
    tile_id: number;
    onClick: (value: number) => void;
  },
) => (
  <div
    onClick={() => onClick(tile_id)}
    className={`aspect-square flex p-4 justify-center items-center rounded-md font-bold uppercase text-slate-800 transition-colors select-none cursor-default + ${
      completed ? "bg-green-400" : "bg-slate-200"
    } + ${/\p{Extended_Pictographic}/u.test(value) ? "text-8xl" : "text-md"}`}
  >
    {value}
  </div>
);

const Board = (
  { tiles, handleTileClick }: {
    tiles: TileData[];
    handleTileClick: (tile_id: number) => void;
  },
) => (
  <div className="grid grid-cols-4 gap-3">
    {tiles.map((tile: TileData) => (
      <Tile
        value={tile.value}
        completed={tile.completed}
        tile_id={tile.tile_id}
        key={tile.tile_id}
        onClick={handleTileClick}
      />
    ))}
  </div>
);

export default Board;
