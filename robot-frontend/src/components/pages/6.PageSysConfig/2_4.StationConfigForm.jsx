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
    stationId: data && data.stationId ? data.stationId : "",
    stationName: data && data.stationName ? data.stationName : "",
  };
  return newInput;
}

function StationConfigForm(props) {
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
  function ConfirmStationConfig() {
    // 输入格式判断
    if (input.stationId === "" || input.stationName === "") {
      swal({
        title: "修改站所配置失败",
        text: "以上内容为必填消息，均不能为空",
        icon: "warning",
        timer: 3000,
        buttons: false,
      });
      return;
    }
    //————————————————————————————PUT请求
    let putParamData = new URLSearchParams();
    putParamData.append("robotId", props.data.robotId.toString());
    putParamData.append("stationId", input.stationId.toString());
    putParamData.append("stationName", input.stationName.toString());

    //发送PUT请求
    putData("/robots/robotupdate", putParamData).then((data) => {
      console.log("post结果", data);
      if (data.success) {
        //alert成功
        swal({
          title: "站所配置成功",
          text: "                 ",
          icon: "success",
          timer: 3000,
          buttons: false,
        });
        //调用父组件函数（重新GET配置列表并刷新）
        props.updateParent();
      } else {
        //alert失败
        swal({
          title: "站所配置失败",
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
      //alert失败
      swal({
        title: "站所配置失败",
        text: error.toString(),
        icon: "error",
        timer: 3000,
        buttons: false,
      });
    });;
  }
  return (
    <Form>
      <Form.Input
        onChange={(e, { value }) => handleChange(e, { value }, "stationId")}
        fluid
        label="站所ID"
        placeholder="站所ID"
        value={input.stationId}
      />
      <Form.Input
        onChange={(e, { value }) => handleChange(e, { value }, "stationName")}
        fluid
        label="站所名称"
        placeholder="站所名称"
        value={input.stationName}
      />
      <Form.Button
        primary
        content="确认配置"
        onClick={() => ConfirmStationConfig()}
      />
    </Form>
  );
}

export default StationConfigForm;
