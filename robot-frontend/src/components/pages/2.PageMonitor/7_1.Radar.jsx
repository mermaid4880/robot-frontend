import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from "bizcharts";
import { makeStyles } from "@material-ui/core/styles";
//functions
import { getData, postData } from "../../../functions/requestDataFromAPI.js";

const useStyles = makeStyles({
  root: {
    // width: "100%",
    width: "250px",
    height: "230px",
    // overflow: "hidden",
    marginLeft: "50px",
  },
});

function Radar() {
  const classes = useStyles();
  //———————————————————————————————————————————————useHistory
  const history = useHistory();
  //———————————————————————————————————————————————useState
  //本组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //雷达图数据的实时信息
  const [radarData, setRadarData] = useState([]);

  //———————————————————————————————————————————————Timer
  //开启定时器（重新获取雷达图的实时信息、刷新组件）
  var timerID = setTimeout(() => {
    setUpdate(!update);
  }, 5000);

  //———————————————————————————————————————————————useEffect
  //当（本组件销毁时），销毁定时器（重新获取雷达图的实时信息、刷新组件）
  useEffect(() => {
    //当组件销毁时，销毁定时器（重新获取雷达图的实时信息、刷新组件）
    return () => {
      clearTimeout(timerID);
    };
  }, []);

  //当（本组件加载完成或需要更新时），GET请求获取雷达图的实时信息
  useEffect(() => {
    //————————————————————————————GET请求
    getData("laser/normalized_data")
      .then((data) => {
        //console.log("get结果", data.data);
        if (data.success) {
          setData(data.data);
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
    // console.log("useEffect");
  }, [update]);

  function setData(data) {
    var temp = [];
    data.forEach((item, index) => {
      //console.log("item--------------------", item);
      if (index % 2 === 0) {
        temp.push({
          angle: (index / 360) * 400,
          radius: parseFloat(item),
        });
      }
    });
    setRadarData(temp);
  }

  const ws = useRef(null);

  return (
    <div className={classes.root}>
      <Chart height={300} data={radarData} forceFit>
        {/* <Tooltip
          showTitle={false}
          crosshairs={{
            type: "cross",
          }}
          itemTpl='<li data-index={index} style="margin-bottom:4px;"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}<br/>{value}</li>'
        /> */}
        <Coord type="polar" />
        <Axis name="angle" label={null} tickLine={null} />
        <Axis name="radius" label={null} />
        <Geom
          type="point"
          position="angle*radius"
          opacity={0.65}
          shape="circle"
          size={2}
          // tooltip={[
          //   "angle*radius",
          //   (angle, radius) => {
          //     return {
          //       value: angle + "(度), " + radius + "(m)",
          //     };
          //   },
          // ]}
        />
      </Chart>
    </div>
  );
}

export default Radar;
