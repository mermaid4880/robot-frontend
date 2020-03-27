//packages
import React from "react";
import { Container, Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
//elements
import Navigation from "../elements/Navigation";
import Breadcrumb3 from "../elements/Breadcrumb3";
import Table3 from "../elements/Table3";
// import Tree1 from "../elements/Tree1";
import TreeSearch from "../elements/TreeSearch";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#eeeeee"
  },
  topRow: {
    top: "0",
    height: "70px"
  },
  topCol: {
    padding: "0px"
  },
  body: {
    top: "0",
    height: "900px",
    paddingTop: "10px"
  },
  paperRow: {
    height: "350px"
  }
}));

function PageTaskMgr() {
  const classes = useStyles();

  return (
    <Container className={classes.root} fluid={true}>
      <Row className={classes.topRow}>
        <Col className={classes.topCol} sm="12" md={{ size: 12, offset: 0 }}>
          <Navigation />
        </Col>
      </Row>
      <Row className={classes.body}>
        <Col sm="12" md={{ size: 3, offset: 0 }}>
          <Row>
            <Breadcrumb3 />
          </Row>
          {/* <Tree1 /> */}
          <TreeSearch />
        </Col>
        <Col sm="12" md={{ size: 9, offset: 0 }}>
          <Row className={classes.paperRow}>paper</Row>
          <Row>
            <Table3 />
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default PageTaskMgr;
