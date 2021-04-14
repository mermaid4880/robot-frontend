// 3.EnvironmentInfo（室外）
//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Label as Label1 } from "semantic-ui-react";
import { Typography, Card, CardContent } from "@material-ui/core";
//functions
import { getData } from "../../../functions/requestDataFromAPI.js";
//images
import imgWindPower from "../../../images/pages/2.PageMonitor/3.OutdoorEnvironmentInfo/风力.png";
import imgWindDirection from "../../../images/pages/2.PageMonitor/3.OutdoorEnvironmentInfo/风向.png";
import imgAirPressure from "../../../images/pages/2.PageMonitor/3.OutdoorEnvironmentInfo/气压.png";
import imgHumidity from "../../../images/pages/2.PageMonitor/3.OutdoorEnvironmentInfo/湿度.png";
import imgWeather from "../../../images/pages/2.PageMonitor/3.OutdoorEnvironmentInfo/天气.png";
import imgTemperature from "../../../images/pages/2.PageMonitor/3.OutdoorEnvironmentInfo/温度.png";
import imgRainFall from "../../../images/pages/2.PageMonitor/3.OutdoorEnvironmentInfo/降雨量.png";
import imgTime from "../../../images/pages/2.PageMonitor/3.OutdoorEnvironmentInfo/时间.png";
import imgThermoAndHumsidity from "../../../images/pages/2.PageMonitor/3.OutdoorEnvironmentInfo/温度湿度.png";

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
  paddingTop: "5px",
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

//获取气象信息区域的所有数据（当前最新气象信息）
function getRealtimeWeatherData(data) {
  var newData = {
    //当前最新气象信息
    airPressure: "未知", //气压
    humidity: "未知", //湿度
    rainfall: "未知", //雨量
    temperature: "未知", //温度
    time: "未知", //时间
    windDirection: "未知", //风向
    windPower: "未知", //风力
  };

  //当前最新气象信息
  newData.airPressure = data.airPressure;
  newData.humidity = data.humidity;
  newData.rainfall = data.rainfall;
  newData.temperature = data.temperature;
  newData.time = data.time;
  newData.windDirection = data.windDirection;
  newData.windPower = data.windPower;

  // console.log("newData", newData);
  return newData;
}

function EnvironmentInfo() {
  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //本组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //当前最新气象信息
  const [realtimeWeatherData, setRealtimeWeatherData] = useState({
    airPressure: "未知", //气压
    humidity: "未知", //湿度
    rainfall: "未知", //雨量
    temperature: "未知", //温度
    time: "未知", //时间
    windDirection: "未知", //风向
    windPower: "未知", //风力
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
    getData("weathers/latest")
      .then((data) => {
        // console.log("get结果", data);
        if (data.success) {
          var result = data.data;
          console.log("result", result);
          //获取气象信息区域的所有数据（当前最新气象信息）
          const realtimeWeatherData = getRealtimeWeatherData(result);
          //设置当前最新气象信息
          setRealtimeWeatherData(realtimeWeatherData);
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

  //获取一组环境数据（根据数据名称）
  function getItemDiv(itemName) {
    var imgSrc = ""; //<img>标签的src属性
    var value = ""; //<img>标签的alt属性
    switch (itemName) {
      case "时间":
        imgSrc = imgTime;
        value = realtimeWeatherData.time;
        return (
          <div style={itemContainerStyle}>
            <img style={itemImgStyle} alt={itemName} src={imgSrc} />
            <div style={timeValueStyle}>{value}</div>
          </div>
        );
      case "温度":
        imgSrc = imgTemperature;
        value = realtimeWeatherData.temperature;
        break;
      case "湿度":
        imgSrc = imgHumidity;
        value = realtimeWeatherData.humidity;
        break;
      case "天气":
        imgSrc = imgWeather;
        value = "多云"; //realtimeWeatherData.weather;
        break;
      case "气压":
        imgSrc = imgAirPressure;
        value = realtimeWeatherData.airPressure;
        break;
      case "风力":
        imgSrc = imgWindPower;
        value = realtimeWeatherData.windPower;
        break;
      case "风向":
        imgSrc = imgWindDirection;
        value = realtimeWeatherData.windDirection;
        break;
      case "降雨量":
        imgSrc = imgRainFall;
        value = realtimeWeatherData.rainfall;
        break;
      default:
        break;
    }
    return (
      <div style={itemContainerStyle}>
        <img style={itemImgStyle} alt={itemName} src={imgSrc} />
        <div style={itemValueStyle}>{value}</div>
      </div>
    );
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
          {getItemDiv("天气")}
          {getItemDiv("温度")}
          {getItemDiv("湿度")}
          {getItemDiv("气压")}
          {getItemDiv("风力")}
          {getItemDiv("风向")}
          {getItemDiv("降雨量")}
        </div>
      </CardContent>
    </Card>
  );
}

export default EnvironmentInfo;
