// （室内）
//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Label as Label1 } from "semantic-ui-react";
import { Typography, Card, CardContent } from "@material-ui/core";
import { Alert } from "rsuite";
//functions
import { getData } from "../../../functions/requestDataFromAPI.js";
import { postData } from "../../../functions/requestDataFromAPI.js";
//images
import imgTime from "../../../images/pages/2.PageMonitor/3.IndoorEnvironmentInfo/时间.png";
import imgTemperature from "../../../images/pages/2.PageMonitor/3.IndoorEnvironmentInfo/温度.png";
import imgHumidity from "../../../images/pages/2.PageMonitor/3.IndoorEnvironmentInfo/湿度.png";
import imgLightOn from "../../../images/pages/2.PageMonitor/3.IndoorEnvironmentInfo/照明灯开.png";
import imgLightOff from "../../../images/pages/2.PageMonitor/3.IndoorEnvironmentInfo/照明灯关.png";
import imgSF6 from "../../../images/pages/2.PageMonitor/3.IndoorEnvironmentInfo/SF6.png";
import imgSoaked from "../../../images/pages/2.PageMonitor/3.IndoorEnvironmentInfo/水浸.png";
import imgRelayOn from "../../../images/pages/2.PageMonitor/3.IndoorEnvironmentInfo/继电器开.png";
import imgRelayOff from "../../../images/pages/2.PageMonitor/3.IndoorEnvironmentInfo/继电器关.png";

//———————————————————————————————————————————————css
//root
const rootStyle = {
  marginLeft: "1.8rem",
  width: 218,
  height: 495,
  display: "inline-block",
  marginTop: "0.5rem",
};
//cardContent
const cardContentStyle = {
  display: "flex",
  height: 495,
  width: 218,
  paddingBottom: 0,
};
//绿色丝带标签
const labelStyle = {
  fontSize: 14,
  height: 26,
};
//div
const divStyle = {
  display: "block",
  position: "absolute",
  margin: "25px 0px 0px -15px",
};
//一组数据的格式
const itemContainerStyle = {
  position: "relative",
  display: "flex",
  width: "200px",
  margin: "10px 7px 7px 0px",
  //padding: "10px 0px 5px 0px",
  verticalAlign: "center",
};
//每组数据中图片的格式
const itemImgStyle = {
  display: "block",
  alignItems: "center",
  justifyContent: "center",
  margin: "4px 0px 0px -20px",
  width: 40,
  height: 30,
  paddingRight: "10px",
};
//每组数据中数据值的格式
const itemValueStyle = {
  width: "100px",
  height: "40px",
  overflow: "hidden",
  margin: 0,
  paddingLeft: "5px",
  paddingTop: "6px",
  textAlign: "left",
};
//时间数据值的格式
const timeValueStyle = {
  width: "100px",
  height: "40px",
  overflow: "hidden",
  margin: 0,
  paddingLeft: "5px",
  paddingTop: "0px",
  textAlign: "left",
};

//获取室内环境信息所有数据（当前最新室内环境信息）
function getIndoorEnvironmentData(data) {
  var newData = {
    //当前最新室内环境信息
    time: "未知", //时间
    temperature: "未知", //温度
    humidity: "未知", //湿度
    illuminationStatus: "未知", //照明灯状态
    relayStatus: "未知", //继电器状态
    soaked: "未知", //水浸状态
    sf6: "未知", //SF6状态
  };

  //当前最新室内环境信息
  newData.time = data.time;
  newData.temperature = data.temperature;
  newData.humidity = data.humidity;
  newData.illuminationStatus = data.illuminationStatus;
  newData.relayStatus = data.relayStatus;
  newData.soaked = data.soaked;
  newData.sf6 = data.sf6;
  // console.log("newData", newData);
  return newData;
}

