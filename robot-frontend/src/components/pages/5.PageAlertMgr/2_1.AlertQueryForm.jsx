//packages
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Input, Form } from "semantic-ui-react";
import { DatePicker } from "rsuite";
import swal from "sweetalert";
//functions
import { getData } from "../../../functions/requestDataFromAPI.js";

//———————————————————————————————————————————————Form.Select
//识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
const alertDetectionTypeOptions = [
  { key: "全部", text: "全部", value: "" },
  { key: "红外测温", text: "红外测温", value: "红外测温" },
  { key: "表计读取", text: "表计读取", value: "表计读取" },
  { key: "位置状态识别", text: "位置状态识别", value: "位置状态识别" },
  {
    key: "设备外观查看（可识别）",
    text: "设备外观查看（可识别）",
    value: "设备外观查看（可识别）",
  },
  {
    key: "设备外观查看（不可识别）",
    text: "设备外观查看（不可识别）",
    value: "设备外观查看（不可识别）",
  },
  { key: "声音检测", text: "声音检测", value: "声音检测" },
];
//点位状态（告警等级）【"正常"  "预警"  "一般告警"  "严重告警"  "危急告警"】
const alertLevelOptions = [
  { key: "全部", text: "全部", value: "" },
  { key: "正常", text: "正常", value: "正常" },
  { key: "预警", text: "预警", value: "预警" },
  { key: "一般告警", text: "一般告警", value: "一般告警" },
  { key: "严重告警", text: "严重告警", value: "严重告警" },
  { key: "危急告警", text: "危急告警", value: "危急告警" },
];
//确认状态（5种）【"未确认"  "现场确认无异常"  "确认异常——已处理"  "确认异常——需要进一步跟踪"  "确认异常——在允许范围内"】
const alertIsDealedOptions = [
  { key: "全部", text: "全部", value: "" },
  { key: "未确认", text: "未确认", value: "未确认" },
  { key: "现场确认无异常", text: "现场确认无异常", value: "现场确认无异常" },
  {
    key: "确认异常——已处理",
    text: "确认异常——已处理",
    value: "确认异常——已处理",
  },
  {
    key: "确认异常——需要进一步跟踪",
    text: "确认异常——需要进一步跟踪",
    value: "确认异常——需要进一步跟踪",
  },
  {
    key: "确认异常——在允许范围内",
    text: "确认异常——在允许范围内",
    value: "确认异常——在允许范围内",
  },
];

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

