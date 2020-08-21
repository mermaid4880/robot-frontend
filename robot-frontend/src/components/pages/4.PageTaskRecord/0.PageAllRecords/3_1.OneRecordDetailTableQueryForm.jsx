//packages
import React, { useState, useEffect } from "react";
import { Input, Form } from "semantic-ui-react";
import { DatePicker } from "rsuite";

//———————————————————————————————————————————————Form.Select
//识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
const detectionTypeOptions = [
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

//巡检结果【"正常"  "异常"】
const statusOptions = [
  { key: "全部", text: "全部", value: "" },
  { key: "正常", text: "正常", value: "正常" },
  { key: "异常", text: "异常", value: "异常" },
];

//巡检审核状态【"待审核"  "已确认"  "已修改"】
const checkStatusOptions = [
  { key: "全部", text: "全部", value: "" },
  { key: "待审核", text: "待审核", value: "待审核" },
  { key: "已确认", text: "已确认", value: "已确认" },
  { key: "已修改", text: "已修改", value: "已修改" },
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

function OneRecordDetailTableQueryForm(props) {
  //———————————————————————————————————————————————useState
  //组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //   用户输入内容;
  //   const [input, setInput] = useState({
  //     startTime: "2018-10-25 17:36:45", //检测时间的时间段起点
  //     endTime: "2018-10-28 17:36:45", //检测时间的时间段终点
  //     meterName: "测", //关键字（检测内容模糊查询）
  //     detectionType: "红外测温", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
  //     status: "异常", //巡检结果【"正常"  "异常"】
  //     checkStatus: "待审核", //巡检审核状态【"待审核"  "已确认"  "已修改"】
  //   });
  const [input, setInput] = useState({
    startTime: "", //检测时间的时间段起点
    endTime: "", //检测时间的时间段终点
    meterName: "", //关键字（检测内容模糊查询）
    detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
    status: "", //巡检结果【"正常"  "异常"】
    checkStatus: "", //巡检审核状态【"待审核"  "已确认"  "已修改"】
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
  //当（将由父组件3_.OneRecordDetailTable#2#3#4#5.jsx传递来的巡检记录ID发生变化时），清空查询条件（用户输入内容）
  useEffect(() => {
    //清空查询条件（用户输入内容）
    setInput({
      startTime: "", //检测时间的时间段起点
      endTime: "", //检测时间的时间段终点
      meterName: "", //关键字（检测内容模糊查询）
      detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
      status: "", //巡检结果【"正常"  "异常"】
      checkStatus: "", //巡检审核状态【"待审核"  "已确认"  "已修改"】
    });
    //清空<DatePicker>的内容
    setDatePicker1State({
      time: timeDeformat(""),
    });
    setDatePicker2State({
      time: timeDeformat(""),
    });
    //设置在组件下个生命周期将清空的input传给父组件2_.AllRecordsTable.jsx（用于设置父组件GET请求（根据条件获取巡检结果记录列表）所带的参数）
    setUpdate(!update);
  }, [props.recordId]);

  //当（input清空时），将用户输入内容input传给父组件2_.AllRecordsTable.jsx
  useEffect(() => {
    //将input传给父组件2_.AllRecordsTable.jsx，用于设置父组件GET请求（根据条件获取巡检结果记录列表）所带的参数和父组件<Table>的状态
    props.exportData(input);
  }, [update]);

  //———————————————————————————————————————————————事件响应函数
  //<Form>中一般组件变化事件响应函数
  function handleChange(e, { value }, key) {
    // console.log("value", value, "key", key);
    //设置用户输入内容
    setInput((prev) => {
      return { ...prev, [key]: value };
    });
  }

  //<Form>中检测时间的时间段起点<DatePicker>组件变化事件响应函数
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

  //<Form>中检测时间的时间段终点<DatePicker>组件变化事件响应函数
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
    <Form>
      <Form.Group inline>
        <Form.Field>
          <label>时间段起点</label>
          <div
            id="father3"
            style={{ position: "relative", display: "inline-block" }}
          >
            <DatePicker
              container={() => document.getElementById("father3")}
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
              placeholder="时间段起点"
              value={datePicker1State.time}
              onChange={handleDatePicker1Change}
            />
          </div>
        </Form.Field>
        <Form.Field>
          <label>时间段终点</label>
          <div
            id="father4"
            style={{ position: "relative", display: "inline-block" }}
          >
            <DatePicker
              container={() => document.getElementById("father4")}
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
              placeholder="时间段终点"
              value={datePicker2State.time}
              onChange={handleDatePicker2Change}
            />
          </div>
        </Form.Field>
        <Form.Field>
          <label>关键字查询</label>
          <Input
            value={input.meterName}
            placeholder="检测内容关键字"
            onChange={(e, { value }) => handleChange(e, { value }, "meterName")}
          />
        </Form.Field>
        <Form.Select
          value={input.detectionType}
          label="识别类型"
          options={detectionTypeOptions}
          placeholder="全部"
          onChange={(e, { value }) =>
            handleChange(e, { value }, "detectionType")
          }
        />
        <Form.Select
          value={input.status}
          label="巡检结果"
          options={statusOptions}
          placeholder="全部"
          onChange={(e, { value }) => handleChange(e, { value }, "status")}
        />
        <Form.Select
          value={input.checkStatus}
          label="巡检审核状态"
          options={checkStatusOptions}
          placeholder="全部"
          onChange={(e, { value }) => handleChange(e, { value }, "checkStatus")}
        />
        <Form.Field>
          <Form.Button
            style={{ width: "70px", marginTop: "19px" }} //将查询按钮对齐底部
            onClick={() => {
              // console.log("datePicker1State", datePicker1State);
              // console.log("datePicker2State", datePicker2State);
              // console.log("hello", input);
              //将input传给父组件2_.AllRecordsTable.jsx（用于设置父组件GET请求（根据条件获取巡检结果记录列表）所带的参数）和父组件<Table>的状态
              props.exportData(input);
            }}
          >
            查询
          </Form.Button>
        </Form.Field>
      </Form.Group>
    </Form>
  );
}

export default OneRecordDetailTableQueryForm;
