//packages
import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Spinner
} from "reactstrap";
import { useHistory } from "react-router-dom";
//functions
import { postData } from "../../functions/requestDataFromAPI";

function UserForm() {
  //————————————————————————————css
  const formStyle = {
    fontStyle: "微软雅黑",
    fontSize: "1.5rem",
    color: "aliceblue"
  };

  const textStyle = {
    width: "50%",
    fontStyle: "微软雅黑",
    fontSize: "1rem",
    paddingBottom: "0.7rem",
    color: "aliceblue"
  };

  //————————————————————————————
  const history = useHistory();

  const [input, setInput] = useState({ username: "", password: "" }); //用户输入内容
  const [text, setText] = useState(""); //登录状态显示
  var isAccess = false; //登录是否成功

  function handleChange(event) {
    const { name, value } = event.target;
    setInput(prevValue => {
      return { ...prevValue, [name]: value };
    });
  }

  function handleClick(event) {
    //————————————————————————————POST请求
    // 用URLSearchParams来传递参数
    let paramData = new URLSearchParams();
    paramData.append("username", input.username.toString());
    paramData.append("password", input.password.toString());
    postData("users/login", paramData).then(data => {
      console.log("post结果", data);
      isAccess = data.data.success;
      if (isAccess) {
        history.push("/Home");
        setText("正在登录，请稍后");
      } else {
        setText("用户名或密码错误！");
        console.log(isAccess);
      }
    });
  }

  return (
    <Form style={formStyle}>
      <FormGroup>
        <Label>用户名</Label>
        <Input
          onChange={handleChange}
          type="username"
          name="username"
          placeholder="用户名"
          value={input.username}
        />
      </FormGroup>
      <FormGroup>
        <Label>密码</Label>
        <Input
          onChange={handleChange}
          type="password"
          name="password"
          placeholder="密码"
          value={input.password}
        />
      </FormGroup>
      <FormGroup>
        {isAccess ? (
          <FormText style={textStyle} color="muted">
            {text}
            <Spinner color="info" size="sm" />
          </FormText>
        ) : (
          <FormText color="muted" style={textStyle}>
            {text}
          </FormText>
        )}
        <Button onClick={handleClick} color="info" size="lg">
          登录
        </Button>
      </FormGroup>
    </Form>
  );
}

export default UserForm;
