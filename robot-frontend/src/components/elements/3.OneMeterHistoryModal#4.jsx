//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Modal, Grid, Form, Table, Header } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faVideo as videoIcon } from "@fortawesome/free-solid-svg-icons";
import { DatePicker } from "rsuite";
import { Tooltip, Spin } from "antd";
import { Chart, Geom, Axis, Tooltip as Tooltip1 } from "bizcharts";
import { DataSet } from "@antv/data-set";
//elements
import MediaModal from "../elements/4.MediaModal.jsx";
//functions
import { getData } from "../../functions/requestDataFromAPI.js";
//images
import ImageNotFound from "../../images/image_not_found.png";
import ImageWaiting from "../../images/image_waiting.png";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "1200px",
    height: "792px",
  },
  imageStyle: {
    margin: "auto",
    height: "250px",
  },
}));

//———————————————————————————————————————————————Chart
//用于获取chart实例的变量（可以通过组件的onGetG2Instance方法获取到g2的chart实例）
var chart;

// "id": 10,						                                           巡检记录ID
// "taskName": "测试",					                                   任务名称
// "meterCount": 1000,					                                   总巡检点数
// "meterFinishCount": 980,				                                 已完成巡检点数
// "meterAbnormalCount": 10,				                               异常巡检点数
// "startTime": "2018-11-07 15:44:06",			                       巡检开始时间
// "endTime": "2018-11-08 15:44:08",			                         巡检结束时间
// "isFinished": "已完成",				                                 巡检完成状态【"未完成"  "已完成"】
// "meterDetail": {
//     "resultId": 12,					                                   巡检结果ID
//     "meterId": 3,                                               点位ID
//     "meterName": "北湖#1线冶48",                                 点位名称（检测内容）
//     "detectionType": null,                                      识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
//     "value": "10",                                              识别结果
//     "valuePath": "D:/robot/static/pic/2018-1-1/111/50.jpg",     识别结果图片路径
//     "voicePath": null,                                          音频文件路径
//     "videoPath": null,                                          视频文件路径
//     "vlPath": "D:/robot/static/pic/2018-1-1/111/50.jpg",        可见光图片文件路径（一定有）
//     "irPath": null,                                             红外图片文件路径
//     "status": "异常",                                           巡检结果【"正常"  "异常"】
//     "time": "2018-01-01 01:01:55",                              检测时间
//     "checkStatus": null,                                        巡检审核状态【"待审核"  "已确认"  "已修改"】
//     "checkInfo": null                                           巡检审核信息
// }

//获取所有数据
function getAllData(list) {
  var newList = [];
  newList = list.map((item, index) => {
    var newItem = {
      key: "",
      //包含该点位的巡检记录信息
      id: "", //巡检记录ID
      taskName: "", //任务名称
      meterCount: "", //总巡检点数
      meterFinishCount: "", //已完成巡检点数
      meterAbnormalCount: "", //异常巡检点数
      startTime: "", //巡检开始时间
      endTime: "", //巡检结束时间
      isFinished: "", //巡检完成状态【"未完成"  "已完成"】
      //该点位的巡检记录详情
      resultId: "", //巡检结果ID
      meterId: "", //点位ID
      meterName: "", //点位名称（检测内容）
      detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
      value: "", //识别结果
      mediaUrl: {
        valuePath: "", //识别结果图片路径
        voicePath: "", //音频文件路径
        videoPath: "", //视频文件路径
        vlPath: "", //可见光图片文件路径（一定有）
        irPath: "", //红外图片文件路径
      },
      status: "", //巡检结果【"正常"  "异常"】
      time: "", //检测时间
      checkStatus: "", //巡检审核状态【"待审核"  "已确认"  "已修改"】
      checkInfo: "", //巡检审核信息
    };

    newItem.key = index;
    //包含该点位的巡检记录信息
    newItem.id = item.id;
    newItem.taskName = item.taskName;
    newItem.meterCount = item.meterCount;
    newItem.meterFinishCount = item.meterFinishCount;
    newItem.meterAbnormalCount = item.meterAbnormalCount;
    newItem.startTime = item.startTime;
    newItem.endTime = item.endTime;
    newItem.isFinished = item.isFinished;
    //该点位的巡检记录详情
    newItem.resultId = item.meterDetail.resultId;
    newItem.meterId = item.meterDetail.meterId;
    newItem.meterName = item.meterDetail.meterName;
    newItem.detectionType = item.meterDetail.detectionType;
    newItem.value = item.meterDetail.value;
    newItem.mediaUrl.valuePath = item.meterDetail.valuePath;
    newItem.mediaUrl.voicePath = item.meterDetail.voicePath;
    newItem.mediaUrl.videoPath = item.meterDetail.videoPath;
    newItem.mediaUrl.vlPath = item.meterDetail.vlPath;
    newItem.mediaUrl.irPath = item.meterDetail.irPath;
    newItem.status = item.meterDetail.status;
    newItem.time = item.meterDetail.time;
    newItem.checkStatus = item.meterDetail.checkStatus;
    newItem.checkInfo = item.meterDetail.checkInfo;
    return newItem;
  });
  // console.log("newList", newList);
  return newList;
}

