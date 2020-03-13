//packages
import React from "react";
import { Container, Row, Col } from "reactstrap";
//elements
import UserForm from "../elements/UserForm";
//images
import ImageBackground from "../../images/PageLogin-bg.png";

function PageLogin() {
  //————————————————————————————css
  const pageStyle = {
    position: "absolute",
    top: "0",
    width: "100%",
    height: "937px",
    backgroundImage: `url(${ImageBackground})`
  };
  const rowStyle = { paddingTop: "40%" };

  return (
    <div style={pageStyle}>
      <Container>
        <Row style={rowStyle}>
          <Col sm={{ size: 4, order: 2, offset: 4 }}>
            <UserForm />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PageLogin;
