// （轮式）（Websocket）
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
import { Alert } from "rsuite";
import classnames from "classnames";
import { Typography, Card, CardContent } from "@material-ui/core";
import { Label, List, Grid } from "semantic-ui-react";
//functions
import {
  initWebsocket,
  destroyWebsocket,
} from "../../../functions/websockets.js";

//———————————————————————————————————————————————css
const root = {
  height: "420px",
  width: "100%",
  marginLeft: "0.5rem",
  marginTop: "0.5rem",
  marginRight: "1rem",
};

const label = {
  fontSize: 14,
};

const blankRow = {
  height: "15px",
};

const gridStyle = {
  margin: "0.5rem 0 0 1rem",
  height: "270px",
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
  width: "135px",
  display: "inline-block",
  verticalAlign: "top",
};
//每条信息的内容
const contentStyle = {
  paddingTop: "0.3rem",
  display: "inline-block",
  verticalAlign: "center",
};

function SysStatus() {
  //———————————————————————————————————————————————useRef
  const ws = useRef(null); //存放websocket对象的ref

  //———————————————————————————————————————————————useState
  //Tab中当前激活的<NavItem>标签的状态
  const [activeTab, setActiveTab] = useState("1");
  //系统状态栏内容的状态
  const [systemStatus, setSystemStatus] = useState({});
  //———————————————————————————————————————————————useEffect
  useEffect(() => {
    //————————————————————————————websocket
    //初始化websocket
    ws.current = initWebsocket("group3");
    //接收websocket消息
    recvWebsocketRecMsg(ws.current);
    //组件销毁时断开websocket连接
    return () => {
      //————————————————————————————websocket
      //销毁websocket
      destroyWebsocket(ws.current, "group3");
    };
  }, []);

  //———————————————————————————————————————————————其他函数（websocket相关）
  //接收websocket消息（设置接收消息处理函数、设置接收消息异常处理）
  function recvWebsocketRecMsg(ws) {
    try {
      //——————设置接收消息处理函数
      ws.onmessage = function (event) {
        var strMsg = event.data; //例如："{"softwareInfo": {"time": "2021-3-25 16:36:44", "detail": "\u8f6f\u4ef6\u8c03\u8bd5"}}"
        var objMsg = JSON.parse(strMsg.toString()); //例如：{"softwareInfo": {"time": "2021-3-25 16:36:44", "detail": "\u8f6f\u4ef6\u8c03\u8bd5"}}
        // console.log("接收到的websocket消息字符串：", strMsg, "  接收到的websocket消息JSON对象：", objMsg);

        // （Websocket group3）1_1. 机器人状态（详）（轮式）
        if (objMsg.hasOwnProperty("robotStatus")) {
          setSystemStatus(objMsg.robotStatus);
        }
      };
    } catch (ex) {
      //——————设置接收消息异常处理
      //rsuite Alert异常：接收消息
      Alert.error("WebSocket接收消息异常！异常信息：" + ex.message, 0);
    }
  }

  //———————————————————————————————————————————————事件响应函数
  //Tab中<NavItem>的点击事件响应函数（切换Tab）
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <Card style={root} raised>
      <CardContent>
        <Typography style={label} color="textSecondary">
          <Label color="teal" ribbon>
            系统状态
          </Label>
          <Row style={blankRow}></Row>
        </Typography>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => {
                toggle("1");
              }}
            >
              机器人状态
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => {
                toggle("2");
              }}
            >
              云台状态
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <Grid style={gridStyle} columns={4} divided>
                  <Grid.Row stretched>
                    <Grid.Column>
                      <List divided>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            电量
                          </Label>
                          <div style={contentStyle}>{systemStatus.battery}</div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            充电状态
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.chargeStatus}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            网络状态
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.netWorkStatus}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            控制模式
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.ctrlMode}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            机器人状态
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.robotCurStatus}
                          </div>
                        </List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column>
                      <List divided>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            位置坐标X
                          </Label>
                          <div style={contentStyle}>{systemStatus.X}</div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            位置坐标Y
                          </Label>
                          <div style={contentStyle}>{systemStatus.Y}</div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            高度
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.liftHeight}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            角度
                          </Label>
                          <div style={contentStyle}>{systemStatus.angle}</div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            补光灯状态
                          </Label>
                          <div style={contentStyle}>{systemStatus.light}</div>
                        </List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column>
                      <List divided>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            电压
                          </Label>
                          <div style={contentStyle}>{systemStatus.voltage}</div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            避障状态
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.obstacle}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            温度
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.temperature}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            左速度
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.leftVelocity}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            右速度
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.rightVelocity}
                          </div>
                        </List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column>
                      <List divided>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            机器人速度
                          </Label>
                          <div style={contentStyle}>{systemStatus.speed}</div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            机器人速度模式
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.speedMode}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            任务状态
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.taskStatus}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            机器人ID
                          </Label>
                          <div style={contentStyle}>{systemStatus.robotId}</div>
                        </List.Item>
                      </List>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <Grid style={gridStyle} columns={3} divided>
                  <Grid.Row stretched>
                    <Grid.Column>
                      <List divided>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            云台状态
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.ptzStatus}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            云台方位
                          </Label>
                          <div style={contentStyle}>{systemStatus.ptzPan}</div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            云台俯仰
                          </Label>
                          <div style={contentStyle}>{systemStatus.ptzTilt}</div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            左臂角度
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.leftUdangle}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            右臂角度
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.rightUdangle}
                          </div>
                        </List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column>
                      <List divided>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            可见光相机状态
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.vlCameraStatus}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            红外相机状态
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.infraredCameraStatus}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            相机变倍值
                          </Label>
                          <div style={contentStyle}>{systemStatus.zoomPos}</div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            相机焦距值
                          </Label>
                          <div style={contentStyle}>{systemStatus.focus}</div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            局放状态
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.pdStatus}
                          </div>
                        </List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column>
                      <List divided>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            激光雷达状态
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.liDarStatus}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            电池状态
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.batteryStatus}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            IMU状态
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.IMUStatus}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            驱动状态
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.driverStatus}
                          </div>
                        </List.Item>
                      </List>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </CardContent>
    </Card>
  );
}

export default SysStatus;
