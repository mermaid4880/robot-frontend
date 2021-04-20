// （轮式）（轮询）
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { Alert } from "rsuite";
//functions
import { getData } from "../../../functions/requestDataFromAPI.js";

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
  //———————————————————————————————————————————————useHistory
  const history = useHistory();
  //———————————————————————————————————————————————useState
  //本组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //机器人状态的实时信息
  const [robotStatus, setRobotStatus] = useState({
    doorState: "未知", //充电房门状态
    robotFault: "未知", //机器人故障信息
    speed: "未知", //机器人速度
  });

  //———————————————————————————————————————————————Timer
  //开启定时器（重新获取当前机器人状态的实时信息、刷新组件）
  var timerID = setTimeout(() => {
    setUpdate(!update);
  }, 1500);

  //———————————————————————————————————————————————useEffect
  //当（本组件销毁时），销毁定时器（重新获取当前机器人状态的实时信息、刷新组件）
  useEffect(() => {
    //当组件销毁时，销毁定时器（重新获取当前机器人状态的实时信息、刷新组件）
    return () => {
      clearTimeout(timerID);
    };
  }, []);

  //当（本组件加载完成或需要更新时），GET请求获取当前机器人状态的实时信息
  useEffect(() => {
    //————————————————————————————GET请求
    getData("robots/robotStatusSimple")
      .then((data) => {
        // console.log("get结果", data);
        if (data.success) {
          //设置机器人状态
          setRobotStatus(data.data);
        } else {
          //rsuite Alert异常信息
          Alert.warning(
            "获取当前机器人状态的实时信息（简）异常！异常信息：" + data.detail,
            2000
          );
        }
      })
      .catch((error) => {
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
      });
  }, [update]);

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
