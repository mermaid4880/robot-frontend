//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Modal, Grid, Form, Table, Header } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { DatePicker } from "rsuite";
import { Tooltip, Spin } from "antd";
import { Chart, Geom, Axis, Tooltip as Tooltip1 } from "bizcharts";
import { DataSet } from "@antv/data-set";
//functions
import { getData } from "../../functions/requestDataFromAPI.js";
//images
import ImageBackground from "../../images/PageLogin-bg.png";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "1200px",
    height: "792px",
  },
}));

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

//———————————————————————————————————————————————Chart
//用于获取chart实例的变量（可以通过组件的onGetG2Instance方法获取到g2的chart实例）
var chart;

//获取所有数据
function getAllData(list) {
  var newList = [];
  newList = list.map((item, index) => {
    var newItem = {
      key: "",
      id: "", //记录ID
      taskName: "", //任务名称
      meterCount: "", //总巡检点数
      meterFinishCount: "", //已完成巡检点数
      meterAbnormalCount: "", //异常巡检点数
      startTime: "", //巡检开始时间
      endTime: "", //巡检结束时间
      isFinished: "", //巡检完成状态【"未完成"  "已完成"】
      meterId: "", //点位ID
      meterName: "", //点位名称（检测内容）
      detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
      value: "", //识别结果
      mediaUrl: "", //图片或音频文件路径
      status: "", //巡检结果【"正常"  "异常"】
      time: "", //检测时间
      checkStatus: "", //巡检审核状态【"待审核"  "已确认"  "已修改"】
      checkInfo: "", //巡检审核信息
    };
    newItem.key = index;
    newItem.id = item.id ? item.id : "";
    newItem.taskName = item.taskName ? item.taskName : "";
    newItem.meterCount = item.meterCount ? item.meterCount : "";
    newItem.meterFinishCount = item.meterFinishCount
      ? item.meterFinishCount
      : "";
    newItem.meterAbnormalCount = item.meterAbnormalCount
      ? item.meterAbnormalCount
      : "";
    newItem.startTime = item.startTime ? item.startTime : "";
    newItem.endTime = item.endTime ? item.endTime : "";
    newItem.isFinished = item.isFinished ? item.isFinished : "";
    // newItem.meterId = item.meterDetail.meterId?item.meterDetail.meterId:"";
    // newItem.meterName = item.meterDetail.meterName?item.meterDetail.meterName:"";
    // newItem.detectionType = item.meterDetail.detectionType?item.meterDetail.detectionType:"";
    // newItem.value = item.meterDetail.value?item.meterDetail.value:"";
    // newItem.mediaUrl = item.meterDetail.mediaUrl?item.meterDetail.mediaUrl:"";
    // newItem.status = item.meterDetail.status?item.meterDetail.status:"";
    // newItem.time = item.meterDetail.time?item.meterDetail.time:"";
    // newItem.checkStatus = item.meterDetail.checkStatus?item.meterDetail.checkStatus:"";
    // newItem.checkInfo = item.meterDetail.checkInfo?item.meterDetail.checkInfo:"";
    newItem.meterId = item.meterId; //HJJ 适配旧API
    newItem.meterName =
      item.meterName +
      "1111111111111111111111111111111111111111111111111111111111111112"; //HJJ
    newItem.meterName = item.meterName; //HJJ
    newItem.detectionType = item.detectionType; //HJJ
    newItem.value = item.detectionValue; //HJJ
    newItem.mediaUrl = item.irpath; //HJJ
    newItem.status = item.status; //HJJ
    newItem.time = item.time; //HJJ
    newItem.checkStatus = item.checkStatus; //HJJ
    newItem.checkInfo = item.checkInfo; //HJJ
    // console.log("newItem", newItem);
    return newItem;
  });
  // console.log("newList", newList);
  return newList;
}

//获取当前明细表格数据在所有数据中的索引
function getIndexInAllData(list, id) {
  var key = null;
  list.forEach((item) => {
    if (id === item.id) {
      key = item.key;
    }
  });
  return key;
}

//获取Chart数据
function getChartData(list) {
  var newList = [];
  newList = list.map((item, index) => {
    var newItem = {
      time: "", //横坐标
      value: "", //纵坐标
      key: "",
    };
    newItem.time = item.time ? item.time : "";
    newItem.value = item.value;
    newItem.key = item.key;
    return newItem;
  });
  console.log("newList", newList);
  return newList;
}

