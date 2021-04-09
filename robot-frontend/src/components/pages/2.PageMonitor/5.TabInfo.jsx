//packages
import React, { useState, useEffect, useRef } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
} from "reactstrap";
import classnames from "classnames";
import { Paper, Switch } from "@material-ui/core";
import { Label, Segment } from "semantic-ui-react";
import { Alert } from "rsuite";
//functions
import {
  initWebsocket,
  destroyWebsocket,
} from "../../../functions/websockets.js";

//———————————————————————————————————————————————css
//root
const rootStyle = {
  marginLeft: "1.8rem",
  marginTop: "2px",
  height: 215,
  width: 1265,
};
//<Segment>
const segmentStyle = {
  padding: "2px",
  zIndex: 1000,
  height: "175px",
  overflow: "auto",
  // backgroundColor: "green"
};
//<pre>
const preStyle = {
  margin: "0px",
  // backgroundColor: "red"
};
//第一条信息
const firstMessageStyle = {
  padding: "7px 20px 7px 20px",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  overflow: "hidden",
  backgroundColor: "#cff1ef",
  fontFamily: "Arial,Microsoft YaHei,黑体,宋体,sans-serif",
};
//正常信息
const normalMessageStyle = {
  padding: "7px 20px 7px 20px",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  overflow: "hidden",
  backgroundColor: "#ffffff",
  fontFamily: "Arial,Microsoft YaHei,黑体,宋体,sans-serif",
};
//异常信息
const abnormalMessageStyle = {
  padding: "7px 20px 7px 20px",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  overflow: "hidden",
  backgroundColor: "#ffecc7",
  fontFamily: "Arial,Microsoft YaHei,黑体,宋体,sans-serif",
};
//系统告警信息
const systemAlarmMessageStyle = {
  padding: "7px 20px 7px 20px",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  overflow: "hidden",
  backgroundColor: "#fcdada",
  fontFamily: "Arial,Microsoft YaHei,黑体,宋体,sans-serif",
};
//实时信息——点位名称<div>
const span1Style = {
  float: "left",
  marginRight: "10px",
  width: "35%",
  height: "20px",
  whiteSpace: "normal",
  wordBreak: "break-all",
  overflow: "hidden",
  textAlign: "left",
};
//系统告警信息——告警信息<div>
const span2Style = {
  float: "left",
  marginRight: "10px",
  width: "60%",
  height: "20px",
  whiteSpace: "normal",
  wordBreak: "break-all",
  overflow: "hidden",
  textAlign: "left",
};
//实时信息和系统告警信息——其他一般<div>
const span3Style = {
  float: "left",
  marginRight: "10px",
  width: "15%",
  height: "20px",
  whiteSpace: "normal",
  wordBreak: "break-all",
  overflow: "hidden",
  textAlign: "left",
};

