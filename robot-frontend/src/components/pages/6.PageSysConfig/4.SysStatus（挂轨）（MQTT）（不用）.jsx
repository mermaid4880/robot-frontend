// （挂轨）（MQTT）
//configuration
import { mqttUrl } from "../../../configuration/config.js";
//packages
import React, { useState, useEffect } from "react";
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
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardContent } from "@material-ui/core";
import { Label, List, Grid } from "semantic-ui-react";
import connect from "mqtt"; //mqtt

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    height: "420px",
    width: "100%",
    marginLeft: "0.5rem",
    marginTop: "0.5rem",
    marginRight: "1rem",
  },
  label: {
    fontSize: 14,
  },
  blankRow: {
    height: "15px",
  },
  taskList: {
    height: "515px",
  },
}));
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
  const classes = useStyles();
  //———————————————————————————————————————————————useState
  //Tab中当前激活的<NavItem>标签的状态
  const [activeTab, setActiveTab] = useState("1");
  //系统状态栏内容的状态
  const [systemStatus, setSystemStatus] = useState({});

  //———————————————————————————————————————————————useEffect
  useEffect(() => {
    //创建mqtt连接
    const client = connect(mqttUrl);
    //订阅主题
    client.on("connect", function () {
      client.subscribe("robotStatus", function (err) {
        if (!err) {
          //client.publish("robotStatus", "Hello mqtt");
        }
      });
    });
    //处理mqtt消息
    client.on("message", function (topic, message) {
      // console.log("message", message.toString());
      let json = JSON.parse(message.toString());
      setSystemStatus(json);
      //console.log((new Date()).valueOf());
    });

    //组件销毁时取消主题订阅并关闭mqtt连接
    return () => {
      client.unsubscribe("robotStatus");
      client.end();
    };
  }, []);

  //———————————————————————————————————————————————事件响应函数
  //Tab中<NavItem>的点击事件响应函数（切换Tab）
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <Card className={classes.root} raised>
      <CardContent>
        <Typography className={classes.label} color="textSecondary">
          <Label color="teal" ribbon>
            系统状态
          </Label>
          <Row className={classes.blankRow}></Row>
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
              <Col sm="12" className={classes.row}>
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
                            真实坐标点
                          </Label>
                          <div style={contentStyle}>{systemStatus.realNum}</div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            真实偏移
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.realPose}
                          </div>
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
                            开灯关灯状态
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
                            左侧障碍物
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.coreLeftObstacleFlag}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            右侧障碍物
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.coreRightObstacleFlag}
                          </div>
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          <Label style={labelStyle} horizontal>
                            下方障碍物
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.coreBelowObstacleFlag}
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
                            任务模式
                          </Label>
                          <div style={contentStyle}>
                            {systemStatus.taskWorkMode}
                          </div>
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
              <Col sm="12" className={classes.row}>
                <Grid style={gridStyle} columns={2} divided>
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
                          <div style={contentStyle}>{systemStatus.zoomVal}</div>
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
