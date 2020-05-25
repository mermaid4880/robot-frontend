//packages
import React from "react";
import { Container, Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
//elements
import Navigation from "../../elements/0.Navigation.jsx";
import Breadcrumb3 from "./1.Breadcrumb3.jsx";
import TabTreeCalendar from "./2_.TabTreeCalendar#1.jsx";
import TaskTableAndDetail from "./3_.TaskTableAndDetail.jsx";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#eeeeee",
    width:"1920px",
    height:"962px"
  },
  navBarRow: {
    top: "0",
    height: "70px",
    padding: "0px",
  },
  navBarCol: {
    padding: "0px",
  },
  main: {
    top: "0",
    height: "900px",
  },
  tabTreeCalendar: {
    top: "0",
    height: "850px",
    padding: "0px 5px 0px 5px",
  },
  paperRow: {
    height: "38px",
  },
}));

function PageTaskMgr() {
  const classes = useStyles();

  return (
    <Container className={classes.root} fluid={true}>
      <Row className={classes.navBarRow}>
        <Col className={classes.navBarCol} sm="12" md={{ size: 12, offset: 0 }}>
          <Navigation />
        </Col>
      </Row>
      <Row className={classes.main}>
        <Col sm="12" md={{ size: 3, offset: 0 }}>
          <Row>
            <Breadcrumb3 />
          </Row>
          <Row className={classes.tabTreeCalendar}>
            <TabTreeCalendar />
          </Row>
        </Col>
        <Col sm="12" md={{ size: 9, offset: 0 }}>
          <Row className={classes.paperRow}></Row>
          <Row>
            <TaskTableAndDetail />
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default PageTaskMgr;
