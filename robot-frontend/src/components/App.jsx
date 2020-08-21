//packages
import React from "react";
import { Router as HashRouter, Route, Switch } from "react-router-dom";
import createHistory from "history/createHashHistory";
//pages
import PageLogin from "./pages/1.PageLogin/0.PageLogin.jsx";
import PageMonitor from "./pages/2.PageMonitor/0.PageMonitor.jsx";
import PageTaskMgr from "./pages/3.PageTaskMgr/0.PageTaskMgr#0.jsx";
import PageAllRecords from "./pages/4.PageTaskRecord/0.PageAllRecords/0.PageAllRecords#0.jsx";
import PageOneMeterRecords from "./pages/4.PageTaskRecord/1.PageOneMeterRecords/0.PageOneMeterRecords#0#1.jsx";
import PageUserMgr from "./pages/6.PageUserMgr/0.PageUserMgr#0.jsx";
import PageAlertMgr from "./pages/5.PageAlertMgr/0.PageAlertMgr#0.jsx";

const history = createHistory();

function App() {
  return (
    <HashRouter history={history}>
      <div>
        <Switch>
          {/* <Route path="/" component={PageLogin} exact></Route> */}
          <Route path="/" component={PageTaskMgr} exact></Route>
          <Route path="/Monitor" component={PageMonitor}></Route>
          <Route path="/TaskMgr" component={PageTaskMgr}></Route>
          <Route path="/AllRecords" component={PageAllRecords}></Route>
          <Route
            path="/OneMeterRecords"
            component={PageOneMeterRecords}
          ></Route>
          <Route path="/AlertMgr" component={PageAlertMgr}></Route>
          <Route path="/UserMgr" component={PageUserMgr}></Route>
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
