//packages
import React from "react";
import { Container, Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
//elements
import Navigation from "../../elements/0.Navigation.jsx";
import Breadcrumb2 from "./1.Breadcrumb2.jsx";
import RobotCard from "./RobotCard.jsx";
import TabTable from "./TabTable.jsx";
import Map from "./Map.jsx";
import Hkws from "../../elements/Hkws.jsx";
import VlcRtsp from "../../elements/VlcRtsp.jsx";

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
    height: "640px",
  },
  bottom: {
    top: "0",
    height: "250px"
  }
}));

function PageMonitor() {
  const classes = useStyles();

  return (
    <Container className={classes.root} fluid={true}>
      <Row className={classes.topRow}>
        <Col className={classes.topCol} sm="12" md={{ size: 12, offset: 0 }}>
          <Navigation />
        </Col>
      </Row>
      <Row className={classes.body}>
        <Col sm="12" md={{ size: 8, offset: 0 }}>
          <Row>
            <Breadcrumb2 />
          </Row>
          <Row>
            <RobotCard />
          </Row>
          <Row>
            <Map />
          </Row>
        </Col>
        <Col sm="12" md={{ size: 4, offset: 0 }}>
          <Row>
            <Hkws />
          </Row>
          <Row>
            <VlcRtsp />
          </Row>
        </Col>
      </Row>
      <Row className={classes.bottom}>
        <Col sm="12" md={{ size: 8, offset: 0 }}>
          <TabTable />
        </Col>
        <Col sm="12" md={{ size: 4, offset: 0 }}>
          .col-sm-12 .col-md-6 .offset-md-3
        </Col>
      </Row>
    </Container>
  );
}

export default PageMonitor;
