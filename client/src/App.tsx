import { Router, Route, Switch } from "react-router-dom";
import Home from "./components/pages/Home";
import List from "./components/pages/List";
import About from "./components/pages/About";
import { Provider } from "./context/GlobalState";
import history from "./utils/history";

const App = () => {
  return (
    <Provider>
      <Router history={history}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/api/:customListName">
            <List />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
