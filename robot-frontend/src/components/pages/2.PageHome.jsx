//packages
import React from "react";
import { Container, Row, Col } from "reactstrap";
//elements
import Navigation from "../elements/Navigation";
import Breadcrumb2 from "../elements/Breadcrumb2";
import RobotCard from "../elements/RobotCard";
import TabTable from "../elements/TabTable";

function PageHome() {
  //————————————————————————————css
  const topStyle = {
    top: "0",
    height: "70px"
  };

  const bodyStyle = {
    top: "0",
    height: "640px",
    paddingTop: "10px"
  };

  const bottomStyle = {
    top: "0",
    height: "226px"
  };

  const colStyle = {
    padding: "0px"
  };

  return (
    <>
      <Container className="themed-container" fluid={true}>
        <Row style={topStyle}>
          <Col style={colStyle} sm="12" md={{ size: 12, offset: 0 }}>
            <Navigation />
          </Col>
        </Row>
        <Row style={bodyStyle}>
          <Container className="themed-container" fluid={true}>
            <Row>
              <Col sm="12" md={{ size: 8, offset: 0 }}>
                <Breadcrumb2 />
              </Col>
              <Col sm="12" md={{ size: 4, offset: 0 }}>
                1
              </Col>
            </Row>
            <Row>
              <Col sm="12" md={{ size: 8, offset: 0 }}>
                <RobotCard />
              </Col>
              <Col sm="12" md={{ size: 4, offset: 0 }}>
                1
              </Col>
            </Row>
          </Container>
        </Row>
        <Row style={bottomStyle}>
          <Col sm="12" md={{ size: 8, offset: 0 }}>
            <TabTable />
          </Col>
          <Col sm="12" md={{ size: 4, offset: 0 }}>
            .col-sm-12 .col-md-6 .offset-md-3
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default PageHome;
