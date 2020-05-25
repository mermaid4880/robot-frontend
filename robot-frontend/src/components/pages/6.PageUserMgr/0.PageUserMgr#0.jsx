//packages
import React from "react";
import { Container, Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
//elements
import Navigation from "../../elements/0.Navigation.jsx";
import Breadcrumb6 from "./1.Breadcrumb6.jsx";
import UserTable from "./2_.UserTable.jsx";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#eeeeee",
  },
  topRow: {
    top: "0",
    height: "70px",
  },
  topCol: {
    padding: "0px",
  },
  body: {
    top: "0",
    height: "890px",
    paddingTop: "10px",
  },
  calendar: {
    height: "833px",
    backgroundColor: "#f5eee6",
  },
  collapse: {
    marginTop: "5px",
    height: "870px",
    backgroundColor: "#f5eee6",
  },
}));

function PageUserMgr() {
  const classes = useStyles();

  return (
    <Container className={classes.root} fluid={true}>
      <Row className={classes.topRow}>
        <Col className={classes.topCol} sm="12" md={{ size: 12, offset: 0 }}>
          <Navigation />
        </Col>
      </Row>
      <Row className={classes.body} sm="12" md={{ size: 12, offset: 0 }}>
        <Col sm="12" md={{ size: 12, offset: 0 }}>
          <Breadcrumb6 />
        </Col>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <UserTable />
        </Col>
      </Row>
    </Container>
  );
}

export default PageUserMgr;
