//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Form } from "semantic-ui-react";
import swal from "sweetalert";
import { Typography, Card, CardContent } from "@material-ui/core";
import { Label, Modal, Button } from "semantic-ui-react";
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
//functions
import { getData, postData } from "../../../functions/requestDataFromAPI.js";
//variables
//import { userID } from "../../pages/1.PageLogin/1.UserForm.jsx";
//elements
import RobotConfigForm from "./2_1.RobotConfigForm.jsx";
import SensorConfigForm from "./2_2.SensorConfigForm.jsx";
import DataBaseConfigForm from "./2_3.DataBaseConfigForm.jsx";
import StationConfigForm from "./2_4.StationConfigForm.jsx";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "850px",
    marginLeft: "1.8rem",
  },
  modal: {
    width: "100%",
    height: "185px",
  },
  icon: {
    margin: "5px 6px 0px 0px",
  },
  robot: {
    width: "100%",
    height: "840px",
    marginLeft: "1rem",
  },
  user: {
    height: "425px",
  },
  video: {
    height: "425px",
  },
  label: {
    fontSize: 14,
  },
  blankRow: {
    height: "15px",
  },
}));

var curRobotConfig;
var curSensorConfig;
var curDataBaseConfig;
var curStationConfig;

function SysConfig() {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //Tab中当前激活的<NavItem>标签的状态
  const [activeTab, setActiveTab] = useState("1");
  //机器人选择框选项状态
  const [robotOptions, setRobotOptions] = useState([]);
  //机器人是否变更
  const [robotChange, setRobotChange] = useState("0");
  //成功选中的机器人的状态
  const [robotSelected, setRobotSelected] = useState("");
  //select标签选中的值的状态
  const [selectValue, setSelectValue] = useState("");

  //传给4个子组件的配置信息
  const [robotConfig, setRobotConfig] = useState({});
  const [sensorConfig, setSensorConfig] = useState({});
  const [dataBaseConfig, setDataBaseConfig] = useState({});
  const [stationConfig, setStationConfig] = useState({});
  //delete modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  //———————————————————————————————————————————————事件响应函数

  //<Form>中机器人选择组件变化事件响应函数
  function RobotSelecthandleChange(value) {
    //————————————————————————————POST请求
    let postParamData = new URLSearchParams();
    setModalOpen(false);
    postParamData.append("robotId", value.toString());
    console.log("post", postParamData);
    //发送POST请求
    postData("/robots", postParamData)
      .then((data) => {
        console.log("post结果", data);
        if (data.success) {
          //sweetalert成功
          swal({
            title: "机器人选择成功",
            text: "                 ",
            icon: "success",
            timer: 3000,
            buttons: false,
          });
          setRobotChange(!robotChange);
        } else {
          //sweetalert失败
          swal({
            title: "机器人选择失败",
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
      });
  }

  //———————————————————————————————————————————————useEffect
  useEffect(() => {
    let options = [];
    //————————————————————————————GET请求：装载机器人列表&获取当前机器人&获取机器人配置
    getData("/robots/robotconfiglist")
      .then((data) => {
        console.log("get2", data);
        if (data.success) {
          for (let index = 0; index < data.data.robotList.length; index++) {
            options.push({
              value: data.data.robotList[index].robotId,
              text: data.data.robotList[index].robotName,
            });
            if (data.data.robotList[index].robotId === data.data.curId) {
              curRobotConfig = {
                robotId: data.data.robotList[index].robotId,
                robotName: data.data.robotList[index].robotName,
                robotIp: data.data.robotList[index].robotIp,
                robotType: data.data.robotList[index].robotType,
                avoidanceBottom: data.data.robotList[index].avoidanceBottom,
                robotSpeed: data.data.robotList[index].robotSpeed,
                inspectionDataDir: data.data.robotList[index].inspectionDataDir,
                picModelDir: data.data.robotList[index].picModelDir,
              };
              curSensorConfig = {
                robotId: data.data.robotList[index].robotId,
                vlIp: data.data.robotList[index].vlIp,
                vlPort: data.data.robotList[index].vlPort,
                vlUserName: data.data.robotList[index].vlUserName,
                vlPassWord: data.data.robotList[index].vlPassWord,
                vlFocusMode: data.data.robotList[index].vlFocusMode,
                irIp: data.data.robotList[index].irIp,
                irPort: data.data.robotList[index].irPort,
                irUserName: data.data.robotList[index].irUserName,
                irPassWord: data.data.robotList[index].irPassWord,
                pdIp: data.data.robotList[index].pdIp,
                pdPort: data.data.robotList[index].pdPort,
              };
              curDataBaseConfig = {
                robotId: data.data.robotList[index].robotId,
                dbIp: data.data.robotList[index].dbIp,
                dbPort: data.data.robotList[index].dbPort,
                dbUserName: data.data.robotList[index].dbUserName,
                mysqlPassWord: data.data.robotList[index].mysqlPassWord,
              };
              curStationConfig = {
                robotId: data.data.robotList[index].robotId,
                stationId: data.data.robotList[index].stationId,
                stationName: data.data.robotList[index].stationName,
              };
            }
          }
          setRobotOptions(options);
          setRobotSelected(data.data.curId);
          setRobotConfig(curRobotConfig);
          setSensorConfig(curSensorConfig);
          setDataBaseConfig(curDataBaseConfig);
          setStationConfig(curStationConfig);
        } else {
          //sweetalert失败
          swal({
            title: "获取系统配置失败",
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
      });

    console.log("robotChange", robotChange);
  }, [robotChange]);

  return (
    <Card className={classes.robot} raised>
      <CardContent>
        <Typography className={classes.label} color="textSecondary">
          <Label color="teal" ribbon>
            系统配置
          </Label>
          <Row className={classes.blankRow}></Row>
        </Typography>
        <Form>
          <Modal
            className={classes.modal}
            open={modalOpen}
            onOpen={() => setModalOpen(true)}
            onClose={() => setModalOpen(false)}
            closeOnDimmerClick={false}
            size={"tiny"}
          >
            <Modal.Header>更改当前机器人</Modal.Header>
            <Modal.Content>
              <p>确认更改机器人？</p>
            </Modal.Content>
            <Modal.Actions>
              <Button
                primary
                content="确认更改"
                onClick={() => RobotSelecthandleChange(selectValue)}
              />
              <Button content="取消更改" onClick={() => setModalOpen(false)} />
            </Modal.Actions>
          </Modal>
          <Form.Select
            onChange={(value) => {
              setModalOpen(true);
              setSelectValue(value);
            }}
            label="选择机器人"
            placeholder="选择机器人"
            options={robotOptions}
            value={robotSelected}
          />
        </Form>
        <Row className={classes.blankRow}></Row>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => {
                toggle("1");
              }}
            >
              机器人配置
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => {
                toggle("2");
              }}
            >
              传感器配置
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "3" })}
              onClick={() => {
                toggle("3");
              }}
            >
              数据库配置
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "4" })}
              onClick={() => {
                toggle("4");
              }}
            >
              站所配置
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <Row className={classes.blankRow}></Row>
                <RobotConfigForm
                  data={robotConfig}
                  updateParent={() => setRobotChange(!robotChange)}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <Row className={classes.blankRow}></Row>
                <SensorConfigForm
                  data={sensorConfig}
                  updateParent={() => setRobotChange(!robotChange)}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col sm="12">
                <Row className={classes.blankRow}></Row>
                <DataBaseConfigForm
                  data={dataBaseConfig}
                  updateParent={() => setRobotChange(!robotChange)}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="4">
            <Row>
              <Col sm="12">
                <Row className={classes.blankRow}></Row>
                <StationConfigForm
                  data={stationConfig}
                  updateParent={() => setRobotChange(!robotChange)}
                />
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </CardContent>
    </Card>
  );
}

export default SysConfig;
