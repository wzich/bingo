import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Board } from "@components";
import { TileData } from "../types.ts";
import { checkBingo, getBoard, toggleTile } from "../utils.ts";

const Game = () => {
  const [location, _navigate] = useLocation();
  const [nickname, setNickname] = useState("");
  const [tiles, setTiles] = useState([]);
  const game_id = location.split("/")[2];

  useEffect(() => {
    if (nickname && game_id) {
      (async () => {
        const board = await getBoard({ nickname, game_id });
        setTiles(board);
      })();
    }
  }, [nickname, game_id]);

  const hasBingo = useMemo(
    () => (checkBingo(tiles)),
    [tiles],
  );
  if (hasBingo) {
    console.log("Bingo :D");
  }

  const handleTileClick = async (tile_id: number) => {
    const toggleTileSuccess = await toggleTile({ game_id, tile_id });
    if (toggleTileSuccess) {
      setTiles((tiles: TileData[]) =>
        tiles.map((t) =>
          t.tile_id == tile_id ? { ...t, completed: !t.completed } : { ...t }
        )
      );
    }
  };
  if (!tiles.length) {
    return (
      <main className="flex justify-center m-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.target as HTMLFormElement).nickname.value.trim();
            if (input) {
              setNickname(input);
            } else {
              console.error("Nickname cannot be empty.");
            }
          }}
          className="w-1/2 flex flex-col gap-3"
        >
          <h1 className="text-4xl text-center text-slate-700">
            Enter a nickname
          </h1>
          <input
            type="text"
            name="nickname"
            placeholder="Your nickname"
            className="border-s-gray-200 border-2 p-3 text-xl outline-none rounded-md text-slate-700"
            required
          />
          <button
            type="submit"
            className="bg-slate-300 text-xl p-3 rounded-md text-slate-700"
          >
            Submit
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="flex justify-center m-5">
      <div className="w-1/2 flex flex-col gap-3">
        <h1 className="text-4xl text-center text-slate-700">Game {game_id}</h1>
        <Board tiles={tiles} onTileClick={handleTileClick} />
        <div className="text-sm text-gray-500 text-right">
          playing as {nickname}
        </div>
      </div>
    </main>
  );
};

export default Game;