//根据Chart数据获取检测时间time的范围
function getChartTimeRange(list) {
  if (list.length < 1) return null; //如果list为空，返回null

  var timeRange = {
    start: list[0].time ? list[0].time : timeFormat(new Date()),
    end: list[0].time ? list[0].time : timeFormat(new Date()),
  };
  list.forEach((item) => {
    if (timeDeformat(item.time)) {
      if (timeDeformat(item.time) < timeDeformat(timeRange.start))
        timeRange.start = item.time;
      if (timeDeformat(item.time) > timeDeformat(timeRange.end))
        timeRange.end = item.time;
    }
  });
  console.log("timeRange", timeRange);
  return timeRange;
}

function OneMeterHistoryModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //Chart数据是否正在请求的状态
  const [loading, setLoading] = useState(false);

  //组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

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
  //   startDate: "2018-10-25 17:36:45", //识别时间段起点
  //   endDate: "2018-10-28 17:36:45", //识别时间段终点
  // });
  const [input, setInput] = useState({
    startDate: "", //识别时间段起点
    endDate: "", //识别时间段终点
  });

  //<DatePicker>的状态
  const [datePicker1State, setDatePicker1State] = useState({
    date: timeDeformat(input.startDate),
  });

  //<DatePicker>的状态
  const [datePicker2State, setDatePicker2State] = useState({
    date: timeDeformat(input.endDate),
  });

  //———————————————————————————————————————————————useEffect
  useEffect(() => {
    if (props.data.meterId) {
      //设置Chart数据请求状态为正在请求
      setLoading(true);
      //————————————————————————————GET请求(根据单点位ID按条件获取包含该点位的巡检结果记录列表GET请求)
      // 用URLSearchParams来传递参数
      let paramData = new URLSearchParams();
      // paramData.append("meterId", props.data.meterId.toString());
      paramData.append("meterIDs", props.data.meterId.toString()); //HJJ 适配旧API
      console.log("props.data.meterId", props.data.meterId); //HJJ 适配旧API
      input.startDate &&
        paramData.append("startDate", input.startDate.toString());
      input.endDate && paramData.append("endDate", input.endDate.toString());
      //发送GET请求
      getData("/detectionDatas", { params: paramData })
        .then((data) => {
          console.log("get结果", data);
          if (data.success) {
            var result = data.data.list;
            console.log("result", result);
            //获取所有数据
            const allData = getAllData(result);
            //设置所有数据的状态
            setAllData(allData);
            //获取并设置当前明细表格数据在所有数据中的索引
            console.log("allData", allData);
            console.log("props.id", props.data.id);
            console.log(
              "getIndexInAllData(allData, props.id)",
              getIndexInAllData(allData, props.data.id)
            );
            setIndexInAllData(getIndexInAllData(allData, props.data.id));
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
            //实现<Chart>和chartData的联动
            linkChartState();
            //设置Chart数据请求状态为完成
            setLoading(false);
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
  //<Form>中告警开始时间<DatePicker>组件变化事件响应函数
  function handleDatePicker1Change(date) {
    //设置<DatePicker>的状态
    setDatePicker1State({ date: date });
    //转换时间格式"Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)"——>"2016-05-12 08:00:00"
    let time = date;
    let convertedTime = timeFormat(time);
    console.log("convertedDatePicker1Time", convertedTime);
    //设置用户输入内容
    setInput((prev) => {
      return { ...prev, startDate: convertedTime };
    });
  }

  //<Form>中告警结束时间<DatePicker>组件变化事件响应函数
  function handleDatePicker2Change(date) {
    //设置<DatePicker>的状态
    setDatePicker2State({ date: date });
    //转换时间格式"Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)"——>"2016-05-12 08:00:00"
    let time = date;
    let convertedTime = timeFormat(time);
    console.log("convertedDatePicker2Time", convertedTime);
    //设置用户输入内容
    setInput((prev) => {
      return { ...prev, endDate: convertedTime };
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
                      id="father1"
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <DatePicker
                        container={() => document.getElementById("father1")}
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
                        value={datePicker1State.date}
                        onChange={handleDatePicker1Change}
                      />
                    </div>
                  </Form.Field>
                  <Form.Field>
                    <label>检测结束时间</label>
                    <div
                      id="father2"
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <DatePicker
                        container={() => document.getElementById("father2")}
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
                        value={datePicker2State.date}
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
                <Chart
                  height={250}
                  width={200}
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
                src={ImageBackground}
                // src={
                //   indexInAllData !== null &&
                //   allData[indexInAllData] &&
                //   allData[indexInAllData].mediaUrl
                // }
                alt="巡检结果图片"
              />
            </Grid.Column>
            <Grid.Column width={10}>
              <Table celled padded>
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
        <Button content="返回" onClick={() => setModalOpen(false)} />
      </Modal.Actions>
    </Modal>
  );
}

export default OneMeterHistoryModal;
