//packages
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
} from "reactstrap";
import classnames from "classnames";
import EventIcon from "@material-ui/icons/Event";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
//elements
import TaskCalendar from "./2_1.TaskCalendar.jsx";
import TreeSearch from "../../elements/1.TreeSearch.jsx";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "850px",
    padding: "0px 5px 5px 5px",
  },
  icon:{
    margin:"5px 6px 0px 0px",
  }
}));

function TabTreeCalendar() {
  const classes = useStyles();

  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  return (
    <Paper className={classes.root} elevation="3" raised>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => {
              toggle("1");
            }}
          >
            <EventIcon className={classes.icon}/>
            日历
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => {
              toggle("2");
            }}
          >
            <AccountTreeIcon className={classes.icon}/>
            设备树展示
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <TaskCalendar />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col sm="12">
              <TreeSearch type={"insideTab"}/>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </Paper>
  );
}

export default TabTreeCalendar;