function AlertQueryForm(props) {
  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //用户输入内容
  // const [input, setInput] = useState({
  //   keyword: "避雷器", //点位名称关键字（检测内容关键字）
  //   startTime: "2018-10-25 17:36:45", //识别时间段起点
  //   endTime: "2018-10-28 17:36:45", //识别时间段终点
  //   level: "预警", //点位状态（告警等级）【"正常"  "预警"  "一般告警"  "严重告警"  "危急告警"】
  //   detectionType: "表计读取", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
  //   isDealed: "现场确认无异常", //确认状态（5种）【"未确认"  "现场确认无异常"  "确认异常——已处理"  "确认异常——需要进一步跟踪"  "确认异常——在允许范围内"】
  // });
  const [input, setInput] = useState({
    keyword: "", //点位名称关键字（检测内容关键字）
    startTime: "", //识别时间段起点
    endTime: "", //识别时间段终点
    level: "", //点位状态（告警等级）【"正常"  "预警"  "一般告警"  "严重告警"  "危急告警"】
    detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
    isDealed: "", //确认状态（5种）【"未确认"  "现场确认无异常"  "确认异常——已处理"  "确认异常——需要进一步跟踪"  "确认异常——在允许范围内"】
  });

  //<DatePicker>的状态
  const [datePicker1State, setDatePicker1State] = useState({
    date: timeDeformat(input.startTime),
  });

  //<DatePicker>的状态
  const [datePicker2State, setDatePicker2State] = useState({
    date: timeDeformat(input.endTime),
  });

  //———————————————————————————————————————————————其他函数
  //按条件获取告警信息列表GET请求
  function queryAlertListGET() {
    //————————————————————————————GET请求
    // 用URLSearchParams来传递参数
    let paramData = new URLSearchParams();
    input.keyword && paramData.append("keyword", input.keyword.toString());
    input.startTime &&
      paramData.append("startTime", input.startTime.toString());
    input.endTime && paramData.append("endTime", input.endTime.toString());
    input.level && paramData.append("level", input.level.toString());
    input.detectionType &&
      paramData.append("detectionType", input.detectionType.toString());
    input.isDealed && paramData.append("isDealed", input.isDealed.toString());
    console.log("paramData", paramData);
    //发送GET请求
    getData("/systemAlarms", { params: paramData })
      .then((data) => {
        console.log("get结果", data);
        if (data.success) {
          var result = data.data;
          console.log("result", result);
          //调用父组件函数（将GET请求结果传给父组件并刷新父组件的table）
          props.exportDataAndSetTable(data.data);
        } else {
          //alert失败
          swal({
            title: "按条件获取告警信息列表失败",
            text: "请重试！错误信息：" + data.detail.toString(),
            icon: "error",
            timer: 3000,
            buttons: false,
          });
        }
      })
      .catch((error) => {
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
        //alert失败
        swal({
          title: "按条件获取告警信息列表失败",
          text: "请重试！错误信息：" + error.toString(),
          icon: "error",
          timer: 3000,
          buttons: false,
        });
      });
  }

  //———————————————————————————————————————————————事件响应函数
  //<Form>中一般组件变化事件响应函数
  function handleChange(e, { value }, key) {
    console.log("value", value, "key", key);
    //限制用户输入的任务执行周期为number类型
    if (key === "period") {
      // let matchFloat = value.match(/^[1-9]*\d+(\.{0,1})([0-9]{1,2})?/gi);
      // console.log("matchFloat",matchFloat);
      // if (matchFloat) {
      //   console.log('result float:',matchFloat);
      //   value = matchFloat;
      // }
      // else{
      //   console.log('before replace:',value);
      //   value = value.replace(/[^0-9]/gi, "");
      // }
      value = value.replace(/[^0-9]/gi, "");
      console.log("period value after replace:", value);
    }
    //设置用户输入内容
    setInput((prev) => {
      return { ...prev, [key]: value };
    });
  }

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
      return { ...prev, startTime: convertedTime };
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
      return { ...prev, endTime: convertedTime };
    });
  }

  return (
    <Form>
      <Form.Group inline>
        <Form.Field>
          <label>告警开始时间</label>
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
              placeholder="告警开始时间"
              value={datePicker1State.date}
              onChange={handleDatePicker1Change}
            />
          </div>
        </Form.Field>
        <Form.Field>
          <label>告警结束时间</label>
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
              placeholder="告警结束时间"
              value={datePicker2State.date}
              onChange={handleDatePicker2Change}
            />
          </div>
        </Form.Field>
        <Form.Field>
          <label>关键字查询</label>
          <Input
            value={input.keyword}
            placeholder="关键字"
            onChange={(e, { value }) => handleChange(e, { value }, "keyword")}
          />
        </Form.Field>
        <Form.Select
          value={input.detectionType}
          label="识别类型"
          options={alertDetectionTypeOptions}
          placeholder="全部"
          onChange={(e, { value }) =>
            handleChange(e, { value }, "detectionType")
          }
        />
        <Form.Select
          value={input.level}
          label="告警等级"
          options={alertLevelOptions}
          placeholder="全部"
          onChange={(e, { value }) => handleChange(e, { value }, "level")}
        />
        <Form.Select
          value={input.isDealed}
          label="确认状态"
          options={alertIsDealedOptions}
          placeholder="全部"
          onChange={(e, { value }) => handleChange(e, { value }, "isDealed")}
        />
        <Form.Field>
          <Form.Button
            style={{ width: "70px", marginTop: "19px" }} //将查询按钮对齐底部
            onClick={() => {
              console.log("datePicker1State", datePicker1State);
              console.log("datePicker2State", datePicker2State);
              console.log("hello", input);
              queryAlertListGET();
            }}
          >
            查询
          </Form.Button>
        </Form.Field>
      </Form.Group>
    </Form>
  );
}

export default AlertQueryForm;