function TabTable() {
  //———————————————————————————————————————————————useRef
  const ws = useRef(null); //存放websocket对象的ref

  //———————————————————————————————————————————————useState
  //Tab中当前激活的<NavItem>标签的状态
  const [activeTab, setActiveTab] = useState("1");

  //实时信息Tab中内容的状态
  const [realtimeInfo, setRealtimeInfo] = useState({
    messageArray: [],
    messageCount: 0,
  });

  //系统告警信息Tab中内容的状态
  const [systemAlarmInfo, setSystemAlarmInfo] = useState({
    messageArray: [],
    messageCount: 0,
  });

  //软件调试信息Tab中内容的状态
  const [softwareInfo, setSoftwareInfo] = useState({
    messageArray: [],
    messageCount: 0,
  });

  //———————————————————————————————————————————————useEffect
  useEffect(() => {
    //————————————————————————————websocket
    //初始化websocket
    ws.current = initWebsocket("group2");
    //接收websocket消息
    recvWebsocketRecMsg(ws.current);

    //组件销毁时
    return () => {
      //————————————————————————————websocket
      //销毁websocket
      destroyWebsocket(ws.current, "group2");
    };
  }, []);

  //———————————————————————————————————————————————其他函数（websocket相关）
  //接收websocket消息（设置接收消息处理函数、设置接收消息异常处理）
  function recvWebsocketRecMsg(ws) {
    try {
      //——————设置接收消息处理函数
      ws.onmessage = function (event) {
        var msg = event.data;
        // console.log("接收到的websocket消息：", message);
        if (JSON.parse(msg.toString()).hasOwnProperty("detectInfo")) {
          // ws.current.send("received");
          let messageDetectInfo = JSON.parse(msg.toString()).detectInfo;
          // console.log("event", event.data.toString());
          messageDetectInfo &&
            addRealtimeInfoMessage(JSON.stringify(messageDetectInfo));
        }
        if (JSON.parse(msg.toString()).hasOwnProperty("systemAlarm")) {
          // ws.current.send("received");
          let messageSystemAlarm = JSON.parse(msg.toString()).systemAlarm;
          messageSystemAlarm &&
            addSystemAlarmInfoMessage(JSON.stringify(messageSystemAlarm));
        }
        if (JSON.parse(msg.toString()).hasOwnProperty("softwareInfo")) {
          // ws.current.send("received");
          let messageSoftwareInfo = JSON.parse(msg.toString()).softwareInfo;
          messageSoftwareInfo &&
            addSoftwareInfoMessage(JSON.stringify(messageSoftwareInfo));
        }
      };
    } catch (ex) {
      //——————设置接收消息异常处理
      //rsuite Alert异常：接收消息
      Alert.error("WebSocket接收消息异常！异常信息：" + ex.message, 0);
    }
  }

  //———————————————————————————————————————————————全局函数
  //将收到的一条string格式的websocket消息转换为<div>
  function parseMessageToDiv(stringData, index) {
    if (typeof stringData !== "string") {
      return;
    }

    try {
      let objectData = JSON.parse(stringData);

      let array = [];
      for (var key in objectData) {
        array.push({ key: key, value: objectData[key] });
      }

      if (stringData.indexOf("异常") > -1)
        //实时信息——异常信息
        return (
          <div key={index} style={abnormalMessageStyle}>
            {array.map((item, index) => {
              if (item.key === "设备名称")
                return (
                  <div style={span1Style}>{item.key + "：" + item.value}</div>
                );
              else
                return (
                  <div style={span3Style}>{item.key + "：" + item.value}</div>
                );
            })}
          </div>
        );
      else if (stringData.indexOf("告警") > -1)
        //系统告警信息——告警信息
        return (
          <div key={index} style={systemAlarmMessageStyle}>
            {array.map((item, index) => {
              if (item.key === "信息")
                return (
                  <div style={span2Style}>{item.key + "：" + item.value}</div>
                );
              else
                return (
                  <div style={span3Style}>{item.key + "：" + item.value}</div>
                );
            })}
          </div>
        );
      else if (index === 0)
        //实时信息——第一条信息
        return (
          <div key={index} style={firstMessageStyle}>
            {array.map((item, index) => {
              if (item.key === "设备名称")
                return (
                  <div style={span1Style}>{item.key + "：" + item.value}</div>
                );
              else
                return (
                  <div style={span3Style}>{item.key + "：" + item.value}</div>
                );
            })}
          </div>
        );
      //实时信息——正常信息
      else
        return (
          <div key={index} style={normalMessageStyle}>
            {array.map((item, index) => {
              if (item.key === "设备名称")
                return (
                  <div style={span1Style}>{item.key + "：" + item.value}</div>
                );
              else
                return (
                  <div style={span3Style}>{item.key + "：" + item.value}</div>
                );
            })}
          </div>
        );
    } catch (e) {
      console.log("parseMessageToDiv error：" + stringData + "!!!" + e);
      return;
    }
  }

  //———————————————————————————————————————————————事件响应函数
  //Tab中<NavItem>的点击事件响应函数（切换Tab）
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  //清空实时信息Tab中的内容
  function clearRealtimeInfoMessage() {
    setRealtimeInfo((prev) => ({ messageArray: [], messageCount: 0 }));
  }

  //添加一条信息到实时信息Tab中
  function addRealtimeInfoMessage(message) {
    // console.log("addRealtimeInfoMessage", typeof message);
    setRealtimeInfo((prev) => ({
      messageArray: [
        `${message}`,
        // `${new Date().toLocaleTimeString()}: ${message}`,
        ...prev.messageArray,
      ].slice(0, 50),
      messageCount: prev.messageCount + 1,
    }));
  }

  //清空系统告警信息Tab中的内容
  function clearSystemAlarmInfoMessage() {
    setSystemAlarmInfo((prev) => ({ messageArray: [], messageCount: 0 }));
  }

  //添加一条信息到系统告警信息Tab中
  function addSystemAlarmInfoMessage(message) {
    // console.log("addSystemAlarmInfoMessage", typeof message);
    setSystemAlarmInfo((prev) => ({
      messageArray: [
        `${message}`,
        // `${new Date().toLocaleTimeString()}: ${message}`,
        ...prev.messageArray,
      ].slice(0, 50),
      messageCount: prev.messageCount + 1,
    }));
  }

  //清空软件调试信息Tab中的内容
  function clearSoftwareInfoMessage() {
    setSoftwareInfo((prev) => ({ messageArray: [], messageCount: 0 }));
  }

  //添加一条信息到软件调试信息Tab中
  function addSoftwareInfoMessage(message) {
    // console.log("addSoftwareInfoMessage", typeof message);
    setSoftwareInfo((prev) => ({
      messageArray: [
        `${message}`,
        // `${new Date().toLocaleTimeString()}: ${message}`,
        ...prev.messageArray,
      ].slice(0, 50),
      messageCount: prev.messageCount + 1,
    }));
  }

  return (
    <Paper style={rootStyle} elevation="10">
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => {
              toggleTab("1");
            }}
          >
            实时信息{" "}
            <Label circular>
              {realtimeInfo.messageCount > 99
                ? "99+"
                : realtimeInfo.messageCount}
            </Label>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => {
              toggleTab("2");
            }}
          >
            系统告警信息
            <Label circular color={systemAlarmInfo.messageCount && "orange"}>
              {systemAlarmInfo.messageCount > 99
                ? "99+"
                : systemAlarmInfo.messageCount}
            </Label>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "3" })}
            onClick={() => {
              toggleTab("3");
            }}
          >
            软件调试信息{" "}
            <Label circular>
              {softwareInfo.messageCount > 99
                ? "99+"
                : softwareInfo.messageCount}
            </Label>
          </NavLink>
        </NavItem>
        <NavItem style={{ marginLeft: "750px" }}>
          <NavLink
            onClick={() => {
              switch (activeTab) {
                case "1":
                  clearRealtimeInfoMessage();
                  break;
                case "2":
                  clearSystemAlarmInfoMessage();
                  break;
                case "3":
                  clearSoftwareInfoMessage();
                  break;
                default:
                  break;
              }
            }}
          >
            清空窗口
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <Segment secondary style={segmentStyle}>
                <pre style={preStyle}>
                  {realtimeInfo.messageArray.map(
                    (e, i) => parseMessageToDiv(e, i) //将每条string格式的websocket消息转换为<div>
                  )}
                </pre>
              </Segment>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col sm="12">
              <Segment secondary style={segmentStyle}>
                <pre style={preStyle}>
                  {systemAlarmInfo.messageArray.map(
                    (e, i) => parseMessageToDiv(e, i) //将每条string格式的websocket消息转换为<div>
                  )}
                </pre>
              </Segment>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="3">
          <Row>
            <Col sm="12">
              <Segment secondary style={segmentStyle}>
                <pre style={preStyle}>
                  {softwareInfo.messageArray.map(
                    (e, i) => parseMessageToDiv(e, i) //将每条string格式的websocket消息转换为<div>
                  )}
                </pre>
              </Segment>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </Paper>
  );
}

export default TabTable;