function EnvironmentInfo() {
  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //本组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //当前最新室内环境信息
  const [indoorEnvironmentData, setIndoorEnvironmentData] = useState({
    time: "未知", //时间
    temperature: "未知", //温度
    humidity: "未知", //湿度
    illuminationStatus: "未知", //照明灯状态
    relayStatus: "未知", //继电器状态
    soaked: "未知", //水浸状态
    sf6: "未知", //SF6状态
  });

  //———————————————————————————————————————————————Timer
  //开启定时器（重新获取当前最新气象信息、刷新组件）
  var timerID = setTimeout(() => {
    setUpdate(!update);
  }, 1500);

  //———————————————————————————————————————————————useEffect
  //当（本组件销毁时），销毁定时器（重新获取最新气象信息、刷新组件）
  useEffect(() => {
    //当组件销毁时，销毁定时器（重新获取最新气象信息、刷新组件）
    return () => {
      clearTimeout(timerID);
    };
  }, []);

  //当（本组件加载完成或需要更新时），GET请求获取最新气象信息
  useEffect(() => {
    //————————————————————————————GET请求
    getData("indoorEnvironment/weathers/latest")
      .then((data) => {
        // console.log("get结果", data);
        if (data.success) {
          var result = data.data;
          //console.log("result", result);
          //获取室内环境信息所有数据（当前最新室内环境信息）
          const indoorEnvData = getIndoorEnvironmentData(result);
          //设置当前最新室内环境信息
          setIndoorEnvironmentData(indoorEnvData);
        } else {
          //rsuite Alert异常信息
          Alert.warning("获取室内环境信息异常！异常信息：" + data.detail, 2000);
        }
      })
      .catch((error) => {
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
      });
  }, [update]);

  //获取一组环境数据（根据数据名称）
  function getItemDiv(itemName) {
    var imgSrc = ""; //<img>标签的src属性
    var value = ""; //<img>标签的alt属性
    var clickfunc = ""; //<img>标签的onclick属性
    switch (itemName) {
      case "时间":
        imgSrc = imgTime;
        value = indoorEnvironmentData.time;
        return (
          <div style={itemContainerStyle}>
            <img style={itemImgStyle} alt={itemName} src={imgSrc} />
            <div style={timeValueStyle}>{value}</div>
          </div>
        );
      case "温度":
        imgSrc = imgTemperature;
        value = indoorEnvironmentData.temperature;
        break;
      case "湿度":
        imgSrc = imgHumidity;
        value = indoorEnvironmentData.humidity;
        break;
      case "照明灯": //照明灯状态
        value = indoorEnvironmentData.illuminationStatus;
        if (value == "开启") {
          //HJJ 待确认
          imgSrc = imgLightOn;
          clickfunc = () => {
            Control("indoorEnvironment/lightOff");
          };
        } else {
          imgSrc = imgLightOff;
          clickfunc = () => {
            Control("indoorEnvironment/lightOn");
          };
        }
        break;
      case "继电器":
        value = indoorEnvironmentData.relayStatus;
        if (value == "开启") {
          //HJJ 待确认
          imgSrc = imgRelayOn;
          clickfunc = () => {
            Control("indoorEnvironment/relayOff");
          };
        } else {
          imgSrc = imgRelayOff;
          clickfunc = () => {
            Control("indoorEnvironment/relayOn");
          };
        }
        break;
      case "水浸":
        imgSrc = imgSoaked;
        value = indoorEnvironmentData.soaked;
        break;
      case "SF6":
        imgSrc = imgSF6;
        value = indoorEnvironmentData.sf6;
        break;
      default:
        break;
    }
    return (
      <div style={itemContainerStyle}>
        <img
          style={itemImgStyle}
          alt={itemName}
          src={imgSrc}
          onClick={clickfunc}
        />
        <div style={itemValueStyle}>{value}</div>
      </div>
    );
  }

  function Control(operation) {
    console.log("enter control:", operation);
    postData(operation)
      .then((data) => {
        if (data.success) {
          this.toast.show({
            severity: "success",
            summary: "Success Message",
            detail: data.detail,
            life: 3000,
          });
        } else {
          this.toast.show({
            severity: "error",
            summary: "Error Message",
            detail: data.detail,
            life: 3000,
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

  return (
    <Card style={rootStyle}>
      <CardContent style={cardContentStyle}>
        <Typography style={labelStyle} color="textSecondary">
          <Label1 color="teal" ribbon>
            环境信息
          </Label1>
        </Typography>
        <div style={divStyle}>
          {getItemDiv("时间")}
          {getItemDiv("温度")}
          {getItemDiv("湿度")}
          {getItemDiv("照明灯")}
          {getItemDiv("继电器")}
          {getItemDiv("水浸")}
          {getItemDiv("SF6")}
        </div>
      </CardContent>
    </Card>
  );
}

export default EnvironmentInfo;
