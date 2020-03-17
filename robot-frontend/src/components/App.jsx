//packages
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//pages
import PageLogin from "./pages/1.PageLogin";
import PageHome from "./pages/2.PageHome";
import PageTaskMgr from "./pages/3.PageTaskMgr";
import PageTaskShow from "./pages/4.PageTaskShow";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" component={PageLogin} exact></Route>
          <Route path="/Home" component={PageHome}></Route>
          <Route path="/TaskMgr" component={PageTaskMgr}></Route>
          <Route path="/TaskShow" component={PageTaskShow}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
