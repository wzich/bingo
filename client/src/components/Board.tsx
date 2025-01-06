import { TileData } from "../types.ts";
import { adaptFontSize } from "../utils.ts";

export const Tile = (
  { value, completed, tile_id, onClick }: {
    value: string;
    completed: boolean;
    tile_id: number;
    onClick: (arg0: { tile_id: number; completed: boolean }) => void;
  },
) => (
  <div
    onClick={() => onClick({ tile_id, completed: !completed })}
    className={`aspect-square flex p-4 justify-center items-center rounded-md font-bold uppercase text-slate-800 dark:text-slate-50 transition-colors select-none cursor-default overflow-hidden + ${
      completed
        ? "bg-green-400 dark:bg-green-700"
        : "bg-slate-200 dark:bg-slate-700"
    } + ${adaptFontSize(value)}`}
  >
    {value}
  </div>
);

const Board = (
  { tiles, onTileClick }: {
    tiles: TileData[];
    onTileClick: (arg0: { tile_id: number; completed: boolean }) => void;
  },
) => (
  <div className="grid grid-cols-4 gap-3">
    {tiles.map((tile: TileData) => (
      <Tile
        value={tile.value}
        completed={tile.completed}
        tile_id={tile.tile_id}
        key={tile.tile_id}
        onClick={onTileClick}
      />
    ))}
  </div>
);

export default Board;
