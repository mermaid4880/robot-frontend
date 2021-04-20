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
    robotName: data && data.robotName ? data.robotName : "",
    robotIp: data && data.robotIp ? data.robotIp : "",
    robotType: data && data.robotType ? data.robotType : "",
    avoidanceBottom: data && data.avoidanceBottom ? data.avoidanceBottom : "",
    robotSpeed: data && data.robotSpeed ? data.robotSpeed : "",
    inspectionDataDir:
      data && data.inspectionDataDir ? data.inspectionDataDir : "",
    picModelDir: data && data.picModelDir ? data.picModelDir : "",
  };
  console.log("newInput", newInput);
  return newInput;
}

function RobotConfigForm(props) {
  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //用户输入内容
  const [input, setInput] = useState({});

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
  //配置确认函数
  function ConfirmRobotConfig() {
    // 输入格式判断
    if (
      input.robotName === "" ||
      input.robotIp === "" ||
      input.robotType === "" ||
      input.avoidanceBottom === "" ||
      input.robotSpeed === "" ||
      input.inspectionDataDir === "" ||
      input.picModelDir === ""
    ) {
      //sweetalert失败
      swal({
        title: "修改机器人配置失败",
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
    putParamData.append("robotName", input.robotName.toString());
    putParamData.append("robotIp", input.robotIp.toString());
    putParamData.append("avoidanceBottom", input.avoidanceBottom.toString());
    putParamData.append("robotSpeed", input.robotSpeed.toString());
    putParamData.append(
      "inspectionDataDir",
      input.inspectionDataDir.toString()
    );
    putParamData.append("picModelDir", input.picModelDir.toString());

    //发送PUT请求
    putData("/robots/robotupdate", putParamData)
      .then((data) => {
        console.log("post结果", data);
        if (data.success) {
          //sweetalert成功
          swal({
            title: "机器人配置成功",
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
            title: "机器人配置失败",
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
          title: "机器人配置失败",
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
        onChange={(e, { value }) => handleChange(e, { value }, "robotName")}
        fluid
        label="机器人名称"
        placeholder="机器人名称"
        value={input.robotName}
      />
      <Form.Input
        onChange={(e, { value }) => handleChange(e, { value }, "robotIp")}
        fluid
        label="机器人本体IP"
        placeholder="机器人本体IP"
        value={input.robotIp}
      />
      <Form.Group grouped>
        <label>机器人类型</label>
        <Form.Group inline>
          <Form.Radio
            label="室外机器人"
            value="室外机器人"
            checked={input.robotType === "室外机器人"}
            onChange={(e, { value }) => {
              handleChange(e, { value }, "robotType");
            }}
          />
          <Form.Radio
            label="室内挂轨道"
            value="室内挂轨道"
            checked={input.robotType === "室内挂轨道"}
            onChange={(e, { value }) => {
              handleChange(e, { value }, "robotType");
            }}
          />
        </Form.Group>
      </Form.Group>
      <Form.Group grouped>
        <label>下避障</label>
        <Form.Group inline>
          <Form.Radio
            label="开"
            value="开"
            checked={input.avoidanceBottom === "开"}
            onChange={(e, { value }) => {
              handleChange(e, { value }, "avoidanceBottom");
            }}
          />
          <Form.Radio
            label="关"
            value="关"
            checked={input.avoidanceBottom === "关"}
            onChange={(e, { value }) => {
              handleChange(e, { value }, "avoidanceBottom");
            }}
          />
        </Form.Group>
      </Form.Group>
      <Form.Group grouped>
        <label>机器人速度</label>
        <Form.Group inline>
          <Form.Radio
            label="快"
            value="快"
            checked={input.robotSpeed === "快"}
            onChange={(e, { value }) => {
              handleChange(e, { value }, "robotSpeed");
            }}
          />
          <Form.Radio
            label="中"
            value="中"
            checked={input.robotSpeed === "中"}
            onChange={(e, { value }) => {
              handleChange(e, { value }, "robotSpeed");
            }}
          />
          <Form.Radio
            label="慢"
            value="慢"
            checked={input.robotSpeed === "慢"}
            onChange={(e, { value }) => {
              handleChange(e, { value }, "robotSpeed");
            }}
          />
        </Form.Group>
      </Form.Group>
      <Form.Input
        onChange={(e, { value }) =>
          handleChange(e, { value }, "inspectionDataDir")
        }
        fluid
        label="巡检图片存储路径"
        placeholder="巡检图片存储路径"
        value={input.inspectionDataDir}
      />
      <Form.Input
        onChange={(e, { value }) => handleChange(e, { value }, "picModelDir")}
        fluid
        label="识别图片模板路径"
        placeholder="识别图片模板路径"
        value={input.picModelDir}
      />
      <Form.Button
        primary
        content="确认配置"
        onClick={() => ConfirmRobotConfig()}
      />
    </Form>
  );
}

export default RobotConfigForm;
