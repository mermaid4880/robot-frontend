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
    marginLeft: "5px",
    marginTop: "30px",
  },
});

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
const Space = {
  width: 8,
  height: 8,
};

function RobotStatusRail() {
  const classes = useStyles();
  //———————————————————————————————————————————————useHistory
  const history = useHistory();
  //———————————————————————————————————————————————useState
  //本组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //机器人状态的实时信息
  const [robotStatus, setRobotStatus] = useState({
    robotFault: "正常", //机器人故障状态
    robotSpeed: "中", //机器人速度
    azimuth: "未知", //方位角度
    elevationLeft: "未知", //左俯仰角
    elevationRight: "未知", //右俯仰角
    liftHeight: "未知", //升降高度
    obstacleUpFront1: "否", //上前1避障状态
    obstacleUpFront2: "否", //上前2避障状态
    obstacleUpBack1: "否", //上后1避障状态
    obstacleUpBack2: "否", //上后2避障状态
    obstacleMiddleFront1: "否", //中前1避障状态
    obstacleMiddleBack1: "否", //中后1避障状态
    obstacleDown1: "否", //下1避障状态
    obstacleDown2: "否", //下2避障状态
    obstacleDown3: "否", //下3避障状态
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
    getData("/railRobot/status")
      .then((data) => {
        if (data.success) {
          //设置机器人状态
          setRobotStatus(data.data);
        } else {
          alert(data.detail);
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
          &nbsp;故障信息:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.robotFault}
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
          &nbsp;方位角度:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.azimuth}
        </Typography>
      </div>
      <div style={ItemContainerStyle}>
        <div style={DotStyle} />
        <Typography style={{ whiteSpace: "nowrap" }}>
          &nbsp;左俯仰角:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.elevationLeft}
        </Typography>
        <div style={Space} />
        <div style={DotStyle} />
        <Typography style={{ whiteSpace: "nowrap" }}>
          &nbsp;右俯仰角:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.elevationRight}
        </Typography>
      </div>
      <div style={ItemContainerStyle}>
        <div style={DotStyle} />
        <Typography style={{ whiteSpace: "nowrap" }}>
          &nbsp;升降高度:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.liftHeight}
        </Typography>
      </div>
      <div style={ItemContainerStyle}>
        <div style={DotStyle} />
        <Typography style={{ whiteSpace: "nowrap" }}>
          &nbsp;上前避障1:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.obstacleUpFront1}
        </Typography>
        <div style={Space} />
        <div style={DotStyle} />
        <Typography style={{ whiteSpace: "nowrap" }}>
          &nbsp;上前避障2:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.obstacleUpFront2}
        </Typography>
      </div>
      <div style={ItemContainerStyle}>
        <div style={DotStyle} />
        <Typography style={{ whiteSpace: "nowrap" }}>
          &nbsp;上后避障1:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.obstacleUpBack1}
        </Typography>
        <div style={Space} />
        <div style={DotStyle} />
        <Typography style={{ whiteSpace: "nowrap" }}>
          &nbsp;上后避障2:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.obstacleUpBack2}
        </Typography>
      </div>
      <div style={ItemContainerStyle}>
        <div style={DotStyle} />
        <Typography style={{ whiteSpace: "nowrap" }}>
          &nbsp;中前避障1:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.obstacleMiddleFront1}
        </Typography>
      </div>
      <div style={ItemContainerStyle}>
        <div style={DotStyle} />
        <Typography style={{ whiteSpace: "nowrap" }}>
          &nbsp;中后避障1:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.obstacleMiddleBack1}
        </Typography>
      </div>
      <div style={ItemContainerStyle}>
        <div style={DotStyle} />
        <Typography style={{ whiteSpace: "nowrap" }}>
          &nbsp;下避障1:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.obstacleDown1}
        </Typography>
        <div style={Space} />
        <div style={DotStyle} />
        <Typography style={{ whiteSpace: "nowrap" }}>
          &nbsp;下避障2:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.obstacleDown2}
        </Typography>
      </div>
      <div style={ItemContainerStyle}>
        <div style={DotStyle} />
        <Typography style={{ whiteSpace: "nowrap" }}>
          &nbsp;下避障3:&nbsp;
        </Typography>
        <Typography color="text" colorBrightness="secondary">
          &nbsp;{robotStatus.obstacleDown3}
        </Typography>
      </div>
    </div>
  );
}
export default RobotStatusRail;
