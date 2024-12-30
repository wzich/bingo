import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Board } from "@components";
import { TileData } from "../types.ts";

const Game = () => {
  const [location, _navigate] = useLocation();
  const [nickname, setNickname] = useState("");
  const [tiles, setTiles] = useState([]);
  const game_id = location.split("/")[2];

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

  const getBoard = async (
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
        setTiles(json);
      } else {
        // Console error
      }
    } catch (e) {
      console.error(e);
    }
  };

  //   function checkBingo(tiles: TileData[]) {
  //     return winningLines.some((line) =>
  //       line.every((idx) => tiles[idx].completed)
  //     );
  //   }

  const toggleTile = async (tile_id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/toggle-tile/${game_id}/${tile_id}`,
        { method: "PUT", headers: { "Content-Type": "application/json" } },
      );
      if (response.ok) {
        const json = await response.json();
        if (json.status == "success") updateState(tile_id);
        else console.error(json);
      }
    } catch (e) {
      console.error(e);
    }
    function updateState(tile_id: number) {
      setTiles((tiles: TileData[]) =>
        tiles.map((t) =>
          t.tile_id == tile_id ? { ...t, completed: !t.completed } : { ...t }
        )
      );
    }
  };

  useEffect(() => {
    if (nickname && game_id) {
      getBoard({ nickname, game_id });
    }
  }, [nickname, game_id]);

  if (!nickname) {
    return (
      <>
        <h1>Enter a nickname</h1>
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
        >
          <input
            type="text"
            name="nickname"
            placeholder="Your nickname"
            required
            className="nickname-input"
          />
          <button type="submit">Submit</button>
        </form>
      </>
    );
  }

  return (
    <main className="flex flex-column justify-center">
      <h1>Game {game_id}</h1>
      <Board tiles={tiles} handleTileClick={toggleTile} />
    </main>
  );
};

export default Game;
