//packages
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; 
//pages
import PageLogin from "./pages/1.PageLogin";
import PageHome from "./pages/2.PageHome";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" component={PageLogin} exact></Route>
          <Route path="/Home" component={PageHome}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
