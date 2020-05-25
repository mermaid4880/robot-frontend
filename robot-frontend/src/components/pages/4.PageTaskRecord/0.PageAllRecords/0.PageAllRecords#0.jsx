//packages
import React from "react";
import { Container, Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
//elements
import Navigation from "../../../elements/0.Navigation.jsx";
import Breadcrumb4_0 from "./1.Breadcrumb4_0.jsx";
import AllRecordsTable from "./2_.AllRecordsTable.jsx";
import OneRecordDetailTable from "./3.OneRecordDetailTable#2#3#4#5.jsx";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#eeeeee",
    width: "1920px",
    height: "962px",
  },
  navBarRow: {
    top: "0",
    height: "70px",
    padding: "0px",
  },
  navBarCol: {
    padding: "0px",
  },
  allRecordsTable: {
    top: "0",
    height: "410px",
    padding: "0px 8px 0px 8px",
  },
  oneRecordDetailTable: {
    top: "0",
    height: "410px",
    padding: "0px 8px 0px 8px",
  },
}));

function PageAllRecords() {
  const classes = useStyles();

  return (
    <Container className={classes.root} fluid={true}>
      <Row className={classes.navBarRow}>
        <Col className={classes.navBarCol} sm="12" md={{ size: 12, offset: 0 }}>
          <Navigation />
        </Col>
      </Row>
      <Row>
        <Breadcrumb4_0 />
      </Row>
      <Row className={classes.allRecordsTable}>
        <AllRecordsTable />
      </Row>
      <Row className={classes.oneRecordDetailTable}>
        <OneRecordDetailTable />
      </Row>
    </Container>
  );
}

export default PageAllRecords;
