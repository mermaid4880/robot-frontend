//packages
import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Row } from "reactstrap";
import { Alert } from "rsuite";
import { Tooltip } from "antd";
//elements
import Radar from "./7_1.Radar.jsx";
import RobotStatusWheel from "./7_2.RobotStatusWheel.jsx";
//functions
import { postData, getData } from "../../../functions/requestDataFromAPI.js";
import {
  initWebsocket,
  destroyWebsocket,
  sendWebsocketMsg,
} from "../../../functions/websockets.js";
//images
//1类按钮
import imgPaizhao_UP from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons1/拍照_UP.png";
import imgPaizhao_DOWN from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons1/拍照_DOWN.png";
import imgChongdianmentingzhi_UP from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons1/充电门停止_UP.png";
import imgChongdianmentingzhi_DOWN from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons1/充电门停止_DOWN.png";
import imgHongwaiduijiao_UP from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons1/红外对焦_UP.png";
import imgHongwaiduijiao_DOWN from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons1/红外对焦_DOWN.png";
//2类按钮
import imgKongzhimoshi1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/控制模式1.png"; //自动
import imgKongzhimoshi2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/控制模式2.png"; //手动
import imgLuxiang1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/录像1.png";
import imgLuxiang2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/录像2.png";
import imgLuyin1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/录音1.png";
import imgLuyin2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/录音2.png";
import imgZhaoming1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/照明1.png";
import imgZhaoming2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/照明2.png";
import imgYushua1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/雨刷1.png";
import imgYushua2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/雨刷2.png";
import imgFangdieluo1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/防跌落1.png";
import imgFangdieluo2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/防跌落2.png";
import imgQianbizhang1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/前避障1.png";
import imgQianbizhang2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/前避障2.png";
import imgHoubizhang1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/后避障1.png";
import imgHoubizhang2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/后避障2.png";
import imgChongdianmen1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/充电门1.png";
import imgChongdianmen2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons2/充电门2.png";
//3类按钮
import imgChetiBackground from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/车体背景.png";
import imgChetiLeft_UP from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/车体向左_UP.png";
import imgChetiLeft_DOWN from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/车体向左_DOWN.png";
import imgChetiRight_UP from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/车体向右_UP.png";
import imgChetiRight_DOWN from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/车体向右_DOWN.png";
import imgChetiAhead_UP from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/车体向前_UP.png";
import imgChetiAhead_DOWN from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/车体向前_DOWN.png";
import imgChetiBack_UP from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/车体向后_UP.png";
import imgChetiBack_DOWN from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/车体向后_DOWN.png";
import imgYuntaiBackground from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/云台背景.png";
import imgYuntaiUp_UP from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/云台上_UP.png";
import imgYuntaiUp_DOWN from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/云台上_DOWN.png";
import imgYuntaiRight_UP from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/云台右_UP.png";
import imgYuntaiRight_DOWN from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/云台右_DOWN.png";
import imgYuntaiDown_UP from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/云台下_UP.png";
import imgYuntaiDown_DOWN from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/云台下_DOWN.png";
import imgYuntaiLeft_UP from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/云台左_UP.png";
import imgYuntaiLeft_DOWN from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/云台左_DOWN.png";
import imgYuntaiBianbeiAdd_UP from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/变倍加_UP.png";
import imgYuntaiBianbeiAdd_DOWN from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/变倍加_DOWN.png";
import imgYuntaiBianbeiSub_UP from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/变倍减_UP.png";
import imgYuntaiBianbeiSub_DOWN from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/变倍减_DOWN.png";
import imgYuntaiJiaojuAdd_UP from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/焦距加_UP.png";
import imgYuntaiJiaojuAdd_DOWN from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/焦距加_DOWN.png";
import imgYuntaiJiaojuSub_UP from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/焦距减_UP.png";
import imgYuntaiJiaojuSub_DOWN from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons3/焦距减_DOWN.png";
//4类按钮
import imgDuijiang1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons4/对讲1.png";
import imgDuijiang2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/buttons4/对讲2.png";

