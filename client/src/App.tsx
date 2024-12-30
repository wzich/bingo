import { Route, Switch } from "wouter";
import { Create, Game } from "@components";

function App() {
  return (
    <>
      <Switch>
        <Route path="/">
          <Create />
        </Route>
        <Route path="/game/:game_id">
          <Game />
        </Route>
        <Route>
          <h1>404</h1>
        </Route>
      </Switch>
      {
        /* <main className="flex justify-center items-center h-svh">
        <div className="w-1/2">
          <Board tiles={getRandomValues(bingoTiles, 16)} />
        </div>
      </main> */
      }
    </>
  );
}

export default App;
