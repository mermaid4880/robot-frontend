//packages
import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Label as Label1 } from "semantic-ui-react";
import { Typography, Card, CardContent } from "@material-ui/core"; 
import { PieChart, Pie, Cell } from "recharts";
import { Tooltip } from "antd";
import { Toast } from "primereact/toast";
//functions
import { getData, postData } from "../../../functions/requestDataFromAPI.js";
//images
import imgTaskSuspend_UP from "../../../images/pages/2.PageMonitor/2.TaskStatus/暂停任务_UP.png";
import imgTaskSuspend_DOWN from "../../../images/pages/2.PageMonitor/2.TaskStatus/暂停任务_DOWN.png";
import imgTaskResume_UP from "../../../images/pages/2.PageMonitor/2.TaskStatus/继续任务_UP.png";
import imgTaskResume_DOWN from "../../../images/pages/2.PageMonitor/2.TaskStatus/继续任务_DOWN.png";
import imgTaskTerminate_UP from "../../../images/pages/2.PageMonitor/2.TaskStatus/终止任务_UP.png";
import imgTaskTerminate_DOWN from "../../../images/pages/2.PageMonitor/2.TaskStatus/终止任务_DOWN.png";
import imgGoHome_UP from "../../../images/pages/2.PageMonitor/2.TaskStatus/一键返航_UP.png";
import imgGoHome_DOWN from "../../../images/pages/2.PageMonitor/2.TaskStatus/一键返航_DOWN.png";

//———————————————————————————————————————————————css
//root
const rootStyle = {
  marginLeft: "1.8rem",
  height: 125,
  width: 1265,
  display: "inline-block",
};
//cardContent
const cardContentStyle = {
  display: "flex",
  height: 125,
  width: 1265,
  paddingBottom: 0,
};
//绿色丝带标签
const labelStyle = {
  fontSize: 14,
  height: 26,
};
//饼图的展示区域
const pieChartStyle = {
  position: "relative",
  display: "inline-block",
  margin: "9px 0px 0px -60px",
  padding: "10px 0px 5px 0px",
  whiteSpace: "normal",
  wordBreak: "break-all",
  overflow: "hidden",
};
//饼图的展示区域（text）
const pieChartText = {
  fontSize: "1.1rem",
  whiteSpace: "normal",
  wordBreak: "break-all",
};
//标题的展示区域
const titleAreaStyle = {
  position: "absolute",
  display: "flex",
  width: "700px",
  margin: "18px 0px 0px 0px",
  padding: "10px 0px 5px 0px",
  verticalAlign: "center",
};
//每条标题的展示区域
const titleContainerStyle = {
  width: "600px",
  height: "30px",
  paddingBottom: "0.1rem",
  display: "flex",
  overflow: "hidden",
  alignItems: "center",
};
//百分比数据的展示区域
const itemsAreaStyle = {
  position: "relative",
  display: "flex",
  width: "600px",
  margin: "48px 0px 0px 0px",
  padding: "10px 0px 5px 0px",
  verticalAlign: "center",
};
//每条百分比数据的展示区域
const itemContainerStyle = {
  width: "270px",
  height: "30px",
  paddingBottom: "0.1rem",
  display: "flex",
  overflow: "hidden",
  alignItems: "center",
};
//每个按钮的区域
const buttonStyle = {
  position: "relative",
  display: "flex",
  width: "70px",
  margin: "18px 0px 0px 0px",
  padding: "10px 0px 5px 0px",
  verticalAlign: "center",
};

//———————————————————————————————————————————————Data
// "taskName": "全站巡检",                            巡检任务名称
// "meterCount": 1000,                               总巡检点数
// "inspectMeterCount": 200,                         已完成巡检点数
// "abnormalMeterCount": 23,                         异常巡检点数
// "nowMeterName": "110kV清国线母线侧泄露电流表C相",	 当前巡检点位名称（检测内容）
// "totalTime": 200,                                 预计巡检剩余时间
// "progress": 30,                                   巡检进度（百分比）

//获取展示区域的所有数据（当前巡检任务的实时信息）
function getRealtimeTaskInfoData(data) {
  var newData = {
    //当前巡检任务的实时信息
    taskName: "未知", //巡检任务名称
    meterCount: "未知", //总巡检点数
    inspectMeterCount: "未知", //已完成巡检点数
    abnormalMeterCount: "未知", //异常巡检点数
    nowMeterName: "未知", //当前巡检点位名称（检测内容）
    totalTime: "未知", //预计巡检剩余时间
    progress: "未知", //巡检进度（百分比）
  };

  //当前巡检任务的实时信息
  newData.taskName = data.taskName;
  newData.meterCount = data.meterCount;
  newData.inspectMeterCount = data.inspectMeterCount;
  newData.abnormalMeterCount = data.abnormalMeterCount;
  newData.nowMeterName = data.nowMeterName;
  newData.totalTime = data.totalTime;
  newData.progress = data.progress;

  // console.log("newData", newData);
  return newData;
}

