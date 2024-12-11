import { Board } from "./components/Board.tsx";

function App() {
  const bingoTiles = [
    "🐒",
    "🐶",
    "🦊",
    "🐈",
    "🐴",
    "🐎",
    "🦄",
    "🐷",
    "🐄",
    "🐪",
    "🐐",
    "🐁",
    "🐘",
    "🦫",
    "🦨",
    "🦦",
    "🐨",
    "🐓",
    "🕊️",
    "🦅",
    "🦢",
    "🪿",
    "🦩",
    "🐢",
    "🐊",
    "🐍",
    "🐋",
    "🐬",
    "🐙",
    "🐝",
    "🐞",
    "🕷️",
  ];

  function getRandomValues(array: string[], n: number) {
    if (n > array.length) {
      throw new Error("n cannot be greater than array length");
    }
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  return (
    <>
      <main className="flex justify-center items-center h-svh">
        <div className="w-1/2">
          <Board tiles={getRandomValues(bingoTiles, 16)} />
        </div>
      </main>
    </>
  );
}

export default App;