//———————————————————————————————————————————————css
const useStyles = makeStyles({
  root: {
    marginLeft: "1.3rem",
    marginTop: "0.5rem",
    width: 625,
    height: 516,
  },
  buttonArea: {
    marginLeft: "28px",
    marginTop: "20px",
    width: "620px",
    height: "80px",
    overflow: "hidden",
  },
  button: {
    width: "83px",
    height: "50px",
    overflow: "hidden",
    float: "left",
  },
  radar: {
    width: "281px",
    height: "200px",
    float: "left",
    overflow: "hidden",
    marginLeft: "0px",
  },
  status: {
    width: "300px",
    height: "200px",
    float: "right",
    overflow: "hidden",
    marginRight: "60px",
  },
  cheti: {
    width: "150px",
    height: "140px",
    float: "left",
    align: "center",
    marginTop: "20px",
    marginLeft: "120px",
    borderLeftWidth: "1px",
    // borderLeftColor:#ccc,
    borderRightWidth: "1px",
    // borderRightColor:#ccc,
    overflow: "hidden",
  },
  chetiLeft: {
    position: "relative",
    top: "-92px",
    left: "6px",
  },
  chetiRight: {
    position: "relative",
    top: "-92px",
    left: "60px",
  },
  chetiAhead: {
    position: "relative",
    top: "-140px",
    left: "-27px",
  },
  chetiBack: {
    position: "relative",
    top: "-79px",
    left: "53px",
  },
  yuntai: {
    width: "170px",
    height: "150px",
    float: "left",
    align: "center",
    marginLeft: "110px",
    marginTop: "23px",
    overflow: "hidden",
  },
  yuntaiUp: {
    position: "relative",
    top: "-141px",
    left: "62px",
  },
  yuntaiRight: {
    position: "relative",
    top: "-92px",
    left: "88px",
  },
  yuntaiDown: {
    position: "relative",
    top: "-40px",
    left: "12px",
  },
  yuntaiLeft: {
    position: "relative",
    top: "-92px",
    left: "-64px",
  },
  yuntaiBianbei1: {
    position: "relative",
    top: "-107px",
    left: "-51px",
  },
  yuntaiBianbei2: {
    position: "relative",
    top: "-107px",
    left: "-50px",
  },
  yuntaiJiaoju1: {
    position: "relative",
    top: "-112px",
    left: "49px",
  },
  yuntaiJiaoju2: {
    position: "relative",
    top: "-112px",
    left: "50px",
  },
});

//———————————————————————————————————————————————全局函数
//修改jsonObj，规则见例子（注意：参数key需为字符串格式）
function modifyJsonObj(jsonObj, key, oldValue, newValue) {
  let newJsonObj = JSON.parse(
    JSON.stringify(jsonObj).replace(
      '"' + key + '":{"status":"' + oldValue + '"',
      '"' + key + '":{"status":"' + newValue + '"'
    )
  );
  // console.log("newJsonObj", newJsonObj);
  return newJsonObj;
}
// 例子：modifyJsonObj(jsonObj1, "paizhao", "UP", "DOWN");
// const jsonObj1 = {
//   paizhao: {
//     status: "UP",                        ------->          status: "DOWN",
//     imgUp: imgPaizhao_UP,
//     imgDown: imgPaizhao_DOWN,
//     text: "拍照",
//     API: "control/vl/capture_picture",
//   },
//   ...
// }

