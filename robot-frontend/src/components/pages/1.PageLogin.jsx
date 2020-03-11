//packages
import React from "react";
import { Container, Row, Col } from "reactstrap";
//elements
import UserForm from "../elements/UserForm";
//functions
import { getData, postData } from "../../functions/requestDataFromAPI";
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

  getData("areas/tree").then(data => {
    console.log("get结果", data);
  });

  //————————————————————————————POST请求
  //用URLSearchParams来传递参数
  let paramData = new URLSearchParams();
  paramData.append("username", "mozhichao");
  paramData.append("password", "123");
  postData("users/login", paramData).then(data => {
    console.log("post结果", data);
  });
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
