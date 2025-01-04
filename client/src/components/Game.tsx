import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Board } from "@components";
import { TileData } from "../types.ts";
import { checkBingo, getBoard } from "../utils.ts";
import GameEvent from "../../../types.ts";

const Game = () => {
  const [location, _navigate] = useLocation();
  const [nickname, setNickname] = useState("");
  const [tiles, setTiles] = useState([]);
  const [_messageLog, editMessageLog] = useState<GameEvent[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const game_id = location.split("/")[2];

  useEffect(() => {
    if (nickname && game_id) {
      (async () => {
        const board = await getBoard({ nickname, game_id });
        setTiles(board);
      })();
    }
    const socket = new WebSocket(
      `ws://localhost:8000/live/${game_id}/${nickname}`,
    );
    socketRef.current = socket;
    socket.onopen = () => {
      console.log("Connected to live game server");
    };
    socket.onmessage = (event) => {
      const data: GameEvent = JSON.parse(event.data);
      editMessageLog((messageLog: GameEvent[]) => [...messageLog, data]);
      console.info(data);
      if (data.type == "tile") {
        if (!data.data?.tile_id || data.data.completed == undefined) {
          throw "Missing tile data from server";
        }
        updateTile({
          tile_id: data.data.tile_id,
          completed: Boolean(data.data.completed),
        });
      }
    };
    socket.onclose = () => {
      console.log("Disconnected from live game server");
    };
    return () => {
      socket.close();
    };
  }, [nickname, game_id]);

  const updateTile = (
    { tile_id, completed }: { tile_id: number; completed: boolean },
  ) => {
    console.info(`Updating tile ${tile_id} to be ${completed}`);
    setTiles((tiles: TileData[]) =>
      tiles.map((t) => t.tile_id == tile_id ? { ...t, completed } : { ...t })
    );
  };

  const hasBingo = useMemo(
    () => (checkBingo(tiles)),
    [tiles],
  );
  if (hasBingo) {
    console.log("Bingo :D");
  }

  const handleTileClick = (
    { tile_id, completed }: { tile_id: number; completed: boolean },
  ) => {
    console.info("Sending click...");
    if (socketRef.current && socketRef.current.readyState == WebSocket.OPEN) {
      const message: GameEvent = {
        type: "tile",
        data: {
          tile_id,
          completed,
        },
      };
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error("Failed to send message to socket server");
    }
  };
  if (!tiles.length) {
    return (
      <main className="flex justify-center p-5">
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
          <h1 className="text-4xl text-center text-slate-700 dark:text-slate-50">
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
    <main className="flex justify-center p-5">
      <div className="w-1/2 flex flex-col gap-3">
        <h1 className="text-4xl text-center text-slate-700 dark:text-slate-50">
          Game {game_id}
        </h1>
        <Board tiles={tiles} onTileClick={handleTileClick} />
        <div className="text-sm text-gray-500 text-right">
          playing as {nickname}
        </div>
      </div>
    </main>
  );
};

export default Game;
