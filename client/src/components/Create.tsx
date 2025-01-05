import { useState } from "react";
import { useLocation } from "wouter";

const Create = () => {
  const [nickname, setNickname] = useState("");
  const [tileValues, setTileValues] = useState("");
  const [_location, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nickname,
      tiles: tileValues.split("\n"),
    };
    try {
      const response = await fetch("https://api.zich.wtf:8000/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        const game_id = data.game_id;
        navigate(`/game/${game_id}`);
      } else {
        console.error("Game creation failed");
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  return (
    <main className="flex justify-center p-5">
      <form
        onSubmit={handleSubmit}
        className="w-1/2 flex flex-col gap-5"
      >
        <h1 className="text-4xl text-center text-slate-700 dark:text-slate-50">
          New Game
        </h1>
        <textarea
          className="border-s-gray-200 border-2 p-3 text-xl outline-none h-96 rounded-md text-slate-700"
          placeholder="Add at least 16 values with a line break between"
          value={tileValues}
          onChange={(e) => setTileValues(e.target.value)}
        >
        </textarea>
        {
          /* <input
          type="text"
          className="border-s-gray-200 border-2 p-3 text-xl outline-none rounded-md text-slate-700"
          placeholder="Your Name"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        >
        </input> */
        }
        <button
          type="submit"
          className="bg-slate-300 text-xl p-3 rounded-md text-slate-700"
        >
          Create Game
        </button>
      </form>
    </main>
  );
};

export default Create;