//获取Chart数据（所有数据中的key、time、value）
function getChartData(list) {
  var newList = [];
  newList = list.map((item, index) => {
    var newItem = {
      key: "",
      time: "", //横坐标
      value: "", //纵坐标
    };
    newItem.key = item.key;
    newItem.time = item.time ? item.time : "";
    newItem.value = item.value;
    return newItem;
  });
  // console.log("newList", newList);
  return newList;
}

//根据Chart数据获取检测时间time的范围
function getChartTimeRange(list) {
  //list为空，返回null
  if (list.length < 1) return null;
  //list不为空，初始化timeRange（list[0]如果存在time，初始化为time，否则初始化为当前时间）
  var timeRange = {
    start: list[0].time ? list[0].time : timeFormat(new Date()),
    end: list[0].time ? list[0].time : timeFormat(new Date()),
  };
  //遍历list获取timeRange
  list.forEach((item) => {
    if (timeDeformat(item.time)) {
      if (timeDeformat(item.time) < timeDeformat(timeRange.start))
        timeRange.start = item.time;
      if (timeDeformat(item.time) > timeDeformat(timeRange.end))
        timeRange.end = item.time;
    }
  });
  // console.log("timeRange", timeRange);
  return timeRange;
}

//———————————————————————————————————————————————Table
//查找list（所有数据）中包含resultId的item的key（索引），用于展示当前明细表格数据
function getIndexInAllData(list, resultId) {
  var key = null;
  list.forEach((item) => {
    if (resultId === item.resultId) {
      key = item.key;
    }
  });
  return key;
}

//———————————————————————————————————————————————全局函数
//转换时间格式"Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)"——>"2016-05-12 08:00:00"
function timeFormat(time) {
  if (!time) return ""; //如果time是null返回空字符串""
  let convertedTime =
    time.getFullYear() +
    "-" +
    (time.getMonth() + 1) +
    "-" +
    time.getDate() +
    " " +
    time.getHours() +
    ":" +
    time.getMinutes() +
    ":" +
    time.getSeconds();
  return convertedTime;
}

//转换时间格式"2016-05-12 08:00:00"——>"Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)"
function timeDeformat(convertedTime) {
  convertedTime = convertedTime.replace(new RegExp(/-/gm), "/"); //将所有的'-'转为'/'即可（兼容IE）
  let time = convertedTime === "" ? null : new Date(convertedTime);
  return time;
}

function OneMeterHistoryModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //Chart数据是否正在请求的状态
  const [loading, setLoading] = useState(false);

  //所有数据的状态
  const [allData, setAllData] = useState({});

  //当前明细表格数据在所有数据中的索引
  const [indexInAllData, setIndexInAllData] = useState({});

  //<Chart>的状态
  const [chartState, setChartState] = useState({
    start: "", //横坐标起点
    end: "", //横坐标终点
    chartData: [], //全部Chart数据
  });

  //用户输入内容
  // const [input, setInput] = useState({
  //   startTime: "2018-10-25 17:36:45", //检测时间段起点
  //   endTime: "2018-10-28 17:36:45", //检测时间段终点
  // });
  const [input, setInput] = useState({
    startTime: "", //检测时间段起点
    endTime: "", //检测时间段终点
  });

  //<DatePicker>的状态
  const [datePicker1State, setDatePicker1State] = useState({
    time: timeDeformat(input.startTime),
  });

  //<DatePicker>的状态
  const [datePicker2State, setDatePicker2State] = useState({
    time: timeDeformat(input.endTime),
  });

  //———————————————————————————————————————————————useEffect
  //当本modal打开时或条件查询按钮按下时，根据点位ID和时间段获取该点位巡检记录详情列表GET请求
  useEffect(() => {
    if (props.data.meterId) {
      //设置Chart数据请求状态为正在请求
      setLoading(true);
      //————————————————————————————GET请求(根据点位ID和时间段获取该点位巡检记录详情列表GET请求)
      // 用URLSearchParams来传递参数
      let paramData = new URLSearchParams();
      paramData.append("id", props.data.meterId.toString());
      input.startTime &&
        paramData.append("startTime", input.startTime.toString());
      input.endTime && paramData.append("endTime", input.endTime.toString());
      //发送GET请求
      getData("detections/bymeter", { params: paramData })
        .then((data) => {
          console.log("get结果", data);
          if (data.success) {
            //获取所有数据的总条数
            var total = data.data.total;
            console.log("total", total);
            //如果有数据
            if (total) {
              var result = data.data.list;
              console.log("result", result);
              //获取所有数据
              const allData = getAllData(result);
              //设置所有数据的状态
              setAllData(allData);
              //获取并设置当前明细表格数据在所有数据中的索引
              setIndexInAllData(
                getIndexInAllData(allData, props.data.resultId)
              );
              //获取Chart数据
              const chartData = getChartData(allData);
              //根据Chart数据获取检测时间time的范围
              let timeRange = getChartTimeRange(chartData);
              //设置<Chart>的状态
              setChartState({
                start: timeRange.start, //横坐标起点
                end: timeRange.end, //横坐标终点
                chartData: chartData, //全部Chart数据
              });
            } //如果没有数据
            else {
              //设置所有数据的状态为空
              setAllData({});
              //设置<Chart>的状态为空
              setChartState({
                start: "", //横坐标起点
                end: "", //横坐标终点
                chartData: [], //全部Chart数据
              });
            }
            //实现<Chart>和chartData的联动
            linkChartState();
            //设置Chart数据请求状态为完成
            setLoading(false);
            // console.log("allData", allData);
            // console.log("props.resultId", props.data.resultId);
            // console.log(
            //   "getIndexInAllData(allData, props.resultId)",
            //   getIndexInAllData(allData, props.data.resultId)
            // );
          } else {
            alert(data.data.detail);
          }
        })
        .catch((error) => {
          //如果鉴权失败，跳转至登录页
          if (error.response.status === 401) {
            history.push("/");
          }
        });
    }
  }, [update]);

  //———————————————————————————————————————————————设置<Chart>用到的变量
  //<Chart>中度量scale（数据空间到图形空间的转换桥梁）的配置描述(https://bizcharts.net/product/bizcharts/category/7/page/35)
  const scale = {
    time: {
      //type度量的类型，可选值有：linear、cat、log、pow、time 和 timeCat
      type: "timeCat", //timeCat：非连续的时间，比如股票的时间不包括周末或者未开盘的日期
      //alias描述: 为数据属性定义别名，用于图例、坐标轴、tooltip 的个性化显示
      alias: "检测时间",
    },
    value: {
      type: "linear",
      alias: "识别结果",
      nice: true,
    },
  };

  //———————————————————————————————————————————————设置<Chart>和chartData的联动
  //实现<Chart>和chartData的联动，步骤如下： 1.创建 DataSet 对象，指定状态量 2.创建 DataView 对象，在 transform 中使用状态量 3.创建图表，引用前面创建 DataView 4.改变状态量

  // step1 创建 dataset 指定状态量
  //DataSet：数据集（一组数据集合）
  const dataSet = new DataSet({
    //state：状态量（数据集内部流转的控制数据状态的变量）
    state: {
      start: chartState.start,
      end: chartState.end,
    },
  });

  // step2 创建 DataView 对象，在 transform 中使用状态量
  //DataView：数据视图（单个数据视图，目前有普通二维数据（类似一张数据库表）、树形数据、图数据和地理信息数据几种类型）
  const dataView = dataSet.createView().source(chartState.chartData);
  //Transform：变换（数据变换函数，数据视图做数据处理时使用，包括图布局、数据补全、数据过滤等等）
  dataView.transform({
    type: "filter", //数据过滤
    callback(item) {
      // 判断某一行是否保留，默认返回true
      return item.time >= dataSet.state.start && item.time <= dataSet.state.end;
    },
  });

  // step4 更新状态量
  function linkChartState() {
    dataSet.setState("start", chartState.start);
    dataSet.setState("end", chartState.end);
  }

  //———————————————————————————————————————————————事件响应函数
  //<Form>中检测时间段起点<DatePicker>组件变化事件响应函数
  function handleDatePicker1Change(time) {
    //设置<DatePicker>的状态
    setDatePicker1State({ time: time });
    //转换时间格式"Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)"——>"2016-05-12 08:00:00"
    let convertedTime = timeFormat(time);
    console.log("convertedDatePicker1Time", convertedTime);
    //设置用户输入内容
    setInput((prev) => {
      return { ...prev, startTime: convertedTime };
    });
  }

  //<Form>中检测时间段终点<DatePicker>组件变化事件响应函数
  function handleDatePicker2Change(time) {
    //设置<DatePicker>的状态
    setDatePicker2State({ time: time });
    //转换时间格式"Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)"——>"2016-05-12 08:00:00"
    let convertedTime = timeFormat(time);
    console.log("convertedDatePicker2Time", convertedTime);
    //设置用户输入内容
    setInput((prev) => {
      return { ...prev, endTime: convertedTime };
    });
  }

  return (
    <Modal
      className={classes.root}
      open={modalOpen}
      onOpen={() => {
        setModalOpen(true);
        setUpdate(!update);
      }}
      onClose={() => setModalOpen(false)}
      closeOnDimmerClick={false}
      size={"large"}
      trigger={
        <Tooltip placement="bottom" title="查看该点位巡检历史曲线">
          <FontAwesomeIcon icon={faChartLine} />
        </Tooltip>
      }
    >
      <Modal.Header>单点位巡检历史曲线</Modal.Header>
      <Modal.Content image scrolling>
        {/* <Grid celled> */}
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}></Grid.Column>
            <Grid.Column width={12}>
              <Form>
                <Form.Group inline>
                  <Form.Field inline>
                    <label>检测开始时间</label>
                    <div
                      id="father5"
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <DatePicker
                        container={() => document.getElementById("father5")}
                        style={{ width: 200 }}
                        block
                        format="YYYY-MM-DD HH:mm:ss"
                        locale={{
                          sunday: "日",
                          monday: "一",
                          tuesday: "二",
                          wednesday: "三",
                          thursday: "四",
                          friday: "五",
                          saturday: "六",
                          ok: "确定",
                          today: "今天",
                          yesterday: "昨天",
                          hours: "时",
                          minutes: "分",
                          seconds: "秒",
                        }}
                        ranges={[
                          {
                            label: "今天",
                            value: new Date(),
                          },
                        ]}
                        placeholder="检测开始时间"
                        value={datePicker1State.time}
                        onChange={handleDatePicker1Change}
                      />
                    </div>
                  </Form.Field>
                  <Form.Field>
                    <label>检测结束时间</label>
                    <div
                      id="father6"
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <DatePicker
                        container={() => document.getElementById("father6")}
                        style={{ width: 200 }}
                        block
                        format="YYYY-MM-DD HH:mm:ss"
                        locale={{
                          sunday: "日",
                          monday: "一",
                          tuesday: "二",
                          wednesday: "三",
                          thursday: "四",
                          friday: "五",
                          saturday: "六",
                          ok: "确定",
                          today: "今天",
                          yesterday: "昨天",
                          hours: "时",
                          minutes: "分",
                          seconds: "秒",
                        }}
                        ranges={[
                          {
                            label: "今天",
                            value: new Date(),
                          },
                        ]}
                        placeholder="检测结束时间"
                        value={datePicker2State.time}
                        onChange={handleDatePicker2Change}
                      />
                    </div>
                  </Form.Field>
                  <Form.Button
                    style={{ width: "70px" }} //将查询按钮对齐底部
                    onClick={() => {
                      // console.log("datePicker1State", datePicker1State);
                      // console.log("datePicker2State", datePicker2State);
                      // console.log("hello", input);
                      setUpdate(!update);
                    }}
                  >
                    查询
                  </Form.Button>
                </Form.Group>
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={1}></Grid.Column>
            <Grid.Column width={14}>
              <Spin spinning={loading} tip="Loading..." size="large">
                {loading ? ( //Chart数据正在请求
                  <img
                    className={classes.imageStyle}
                    src={ImageWaiting}
                    alt="加载中"
                  />
                ) : chartState.chartData.length ? ( //Chart数据请求完成，Chart数据不为空
                  <Chart
                    height={240}
                    width={200}
                    padding={{ top: 30, right: 30, bottom: 30, left: 30 }}
                    forceFit //自适应父组件宽度，为true时width不生效
                    data={dataView} // step3 引用 DataView
                    scale={scale}
                    //获取chart实例
                    onGetG2Instance={(c) => {
                      chart = c;
                    }}
                    //鼠标点击Point事件
                    onPointClick={(e) => {
                      // console.log("~~~~~~~~~~~~~~~Point~~~~~~~~~~~~~~");
                      chart.showTooltip({
                        //显示tooltip
                        x: e.data.x,
                        y: e.data.y,
                      });
                      //设置明细表格数据在所有数据中的索引
                      setIndexInAllData(e.data._origin.key);
                    }}
                    //鼠标进入Point事件
                    onPointMouseenter={(e) => {
                      // console.log("~~~~~~~~~~~~~~~Mouseenter~~~~~~~~~~~~~~");
                      chart.showTooltip({
                        //显示tooltip
                        x: e.data.x,
                        y: e.data.y,
                      });
                    }}
                  >
                    <Axis
                      name="time"
                      line={{
                        stroke: "#E6E6E6",
                      }}
                    />
                    <Axis
                      name="value"
                      line={false} //不展示坐标轴线
                      grid={{
                        lineStyle: {
                          stroke: "#d9d9d9", // 网格线的颜色
                          lineWidth: 1, // 网格线的宽度复制代码
                          lineDash: [4, 4], // 网格线的虚线配置，第一个参数描述虚线的实部占多少像素，第二个参数描述虚线的虚部占多少像素
                        },
                      }}
                    />
                    <Tooltip1
                      inPlot={true}
                      useHtml
                      containerTpl={
                        '<div class="g2-tooltip">' +
                        '<div class="g2-tooltip-title" style="margin-bottom: 4px;"></div>' +
                        '<ul class="g2-tooltip-list"></ul>' +
                        "</div>"
                      }
                      itemTpl={
                        "<div data-index={index}>" + "{name}{value}" + "</div>"
                      }
                    />
                    <Geom
                      type="line"
                      position="time*value"
                      size={2}
                      color="rgba(113, 201, 206,1)"
                      shape="smooth"
                      style={{
                        shadowColor: "l (270) 0:rgba(21, 146, 255, 0)", //l：线性渐变，270：角度
                        shadowBlur: 60,
                        shadowOffsetY: 6,
                      }}
                      tooltip={[
                        "time*value",
                        (time, value) => {
                          return {
                            title: `检测时间：${time}`,
                            value: `识别结果：${value}`,
                          };
                        },
                      ]}
                    />
                    <Geom
                      type="point"
                      position="time*value"
                      size={3}
                      shape={"circle"}
                      color={[
                        "value",
                        (value) => {
                          if (value >= 0 && value < 5)
                            return "rgba(0, 128, 0, 1)";
                          else if (value >= 5 && value < 10)
                            return "rgba(0, 0, 255, 1)";
                          else if (value >= 10 && value < 15)
                            return "rgba(255, 255, 0, 1)";
                          else if (value >= 15 && value < 20)
                            return "rgba(255, 128, 10, 1)";
                          else if (value >= 20 && value < 100)
                            return "rgba(255, 0, 0, 1)";
                        },
                      ]}
                      tooltip={[
                        "time*value",
                        (time, value) => {
                          return {
                            title: `检测时间：${time}`,
                            value: `识别结果：${value}`,
                          };
                        },
                      ]}
                    />
                  </Chart>
                ) : (
                  //Chart数据请求完成，Chart数据为空
                  <img
                    className={classes.imageStyle}
                    src={ImageNotFound}
                    alt="没有找到符合条件的结果"
                  />
                )}
              </Spin>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              <img
                style={{
                  marginLeft: "20px",
                  width: "440px",
                  height: "259px",
                }}
                src={
                  indexInAllData !== null &&
                  allData[indexInAllData] &&
                  allData[indexInAllData].mediaUrl.vlPath
                }
                alt="巡检结果图片（可见光）"
              />
            </Grid.Column>
            <Grid.Column width={10}>
              <Table celled padded size="small">
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <Header as="h4" textAlign="center">
                        任务名称
                      </Header>
                    </Table.Cell>
                    <Table.Cell>
                      {indexInAllData !== null &&
                        allData[indexInAllData] &&
                        allData[indexInAllData].taskName}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width="3">
                      <Header as="h4" textAlign="center">
                        检测内容
                      </Header>
                    </Table.Cell>
                    <Table.Cell>
                      {indexInAllData !== null &&
                        allData[indexInAllData] &&
                        allData[indexInAllData].meterName +
                          "（" +
                          allData[indexInAllData].detectionType +
                          "）"}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <Header as="h4" textAlign="center">
                        识别结果
                      </Header>
                    </Table.Cell>
                    <Table.Cell>
                      {indexInAllData !== null &&
                        allData[indexInAllData] &&
                        allData[indexInAllData].value}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <Header as="h4" textAlign="center">
                        结果详情
                      </Header>
                    </Table.Cell>
                    <Table.Cell>
                      {indexInAllData !== null &&
                        allData[indexInAllData] &&
                        allData[indexInAllData].mediaUrl && (
                          <span>
                            {allData[indexInAllData].mediaUrl.vlPath && ( //可见光图片文件路径（一定有）
                              <a>
                                <MediaModal
                                  mediaInfo={{
                                    meterName:
                                      allData[indexInAllData].meterName,
                                    mediaType: "可见光图片文件路径（一定有）",
                                    mediaUrl:
                                      allData[indexInAllData].mediaUrl.vlPath,
                                  }}
                                />
                              </a>
                            )}
                            &nbsp;&nbsp;
                            {allData[indexInAllData].mediaUrl.irPath && ( //红外图片文件路径
                              <a>
                                <MediaModal
                                  mediaInfo={{
                                    meterName:
                                      allData[indexInAllData].meterName,
                                    mediaType: "红外图片文件路径",
                                    mediaUrl:
                                      allData[indexInAllData].mediaUrl.irPath,
                                  }}
                                />
                              </a>
                            )}
                            &nbsp;&nbsp;
                            {allData[indexInAllData].mediaUrl.valuePath && ( //识别结果图片路径
                              <a>
                                <MediaModal
                                  mediaInfo={{
                                    meterName:
                                      allData[indexInAllData].meterName,
                                    mediaType: "识别结果图片路径",
                                    mediaUrl:
                                      allData[indexInAllData].mediaUrl
                                        .valuePath,
                                  }}
                                />
                              </a>
                            )}
                            &nbsp;&nbsp;
                            {allData[indexInAllData].mediaUrl.voicePath && ( //音频文件路径
                              <a>
                                <MediaModal
                                  mediaInfo={{
                                    meterName:
                                      allData[indexInAllData].meterName,
                                    mediaType: "音频文件路径",
                                    mediaUrl:
                                      allData[indexInAllData].mediaUrl
                                        .voicePath,
                                  }}
                                />
                              </a>
                            )}
                            &nbsp;&nbsp;
                            {allData[indexInAllData].mediaUrl.videoPath && ( //视频文件路径
                              <a
                                href={
                                  allData[indexInAllData].mediaUrl.videoPath
                                }
                                download="video"
                                style={{
                                  color: "#6C6C6C",
                                  textDecoration: "none",
                                }}
                              >
                                <Tooltip
                                  placement="bottom"
                                  title="查看视频文件"
                                >
                                  <FontAwesomeIcon icon={videoIcon} />
                                </Tooltip>
                              </a>
                            )}
                          </span>
                        )}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <Header as="h4" textAlign="center">
                        巡检结果
                      </Header>
                    </Table.Cell>
                    <Table.Cell>
                      {indexInAllData !== null &&
                        allData[indexInAllData] &&
                        allData[indexInAllData].status}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <Header as="h4" textAlign="center">
                        检测时间
                      </Header>
                    </Table.Cell>
                    <Table.Cell>
                      {indexInAllData !== null &&
                        allData[indexInAllData] &&
                        allData[indexInAllData].time}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="返回"
          onClick={() => {
            setModalOpen(false);
            //清空所有数据
            setAllData({});
            //清空当前明细表格数据在所有数据中的索引
            setIndexInAllData({});
            //清空<Chart>的状态
            setChartState({
              start: "", //横坐标起点
              end: "", //横坐标终点
              chartData: [], //全部Chart数据
            });
            //清空用户输入内容
            setInput({
              startTime: "", //检测时间段起点
              endTime: "", //检测时间段终点
            });
          }}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default OneMeterHistoryModal;
