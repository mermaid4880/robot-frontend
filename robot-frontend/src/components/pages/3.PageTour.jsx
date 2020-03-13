//packages
import React from "react";
import { Container, Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
//elements
import Navigation from "../elements/Navigation";
import Breadcrumb3 from "../elements/Breadcrumb3";
import Table3 from "../elements/Table3";
import Tree from "../elements/Tree";

const useStyles = makeStyles(theme => ({
  topStyle: {
    top: "0",
    height: "70px"
  },
  bottomStyle: {
    top: "0",
    height: "566px",
    paddingTop: "10px"
  },
  colStyle: {
    padding: "0px"
  },
  rowStyle: {
    height: "310px"
  }
}));

function PageTour() {
  const classes = useStyles();

  return (
    <>
      <Container className="themed-container" fluid={true}>
        <Row className={classes.topStyle}>
          <Col
            className={classes.colStyle}
            sm="12"
            md={{ size: 12, offset: 0 }}
          >
            <Navigation />
          </Col>
        </Row>
        <Row className={classes.bottomStyle}>
          <Container className="themed-container" fluid={true}>
            <Row>
              <Breadcrumb3 />
            </Row>
            <Row>
              <Col sm="12" md={{ size: 4, offset: 0 }}>
                <Tree />
              </Col>
              <Col sm="12" md={{ size: 8, offset: 0 }}>
                <Row className={classes.rowStyle}>121</Row>
                <Row>
                  <Table3 />
                </Row>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
    </>
  );
}

export default PageTour;
