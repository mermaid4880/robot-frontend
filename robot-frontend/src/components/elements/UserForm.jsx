//packages
import React from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Link } from "react-router-dom";

function UserForm() {
  //————————————————————————————css
  const formStyle = {
    fontStyle: "微软雅黑",
    fontSize: "1.5rem",
    color: "aliceblue"
  };

  return (
    <Form style={formStyle}>
      <FormGroup>
        <Label for="exampleEmail">用户名</Label>
        <Input type="user" name="user" id="exampleEmail" placeholder="用户名" />
      </FormGroup>
      <FormGroup>
        <Label for="examplePassword">密码</Label>
        <Input
          type="password"
          name="password"
          id="examplePassword"
          placeholder="密码"
        />
      </FormGroup>
      <Link to="/Home">
        <Button color="info" size="lg">
          登录
        </Button>
      </Link>
    </Form>
  );
}

export default UserForm;
