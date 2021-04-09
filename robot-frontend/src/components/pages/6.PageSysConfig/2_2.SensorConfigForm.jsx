//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Label, List, Grid, Form } from "semantic-ui-react";
import swal from "sweetalert";
//functions
import { putData } from "../../../functions/requestDataFromAPI.js";

//———————————————————————————————————————————————css
const gridStyle = {
  margin: "0 0 0 1rem",
  height: "700px",
  overflow: "auto",
};
//每条信息
const listItemStyle = {
  padding: "10px 0px 5px 5px",
  whiteSpace: "normal",
  wordBreak: "break-all",
  overflow: "hidden",
};
//每条信息的标题
const labelStyle = {
  fontSize: "1.1rem",
  width: "110px",
  display: "inline-block",
  verticalAlign: "top",
  margin: "0 0 10px 0",
};
//每条信息的内容
const contentStyle = {
  width: "310px",
  paddingTop: "0.3rem",
  display: "inline-block",
  verticalAlign: "center",
};

//———————————————————————————————————————————————全局函数
//初始化<Form>中所有默认数据（用户输入内容）
function initInput(data) {
  console.log("data", data);
  let newInput = {
    vlIp: data && data.vlIp ? data.vlIp : "",
    vlPort: data && data.vlPort ? data.vlPort : "",
    vlUserName: data && data.vlUserName ? data.vlUserName : "",
    vlPassWord: "",
    vlPassWord_: "",
    vlFocusMode: data && data.vlFocusMode ? data.vlFocusMode : "",
    irIp: data && data.irIp ? data.irIp : "",
    irPort: data && data.irPort ? data.irPort : "",
    irUserName: data && data.irUserName ? data.irUserName : "",
    irPassWord: "",
    irPassWord_: "",
    pdIp: data && data.pdIp ? data.pdIp : "",
    pdPort: data && data.pdPort ? data.pdPort : "",
  };
  // console.log("newInput", newInput);
  return newInput;
}

