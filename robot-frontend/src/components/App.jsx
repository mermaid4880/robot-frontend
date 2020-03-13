//packages
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//pages
import PageLogin from "./pages/1.PageLogin";
import PageHome from "./pages/2.PageHome";
import PageTour from "./pages/3.PageTour";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" component={PageLogin} exact></Route>
          <Route path="/Home" component={PageHome}></Route>
          <Route path="/Tour" component={PageTour}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