//获取<Pie>中要展示的数据
function getPieData(realtimeTaskInfo) {
  var newPieData = [
    {
      name: "异常节点数",
      value: "未知",
      color: "#ffbcbc",
    },
    {
      name: "已完成节点数",
      value: "未知",
      color: "#99d8d0",
    },
    {
      name: "未完成节点数",
      value: "未知",
      color: "#b7efcd",
    }, //计算的
  ];
  newPieData[0].value = realtimeTaskInfo.abnormalMeterCount;
  newPieData[1].value = realtimeTaskInfo.inspectMeterCount;
  newPieData[2].value =
    realtimeTaskInfo.meterCount - realtimeTaskInfo.inspectMeterCount;

  // console.log("newPieData", newPieData);
  return newPieData;
}

function TaskStatus() {
  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useRef
  const toastRef = useRef(null); //<Toast>组件的ref

  //———————————————————————————————————————————————useState
  //本组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //当前巡检任务的实时信息
  const [realtimeTaskInfo, setRealtimeTaskInfo] = useState({
    taskName: "未知", //巡检任务名称
    meterCount: "未知", //总巡检点数
    inspectMeterCount: "未知", //已完成巡检点数
    abnormalMeterCount: "未知", //异常巡检点数
    nowMeterName: "未知", //当前巡检点位名称（检测内容）
    totalTime: "未知", //预计巡检剩余时间
    progress: "未知", //巡检进度（百分比）
  });

  //<Pie>中要展示的数据
  const [pieData, setPieData] = useState([
    {
      name: "异常节点数",
      value: "未知",
      color: "#ffbcbc",
    },
    {
      name: "已完成节点数",
      value: "未知",
      color: "#99d8d0",
    },
    {
      name: "未完成节点数",
      value: "未知",
      color: "#b7efcd",
    }, //计算的
  ]);

  //按钮图片的显示状态
  const [buttonStatus, setButtonStatus] = useState({
    imgTaskSuspend: imgTaskSuspend_UP,
    imgTaskResume: imgTaskResume_UP,
    imgTaskTerminate: imgTaskTerminate_UP,
    imgGoHome: imgGoHome_UP,
  });

  //———————————————————————————————————————————————Timer
  //开启定时器（重新获取当前巡检任务的实时信息、刷新组件）
  var timerID = setTimeout(() => {
    setUpdate(!update);
  }, 1500);

  //———————————————————————————————————————————————useEffect
  //当（本组件销毁时），销毁定时器（重新获取当前巡检任务的实时信息、刷新组件）
  useEffect(() => {
    //当组件销毁时，销毁定时器（重新获取当前巡检任务的实时信息、刷新组件）
    return () => {
      clearTimeout(timerID);
    };
  }, []);

  //当（本组件加载完成或需要更新时），GET请求获取当前巡检任务的实时信息
  useEffect(() => {
    //————————————————————————————GET请求
    getData("taskFinish/now/192.168.0.1")
      .then((data) => {
        // console.log("get结果", data);
        if (data.success) {
          var result = data.data;
          // console.log("result", result);
          //获取展示区域的所有数据（当前巡检任务的实时信息）
          const realtimeTaskInfoData = getRealtimeTaskInfoData(result);
          //设置当前巡检任务的实时信息
          setRealtimeTaskInfo(realtimeTaskInfoData);
          //获取<Pie>中要展示的数据
          const pieData = getPieData(realtimeTaskInfoData);
          //设置<Pie>中要展示的数据
          setPieData(pieData);
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

  //———————————————————————————————————————————————其他函数
  //获取每条数据前面的点点的样式
  function getItemDotStyle(color) {
    //每条数据前面的点点的样式
    return {
      width: 8,
      height: 8,
      backgroundColor: color,
      borderRadius: "50%",
    };
  }

  //——————————按钮部分
  //获取相应的按钮组件（根据按钮名称）
  function getButtonDiv(buttonName) {
    return (
      <div style={buttonStyle}>
        <Tooltip placement="top" title={buttonName}>
          <a>
            <img
              alt={buttonName}
              src={getButtonSrc(buttonName)}
              onMouseDown={() => {
                buttonMouseDownHandler(buttonName); //按钮按下事件处理函数
                setButtonStatusDOWN(buttonName); //设置按钮图片的显示为DOWN状态
              }}
              onMouseUp={() => {
                setButtonStatusUP(buttonName); //设置按钮图片的显示为UP状态
              }}
            />
          </a>
        </Tooltip>
      </div>
    );
  }

  //获取<img>标签的src（根据按钮名称）
  function getButtonSrc(buttonName) {
    switch (buttonName) {
      case "暂停任务":
        return buttonStatus.imgTaskSuspend;
      case "继续任务":
        return buttonStatus.imgTaskResume;
      case "终止任务":
        return buttonStatus.imgTaskTerminate;
      case "一键返航":
        return buttonStatus.imgGoHome;
      default:
        break;
    }
  }

  //按钮按下事件处理函数（根据按钮名称）
  function buttonMouseDownHandler(buttonName) {
    //根据按钮名称设置POST请求路径
    var path = ""; //POST请求路径
    switch (buttonName) {
      case "暂停任务":
        path = "pause";
        break;
      case "继续任务":
        path = "resume";
        break;
      case "终止任务":
        path = "terminate-all";
        break;
      case "一键返航":
        path = "goHome";
        break;
      default:
        path = "";
        break;
    }
    //发送POST请求
    postData("taskManager/" + path).then((data) => {
      console.log("post结果", data);
      this.toast.show({
        severity: "error",
        summary: "Error Message",
        detail: data.detail,
        life: 3000,
      });
    });
  }

  //设置按钮图片的显示为UP状态（按钮名字）
  function setButtonStatusUP(buttonName) {
    switch (buttonName) {
      case "暂停任务":
        setButtonStatus((prev) => {
          return { ...prev, imgTaskSuspend: imgTaskSuspend_UP };
        });
        break;
      case "继续任务":
        setButtonStatus((prev) => {
          return { ...prev, imgTaskResume: imgTaskResume_UP };
        });
        break;
      case "终止任务":
        setButtonStatus((prev) => {
          return { ...prev, imgTaskTerminate: imgTaskTerminate_UP };
        });
        break;
      case "一键返航":
        setButtonStatus((prev) => {
          return { ...prev, imgGoHome: imgGoHome_UP };
        });
        break;
      default:
        break;
    }
  }

  //设置按钮图片的显示为DOWN状态（按钮名字）
  function setButtonStatusDOWN(buttonName) {
    switch (buttonName) {
      case "暂停任务":
        setButtonStatus((prev) => {
          return { ...prev, imgTaskSuspend: imgTaskSuspend_DOWN };
        });
        break;
      case "继续任务":
        setButtonStatus((prev) => {
          return { ...prev, imgTaskResume: imgTaskResume_DOWN };
        });
        break;
      case "终止任务":
        setButtonStatus((prev) => {
          return { ...prev, imgTaskTerminate: imgTaskTerminate_DOWN };
        });
        break;
      case "一键返航":
        setButtonStatus((prev) => {
          return { ...prev, imgGoHome: imgGoHome_DOWN };
        });
        break;
      default:
        break;
    }
  }

  return (
    <Card style={rootStyle} raised>
      <Toast ref={(el) => (this.toast = el)} position="top-center" />
      <CardContent style={cardContentStyle}>
        <Typography style={labelStyle} color="textSecondary">
          <Label1 color="teal" ribbon>
            当前巡检任务信息
          </Label1>
        </Typography>
        {/* 当前巡检进度text + 饼饼 */}
        <PieChart style={pieChartStyle} width={280} height={90}>
          <text
            style={pieChartText}
            x={54}
            y={32}
            dx={5}
            dy={10}
            textAnchor="middle"
            verticalAnchor="middle"
            fill="#363636"
            scaleToFit={true}
          >
            当前巡检进度
          </text>
          <text
            style={pieChartText}
            x={168}
            y={32}
            dx={5}
            dy={10}
            textAnchor="middle"
            verticalAnchor="middle"
            fill="#363636"
            scaleToFit={true}
          >
            {realtimeTaskInfo.progress + "%"}
          </text>
          <Pie
            data={pieData}
            cx={168}
            cy={32}
            innerRadius={30}
            outerRadius={36}
            startAngle={0}
            endAngle={360}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map(({ color }, index) => (
              <Cell key={`cell-${index}`} fill={color} />
            ))}
          </Pie>
        </PieChart>
        {/* 标题（任务名称 + 检测内容） */}
        <div style={titleAreaStyle}>
          <div style={titleContainerStyle}>
            <div style={getItemDotStyle("#363636")} />
            <Typography style={{ whiteSpace: "nowrap" }}>
              &nbsp;
              {realtimeTaskInfo.taskName}
              &nbsp;
            </Typography>
            <Typography color="text" colorBrightness="secondary">
              &nbsp;{"（" + realtimeTaskInfo.nowMeterName + "）"}
            </Typography>
          </div>
        </div>
        {/* 各条完成百分比（根据pieData得到） */}
        <div style={itemsAreaStyle}>
          {pieData.map(({ name, value, color }) => (
            <div key={color} style={itemContainerStyle}>
              <div style={getItemDotStyle(color)} />
              <Typography style={{ whiteSpace: "nowrap" }}>
                &nbsp;{name}&nbsp;
              </Typography>
              <Typography color="text" colorBrightness="secondary">
                &nbsp;{value}
              </Typography>
            </div>
          ))}
        </div>
        {/* 各个按钮 */}
        {getButtonDiv("暂停任务")}
        {getButtonDiv("继续任务")}
        {getButtonDiv("终止任务")}
        {getButtonDiv("一键返航")}
      </CardContent>
    </Card>
  );
}

export default TaskStatus;
