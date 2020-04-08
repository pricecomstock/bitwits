import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./mvp.css";
import "./appleseed.scss";

import Home from "./components/pages/Home";
import HostView from "./components/pages/HostView";
import PlayerView from "./components/pages/PlayerView";

function App() {
  return (
    <Router>
      <div className="App section">
        {/* notice "exact" */}
        <Switch>
          <Route exact path="/" component={Home}></Route>

          <Route exact path="/host/:code" component={HostView}></Route>
          <Route exact path="/play/:code" component={PlayerView}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
