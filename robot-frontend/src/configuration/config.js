//———————————————————————————————————————————————服务器
//服务器地址
// const serverIP = "http://127.0.0.1:8080/";
// const serverIP = "http://112.126.66.90:8082/";//郑凯
// const serverIP = "http://192.168.1.120:8082/"; //局域网后台电脑
const serverIP = "103.149.26.221"; //风奇
//HTTP端口号
const httpPortNum = "8082";
//MQTT端口号
const mqttPortNum = "8083";
//HTTP请求服务器地址【导出】
const httpUrl = "http://" + serverIP + ":" + httpPortNum + "/";
//MQTT连接服务器地址【导出】
const mqttUrl = "ws://" + serverIP + ":" + mqttPortNum + "/mqtt";

//———————————————————————————————————————————————海康威视
//HD（IP、用户名、密码）【导出】
const HDCameraIP = "192.168.1.64";
const HDUserName = "admin";
const HDPassword = "Admin12345";
//IR（IP、用户名、密码）【导出】
const IRCameraIP = "192.168.1.40";
const IRUserName = "admin";
const IRPassword = "Admin12345";

//———————————————————————————————————————————————VLC
//rtsp地址【导出】
const rtspAddress = "rtsp://888888:888888@192.168.1.29:8554/stream1"; //？？？
// const rtspAddress = "rtsp://admin:zngdzx613@192.168.1.40:554/h264/ch01/main/av_stream";//海康威视

export { httpUrl, mqttUrl };
export { HDCameraIP, HDUserName, HDPassword };
export { IRCameraIP, IRUserName, IRPassword };
export { rtspAddress };
