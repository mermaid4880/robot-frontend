//configuration
import {
  wsUrl1,
  wsUrl2,
  wsUrl3,
  wsUrl_voiceTalk,
} from "../configuration/config.js";
//packages
import { Alert } from "rsuite";

//————————————————————————————初始化websocket（创建连接、设置onclose、onerror和未知异常处理）
function initWebsocket(groupName) {
  console.log("进入initWebsocket！", "groupName：", groupName);
  //——————创建连接
  var ws; //websocket客户端
  var alertTitle; //弹出的rsuite Alert的title
  switch (groupName) {
    case "group1":
      ws = new WebSocket(wsUrl1);
      alertTitle = "初始化WebSocket(1)";
      break;
    case "group2":
      ws = new WebSocket(wsUrl2);
      alertTitle = "初始化WebSocket(2)";
      break;
    case "group3":
      ws = new WebSocket(wsUrl3);
      alertTitle = "初始化WebSocket(3)";
      break;
    case "voiceTalk":
      ws = new WebSocket(wsUrl_voiceTalk);
      alertTitle = "初始化WebSocket(对讲)";
      break;
    default:
      break;
  }

  try {
    //——————设置onclose连接关闭处理
    ws.onclose = function (event) {
      //rsuite Alert：onclose
      // Alert.error(alertTitle + "：onclose！", 0);
    };
    //——————设置onerror异常处理
    ws.onerror = function (event) {
      //rsuite Alert异常：onerror
      Alert.error(alertTitle + "：onerror异常！", 0);
    };
  } catch (ex) {
    //——————设置未知异常处理
    //rsuite Alert异常：未知
    Alert.error(alertTitle + "未知异常！异常信息：" + ex.message, 0);
  }
  return ws;
}

//————————————————————————————销毁websocket（关闭连接、设置关闭连接异常处理）
function destroyWebsocket(ws, groupName) {
  console.log("进入destroyWebsocket！", "ws：", ws, "groupName：", groupName);
  var alertTitle; //弹出的rsuite Alert的title
  switch (groupName) {
    case "group1":
      alertTitle = "销毁WebSocket(1)";
      break;
    case "group2":
      alertTitle = "销毁WebSocket(2)";
      break;
    case "group3":
      alertTitle = "销毁WebSocket(3)";
      break;
    case "voiceTalk":
      alertTitle = "销毁WebSocket(对讲)";
      break;
    default:
      break;
  }
  try {
    //——————关闭连接
    ws.close();
  } catch (ex) {
    //——————设置关闭异常处理
    //rsuite Alert异常：关闭连接
    Alert.error(alertTitle + "未知异常！异常信息：" + ex.message, 0);
  }
}

//————————————————————————————发送websocket消息（发送消息、设置发送消息异常处理）
function sendWebsocketMsg(ws, msg, groupName) {
  // console.log("发送的websocket消息：", msg);
  var alertTitle; //弹出的rsuite Alert的title
  switch (groupName) {
    case "group1":
      alertTitle = "发送WebSocket(1)";
      break;
    case "group2":
      alertTitle = "发送WebSocket(2)";
      break;
    case "group3":
      alertTitle = "发送WebSocket(3)";
      break;
    case "voiceTalk":
      alertTitle = "发送WebSocket(对讲)";
      break;
    default:
      break;
  }
  try {
    //——————发送消息
    if (msg) {
      ws.send(msg);
    }
  } catch (ex) {
    //——————设置发送消息异常处理
    //rsuite Alert异常：发送消息
    Alert.error(alertTitle + "发送消息异常！异常信息：" + ex.message, 0);
  }
}

export { initWebsocket, destroyWebsocket, sendWebsocketMsg };
