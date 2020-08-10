//packages
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Spinner,
} from "reactstrap";
import cookie from "react-cookies";
//functions
import { postData } from "../../../functions/requestDataFromAPI.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    fontStyle: "微软雅黑",
    fontSize: "1.5rem",
    color: "aliceblue",
  },
  text: {
    width: "50%",
    fontStyle: "微软雅黑",
    fontSize: "1rem",
    paddingBottom: "0.7rem",
    color: "aliceblue",
  },
}));

function UserForm() {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //用户输入内容
  const [input, setInput] = useState({ username: "", password: "" });

  //登录状态显示
  const [text, setText] = useState("");

  var isAccess = false; //登录是否成功

  //———————————————————————————————————————————————事件响应函数
  //用户名和密码<Input>变化事件响应函数
  function handleInputChange(event) {
    const { name, value } = event.target;
    setInput((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  //登录<Button>按下事件响应函数
  function handleButtonClick(event) {
    //————————————————————————————POST请求
    // 用URLSearchParams来传递参数
    let paramData = new URLSearchParams();
    paramData.append("username", input.username.toString());
    paramData.append("password", input.password.toString());
    postData("users/login", paramData).then((data) => {
      console.log("post结果", data);
      isAccess = data.data.success;
      if (isAccess) {
        console.log("userId:", data.data.userMessage.userId);
        console.log("token:", data.data.token);
        //获取用户ID和token并存入cookie
        const expires = new Date();
        expires.setDate(Date.now() + 1000 * 60 * 60 * 1);
        cookie.save("userId", data.data.userMessage.userId, {
          path: "/", //Cookie path. Use / as the path if you want your cookie to be accessible on all pages
          // expires, //Absolute expiration date for the cookie.
          //maxAge: 1000, //Relative max age of the cookie from when the client receives it in seconds
          // domain: "https://play.bukinoshita.io", //Domain for the cookie
          // secure: true, //If set true it will only be accessible through https
          // httpOnly: true, //If set true it will only be accessible on the server
        });
        cookie.save("token", data.data.token, {
          path: "/",
          // expires,
          //maxAge: 1000,
          //domain: 'https://play.bukinoshita.io',
          //secure: true,
          //httpOnly: true,
        });
        history.push("/Monitor");
        setText("正在登录，请稍后");
      } else {
        setText("用户名或密码错误！");
        console.log(isAccess);
      }
    });
  }

  return (
    <Form className={classes.root}>
      <FormGroup>
        <Label>用户名</Label>
        <Input
          onChange={handleInputChange}
          type="username"
          name="username"
          placeholder="用户名"
          value={input.username}
        />
      </FormGroup>
      <FormGroup>
        <Label>密码</Label>
        <Input
          onChange={handleInputChange}
          type="password"
          name="password"
          placeholder="密码"
          value={input.password}
        />
      </FormGroup>
      <FormGroup>
        {isAccess ? (
          <FormText className={classes.text} color="muted">
            {text}
            <Spinner color="info" size="sm" />
          </FormText>
        ) : (
          <FormText className={classes.text} color="muted">
            {text}
          </FormText>
        )}
        <Button onClick={handleButtonClick} color="info" size="lg">
          登录
        </Button>
      </FormGroup>
    </Form>
  );
}

export default UserForm;