function ControlPanelWheel() {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useRef
  const ws = useRef(null); //存放websocket对象的ref

  //———————————————————————————————————————————————useState
  //1类按钮（按钮按下和抬起状态对应不同按钮图片，按下时触发POST请求）的状态
  //【拍照、充电门停止、红外对焦】
  const [buttons1, setButtons1] = useState({
    paizhao: {
      status: "UP", //按钮状态【"UP"-按钮抬起、"DOWN"-按钮按下】
      imgUp: imgPaizhao_UP, //按钮抬起时的图片
      imgDown: imgPaizhao_DOWN, //按钮按下时的图片
      textUp: "拍照", //按钮的操作提示
      API: "control/vl/capture_picture", //按钮按下时触发的POST请求url
    },
    chongdianmentingzhi: {
      status: "UP",
      imgUp: imgChongdianmentingzhi_UP,
      imgDown: imgChongdianmentingzhi_DOWN,
      textUp: "充电门停止",
      API: "control/door/control?command=stop",
    },
    IRduijiao: {
      status: "UP",
      imgUp: imgHongwaiduijiao_UP,
      imgDown: imgHongwaiduijiao_DOWN,
      textUp: "红外自动对焦",
      API: "control/ir/focus",
    },
  });

  //2类按钮（按钮通过鼠标点击在两种状态中相互切换，每种状态对应不同的按钮图片、操作提示和点击时触发POST请求）的状态
  //【控制模式：手动/自动】【录像、录音、照明灯、雨刷、防跌落、前避障、后避障、充电门：关闭/开启】
  const [buttons2, setButtons2] = useState({
    kongzhimoshi: {
      status: "STATE1", //按钮状态【"STATE1"-按钮状态1、"STATE2"-按钮状态2】
      img1: imgKongzhimoshi1, //按钮状态1对应的图片
      img2: imgKongzhimoshi2, //按钮状态2对应的图片
      text1: "切换为自动模式", //按钮状态1对应的操作提示
      text2: "切换为手动模式", //按钮状态2对应的操作提示
      API1: "robotMode/backEndControl", //按钮状态1对应的点击触发POST请求url
      API2: "robotMode/task", //按钮状态2对应的点击触发POST请求url
    },
    luxiang: {
      status: "STATE1",
      img1: imgLuxiang1,
      img2: imgLuxiang2,
      text1: "开始录像",
      text2: "停止录像",
      API1: "control/vl/record_video/start",
      API2: "control/vl/record_video/stop",
    },
    luyin: {
      status: "STATE1",
      img1: imgLuyin1,
      img2: imgLuyin2,
      text1: "开始录音",
      text2: "停止录音",
      API1: "control/vl/record_voice/start",
      API2: "control/vl/record_voice/stop",
    },
    zhaoming: {
      status: "STATE1",
      img1: imgZhaoming1,
      img2: imgZhaoming2,
      text1: "打开照明灯",
      text2: "关闭照明灯",
      API1: "control/ptz/headlampOn",
      API2: "control/ptz/headlampOff",
    },
    yushua: {
      status: "STATE1",
      img1: imgYushua1,
      img2: imgYushua2,
      text1: "打开雨刷",
      text2: "关闭雨刷",
      API1: "control/ptz/wiperOn",
      API2: "control/ptz/wiperOff",
    },
    fangdieluo: {
      status: "STATE1",
      img1: imgFangdieluo1,
      img2: imgFangdieluo2,
      text1: "打开防跌落",
      text2: "关闭防跌落",
      API1: "control/drop_sensor/open",
      API2: "control/drop_sensor/close",
    },
    qianbizhang: {
      status: "STATE1",
      img1: imgQianbizhang1,
      img2: imgQianbizhang2,
      text1: "打开前避障",
      text2: "关闭前避障",
      API1: "control/front_obstacle_sensor/open",
      API2: "control/front_obstacle_sensor/close",
    },
    houbizhang: {
      status: "STATE1",
      img1: imgHoubizhang1,
      img2: imgHoubizhang2,
      text1: "打开后避障",
      text2: "关闭后避障",
      API1: "control/back_obstacle_sensor/open",
      API2: "control/back_obstacle_sensor/close",
    },
    chongdianmen: {
      status: "STATE1",
      img1: imgChongdianmen1,
      img2: imgChongdianmen2,
      text1: "打开充电门",
      text2: "关闭充电门",
      API1: "control/door/control?command=open",
      API2: "control/door/control?command=close",
    },
  });

  //3类控制按钮（按钮通过鼠标左键按下和抬起在两种状态中相互切换，每种状态对应不同的按钮图片、操作提示和POST请求
  //【车体前、后、左、右】【云台上、下、左、右、变倍+、变倍-、调焦+、调焦-】
  const [buttons3, setButtons3] = useState({
    chetiLeft: {
      status: "UP", //按钮状态【"UP"-鼠标左键抬起、"DOWN"-鼠标左键按下】
      style: classes.chetiLeft, //按钮图片样式
      imgUp: imgChetiLeft_UP, //鼠标左键抬起时的图片
      imgDown: imgChetiLeft_DOWN, //鼠标左键按下时的图片
      textUp: "车体向左", //鼠标左键抬起时的操作提示
      textDown: "车体停止", //鼠标左键按下时的操作提示
      APIUp: "control/robot-motion?operation=left", //鼠标左键抬起时触发的POST请求url
      APIDown: "control/robot-motion?operation=stop", //鼠标左键按下时触发的POST请求url
    },
    chetiAhead: {
      status: "UP",
      style: classes.chetiAhead,
      imgUp: imgChetiAhead_UP,
      imgDown: imgChetiAhead_DOWN,
      textUp: "车体向前",
      textDown: "车体停止",
      APIUp: "control/robot-motion?operation=ahead",
      APIDown: "control/robot-motion?operation=stop",
    },
    chetiRight: {
      status: "UP",
      style: classes.chetiRight,
      imgUp: imgChetiRight_UP,
      imgDown: imgChetiRight_DOWN,
      textUp: "车体向右",
      textDown: "车体停止",
      APIUp: "control/robot-motion?operation=right",
      APIDown: "control/robot-motion?operation=stop",
    },
    chetiBack: {
      status: "UP",
      style: classes.chetiBack,
      imgUp: imgChetiBack_UP,
      imgDown: imgChetiBack_DOWN,
      textUp: "车体向后",
      textDown: "车体停止",
      APIUp: "control/robot-motion?operation=back",
      APIDown: "control/robot-motion?operation=stop",
    },
    yuntaiUp: {
      status: "UP",
      style: classes.yuntaiUp,
      imgUp: imgYuntaiUp_UP,
      imgDown: imgYuntaiUp_DOWN,
      textUp: "云台向上",
      textDown: "云台停止",
      APIUp: "control/ptz/up",
      APIDown: "control/ptz/stop",
    },
    yuntaiRight: {
      status: "UP",
      style: classes.yuntaiRight,
      imgUp: imgYuntaiRight_UP,
      imgDown: imgYuntaiRight_DOWN,
      textUp: "云台向右",
      textDown: "云台停止",
      APIUp: "control/ptz/right",
      APIDown: "control/ptz/stop",
    },
    yuntaiDown: {
      status: "UP",
      style: classes.yuntaiDown,
      imgUp: imgYuntaiDown_UP,
      imgDown: imgYuntaiDown_DOWN,
      textUp: "云台向下",
      textDown: "云台停止",
      APIUp: "control/ptz/down",
      APIDown: "control/ptz/stop",
    },
    yuntaiLeft: {
      status: "UP",
      style: classes.yuntaiLeft,
      imgUp: imgYuntaiLeft_UP,
      imgDown: imgYuntaiLeft_DOWN,
      textUp: "云台向左",
      textDown: "云台停止",
      APIUp: "control/ptz/left",
      APIDown: "control/ptz/stop",
    },
    yuntaiBianbei1: {
      status: "UP",
      style: classes.yuntaiBianbei1,
      imgUp: imgYuntaiBianbeiAdd_UP,
      imgDown: imgYuntaiBianbeiAdd_DOWN,
      textUp: "云台变倍加",
      textDown: "云台变倍停止",
      APIUp: "control/vl/zoom/in",
      APIDown: "control/vl/zoom/stop",
    },
    yuntaiBianbei2: {
      status: "UP",
      style: classes.yuntaiBianbei2,
      imgUp: imgYuntaiBianbeiSub_UP,
      imgDown: imgYuntaiBianbeiSub_DOWN,
      textUp: "云台变倍减",
      textDown: "云台变倍停止",
      APIUp: "control/vl/zoom/out",
      APIDown: "control/vl/zoom/stop",
    },
    yuntaiJiaoju1: {
      status: "UP",
      style: classes.yuntaiJiaoju1,
      imgUp: imgYuntaiJiaojuAdd_UP,
      imgDown: imgYuntaiJiaojuAdd_DOWN,
      textUp: "云台焦距加",
      textDown: "云台调焦停止",
      APIUp: "control/vl/focus/in",
      APIDown: "control/vl/focus/stop",
    },
    yuntaiJiaoju2: {
      status: "UP",
      style: classes.yuntaiJiaoju2,
      imgUp: imgYuntaiJiaojuSub_UP,
      imgDown: imgYuntaiJiaojuSub_DOWN,
      textUp: "云台焦距加",
      textDown: "云台调焦停止",
      APIUp: "control/vl/focus/in",
      APIDown: "control/vl/focus/stop",
    },
  });

  //4类按钮（按钮通过鼠标点击在两种状态中相互切换，每种状态对应不同的按钮图片、操作提示和点击时触发websocket指令发送）的状态
  //【对讲：停止/开启】
  const [buttons4, setButtons4] = useState({
    duijiang: {
      status: "STATE1", //按钮状态【"STATE1"-按钮状态1、"STATE2"-按钮状态2】
      img1: imgDuijiang1, //按钮状态1对应的图片
      img2: imgDuijiang2, //按钮状态2对应的图片
      text1: "开始对讲", //按钮状态1对应的操作提示
      text2: "停止对讲", //按钮状态2对应的操作提示
      message1: "voiceTalk:start", //按钮状态1对应的点击触发websocket发送的指令
      message2: "voiceTalk:stop", //按钮状态2对应的点击触发websocket发送的指令
    },
  });

  //———————————————————————————————————————————————useEffect
  //当组件加载完成后
  useEffect(() => {
    //————————————————————————————websocket
    //初始化websocket
    ws.current = initWebsocket("voiceTalk");
    //接收websocket消息
    recvWebsocketRecMsg(ws.current);

    //组件销毁时
    return () => {
      //————————————————————————————websocket
      //销毁websocket
      destroyWebsocket(ws.current, "voiceTalk");
    };
  }, []);

  //———————————————————————————————————————————————其他函数（websocket相关）
  //接收websocket消息（设置接收消息处理函数、设置接收消息异常处理）
  function recvWebsocketRecMsg(ws) {
    try {
      //——————设置接收消息处理函数
      ws.onmessage = function (event) {
        var msg = event.data;
        console.log("event", event);
        switch (msg) {
          case "voiceTalk:startSuccess": //开始对讲成功
            //rsuite Alert开始对讲成功
            Alert.success("开始对讲成功！", 3000);
            //设置4类按钮的状态（相应的按钮状态设为"STATE2"）
            setButtons4(
              modifyJsonObj(buttons4, "duijiang", "STATE1", "STATE2")
            );
            break;
          case "voiceTalk:startFailed": //开始对讲失败
            //rsuite Alert开始对讲失败
            Alert.error("开始对讲失败！", 0);
            break;
          case "voiceTalk:stopSuccess": //结束对讲成功
            //rsuite Alert结束对讲成功
            Alert.success("结束对讲成功！", 3000);
            //设置4类按钮的状态（相应的按钮状态设为"STATE1"）
            setButtons4(
              modifyJsonObj(buttons4, "duijiang", "STATE2", "STATE1")
            );
            break;
          case "voiceTalk:stopFailed": //结束对讲失败
            //rsuite Alert结束对讲失败
            Alert.error("结束对讲失败！", 0);
            break;
          default:
            //rsuite Alert收到的消息
            Alert.info("WebSocket消息内容：" + msg, 3000);
            break;
        }
      };
    } catch (ex) {
      //——————设置接收消息异常处理
      //rsuite Alert异常：接收消息
      Alert.error("WebSocket接收消息异常！异常信息：" + ex.message, 0);
    }
  }

  //———————————————————————————————————————————————其他函数（获取界面组件）
  //获取1类按钮组件（根据按钮状态和按钮名称）
  function getButton1Div(button, buttonName) {
    //按钮文字提示
    var hint = button.textUp;
    //按钮图片
    var img = button.status === "UP" ? button.imgUp : button.imgDown;
    //POST请求url
    var url = button.API;

    return (
      <div className={classes.button}>
        <Tooltip placement="bottom" title={hint}>
          <a>
            <img
              alt={hint}
              src={img}
              onMouseDown={() => {
                //设置1类按钮的状态（相应的按钮状态设为"DOWN"）
                setButtons1(modifyJsonObj(buttons1, buttonName, "UP", "DOWN"));
                //发送POST请求（POST请求url，按钮的状态）
                controlPOST(url, button);
              }}
              onMouseUp={() => {
                //设置1类按钮的状态（相应的按钮状态设为"UP"）
                setButtons1(modifyJsonObj(buttons1, buttonName, "DOWN", "UP"));
              }}
            />
          </a>
        </Tooltip>
      </div>
    );
  }

  //获取2类按钮组件（根据按钮状态和按钮名称）
  function getButton2Div(button, buttonName) {
    //按钮文字提示
    var hint = button.status === "STATE1" ? button.text1 : button.text2;
    //按钮图片
    var img = button.status === "STATE1" ? button.img1 : button.img2;
    //POST请求url
    var url = button.status === "STATE1" ? button.API1 : button.API2;

    return (
      <div className={classes.button}>
        <Tooltip placement="bottom" title={hint}>
          <a>
            <img
              alt={hint}
              src={img}
              onClick={() => {
                //发送POST请求
                controlPOSTAndSetButtons2(url, button, buttonName);
              }}
            />
          </a>
        </Tooltip>
      </div>
    );
  }

  //获取3类按钮组件（根据按钮状态和按钮名称）
  function getButton3Div(button, buttonName) {
    //按钮文字提示
    var hint = button.status === "UP" ? button.textUp : button.textDown;
    //按钮图片
    var img = button.status === "UP" ? button.imgUp : button.imgDown;
    //POST请求url
    var url = button.status === "UP" ? button.APIUp : button.APIDown;

    return (
      // <Tooltip placement="top" title={hint}>
      <a>
        <img
          className={button.style}
          alt={hint}
          src={img}
          onMouseDown={() => {
            //设置3类按钮的状态（相应的按钮状态设为"DOWN"）
            setButtons3(modifyJsonObj(buttons3, buttonName, "UP", "DOWN"));
            //发送POST请求（POST请求url，按钮的状态）
            controlPOST(url, button);
          }}
          onMouseUp={() => {
            //设置3类按钮的状态（相应的按钮状态设为"UP"）
            setButtons3(modifyJsonObj(buttons3, buttonName, "DOWN", "UP"));
            //发送POST请求（POST请求url，按钮的状态）
            controlPOST(url, button);
          }}
        />
      </a>
      // </Tooltip>
    );
  }

  //获取4类按钮组件（根据按钮状态和按钮名称）
  function getButton4Div(button) {
    //按钮文字提示
    var hint = button.status === "STATE1" ? button.text1 : button.text2;
    //按钮图片
    var img = button.status === "STATE1" ? button.img1 : button.img2;

    return (
      <div className={classes.button}>
        <Tooltip placement="bottom" title={hint}>
          <a>
            <img
              alt={hint}
              src={img}
              onClick={() => {
                //发送websocket消息
                controlWebsocket(button);
              }}
            />
          </a>
        </Tooltip>
      </div>
    );
  }

  //———————————————————————————————————————————————其他函数（按钮事件响应调用）
  //发送POST请求（POST请求url，按钮的状态）
  //1类、3类按钮调用
  function controlPOST(url, button) {
    postData(url)
      .then((data) => {
        if (data.success) {
          //rsuite Alert成功
          // Alert.success(
          //   button.status === "UP"
          //     ? button.textUp + "成功！"
          //     : button.textDown + "成功！" + data.detail,
          //   3000
          // );
        } else {
          //rsuite Alert失败
          Alert.error(
            button.status === "UP"
              ? button.textUp + "失败！"
              : button.textDown + "失败！" + data.detail,
            0
          );
        }
      })
      .catch((error) => {
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
        //rsuite Alert失败
        Alert.error(
          button.status === "UP"
            ? button.textUp + "失败！"
            : button.textDown + "失败！" + error.toString(),
          0
        );
      });
  }

  //发送POST请求、设置2类按钮的状态（POST请求url，按钮的状态，按钮名称的key字符串）
  //2类按钮调用
  function controlPOSTAndSetButtons2(url, button, buttonName) {
    //发送POST请求
    postData(url)
      .then((data) => {
        if (data.success) {
          //rsuite Alert成功
          // Alert.success(
          //   button.status === "STATE1"
          //     ? button.text1 + "成功！"
          //     : button.text2 + "成功！" + data.detail,
          //   3000
          // );
          //设置2类按钮的状态（根据当前的按钮状态切换）
          button.status === "STATE1"
            ? setButtons2(
                modifyJsonObj(buttons2, buttonName, "STATE1", "STATE2")
              )
            : setButtons2(
                modifyJsonObj(buttons2, buttonName, "STATE2", "STATE1")
              );
        } else {
          //rsuite Alert失败
          Alert.error(
            button.status === "STATE1"
              ? button.text1 + "失败！"
              : button.text2 + "失败！" + data.detail,
            0
          );
        }
      })
      .catch((error) => {
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
        //rsuite Alert失败
        Alert.error(
          button.status === "STATE1"
            ? button.text1 + "失败！"
            : button.text2 + "失败！" + error.toString(),
          0
        );
      });
  }

  //发送Websocket消息（按钮的状态）
  //4类按钮调用
  function controlWebsocket(button) {
    button.status === "STATE1"
      ? sendWebsocketMsg(ws.current, button.message1, "voiceTalk")
      : sendWebsocketMsg(ws.current, button.message2, "voiceTalk");
  }

  return (
    <Paper className={classes.root} elevation="10" raised>
      <div className={classes.buttonArea}>
        {getButton4Div(buttons4.duijiang)}
        {getButton1Div(buttons1.paizhao, "paizhao")}
        {getButton2Div(buttons2.zhaoming, "zhaoming")}
        {getButton2Div(buttons2.qianbizhang, "qianbizhang")}
        {getButton2Div(buttons2.chongdianmen, "chongdianmen")}
        {getButton2Div(buttons2.fangdieluo, "fangdieluo")}
        {getButton1Div(buttons1.IRduijiao, "IRduijiao")}
        {getButton2Div(buttons2.luyin, "luyin")}
        {getButton2Div(buttons2.luxiang, "luxiang")}
        {getButton2Div(buttons2.yushua, "yushua")}
        {getButton2Div(buttons2.houbizhang, "houbizhang")}
        {getButton1Div(buttons1.chongdianmentingzhi, "chongdianmentingzhi")}
        {getButton2Div(buttons2.kongzhimoshi, "kongzhimoshi")}
      </div>
      <Row>
        <div className={classes.radar}>{/* <Radar /> */}</div>
        <div className={classes.status}>
          <RobotStatusWheel />
        </div>
      </Row>
      <div className={classes.cheti}>
        <img alt="车体底图" src={imgChetiBackground} />
        {getButton3Div(buttons3.chetiLeft, "chetiLeft")}
        {getButton3Div(buttons3.chetiRight, "chetiRight")}
        {getButton3Div(buttons3.chetiAhead, "chetiAhead")}
        {getButton3Div(buttons3.chetiBack, "chetiBack")}
      </div>
      <div className={classes.yuntai}>
        <img alt="云台底图" src={imgYuntaiBackground} />
        {getButton3Div(buttons3.yuntaiUp, "yuntaiUp")}
        {getButton3Div(buttons3.yuntaiRight, "yuntaiRight")}
        {getButton3Div(buttons3.yuntaiDown, "yuntaiDown")}
        {getButton3Div(buttons3.yuntaiLeft, "yuntaiLeft")}
        {getButton3Div(buttons3.yuntaiBianbei1, "yuntaiBianbei1")}
        {getButton3Div(buttons3.yuntaiBianbei2, "yuntaiBianbei2")}
        {getButton3Div(buttons3.yuntaiJiaoju1, "yuntaiJiaoju1")}
        {getButton3Div(buttons3.yuntaiJiaoju2, "yuntaiJiaoju2")}
      </div>
    </Paper>
  );
}

export default ControlPanelWheel;
