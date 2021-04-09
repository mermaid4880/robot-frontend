import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardContent } from "@material-ui/core";
//functions
import { getData, postData } from "../../../functions/requestDataFromAPI.js";

const useStyles = makeStyles({
  root: {
    width: "250px",
    overflow: "hidden",
    marginLeft: "100px",
    marginTop: "70px",
  },
});

//标题的展示区域
const TitleAreaStyle = {
  position: "relative",
  display: "flex",
  width: "700px",
  margin: "18px 0px 0px 0px",
  padding: "10px 0px 5px 0px",
  verticalAlign: "center",
};
//每条标题的展示区域
const TitleContainerStyle = {
  width: "600px",
  height: "30px",
  paddingBottom: "0.1rem",
  display: "flex",
  overflow: "hidden",
  alignItems: "center",
};
//百分比数据的展示区域
const ItemsAreaStyle = {
  position: "relative",
  display: "flex",
  width: "600px",
  margin: "48px 0px 0px 0px",
  padding: "10px 0px 5px 0px",
  verticalAlign: "center",
};
//每条百分比数据的展示区域
const ItemContainerStyle = {
  width: "270px",
  height: "30px",
  paddingBottom: "0.1rem",
  display: "flex",
  overflow: "hidden",
  alignItems: "center",
};
const DotStyle = {
  width: 8,
  height: 8,
  backgroundColor: "#99d8d0",
  borderRadius: "50%",
};

function RobotStatus() {
  const classes = useStyles();
  //———————————————————————————————————————————————useHistory
  const history = useHistory();
  //———————————————————————————————————————————————useState
  //本组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //机器人状态的实时信息
  const [robotStatus, setRobotStatus] = useState({
    doorState: "未知", //充电房门状态
    robotFault: "未知", //机器人故障信息
    robotSpeed: "未知", //机器人速度
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
    getData("control/door/state")
      .then((data) => {
        // console.log("get结果", data);
        if (data.success) {
          //设置机器人状态中的doorState
          setRobotStatus((prev) => {
            return { ...prev, doorState: data.data };
          });
        } else {
          // alert(data.detail);
        }
      })
      .catch((error) => {
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
      });
      getData("robots/status")
      .then((data) => {
        if (data.success) {
          //设置机器人状态
          setRobotStatus((prev) => {
            return { ...prev, robotSpeed: data.data.robotVelocity };
          });
        } else {
          // alert(data.detail);
        }
      })
      .catch((error) => {
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
      });
  }, [update]);

  return (
    <div className={classes.root}>
      <div style={ItemContainerStyle}>
        <div style={DotStyle} />
        <Typography style={{ whiteSpace: "nowrap" }}>
          &nbsp;充电房门状态:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.doorState}
        </Typography>
      </div>
      <div style={ItemContainerStyle}>
        <div style={DotStyle} />
        <Typography style={{ whiteSpace: "nowrap" }}>
          &nbsp;机器人速度:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.robotSpeed}
        </Typography>
      </div>
      <div style={ItemContainerStyle}>
        <div style={DotStyle} />
        <Typography style={{ whiteSpace: "nowrap" }}>
          &nbsp;机器人故障信息:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.robotFault}
        </Typography>
      </div>
    </div>
  );
}
export default RobotStatus;
