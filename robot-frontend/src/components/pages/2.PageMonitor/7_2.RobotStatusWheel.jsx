import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@material-ui/core";
import { Alert } from "rsuite";
//functions
import {
  initWebsocket,
  destroyWebsocket,
} from "../../../functions/websockets.js";
//———————————————————————————————————————————————css
//root
const rootStyle = {
  marginTop: "70px",
  marginLeft: "100px",
  width: "250px",
  overflow: "hidden",
};
//每条状态数据的展示区域
const itemContainerStyle = {
  width: "270px",
  height: "30px",
  paddingBottom: "0.1rem",
  display: "flex",
  overflow: "hidden",
  alignItems: "center",
};
//每条状态数据前的点点
const dotStyle = {
  width: 8,
  height: 8,
  backgroundColor: "#99d8d0",
  borderRadius: "50%",
};

function RobotStatusWheel() {
  //———————————————————————————————————————————————useRef
  const ws = useRef(null); //存放websocket对象的ref

  //———————————————————————————————————————————————useState
  //机器人状态的实时信息
  const [robotStatus, setRobotStatus] = useState({
    doorState: "未知", //充电房门状态
    robotFault: "未知", //机器人故障信息
    speed: "未知", //机器人速度
  });

  //当（本组件加载完成或需要更新时），GET请求获取当前机器人状态的实时信息
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
        if (JSON.parse(msg.toString()).hasOwnProperty("robotStatusSimple")) {
          // ws.current.send("received");
          let messageRobotStatus = JSON.parse(msg.toString()).robotStatusSimple;
          setRobotStatus(messageRobotStatus);
        }
      };
    } catch (ex) {
      //——————设置接收消息异常处理
      //rsuite Alert异常：接收消息
      Alert.error("WebSocket接收消息异常！异常信息：" + ex.message, 0);
    }
  }

  //获取相应的机器人状态组件（根据状态名称和状态值）
  function getStatusDiv(statusKey, statusValue) {
    return (
      <div style={itemContainerStyle}>
        <div style={dotStyle} />
        <Typography style={{ whiteSpace: "nowrap" }}>
          &nbsp;{statusKey}&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{statusValue}
        </Typography>
      </div>
    );
  }

  return (
    <div style={rootStyle}>
      {getStatusDiv("充电房门状态：", robotStatus.doorState)}
      {getStatusDiv("机器人速度：", robotStatus.speed)}
      {getStatusDiv("机器人故障信息：", robotStatus.robotFault)}
    </div>
  );
}

export default RobotStatusWheel;
