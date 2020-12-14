import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { Badge } from "antd";
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
import Portal from "./4_1.Portal.jsx";
// import "./4_.Map.css";
//functions
import {
  getData,
  postData,
  deleteData,
} from "../../../functions/requestDataFromAPI.js";
//images
import useImage from "use-image";
import ImgMap from "../../../images/pages/2.PageMonitor/4.Map/1.地图背景/地图.png";
import ImgRobot from "../../../images/pages/2.PageMonitor/4.Map/2.车体/车体.png";
import ImgDangerArea from "../../../images/pages/2.PageMonitor/4.Map/4.检修区域/检修区域.png";
import ImgStationNoTask from "../../../images/pages/2.PageMonitor/4.Map/3.停车点/无任务.png";
import ImgStationForCheck from "../../../images/pages/2.PageMonitor/4.Map/3.停车点/待巡检.png";
import ImgStationIsChecking from "../../../images/pages/2.PageMonitor/4.Map/3.停车点/巡检中.png";
import ImgStationNormal from "../../../images/pages/2.PageMonitor/4.Map/3.停车点/正常.png";
import ImgStationEarlyAlarm from "../../../images/pages/2.PageMonitor/4.Map/3.停车点/预警.png";
import ImgStationGeneralAlarm from "../../../images/pages/2.PageMonitor/4.Map/3.停车点/一般告警.png";
import ImgStationSeriousAlarm from "../../../images/pages/2.PageMonitor/4.Map/3.停车点/严重告警.png";
import ImgStationCriticalAlarm from "../../../images/pages/2.PageMonitor/4.Map/3.停车点/危急告警.png";

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
//地图缩略图
const mapPreviewStyle = {
  position: "absolute",
  top: "2px",
  right: "2px",
  border: "1px solid grey",
  backgroundColor: "lightgrey",
};
//son
const sonStyle = {
  position: "absolute",
  top: "2px",
  right: "2px",
  border: "1px solid grey",
  backgroundColor: "lightgrey",
};
//停车点菜单背景（不显示）
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
//停车点菜单项目
const stationMenuItemStyle = {
  width: "100%",
  backgroundColor: "white",
  border: "none",
  margin: 0,
  padding: "10px",
};

//———————————————————————————————————————————————地图绘制
//颜色（道路、停车点（未巡检）、停车点（已巡检）、检修区域）
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

//绘制的地图尺寸与API的地图尺寸的比例尺（绘制的地图尺寸/API的地图尺寸）
const scale = 1008 / 740;

