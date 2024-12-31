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
    </>
  );
}

export default App;
