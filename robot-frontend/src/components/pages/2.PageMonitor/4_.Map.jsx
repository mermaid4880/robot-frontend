import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { Badge, Modal, Tooltip } from "antd";
import swal from "sweetalert";
import {
  Stage,
  Layer,
  Image,
  Line,
  Rect,
  Text,
  Circle,
  Util,
  Konva,
} from "react-konva";
import { Alert } from "rsuite";
// import "./4_.Map.css";
//elements
import Portal from "./4_1.Portal.jsx";
import DangerAreaForm from "./4_2.DangerAreaForm.jsx";
//functions
import {
  getData,
  postData,
  deleteData,
} from "../../../functions/requestDataFromAPI.js";
//images
import useImage from "use-image";
import imgMap from "../../../images/pages/2.PageMonitor/4.Map/1.地图背景/地图.png";
import imgRobot from "../../../images/pages/2.PageMonitor/4.Map/2.车体/车体.png";
import imgStationNoTask from "../../../images/pages/2.PageMonitor/4.Map/3.停车点/无任务.png";
import imgStationForCheck from "../../../images/pages/2.PageMonitor/4.Map/3.停车点/待巡检.png";
import imgStationIsChecking from "../../../images/pages/2.PageMonitor/4.Map/3.停车点/巡检中.png";
import imgStationNormal from "../../../images/pages/2.PageMonitor/4.Map/3.停车点/正常.png";
import imgStationEarlyAlarm from "../../../images/pages/2.PageMonitor/4.Map/3.停车点/预警.png";
import imgStationGeneralAlarm from "../../../images/pages/2.PageMonitor/4.Map/3.停车点/一般告警.png";
import imgStationSeriousAlarm from "../../../images/pages/2.PageMonitor/4.Map/3.停车点/严重告警.png";
import imgStationCriticalAlarm from "../../../images/pages/2.PageMonitor/4.Map/3.停车点/危急告警.png";
import imgDangerArea from "../../../images/pages/2.PageMonitor/4.Map/4.检修区域/检修区域.png";
import imgAddDangerArea_UP from "../../../images/pages/2.PageMonitor/4.Map/4.检修区域/操作按钮/新增_UP.png";
import imgAddDangerArea_ING from "../../../images/pages/2.PageMonitor/4.Map/4.检修区域/操作按钮/新增_ING.png";
import imgDeleteDangerArea_UP from "../../../images/pages/2.PageMonitor/4.Map/4.检修区域/操作按钮/删除_UP.png";
import imgDeleteDangerArea_ING from "../../../images/pages/2.PageMonitor/4.Map/4.检修区域/操作按钮/删除_ING.png";

//———————————————————————————————————————————————css
//root
const rootStyle = {
  marginLeft: "0.5rem",
  marginTop: "0.5rem",
  width: 1040,
  height: 495,
};
//地图
const mapStyle = {
  position: "absolute",
  margin: "0px 16px 0px 16px",
  padding: "0px",
};
//CTT 地图缩略图
const mapPreviewStyle = {
  position: "absolute",
  top: "2px",
  right: "2px",
  border: "1px solid grey",
  backgroundColor: "lightgrey",
};
//CTT son
const sonStyle = {
  position: "absolute",
  top: "2px",
  right: "2px",
  border: "1px solid grey",
  backgroundColor: "lightgrey",
};
//CTT停车点菜单背景（不显示）
const stationMenuBkStyle = {
  display: "none",
  position: "absolute",
  width: "60px",
  backgroundColor: "white",
  boxShadow: "0 0 5px grey",
  borderRadius: "3px",
};
//CTT停车点菜单背景（显示）
const stationMenuBk1Style = {
  display: "initial",
  position: "absolute",
  width: "60px",
  backgroundColor: "white",
  boxShadow: "0 0 5px grey",
  borderRadius: "3px",
  top: "314px",
  left: "748px",
};
//CTT停车点菜单项目
const stationMenuItemStyle = {
  width: "100%",
  backgroundColor: "white",
  border: "none",
  margin: 0,
  padding: "10px",
};

//———————————————————————————————————————————————地图绘制
//颜色（道路、检修区域、停车点（8种状态））
const color = {
  road: "#2db7f5",
  dangerArea: "#f50",
  stationNoTask: "#dadada",
  stationForCheck: "#78909c",
  stationIsChecking: "#12b5cb",
  stationNormal: "#3dad5d",
  stationEarlyAlarm: "#f29900",
  stationGeneralAlarm: "#f06292",
  stationSeriousAlarm: "#ee675c",
  stationCriticalAlarm: "#ff0000",
};

//绘制的地图尺寸与API的地图尺寸的比例尺（绘制的地图尺寸/API的地图尺寸）   （1008*465 = 740*340）
const scale = 1008 / 740;

//画布的尺寸（图例、地图、地图缩略图、停车点、车体）
const stageSize = {
  legend: {
    width: 1040,
    height: 30,
  },
  map: {
    width: 1008,
    height: 465,
  },
  //CTT 地图缩略图
  mapPreview: {
    width: 1008 / 4,
    height: 465 / 4,
  },
  station: {
    width: 16,
    height: 24,
    offsetY: 9, //停车点图片（尖尖与中心的距离）
  },
  robot: {
    width: 16,
    height: 24,
  },
};

//———————————————————————————————————————————————Data
//获取所有停车点的信息
function getStationsInfo(list) {
  //停车点的信息
  var newStationsInfo = [];
  newStationsInfo = list.map((item, index) => {
    var newItem = {
      key: "",
      id: "",
      X: "",
      Y: "",
      meters: [
        {
          meterId: "",
          meterName: "",
        },
      ],
      state: "",
    };
    newItem.key = index;
    newItem.id = item.id ? item.id : "";
    newItem.X = item.x ? item.x : "";
    newItem.Y = item.y ? item.y : "";
    newItem.meters = item.meters
      ? item.meters
      : [
          {
            meterId: "",
            meterName: "",
          },
        ];
    newItem.state = item.state ? item.state : "0"; //默认无任务

    return newItem;
  });

  // console.log("newStationsInfo", newStationsInfo);
  return newStationsInfo;
}

