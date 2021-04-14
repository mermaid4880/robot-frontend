// （轮式湖南阳光电力）

//———————————————————————————————————————————————服务器
//服务器地址
const serverIP = "127.0.0.1"; //本机
// const serverIP = "103.149.26.221"; //风奇
// const serverIP = "112.126.66.90"; //郑凯
// const serverIP = "192.168.0.120"; //局域网后台电脑
//HTTP端口号
const httpPortNum = "8082";
//MQTT端口号
const mqttPortNum = "8083";
//Websocket端口号
const wsPortNum = "8082";
//HTTP请求服务器地址【导出】
const httpUrl = "http://" + serverIP + ":" + httpPortNum + "/";
//MQTT连接服务器地址【导出】
const mqttUrl = "ws://" + serverIP + ":" + mqttPortNum + "/mqtt";
//Websocket连接服务器地址（通用）【导出】
const wsUrl1 = "ws://" + serverIP + ":" + wsPortNum + "/websocket/group1";
const wsUrl2 = "ws://" + serverIP + ":" + wsPortNum + "/websocket/group2";
const wsUrl3 = "ws://" + serverIP + ":" + wsPortNum + "/websocket/group3";
//Websocket连接服务器地址（对讲专用）【导出】
const wsUrl_voiceTalk = "ws://127.0.0.1:8900";

//———————————————————————————————————————————————海康威视
//HD（IP、用户名、密码）【导出】
const HDCameraIP = "192.168.0.64";
const HDUserName = "admin";
const HDPassword = "Admin12345";
//IR（IP、用户名、密码）【导出】
const IRCameraIP = "192.168.0.40";
const IRUserName = "admin";
const IRPassword = "admin";

//———————————————————————————————————————————————VLC
//rtsp地址【导出】
const rtspAddress = "rtsp://admin:admin@192.168.0.40"; //？？波普
// const rtspAddress =
//   "rtsp://admin:admin@192.168.0.40:554/h264/ch01/main/av_stream"; //海康

export { httpUrl, mqttUrl, wsUrl1, wsUrl2, wsUrl3, wsUrl_voiceTalk };
export { HDCameraIP, HDUserName, HDPassword };
export { IRCameraIP, IRUserName, IRPassword };
export { rtspAddress };