function SensorConfigForm(props) {
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
  //配置确认
  function ConfirmSensorConfig(type) {
    switch (type) {
      case "vl": {
        // 输入格式判断
        if (
          input.vlIp === "" ||
          input.vlPort === "" ||
          input.vlUserName === "" ||
          input.vlFocusMode === ""
        ) {
          swal({
            title: "修改可见光配置失败",
            text: "以上内容为必填消息，均不能为空",
            icon: "warning",
            timer: 3000,
            buttons: false,
          });
          return;
        } else {
          //密码验证
          if (input.vlPassWord !== input.vlPassWord_) {
            swal({
              title: "修改可见光配置失败",
              text: "前后密码不一致",
              icon: "warning",
              timer: 3000,
              buttons: false,
            });
            return;
          }
        }
        //————————————————————————————PUT请求
        let vlPutParamData = new URLSearchParams();
        vlPutParamData.append("robotId", props.data.robotId.toString());
        vlPutParamData.append("vlIp", input.vlIp.toString());
        vlPutParamData.append("vlPort", input.vlPort.toString());
        vlPutParamData.append("vlUserName", input.vlUserName.toString());
        if (input.vlPassWord !== "") {
          vlPutParamData.append("vlPassWord", input.vlPassWord.toString());
        }
        vlPutParamData.append("vlFocusMode", input.vlFocusMode.toString());

        //发送PUT请求
        putData("/robots/robotupdate", vlPutParamData)
          .then((data) => {
            console.log("post结果", data);
            if (data.success) {
              //alert成功
              swal({
                title: "可见光配置成功",
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
                title: "可见光配置失败",
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
              title: "可见光配置失败",
              text: error.toString(),
              icon: "error",
              timer: 3000,
              buttons: false,
            });
          });
        break;
      }
      case "ir": {
        // 输入格式判断
        if (
          input.irIp === "" ||
          input.irPort === "" ||
          input.irUserName === ""
        ) {
          swal({
            title: "修改红外配置失败",
            text: "以上内容为必填消息，均不能为空",
            icon: "warning",
            timer: 3000,
            buttons: false,
          });
          return;
        } else {
          //密码验证
          if (input.irPassWord !== input.irPassWord_) {
            swal({
              title: "修改红外配置失败",
              text: "前后密码不一致",
              icon: "warning",
              timer: 3000,
              buttons: false,
            });
            return;
          }
        }
        //————————————————————————————PUT请求
        let irPutParamData = new URLSearchParams();
        irPutParamData.append("robotId", props.data.robotId.toString());
        irPutParamData.append("irIp", input.irIp.toString());
        irPutParamData.append("irPort", input.irPort.toString());
        irPutParamData.append("irUserName", input.irUserName.toString());
        if (input.vlPassWord !== "") {
          irPutParamData.append("irPassWord", input.irPassWord.toString());
        }

        //发送PUT请求
        putData("/robots/robotupdate", irPutParamData)
          .then((data) => {
            console.log("post结果", data);
            if (data.success) {
              //alert成功
              swal({
                title: "红外配置成功",
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
                title: "红外配置失败",
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
              title: "红外配置失败",
              text: error.toString(),
              icon: "error",
              timer: 3000,
              buttons: false,
            });
          });
        break;
      }
      case "pd": {
        // 输入格式判断
        if (input.pdIp === "" || input.pdPort === "") {
          swal({
            title: "修改局放配置失败",
            text: "以上内容为必填消息，均不能为空",
            icon: "warning",
            timer: 3000,
            buttons: false,
          });
          return;
        }
        //————————————————————————————PUT请求
        let irPutParamData = new URLSearchParams();
        irPutParamData.append("robotId", props.data.robotId.toString());
        irPutParamData.append("pdIp", input.pdIp.toString());
        irPutParamData.append("pdPort", input.pdPort.toString());

        //发送PUT请求
        putData("/robots/robotupdate", irPutParamData)
          .then((data) => {
            console.log("post结果", data);
            if (data.success) {
              //alert成功
              swal({
                title: "局放配置成功",
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
                title: "局放配置失败",
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
              title: "局放配置失败",
              text: error.toString(),
              icon: "error",
              timer: 3000,
              buttons: false,
            });
          });
        break;
      }
      default:
        break;
    }
  }
  return (
    <Grid style={gridStyle} columns={2} divided>
      <Grid.Row stretched>
        <Grid.Column>
          <List divided>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                可见光相机
              </Label>
              <Form>
                <Form.Input
                  size="mini"
                  onChange={(e, { value }) =>
                    handleChange(e, { value }, "vlIp")
                  }
                  fluid
                  label="IP地址"
                  placeholder="IP地址"
                  value={input.vlIp}
                />
                <Form.Input
                  size="mini"
                  onChange={(e, { value }) =>
                    handleChange(e, { value }, "vlPort")
                  }
                  fluid
                  label="端口号"
                  placeholder="端口号"
                  value={input.vlPort}
                />
                <Form.Input
                  size="mini"
                  onChange={(e, { value }) =>
                    handleChange(e, { value }, "vlUserName")
                  }
                  fluid
                  label="用户名"
                  placeholder="用户名"
                  value={input.vlUserName}
                />
                <Form.Input
                  size="mini"
                  onChange={(e, { value }) =>
                    handleChange(e, { value }, "vlPassWord")
                  }
                  fluid
                  label="密码"
                  placeholder="修改密码"
                  type="password"
                />
                <Form.Input
                  size="mini"
                  onChange={(e, { value }) =>
                    handleChange(e, { value }, "vlPassWord_")
                  }
                  fluid
                  label="确认密码"
                  placeholder="确认修改密码"
                  type="password"
                />
                <Form.Group grouped>
                  <label>对焦模式</label>
                  <Form.Group inline>
                    <Form.Radio
                      label="手动"
                      value="手动"
                      checked={input.vlFocusMode === "手动"}
                      onChange={(e, { value }) => {
                        handleChange(e, { value }, "vlFocusMode");
                      }}
                    />
                    <Form.Radio
                      label="自动"
                      value="自动"
                      checked={input.vlFocusMode === "自动"}
                      onChange={(e, { value }) => {
                        handleChange(e, { value }, "vlFocusMode");
                      }}
                      inline
                    />
                  </Form.Group>
                </Form.Group>
                <Form.Button
                  size="mini"
                  primary
                  content="确认配置"
                  onClick={() => ConfirmSensorConfig("vl")}
                />
              </Form>
            </List.Item>
          </List>
        </Grid.Column>
        <Grid.Column>
          <List divided>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                红外相机
              </Label>
              <Form>
                <Form.Input
                  size="mini"
                  onChange={(e, { value }) =>
                    handleChange(e, { value }, "irIp")
                  }
                  fluid
                  label="IP地址"
                  placeholder="IP地址"
                  value={input.irIp}
                />
                <Form.Input
                  size="mini"
                  onChange={(e, { value }) =>
                    handleChange(e, { value }, "irPort")
                  }
                  fluid
                  label="端口号"
                  placeholder="端口号"
                  value={input.irPort}
                />
                <Form.Input
                  size="mini"
                  onChange={(e, { value }) =>
                    handleChange(e, { value }, "irUserName")
                  }
                  fluid
                  label="用户名"
                  placeholder="用户名"
                  value={input.irUserName}
                />
                <Form.Input
                  size="mini"
                  onChange={(e, { value }) =>
                    handleChange(e, { value }, "irPassWord")
                  }
                  fluid
                  label="密码"
                  placeholder="修改密码"
                  type="password"
                />
                <Form.Input
                  size="mini"
                  onChange={(e, { value }) =>
                    handleChange(e, { value }, "irPassWord_")
                  }
                  fluid
                  label="确认修改密码"
                  placeholder="确认修改密码"
                  type="password"
                />
                <Form.Button
                  size="mini"
                  primary
                  content="确认配置"
                  onClick={() => ConfirmSensorConfig("ir")}
                />
              </Form>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                局放
              </Label>
              <Form>
                <Form.Input
                  size="mini"
                  onChange={(e, { value }) =>
                    handleChange(e, { value }, "pdIp")
                  }
                  fluid
                  label="IP地址"
                  placeholder="IP地址"
                  value={input.pdIp}
                />
                <Form.Input
                  size="mini"
                  onChange={(e, { value }) =>
                    handleChange(e, { value }, "pdPort")
                  }
                  fluid
                  label="端口号"
                  placeholder="端口号"
                  value={input.pdPort}
                />
                <Form.Button
                  size="mini"
                  primary
                  content="确认配置"
                  onClick={() => ConfirmSensorConfig("pd")}
                />
              </Form>
            </List.Item>
          </List>
          <List divided></List>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default SensorConfigForm;