//获取所有停车点菜单的信息（根据停车点的信息stationsInfo）
function getStationMenusInfo(list) {
  //停车点菜单的信息
  var newStationMenusInfo = [];
  newStationMenusInfo = list.map((item, index) => {
    var newItem = {
      id: "", //停车点ID
      X: "", //坐标X
      Y: "", //坐标Y
      meters: [
        {
          meterId: "",
          meterName: "",
        },
      ], //包含的所有点位信息（点位ID、点位名称）
      show: false, //菜单是否显示
    };
    newItem.id = item.id ? item.id : "";
    newItem.X = item.X ? item.X + 4 : "";
    newItem.Y = item.Y ? item.Y + 4 : "";
    newItem.meters = item.meters
      ? item.meters
      : [
          {
            meterId: "",
            meterName: "",
          },
        ];
    newItem.show = false;

    return newItem;
  });

  // console.log("newStationMenusInfo", newStationMenusInfo);
  return newStationMenusInfo;
}

//获取车体的实时位置信息
function getRobotPos(data) {
  //车体的实时位置信息
  var newRobotPos = {
    robotX: null,
    robotY: null,
    robotOrientation: null,
  };

  newRobotPos.robotX =
    data && data.robotPos && data.robotPos.x ? data.robotPos.x : 0;
  newRobotPos.robotY =
    data && data.robotPos && data.robotPos.y ? data.robotPos.y : 0;
  newRobotPos.robotOrientation =
    data && data.robotPos && data.robotPos.fx ? data.robotPos.fx : 0;

  // console.log("newRobotPos", newRobotPos);
  return newRobotPos;
}

