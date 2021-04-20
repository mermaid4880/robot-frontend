//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form } from "semantic-ui-react";
import swal from "sweetalert";
//functions
import { putData } from "../../../functions/requestDataFromAPI.js";

//———————————————————————————————————————————————全局函数
//初始化<Form>中所有默认数据（用户输入内容）
function initInput(data) {
  console.log("data", data);
  let newInput = {
    dbIp: data && data.dbIp ? data.dbIp : "",
    dbPort: data && data.dbPort ? data.dbPort : "",
    dbUserName: data && data.dbUserName ? data.dbUserName : "",
    mysqlPassWord: "",
    mysqlPassWord_: "",
  };
  return newInput;
}

function DataBaseConfigForm(props) {
  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //用户输入内容
  const [input, setInput] = useState(initInput());

  //———————————————————————————————————————————————useEffect
  useEffect(() => {
    setInput(initInput(props.data));
  }, [props.data]);

  //———————————————————————————————————————————————事件响应函数
  //<Form>中一般组件变化事件响应函数
  function handleChange(e, { value }, key) {
    console.log("value", value, "key", key);
    //设置用户输入内容
    setInput((prev) => {
      return { ...prev, [key]: value };
    });
  }
  //配置确认
  function ConfirmDataBaseConfig() {
    // 输入格式判断
    if (input.dbIp === "" || input.dbPort === "" || input.dbUserName === "") {
      //sweetalert失败
      swal({
        title: "修改数据库配置失败",
        text: "以上内容为必填消息，均不能为空",
        icon: "warning",
        timer: 3000,
        buttons: false,
      });
      return;
    } else {
      //密码验证
      if (input.mysqlPassWord !== input.mysqlPassWord_) {
        //sweetalert失败
        swal({
          title: "修改数据库配置失败",
          text: "前后密码不一致",
          icon: "warning",
          timer: 3000,
          buttons: false,
        });
        return;
      }
    }
    //————————————————————————————PUT请求
    let putParamData = new URLSearchParams();
    putParamData.append("robotId", props.data.robotId.toString());
    putParamData.append("dbIp", input.dbIp.toString());
    putParamData.append("dbPort", input.dbPort.toString());
    putParamData.append("dbUserName", input.dbUserName.toString());
    if (input.mysqlPassWord !== "") {
      putParamData.append("mysqlPassWord", input.mysqlPassWord.toString());
    }

    //发送PUT请求
    putData("/robots/robotupdate", putParamData)
      .then((data) => {
        console.log("post结果", data);
        if (data.success) {
          //sweetalert成功
          swal({
            title: "数据库配置成功",
            text: "                 ",
            icon: "success",
            timer: 3000,
            buttons: false,
          });
          //调用父组件函数（重新GET配置列表并刷新）
          props.updateParent();
        } else {
          //sweetalert失败
          swal({
            title: "数据库配置失败",
            text: data.detail,
            icon: "error",
            timer: 3000,
            buttons: false,
          });
        }
      })
      .catch((error) => {
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
        //sweetalert失败
        swal({
          title: "数据库配置失败",
          text: error.toString(),
          icon: "error",
          timer: 3000,
          buttons: false,
        });
      });
  }
  return (
    <Form>
      <Form.Input
        onChange={(e, { value }) => handleChange(e, { value }, "dbIp")}
        fluid
        label="数据库IP地址"
        placeholder="数据库IP地址"
        value={input.dbIp}
      />
      <Form.Input
        onChange={(e, { value }) => handleChange(e, { value }, "dbPort")}
        fluid
        label="数据库端口"
        placeholder="数据库端口"
        value={input.dbPort}
      />
      <Form.Input
        onChange={(e, { value }) => handleChange(e, { value }, "dbUserName")}
        fluid
        label="数据库用户名"
        placeholder="数据库用户名"
        value={input.dbUserName}
      />
      <Form.Input
        onChange={(e, { value }) => handleChange(e, { value }, "mysqlPassWord")}
        fluid
        label="数据库密码"
        placeholder="修改密码"
        type="password"
      />
      <Form.Input
        onChange={(e, { value }) =>
          handleChange(e, { value }, "mysqlPassWord_")
        }
        fluid
        label="数据库密码确认"
        placeholder="确认修改密码"
        type="password"
      />
      <Form.Button
        primary
        content="确认配置"
        onClick={() => ConfirmDataBaseConfig()}
      />
    </Form>
  );
}

export default DataBaseConfigForm;