//画布的尺寸（车体、停车点、图例、地图、地图缩略图）
const stageSize = {
  robot: {
    width: 16,
    height: 24,
  },
  station: {
    width: 16,
    height: 24,
  },
  legend: {
    width: 1040,
    height: 30,
  },
  map: {
    width: 1008,
    height: 465,
  },
  mapPreview: {
    width: 1008 / 4,
    height: 465 / 4,
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
    newItem.state = 0; //CTT无任务

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

  console.log("newStationMenusInfo", newStationMenusInfo);
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

  //———————————————————————————————————————————————useImage
  const [imageMap] = useImage(ImgMap); //地图背景图片
  const [imageRobot] = useImage(ImgRobot); //车体图片
  const [imageDangerArea] = useImage(ImgDangerArea); //检修区域图片
  //停车点
  const [imageStationNoTask] = useImage(ImgStationNoTask); //无任务
  const [imageStationForCheck] = useImage(ImgStationForCheck); //待巡检
  const [imageStationIsChecking] = useImage(ImgStationIsChecking); //巡检中
  const [imageStationNormal] = useImage(ImgStationNormal); //正常
  const [imageStationEarlyAlarm] = useImage(ImgStationEarlyAlarm); //预警
  const [imageStationGeneralAlarm] = useImage(ImgStationGeneralAlarm); //一般告警
  const [imageStationSeriousAlarm] = useImage(ImgStationSeriousAlarm); //严重告警
  const [imageStationCriticalAlarm] = useImage(ImgStationCriticalAlarm); //危急告警

  //———————————————————————————————————————————————useState
  //本组件是否需要更新的状态
  const [update2s, setUpdate2s] = useState(false); //每1秒更新
  const [update10min, setUpdate10min] = useState(false); //每10分钟更新

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
      state: 0, //停车点状态【0-无任务、1-待巡检、2-巡检中、3-正常、4-预警、5-一般告警、6-严重告警、7-危急告警】
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

  //添加或编辑地图检修区域POST请求所带的参数
  const [bodyParams, setBodyParams] = useState({});

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
          alert(data.detail);
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
          alert(data.detail);
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
          // const robotPos = getRobotPos(result);
          const robotPos = getRobotPosFake1(result); //CTT
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
          alert(data.detail);
        }
      })
      .catch((error) => {
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
      });
  }, [update2s]);

  //———————————————————————————————————————————————Timer
  //开启定时器（每1秒————调用相应的useEffect，更新实时信息【机器人位置+停车点状态】）
  var timerID1 = setTimeout(() => {
    setUpdate2s(!update2s);
  }, 2000);

  //开启定时器（每10分钟————调用相应的useEffect，更新绘制信息【道路+检修区域】）
  var timerID2 = setTimeout(() => {
    setUpdate10min(!update10min);
  }, 600000);

  //———————————————————————————————————————————————其他函数（获取界面组件）
  //获取图例里包含每个badge的<div>（根据图例的种类）
  function getBadgeDiv(type) {
    var space = 20; //每个<div>到left之间的距离
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
      left: 360 + space,
      width: "200px",
    };
    return (
      <div style={divStyle}>
        <Badge color={colorBadge} text={type} />
      </div>
    );
  }

  //根据停车点状态获取相应的停车点<image>标签的image属性
  function getImageProperty(state) {
    //停车点状态【0-无任务、1-待巡检、2-巡检中、3-正常、4-预警、5-一般告警、6-严重告警、7-危急告警】
    switch (state) {
      case 0:
        return imageStationNoTask;
      case 1:
        return imageStationForCheck;
      case 2:
        return imageStationIsChecking;
      case 3:
        return imageStationNormal;
      case 4:
        return imageStationEarlyAlarm;
      case 5:
        return imageStationGeneralAlarm;
      case 6:
        return imageStationSeriousAlarm;
      case 7:
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

  //———————————————————————————————————————————————其他函数（REST请求）
  //添加地图检修区域POST请求
  function addDangerAreaPOST() {
    //————————————————————————————POST请求
    // 用URLSearchParams来传递参数
    let BodyParams = new URLSearchParams();
    BodyParams.append("x1", bodyParams.x1.toString());
    BodyParams.append("y1", bodyParams.y1.toString());
    BodyParams.append("x2", bodyParams.x2.toString());
    BodyParams.append("y2", bodyParams.y2.toString());
    BodyParams.append("startTime", bodyParams.startTime.toString());
    BodyParams.append("endTime", bodyParams.endTime.toString());
    BodyParams.append("detail", bodyParams.detail.toString());
    //发送POST请求
    postData("robots/dangerarea/add", BodyParams)
      .then((data) => {
        console.log("post结果", data);
        if (data.success) {
          //alert成功
          swal({
            title: "添加检修区域成功",
            text: "                 ",
            icon: "success",
            timer: 3000,
            buttons: false,
          });
          //CTT调用父组件函数（重新GET任务列表并刷新组件）
        } else {
          //alert失败
          swal({
            title: "添加检修区域失败",
            text:
              "请重新在地图上选择检修区域！错误信息：" + data.detail.toString(),
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
          title: "添加检修区域失败",
          text: "请重新在地图上选择检修区域！错误信息：" + error.toString(),
          icon: "error",
          timer: 3000,
          buttons: false,
        });
      });
  }

  //编辑地图检修区域POST请求
  function editDangerAreaPOST() {
    //————————————————————————————POST请求
    // 用URLSearchParams来传递参数
    let BodyParams = new URLSearchParams();
    BodyParams.append("uuid", bodyParams.uuid.toString());
    BodyParams.append("x1", bodyParams.x1.toString());
    BodyParams.append("y1", bodyParams.y1.toString());
    BodyParams.append("x2", bodyParams.x2.toString());
    BodyParams.append("y2", bodyParams.y2.toString());
    BodyParams.append("startTime", bodyParams.startTime.toString());
    BodyParams.append("endTime", bodyParams.endTime.toString());
    BodyParams.append("detail", bodyParams.detail.toString());
    //发送POST请求
    postData("robots/dangerarea/edit", BodyParams)
      .then((data) => {
        console.log("post结果", data);
        if (data.success) {
          //alert成功
          swal({
            title: "编辑检修区域成功",
            text: "                 ",
            icon: "success",
            timer: 3000,
            buttons: false,
          });
          //CTT调用父组件函数（重新GET任务列表并刷新组件）
        } else {
          //alert失败
          swal({
            title: "编辑检修区域失败",
            text: "请重新编辑检修区域！错误信息：" + data.detail.toString(),
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
          title: "编辑检修区域失败",
          text: "请重新编辑检修区域！错误信息：" + error.toString(),
          icon: "error",
          timer: 3000,
          buttons: false,
        });
      });
  }

  //删除地图检修区域DELETE请求
  function deleteDangerAreaDELETE() {
    //————————————————————————————DELETE请求
    //发送DELETE请求
    deleteData("task/delete" + bodyParams.uuid)
      .then((data) => {
        console.log("delete结果", data);
        if (data.success) {
          //alert成功
          swal({
            title: "删除检修区域成功",
            text: "                 ",
            icon: "success",
            timer: 3000,
            buttons: false,
          });
          //CTT调用父组件函数（重新GET任务列表并刷新组件）
        } else {
          //alert失败
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
        //alert失败
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
  //地图<Stage>的鼠标滑轮滚动事件处理函数
  function handleWheel(e) {
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

  //CTT地图<Stage>的鼠标左键双击事件处理函数
  function handleDblClick(e) {
    //阻止事件的默认行为
    // e.evt.preventDefault();

    console.log("进入左键双击事件");

    //实现鼠标右键双击添加新检修区域
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

  //———————————————————————————————————————————————其他函数（调试用）
  //CTT产生随机数
  function generateRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  //CTT随机获取车体的实时位置信息（Fake）
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
              generateRandomArbitrary(0, stageSize.map.width)
          )
        : null;
    newRobotPos.robotY =
      data && data.robotPos && data.robotPos.y + 1
        ? Math.round(
            (data.robotPos.y + 1) *
              generateRandomArbitrary(0, stageSize.map.height)
          )
        : null;
    newRobotPos.robotOrientation =
      data && data.robotPos && data.robotPos.fx + 1
        ? Math.round((data.robotPos.fx + 1) * generateRandomArbitrary(0, 360))
        : null;

    console.log("newRobotPos", newRobotPos);
    return newRobotPos;
  }

  //CTT按规律获取车体的实时位置信息（Fake）
  function getRobotPosFake1(data) {
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
              generateRandomArbitrary(0, stageSize.map.width - 300)
          )
        : null;
    newRobotPos.robotY =
      data && data.robotPos && data.robotPos.y + 1
        ? Math.round(
            (data.robotPos.y + 1) *
              generateRandomArbitrary(0, stageSize.map.height - 300)
          )
        : null;
    newRobotPos.robotOrientation =
      data && data.robotPos && data.robotPos.fx + 1
        ? Math.round((data.robotPos.fx + 1) * generateRandomArbitrary(0, 360))
        : null;

    console.log("newRobotPos", newRobotPos);
    return newRobotPos;
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
        </Portal>
      </Stage>
      {/* 地图 */}
      <Stage
        style={mapStyle}
        id="papa"
        ref={mapStageRef}
        width={stageSize.map.width}
        height={stageSize.map.height}
        draggable
        onWheel={(e) => handleWheel(e)}
        onDblClick={(e) => handleDblClick(e)}
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
              x={(item.X - stageSize.station.width / 2) * scale}
              y={(item.Y - stageSize.station.height / 2) * scale}
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
              draggable
              fill={dragState.isDragging ? "green" : "black"}
              shadowBlur={10}
              shadowOpacity={0.6}
              shadowOffsetX={dragState.isDragging ? 10 : 5}
              shadowOffsetY={dragState.isDragging ? 10 : 5}
              scaleX={dragState.isDragging ? 1.05 : 1}
              scaleY={dragState.isDragging ? 1.05 : 1}
              opacity={0.3}
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
            x={(robotPos.robotX - stageSize.robot.width / 2) * scale}
            y={(robotPos.robotY - stageSize.robot.height / 2) * scale}
            rotation={robotPos.robotOrientation}
            image={imageRobot}
            opacity={0.8}
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