function Map() {
  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useRef
  const legendStageRef = useRef(); //图例<Stage>标签的节点
  const mapStageRef = useRef(); //地图<Stage>标签的节点
  const debugLayerRef = useRef(); //调试信息<Layer>标签的节点
  const debugTextRef = useRef(); //调试信息<Text>标签的节点

  //———————————————————————————————————————————————useImage
  const [imageMap] = useImage(imgMap); //地图背景图片
  const [imageRobot] = useImage(imgRobot); //车体图片
  const [imageDangerArea] = useImage(imgDangerArea); //检修区域图片
  //停车点
  const [imageStationNoTask] = useImage(imgStationNoTask); //无任务
  const [imageStationForCheck] = useImage(imgStationForCheck); //待巡检
  const [imageStationIsChecking] = useImage(imgStationIsChecking); //巡检中
  const [imageStationNormal] = useImage(imgStationNormal); //正常
  const [imageStationEarlyAlarm] = useImage(imgStationEarlyAlarm); //预警
  const [imageStationGeneralAlarm] = useImage(imgStationGeneralAlarm); //一般告警
  const [imageStationSeriousAlarm] = useImage(imgStationSeriousAlarm); //严重告警
  const [imageStationCriticalAlarm] = useImage(imgStationCriticalAlarm); //危急告警

  //———————————————————————————————————————————————useState
  //本组件是否需要更新的状态
  const [update1s, setUpdate1s] = useState(false); //每1秒更新
  const [update10min, setUpdate10min] = useState(false); //每10分钟更新

  //CTT 当前舞台缩放和鼠标的信息
  const [stageState, setStageState] = useState({
    scale: 1,
    pointer: { x: 0, y: 0 },
  });

  //CTT 拖拽的信息
  const [dragState, setDragState] = useState({
    isDragging: false,
    x: 50,
    y: 50,
  });

  //车体的实时位置信息（X坐标、Y坐标、头部与正北方向的夹角（正北0-360°顺时针））
  const [robotPos, setRobotPos] = useState({
    robotX: null,
    robotY: null,
    robotOrientation: null,
  });

  //所有停车点的信息（key、ID、坐标、包含的所有点位信息、状态）
  const [stationsInfo, setStationsInfo] = useState([
    {
      key: null,
      id: null, //停车点ID
      X: null, //坐标X
      Y: null, //坐标Y
      meters: [{ meterId: null, meterName: null }], //包含的所有点位信息（点位ID、点位名称）
      state: "0", //停车点状态【"0"-无任务、"1"-待巡检、"2"-巡检中、"3"-正常、"4"-预警、"5"-一般告警、"6"-严重告警、"7"-危急告警】
    },
  ]);

  //所有停车点菜单的信息（ID、坐标、包含的所有点位信息、菜单是否显示）
  const [stationMenusInfo, setStationMenusInfo] = useState([
    {
      id: null, //停车点ID
      X: null, //坐标X
      Y: null, //坐标Y
      meters: [{ meterId: null, meterName: null }], //包含的所有点位信息（点位ID、点位名称）
      show: false, //菜单是否显示
    },
  ]);

  //需要显示的停车点菜单的信息（stationMenusInfo中show为true的项目）
  const [stationMenuShow, setStationMenuShow] = useState([]);

  //所有道路的信息
  const [roadsInfo, setRoadsInfo] = useState([
    {
      x1: null, //每条道路的起点坐标	X
      y1: null, //每条道路的起点坐标	Y
      x2: null, //每条道路的终点坐标	X
      y2: null, //每条道路的终点坐标	Y
    },
  ]);

  //————————————————————————————检修区域相关
  //所有检修区域的信息
  const [dangerAreaInfo, setDangerAreaInfo] = useState([
    {
      uuid: null, //检修区域ID
      x1: null, //检修区域左上角X坐标
      y1: null, //检修区域左上角Y坐标
      x2: null, //检修区域右下角X坐标
      y2: null, //检修区域右下角Y坐标
      startTime: null, //检修开始时间
      endTime: null, //检修结束时间
      detail: null, //检修区域详情信息
    },
  ]);

  //新增地图检修区域modal是否打开状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  //定时器开关状态（打开新增地图检修区域modal）
  const [startTimer, setStartTimer] = useState(false);

  //是否正在新增检修区域标志位
  const [isAddDangerArea, setIsAddDangerArea] = useState(false);
  //是否正在删除检修区域标志位
  const [isDeleteDangerArea, setIsDeleteDangerArea] = useState(false);

  //是否正在地图上选取检修区域标志位
  const [isSelectDangerArea, setIsSelectDangerArea] = useState(false);

  //正在地图上选取的区域的信息
  const [selectDangerArea, setSelectDangerArea] = useState({
    x1: null, //（左键、右键）按下时的X坐标
    y1: null, //（左键、右键）按下时的Y坐标
    x2: null, //鼠标移动或（左键、右键）抬起时的X坐标
    y2: null, //鼠标移动或（左键、右键）抬起时的Y坐标
  });

  //新增检修区域的信息
  const [newDangerAreaInfo, setNewDangerAreaInfo] = useState({
    x1: null, //检修区域左上角X坐标
    y1: null, //检修区域左上角Y坐标
    x2: null, //检修区域右下角X坐标
    y2: null, //检修区域右下角Y坐标
  });

  //新增地图检修区域POST请求所带的参数
  const [bodyParams, setBodyParams] = useState({
    uuid: null, //检修区域ID
    x1: null, //检修区域左上角X坐标
    y1: null, //检修区域左上角Y坐标
    x2: null, //检修区域右下角X坐标
    y2: null, //检修区域右下角Y坐标
    startTime: null, //检修开始时间
    endTime: null, //检修结束时间
    detail: null, //检修区域详情信息
  });

  //———————————————————————————————————————————————useEffect
  //CTT当（本组件加载完成时），
  useEffect(() => {
    //添加监听message事件
    window.addEventListener("click", () => {
      console.log("监听到事件！！！！！！！！！！！！！！！！！！！！！！！！");
      // hide menu
      setStationMenuShow([]);
    });
  }, []);

  //当（本组件销毁时），销毁所有定时器
  useEffect(() => {
    return () => {
      clearTimeout(timerID1);
      clearTimeout(timerID2);
    };
  }, []);

  //延时200ms————打开新增地图检修区域modal
  useEffect(() => {
    if (startTimer === true) {
      //开启定时器（200ms后打开新增地图检修区域modal）
      setTimeout(() => {
        setIsModalOpen(true);
        //显示调试信息
        // var debugInfo =
        //   "selectDangerArea x1 x2 y1 y2：" +
        //   selectDangerArea.x1 +
        //   "," +
        //   selectDangerArea.x2 +
        //   "," +
        //   selectDangerArea.y1 +
        //   "," +
        //   selectDangerArea.y2 +
        //   "\n" +
        //   "newDangerAreaInfo x1 x2 y1 y2：" +
        //   newDangerAreaInfo.x1 +
        //   "," +
        //   newDangerAreaInfo.x2 +
        //   "," +
        //   newDangerAreaInfo.y1 +
        //   "," +
        //   newDangerAreaInfo.y2;
        // displayDebugInfo(debugInfo);
      }, 200);
    }
  }, [startTimer]);

  //每10分钟————GET请求获取地图（绘制信息【道路+检修区域】），设置roadsInfo和dangerAreaInfo
  useEffect(() => {
    //————————————————————————————GET请求
    //获取地图（绘制信息【道路+检修区域】）
    getData("robots/map")
      .then((data) => {
        // console.log("get结果", data);
        if (data.success) {
          var result = data.data;
          // console.log("result", result);
          //————————————————绘制信息【道路】
          //获取所有道路的信息
          const roadsInfo = result.mapInfo.edges;
          // console.log("roadsInfo", roadsInfo);
          //设置所有道路的信息
          setRoadsInfo(roadsInfo);
          //————————————————绘制信息【检修区域】
          //获取所有检修区域的信息
          const dangerAreaInfo = result.mapInfo.dangerAreaList;
          // console.log("dangerAreaInfo", dangerAreaInfo);
          //设置所有检修区域的信息
          setDangerAreaInfo(dangerAreaInfo);
        } else {
          //rsuite Alert异常信息
          Alert.warning(
            "获取地图（绘制信息【道路+检修区域】）异常！异常信息：" +
              data.detail,
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
  }, [update10min]);

  //CTT每10分钟————GET请求获取地图（所有停车点信息），设置stationsInfo和stationMenusInfo
  useEffect(() => {
    //————————————————————————————GET请求
    //获取地图（所有停车点信息）
    getData("robots/map/stationsInfo")
      .then((data) => {
        // console.log("get结果", data);
        if (data.success) {
          var result = data.data;
          // console.log("result", result);
          //————————————————所有停车点的信息
          //获取所有停车点的信息
          const stationsInfo = getStationsInfo(result.mapInfo.stationsInfo);
          // console.log("stationsInfo", stationsInfo);
          //设置所有停车点的信息（key、ID、坐标、包含的所有点位信息、状态）
          setStationsInfo(stationsInfo);
          //根据stationsInfo获取所有停车点菜单的信息
          const stationMenusInfo = getStationMenusInfo(stationsInfo);
          // console.log("stationMenusInfo", stationMenusInfo);
          //设置所有停车点菜单的信息（ID、坐标、包含的所有点位信息、菜单是否显示）
          setStationMenusInfo(stationMenusInfo);
        } else {
          //rsuite Alert异常信息
          Alert.warning(
            "获取地图（所有停车点信息）异常！异常信息：" + data.detail,
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
  }, [update10min]);

  //每1秒————GET请求获取地图（实时信息【机器人位置+停车点状态】），设置robotPos和stationsInfo
  useEffect(() => {
    //————————————————————————————GET请求
    //获取地图（实时信息【机器人位置+停车点状态】）
    getData("robots/map/realtimeInfo")
      .then((data) => {
        // console.log("get结果", data);
        if (data.success) {
          var result = data.data;
          // console.log("result", result);
          //————————————————实时信息【机器人位置】
          //获取车体的实时位置信息
          const robotPos = getRobotPos(result);
          // const robotPos = getRobotPosFake(result); //CTT
          // console.log("robotPos", robotPos);
          //设置车体的实时位置信息（X坐标、Y坐标、头部与正北方向的夹角（正北0-360°顺时针））
          setRobotPos(robotPos);
          //————————————————实时信息【停车点状态】
          //获取停车点的实时状态信息
          const stationsStatus = result.mapInfo.stationsStatus;
          // console.log("stationsStatus", stationsStatus);
          //对应stationsStatus（实时停车点状态list）中的state（状态）设置stationsInfo（所有停车点的信息）中的state（状态）
          setStateInStationsInfo(stationsStatus);
        } else {
          //rsuite Alert异常信息
          Alert.warning(
            "获取地图（实时信息【机器人位置+停车点状态】）异常！异常信息：" +
              data.detail,
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
  }, [update1s]);

  //———————————————————————————————————————————————Timer
  //开启定时器（每1秒————调用相应的useEffect，更新实时信息【机器人位置+停车点状态】）
  const timerID1 = setTimeout(() => {
    setUpdate1s(!update1s);
  }, 1000);

  //开启定时器（每10分钟————调用相应的useEffect，更新绘制信息【道路+检修区域】）
  const timerID2 = setTimeout(() => {
    setUpdate10min(!update10min);
  }, 600000);

  //———————————————————————————————————————————————其他函数（获取界面组件）
  //获取图例里包含每个badge的<div>（根据图例的种类）
  function getBadgeDiv(type) {
    var space = 18; //每个<div>到left之间的距离
    var colorBadge = ""; //每个badge的颜色
    switch (type) {
      case "道路":
        space = 0;
        colorBadge = color.road;
        break;
      case "检修区域":
        space = space * 4;
        colorBadge = color.dangerArea;
        break;
      case "无任务":
        space = space * 9;
        colorBadge = color.stationNoTask;
        break;
      case "待巡检":
        space = space * 13;
        colorBadge = color.stationForCheck;
        break;
      case "巡检中":
        space = space * 17;
        colorBadge = color.stationIsChecking;
        break;
      case "正常":
        space = space * 21;
        colorBadge = color.stationNormal;
        break;
      case "预警":
        space = space * 24;
        colorBadge = color.stationEarlyAlarm;
        break;
      case "一般告警":
        space = space * 27;
        colorBadge = color.stationGeneralAlarm;
        break;
      case "严重告警":
        space = space * 32;
        colorBadge = color.stationSeriousAlarm;
        break;
      case "危急告警":
        space = space * 37;
        colorBadge = color.stationCriticalAlarm;
        break;
      default:
        space = 0;
        colorBadge = "";
        break;
    }
    //<div>的样式
    var divStyle = {
      position: "absolute",
      top: 243,
      left: 265 + space,
      width: "200px",
    };
    return (
      <div style={divStyle}>
        <Badge color={colorBadge} text={type} />
      </div>
    );
  }

  //获取图例里包含button（新增、删除）的<div>       点击button（新增）弹出<Modal>
  function getButtonModalDiv() {
    var space = 18; //每个<div>到left之间的距离
    //<div>的样式
    var divStyle = {
      position: "absolute",
      top: 243,
      left: 1070 + space,
      width: "200px",
    };
    return (
      <div style={divStyle}>
        检修区域：&nbsp;&nbsp;&nbsp;
        <Tooltip
          placement="bottom"
          title={isAddDangerArea ? "取消新增" : "新增"}
        >
          <a>
            <img
              alt={"新增"}
              src={isAddDangerArea ? imgAddDangerArea_ING : imgAddDangerArea_UP}
              onClick={() => {
                //清空正在地图上选取的区域的信息
                setSelectDangerArea({
                  x1: null, //（左键、右键）按下时的X坐标
                  y1: null, //（左键、右键）按下时的Y坐标
                  x2: null, //鼠标移动或（左键、右键）抬起时的X坐标
                  y2: null, //鼠标移动或（左键、右键）抬起时的Y坐标
                });

                if (isAddDangerArea) {
                  //设置正在新增检修区域标志位为false
                  setIsAddDangerArea(false);
                } else {
                  //设置正在删除检修区域标志位为false
                  setIsDeleteDangerArea(false);
                  //sweetalert新增检修区域操作说明
                  swal({
                    title: "新增检修区域",
                    text: "请在地图上选择区域（按下并拖拽鼠标左键）",
                  });
                  //设置正在新增检修区域标志位为true
                  setIsAddDangerArea(true);
                }
              }}
            />
          </a>
        </Tooltip>
        &nbsp;&nbsp;
        <Tooltip
          placement="bottom"
          title={isDeleteDangerArea ? "取消删除" : "删除"}
        >
          <a>
            <img
              alt={"删除"}
              src={
                isDeleteDangerArea
                  ? imgDeleteDangerArea_ING
                  : imgDeleteDangerArea_UP
              }
              onClick={() => {
                //清空正在地图上选取的区域的信息
                setSelectDangerArea({
                  x1: null, //（左键、右键）按下时的X坐标
                  y1: null, //（左键、右键）按下时的Y坐标
                  x2: null, //鼠标移动或（左键、右键）抬起时的X坐标
                  y2: null, //鼠标移动或（左键、右键）抬起时的Y坐标
                });

                if (isDeleteDangerArea) {
                  //设置正在删除检修区域标志位为false
                  setIsDeleteDangerArea(false);
                } else {
                  //设置正在新增检修区域标志位为false
                  setIsAddDangerArea(false);
                  //sweetalert删除检修区域操作说明
                  swal({
                    title: "删除检修区域",
                    text: "请在地图上选择区域（双击鼠标左键）",
                  });
                  //设置正在删除检修区域标志位为true
                  setIsDeleteDangerArea(true);
                }
              }}
            />
          </a>
        </Tooltip>
        <Modal
          title="检修区域信息"
          visible={isModalOpen}
          onOk={() => {
            addDangerAreaPOST(); //发送POST请求新增地图检修区域
            setIsAddDangerArea(false); //设置正在新增检修区域标志位为false
            setIsModalOpen(false); //关闭新增地图检修区域modal
            setStartTimer(false); //关闭定时器（打开新增地图检修区域modal）
            //清空POST请求所带的参数
            setBodyParams({
              uuid: null, //检修区域ID
              x1: null, //检修区域左上角X坐标
              y1: null, //检修区域左上角Y坐标
              x2: null, //检修区域右下角X坐标
              y2: null, //检修区域右下角Y坐标
              startTime: null, //检修开始时间
              endTime: null, //检修结束时间
              detail: null, //检修区域详情信息
            });
            //清空新增检修区域的信息
            setNewDangerAreaInfo({
              x1: null, //检修区域左上角X坐标
              y1: null, //检修区域左上角Y坐标
              x2: null, //检修区域右下角X坐标
              y2: null, //检修区域右下角Y坐标
            });
          }}
          onCancel={() => {
            setIsAddDangerArea(false); //设置正在新增检修区域标志位为false
            setIsModalOpen(false); //关闭新增地图检修区域modal
            setStartTimer(false); //关闭定时器（打开新增地图检修区域modal）
          }}
        >
          <DangerAreaForm
            data={newDangerAreaInfo}
            //CTT 将子组件4_2.DangerAreaForm.jsx中的用户输入数据导出，用于设置POST请求（新增检修区）或PUT请求（修改检修区）所带的参数
            exportData={(input) => {
              setBodyParams(input);
            }}
          />
        </Modal>
      </div>
    );
  }

  //根据停车点状态获取相应的停车点<image>标签的image属性
  function getImageProperty(state) {
    //停车点状态【"0"-无任务、"1"-待巡检、"2"-巡检中、"3"-正常、"4"-预警、"5"-一般告警、"6"-严重告警、"7"-危急告警】
    switch (state) {
      case "0":
        return imageStationNoTask;
      case "1":
        return imageStationForCheck;
      case "2":
        return imageStationIsChecking;
      case "3":
        return imageStationNormal;
      case "4":
        return imageStationEarlyAlarm;
      case "5":
        return imageStationGeneralAlarm;
      case "6":
        return imageStationSeriousAlarm;
      case "7":
        return imageStationCriticalAlarm;
      default:
        return null;
    }
  }

  //———————————————————————————————————————————————其他函数（功能性）
  //对应stationsStatus（实时停车点状态list）中的state（状态）设置stationsInfo（所有停车点的信息）中的state（状态）
  function setStateInStationsInfo(list) {
    //list为空，返回
    if (list.length < 1) return;
    //list不为空，遍历list（更新stationsInfo中的state）
    list.forEach((listItem) => {
      stationsInfo.forEach((item, index) => {
        if (item.id === listItem.id) {
          var tempStationsInfo = stationsInfo;
          tempStationsInfo[index].state = listItem.state;
          // console.log("tempStationsInfo", tempStationsInfo);
          setStationsInfo(tempStationsInfo);
          // console.log("stationsInfo", stationsInfo);
        }
      });
    });
  }

  //CTT 根据停车点ID找到stationMenusInfo
  function getStationMenuShow(list, id) {
    //list为空，返回
    if (list.length < 1) return;
    //CTT list不为空，遍历list（找到list中???中的show）
    list.forEach((listItem) => {
      if (id === listItem.id) {
        listItem.show = true;
      } else {
        listItem.show = false;
      }
    });

    //过滤出show只有true的项目
    var stationMenuShow = list.filter(function (item) {
      return item.show === true;
    });

    console.log("stationMenuShow", stationMenuShow);
    return stationMenuShow;
  }

  //更新newDangerAreaInfo（根据selectDangerArea）
  function updateNewDangerAreaInfo() {
    var minX, maxX, minY, maxY;
    if (selectDangerArea.x1 <= selectDangerArea.x2) {
      minX = selectDangerArea.x1;
      maxX = selectDangerArea.x2;
    } else if (selectDangerArea.x1 > selectDangerArea.x2) {
      minX = selectDangerArea.x2;
      maxX = selectDangerArea.x1;
    }
    if (selectDangerArea.y1 <= selectDangerArea.y2) {
      minY = selectDangerArea.y1;
      maxY = selectDangerArea.y2;
    } else if (selectDangerArea.y1 > selectDangerArea.y2) {
      minY = selectDangerArea.y2;
      maxY = selectDangerArea.y1;
    }

    //设置新增检修区域的信息
    setNewDangerAreaInfo((prev) => {
      return {
        ...prev,
        x1: Math.round(minX),
        y1: Math.round(minY),
        x2: Math.round(maxX),
        y2: Math.round(maxY),
      };
    });
  }

  //———————————————————————————————————————————————其他函数（REST请求）
  //新增地图检修区域POST请求
  function addDangerAreaPOST() {
    //————————————————————————————POST请求
    // 用URLSearchParams来传递参数
    let BodyParams = new URLSearchParams();
    bodyParams.x1 &&
      BodyParams.append("x1", Math.round(bodyParams.x1 / scale).toString());
    bodyParams.y1 &&
      BodyParams.append("y1", Math.round(bodyParams.y1 / scale).toString());
    bodyParams.x2 &&
      BodyParams.append("x2", Math.round(bodyParams.x2 / scale).toString());
    bodyParams.y2 &&
      BodyParams.append("y2", Math.round(bodyParams.y2 / scale).toString());
    bodyParams.startTime &&
      BodyParams.append("startTime", bodyParams.startTime.toString());
    bodyParams.endTime &&
      BodyParams.append("endTime", bodyParams.endTime.toString());
    bodyParams.detail &&
      BodyParams.append("detail", bodyParams.detail.toString());
    //发送POST请求
    postData("robots/dangerarea/add", BodyParams)
      .then((data) => {
        console.log("post结果", data);
        if (data.success) {
          //sweetalert成功
          swal({
            title: "新增检修区域成功",
            text: "                 ",
            icon: "success",
            timer: 3000,
            buttons: false,
          });
          //更新绘制信息【道路+检修区域】
          setUpdate10min(!update10min);
        } else {
          //sweetalert失败
          swal({
            title: "新增检修区域失败",
            text: "错误信息：" + data.detail.toString(),
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
          title: "新增检修区域失败",
          text: "错误信息：" + error.toString(),
          icon: "error",
          timer: 3000,
          buttons: false,
        });
      });
  }

  //删除地图检修区域DELETE请求
  function deleteDangerAreaDELETE(uuid) {
    //————————————————————————————DELETE请求
    //发送DELETE请求
    deleteData("robots/dangerarea/remove/" + uuid)
      .then((data) => {
        console.log("delete结果", data);
        if (data.success) {
          //sweetalert成功
          swal({
            title: "删除检修区域成功",
            text: "                 ",
            icon: "success",
            timer: 3000,
            buttons: false,
          });
          //更新绘制信息【道路+检修区域】
          setUpdate10min(!update10min);
        } else {
          //sweetalert失败
          swal({
            title: "删除检修区域失败",
            text: "请重试！错误信息：" + data.detail.toString(),
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
          title: "删除检修区域失败",
          text: "请重试！错误信息：" + error.toString(),
          icon: "error",
          timer: 3000,
          buttons: false,
        });
      });
  }

  //———————————————————————————————————————————————事件响应函数
  //CTT（左键）双击
  function handleDblClick(e) {
    //阻止事件的默认行为
    // e.evt.preventDefault();

    console.log("进入地图<Stage>（左键）双击事件！");

    //实现鼠标右键双击新增新检修区域
    const mapStageNode = mapStageRef.current; //获取地图<Stage>标签的节点

    var pointer = mapStageNode.getPointerPosition(); //获取鼠标的绝对指针位置（相对于舞台容器左上角的指针的普通位置）

    console.log("pointer~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", pointer);

    // var layer = new Konva.Layer();
    // console.log("layer~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", layer);
    mapStageNode.add(
      <Layer>
        <Image //检修区
          x={pointer.x}
          y={pointer.y}
          width={100}
          height={46}
          image={imageDangerArea}
        />
      </Layer>
    );
    // console.log(
    //   "mapStageNode~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    //   mapStageNode
    // );
    // // add a new shape
    // var newShape = new Konva.Circle({
    //   x: mapStageNode.getPointerPosition().x,
    //   y: mapStageNode.getPointerPosition().y,
    //   radius: 10 + Math.random() * 30,
    //   fill: "green",
    //   shadowBlur: 10,
    // });
    // console.log(
    //   "x~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    //   mapStageNode.getPointerPosition().x,
    //   "y~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    //   mapStageNode.getPointerPosition().y
    // );
    // layer.add(newShape);
    // layer.draw();

    mapStageNode.batchDraw();
  }

  //CTT 地图<Stage>的鼠标滑轮滚动事件处理函数
  function handleWheelMap(e) {
    //阻止事件的默认行为
    e.evt.preventDefault();

    //实现鼠标滑轮滚动缩放
    const mapStageNode = mapStageRef.current; //获取地图<Stage>标签的节点

    var scaleBy = 1.01; //缩放比例尺
    var oldScale = mapStageNode.scaleX(); // get scale x
    var pointer = mapStageNode.getPointerPosition(); //获取鼠标的绝对指针位置（相对于舞台容器左上角的指针的普通位置）
    var mousePointTo = {
      x: (pointer.x - mapStageNode.x()) / oldScale,
      y: (pointer.y - mapStageNode.y()) / oldScale,
    };
    var newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy; // e.evt.deltaY: the vertical scroll amount
    mapStageNode.scale({ x: newScale, y: newScale }); // set scale
    var newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    mapStageNode.position(newPos); // set node position relative to parent

    console.log("mapStageNode", mapStageNode);

    mapStageNode.batchDraw();
  }

  //————————————————————————————地图<Stage>
  //（左键、右键）按下
  function handleMouseDownMap(e) {
    console.log("进入地图<Stage>（左键、右键）按下事件！");

    //正在新增检修区域
    if (isAddDangerArea) {
      //获取鼠标在地图<Stage>上的位置
      const mapStageNode = mapStageRef.current; //获取地图<Stage>标签的节点
      var pointer = mapStageNode.getPointerPosition(); //获取鼠标的位置（相对于舞台容器mapStageNode的左上角）
      var x = pointer.x;
      var y = pointer.y;
      //设置正在地图上选取的区域的信息
      setSelectDangerArea((prev) => {
        return { ...prev, x1: x, y1: y };
      });
      //设置正在地图上选取检修区域标志位为true
      setIsSelectDangerArea(true);
    }
  }

  //鼠标移动
  function handleMouseMoveMap(e) {
    // console.log("进入地图<Stage>鼠标移动事件！");

    //正在地图上选取检修区域
    if (isSelectDangerArea) {
      //获取鼠标在地图<Stage>上的位置
      const mapStageNode = mapStageRef.current; //获取地图<Stage>标签的节点
      var pointer = mapStageNode.getPointerPosition(); //获取鼠标的位置（相对于舞台容器mapStageNode的左上角）
      var x = pointer.x;
      var y = pointer.y;
      //设置正在地图上选取的区域的信息
      setSelectDangerArea((prev) => {
        return { ...prev, x2: x, y2: y };
      });
      //根据selectDangerArea获取newDangerAreaInfo
      updateNewDangerAreaInfo();
      //显示调试信息
      // var debugInfo =
      //   "x：" +
      //   x +
      //   "y：" +
      //   y +
      //   "\n" +
      //   "selectDangerArea x1 x2 y1 y2：" +
      //   selectDangerArea.x1 +
      //   "," +
      //   selectDangerArea.x2 +
      //   "," +
      //   selectDangerArea.y1 +
      //   "," +
      //   selectDangerArea.y2 +
      //   "\n" +
      //   "newDangerAreaInfo x1 x2 y1 y2：" +
      //   newDangerAreaInfo.x1 +
      //   "," +
      //   newDangerAreaInfo.x2 +
      //   "," +
      //   newDangerAreaInfo.y1 +
      //   "," +
      //   newDangerAreaInfo.y2;
      // displayDebugInfo(debugInfo);
    }
  }

  //（左键、右键）抬起
  function handleMouseUpMap(e) {
    console.log("进入地图<Stage>（左键、右键）抬起事件！");

    //正在新增检修区域
    if (isAddDangerArea) {
      //获取鼠标在地图<Stage>上的位置
      const mapStageNode = mapStageRef.current; //获取地图<Stage>标签的节点
      var pointer = mapStageNode.getPointerPosition(); //获取鼠标的位置（相对于舞台容器mapStageNode的左上角）
      var x = pointer.x;
      var y = pointer.y;
      //设置正在地图上选取的区域的信息
      setSelectDangerArea((prev) => {
        return { ...prev, x2: x, y2: y };
      });
      //更新newDangerAreaInfo（根据selectDangerArea）
      updateNewDangerAreaInfo();
      //设置正在地图上选取检修区域标志位为false
      setIsSelectDangerArea(false);
      //开启定时器（打开新增地图检修区域modal）
      setStartTimer(true);
    }
  }

  //————————————————————————————检修区<Image>
  function handleDblClickDangerArea(uuid) {
    console.log("进入检修区<Image>（左键）双击事件！  检修区uuid：", uuid);

    //正在删除检修区域
    if (isDeleteDangerArea) {
      //发送DELETE请求删除地图检修区域
      deleteDangerAreaDELETE(uuid);
      //设置正在删除检修区域标志位为false
      setIsDeleteDangerArea(false);
    }
  }

  //————————————————————————————停车点<Image>
  //停车点<Image>的鼠标滑轮滚动事件处理函数
  function handleClickStation(e) {
    console.log("enter handleClickStation~~~~~~~~~~~~~~~~~~", e);
    // hide menu
  }

  function handleDblClickStation(e) {
    console.log("enter handleDblClickStation~~~~~~~~~~~~~~~~~~", e);
  }

  function handleMouseOverStation(e) {
    console.log("enter handleMouseOverStation~~~~~~~~~~~~~~~~~~", e);
  }

  function handleMouseDownStation(e) {
    console.log("enter handleMouseDownStation~~~~~~~~~~~~~~~~~~", e);
  }

  function handleMouseUpStation(e) {
    console.log("enter handleMouseUpStation~~~~~~~~~~~~~~~~~~", e);
  }

  function handleMouseMoveStation(e) {
    console.log("enter handleMouseMoveStation~~~~~~~~~~~~~~~~~~", e);
  }

  function handleContextMenuStation(e) {
    console.log("enter handleContextMenuStation~~~~~~~~~~~~~~~~~~", e);
    // prevent default behavior
    e.evt.preventDefault();

    const mapStageNode = mapStageRef.current; //获取地图<Stage>标签的节点
    console.log("mapStageNode", mapStageNode);
    console.log("e.currentTarget", e.currentTarget);
    console.log("e.currentTarget.index", e.currentTarget.index);
    // console.log("e.currentTarget.parent", e.currentTarget.parent);
    // console.log("e.currentTarget.parent.parent", e.currentTarget.parent.parent);

    if (e.currentTarget.parent.parent === mapStageNode) {
      // if we are on empty place of the stage we will do nothing
      console.log("do nothing~~~~~~~~~~~~~~~~~~");
      // return;
    }

    // show menu
    const id = e.target.id();
    console.log("id", id);
    const stationMenuShow = getStationMenuShow(stationMenusInfo, id);
    console.log("stationMenuShow", stationMenuShow);
    setStationMenuShow(stationMenuShow);

    // show menu
    // var menuNode = document.getElementById("menu");
    // menuNode.style.display = "initial";
    // console.log("menuNode.style~~~~~~~~~~~~~~~~~~", menuNode.style);
    // var containerRect = mapStageNode.container().getBoundingClientRect();
    // console.log("containerRect~~~~~~~~~~~~~~~~~~", containerRect);
    // menuNode.style.top =
    //   containerRect.top + mapStageNode.getPointerPosition().y + 4 + "px";
    // menuNode.style.left =
    //   containerRect.left + mapStageNode.getPointerPosition().x + 4 + "px";
    // console.log("menuNode.style~~~~~~~~~~~~~~~~~~1", menuNode.style);

    // console.log(
    //   "top",
    //   containerRect.top + mapStageNode.getPointerPosition().y + 4 + "px"
    // );
    // console.log(
    //   "left",
    //   containerRect.left + mapStageNode.getPointerPosition().x + 4 + "px"
    // );
  }

  //———————————————————————————————————————————————其他函数（调试用）
  //CTT产生随机数
  function generateRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  //CTT按规律获取车体的实时位置信息（Fake）
  function getRobotPosFake(data) {
    //车体的实时位置信息
    var newRobotPos = {
      robotX: null,
      robotY: null,
      robotOrientation: null,
    };

    newRobotPos.robotX =
      data && data.robotPos && data.robotPos.x + 1
        ? Math.round(
            (data.robotPos.x + 1) *
              generateRandomArbitrary(0, stageSize.map.width / scale)
          )
        : null;
    newRobotPos.robotY =
      data && data.robotPos && data.robotPos.y + 1
        ? Math.round(
            (data.robotPos.y + 1) *
              generateRandomArbitrary(0, stageSize.map.height / scale)
          )
        : null;
    newRobotPos.robotOrientation =
      data && data.robotPos && data.robotPos.fx + 1
        ? Math.round((data.robotPos.fx + 1) * generateRandomArbitrary(0, 360))
        : null;

    console.log("newRobotPos", newRobotPos);
    return newRobotPos;
  }

  //显示调试信息（地图左上角）
  function displayDebugInfo(debugInfo) {
    const debugTextNode = debugTextRef.current; //获取调试信息<Text>标签的节点
    debugTextNode.text(debugInfo);
    const debugLayerNode = debugLayerRef.current; //获取调试信息<Layer>标签的节点
    debugLayerNode.draw();
  }

  return (
    <Paper style={rootStyle}>
      {/* <div id="son" className={classes.son}> */}
      {/* 图例 */}
      <Stage
        ref={legendStageRef}
        width={stageSize.legend.width}
        height={stageSize.legend.height}
      >
        <Portal>
          {getBadgeDiv("道路")}
          {getBadgeDiv("检修区域")}
          {getBadgeDiv("无任务")}
          {getBadgeDiv("待巡检")}
          {getBadgeDiv("巡检中")}
          {getBadgeDiv("正常")}
          {getBadgeDiv("预警")}
          {getBadgeDiv("一般告警")}
          {getBadgeDiv("严重告警")}
          {getBadgeDiv("危急告警")}
          {getButtonModalDiv()}
        </Portal>
      </Stage>
      {/* 地图 */}
      <Stage
        style={mapStyle}
        id="papa"
        ref={mapStageRef}
        width={stageSize.map.width}
        height={stageSize.map.height}
        // draggable
        // onClick={(e) => handleClickMap(e)} //（左键、右键）单击
        // onDblClick={(e) => handleDblClickMap(e)} //（左键）双击
        // onMouseOver={(e) => handleMouseOverMap(e)} //鼠标移入
        onMouseDown={(e) => handleMouseDownMap(e)} //（左键、右键）按下
        onMouseMove={(e) => handleMouseMoveMap(e)} //鼠标移动
        onMouseup={(e) => handleMouseUpMap(e)} //（左键、右键）抬起
      >
        <Layer>
          <Image //地图背景
            width={1008}
            height={465}
            image={imageMap}
          />
        </Layer>
        <Layer>
          {roadsInfo.map((item, index) => (
            <Line //道路
              points={[
                item.x1 * scale,
                item.y1 * scale,
                item.x2 * scale,
                item.y2 * scale,
              ]}
              stroke={color.road}
              tension={0}
            />
          ))}
        </Layer>
        <Layer>
          {stationsInfo.map((item, index) => (
            <Image //停车点
              id={item.id}
              width={stageSize.station.width}
              height={stageSize.station.height}
              offsetX={stageSize.station.width / 2}
              offsetY={stageSize.station.height / 2 + stageSize.station.offsetY}
              x={item.X * scale}
              y={item.Y * scale}
              image={getImageProperty(item.state)}
              opacity={0.8}
              onClick={handleClickStation} //（左键、右键）单击
              onDblClick={handleDblClickStation} //（左键）双击
              onMouseOver={handleMouseOverStation} //鼠标移入
              onMouseDown={handleMouseDownStation} //（左键、右键）按下
              onMouseup={handleMouseUpStation} //（左键、右键）抬起
              // onMousemove={handleMouseMoveStation} //鼠标移动
              onContextMenu={handleContextMenuStation} //（右键）显示菜单
            />
          ))}
        </Layer>
        <Layer>
          {dangerAreaInfo.map((item, index) => (
            <Image //检修区
              key={index}
              width={(item.x2 - item.x1) * scale}
              height={(item.y2 - item.y1) * scale}
              x={item.x1 * scale}
              y={item.y1 * scale}
              image={imageDangerArea}
              opacity={0.3}
              shadowBlur={10}
              shadowOpacity={0.6}
              shadowOffsetX={dragState.isDragging ? 10 : 5}
              shadowOffsetY={dragState.isDragging ? 10 : 5}
              scaleX={dragState.isDragging ? 1.05 : 1}
              scaleY={dragState.isDragging ? 1.05 : 1}
              // draggable
              onDragStart={() => {
                setDragState((prev) => {
                  return { ...prev, isDragging: true };
                });
              }}
              onDragEnd={(e) => {
                setDragState({
                  isDragging: false,
                  x: e.target.x(),
                  y: e.target.y(),
                });
              }}
              onDblClick={() => handleDblClickDangerArea(item.uuid)} //（左键）双击
            />
          ))}
        </Layer>
        <Layer>
          <Portal>
            {/* 停车点菜单 */}
            {stationMenuShow.map((item, index) => (
              <div
                style={{
                  display: "initial",
                  position: "absolute",
                  width: "60px",
                  backgroundColor: "white",
                  boxShadow: "0 0 5px grey",
                  borderRadius: "3px",
                  left: item.X * scale + 252 + "px",
                  top: item.Y * scale + 270 + "px",
                }}
              >
                <div>
                  <button style={stationMenuItemStyle}>Pulse</button>
                  <button style={stationMenuItemStyle}>Delete</button>
                </div>
              </div>
            ))}
          </Portal>
        </Layer>
        <Layer>
          <Image //车体
            width={stageSize.robot.width}
            height={stageSize.robot.height}
            offsetX={stageSize.robot.width / 2}
            offsetY={stageSize.robot.height / 2}
            x={robotPos.robotX * scale}
            y={robotPos.robotY * scale}
            rotation={robotPos.robotOrientation}
            //offset from center point and rotation point
            offset={{
              x: stageSize.robot.width / 2,
              y: stageSize.robot.height / 2,
            }}
            image={imageRobot}
            opacity={0.8}
          />
        </Layer>
        <Layer>
          {isAddDangerArea && ( //新增检修区
            <Rect
              x={selectDangerArea.x1 ? selectDangerArea.x1 : 0}
              y={selectDangerArea.y1 ? selectDangerArea.y1 : 0}
              width={
                selectDangerArea.x2
                  ? selectDangerArea.x2 - selectDangerArea.x1
                  : 0
              }
              height={
                selectDangerArea.y2
                  ? selectDangerArea.y2 - selectDangerArea.y1
                  : 0
              }
              fill={"rgba(225,0,0,0.4)"}
            />
          )}
        </Layer>
        <Layer ref={debugLayerRef}>
          <Text //打印调试信息
            ref={debugTextRef}
            text=""
            fontFamily={"Calibri"}
            fontSize={20}
            x={10}
            y={10}
            fill={"black"}
          />
        </Layer>
        {/* 地图缩略图 */}
        {/* <Layer
          container="papa"
          style={mapPreviewStyle}
          // width={stageSize.mapPreview.width}
          // height={stageSize.mapPreview.height}
        >
          <Text text="Hello, I am the preview" />
          <Image
            x={10}
            y={10}
            width={1256 / 4}
            height={310 / 4}
            image={imageMap}
          />
        </Layer> */}
      </Stage>
      {/* </div> */}
      {/* <Stage
        width={stageSize.mapPreview.width}
        height={stageSize.mapPreview.height}
        container="papa"
      >
        <Layer>
          <Text text="SON........." />
        </Layer>
      </Stage> */}
      {/* <div
        id="menu"
        // style={getStationMenuBkStyle(showMenu)}
        // style={showMenu ? stationMenuBk1Style : stationMenuBkStyle}
        // style={stationMenuBk1Style}
      >
        <div>
          <button id="pulse-button">Pulse</button>
          <button id="delete-button">Delete</button>
        </div>
      </div> */}
      {/* <div
        id="menu"
        // style={getStationMenuBkStyle(showMenu)}
        // style={showMenu ? stationMenuBk1Style : stationMenuBkStyle}
        // style={stationMenuBk1Style}
        style={{ position: "relative", display: "inline-block" }}
      >
        <div>
          <button id="pulse-button" style={stationMenuItemStyle}>
            Pulse
          </button>
          <button id="delete-button" style={stationMenuItemStyle}>
            Delete
          </button>
        </div>
      </div> */}
    </Paper>
  );
}

export default Map;
