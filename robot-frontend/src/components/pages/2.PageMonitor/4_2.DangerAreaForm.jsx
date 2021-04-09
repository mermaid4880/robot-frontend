//packages
import React, { useState, useEffect } from "react";
import { Form } from "semantic-ui-react";
import { DatePicker } from "rsuite";

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

//获取<Form>中所有默认数据（用户输入内容）
function getInput(data) {
  // data = {
  //   //新增检修区域的信息
  //   uuid: "1234", //检修区域ID
  //   x1: 100, //检修区域左上角X坐标
  //   y1: 100, //检修区域左上角Y坐标
  //   x2: 200, //检修区域右下角X坐标
  //   y2: 200, //检修区域右下角Y坐标
  //   startTime: "2020-04-02 08:00:00", //检修开始时间
  //   endTime: "2020-05-02 08:00:00", //检修结束时间
  //   detail: "检修区域详情信息", //检修区域详情信息
  // };

  let newInput = {
    uuid: data && data.uuid ? data.uuid : null,
    x1: data && data.x1 ? data.x1 : null,
    y1: data && data.y1 ? data.y1 : null,
    x2: data && data.x2 ? data.x2 : null,
    y2: data && data.y2 ? data.y2 : null,
    startTime: data.startTime ? data.startTime : timeFormat(new Date()), //当前时间
    endTime: data.endTime ? data.endTime : timeFormat(new Date()), //当前时间
    detail: data.detail ? data.detail : "",
  };

  console.log("newInput", newInput);
  return newInput;
}

function DangerAreaForm(props) {
  //———————————————————————————————————————————————useState
  // //用户输入内容
  // const [input, setInput] = useState({
  //   uuid: "", //检修区域ID
  //   x1: "", //检修区域左上角X坐标
  //   y1: "", //检修区域左上角Y坐标
  //   x2: "", //检修区域右下角X坐标
  //   y2: "", //检修区域右下角Y坐标
  //   startTime: "", //检修开始时间
  //   endTime: "", //检修结束时间
  //   detail: "", //检修区域详情信息
  // });
  const [input, setInput] = useState(getInput(props.data));

  //<DatePicker>的状态
  const [datePicker1State, setDatePicker1State] = useState({
    time: timeDeformat(input.startTime),
  });

  //<DatePicker>的状态
  const [datePicker2State, setDatePicker2State] = useState({
    time: timeDeformat(input.endTime),
  });

  //———————————————————————————————————————————————useEffect
  //当（由父组件4_.Map.jsx传递来的data发生变化时），重新设置用户输入内容input和<DatePicker>的状态
  useEffect(() => {
    setInput(getInput(props.data));
    setDatePicker1State({
      time: timeDeformat(input.startTime),
    });
    setDatePicker2State({
      time: timeDeformat(input.endTime),
    });
  }, [props.data]);

  //当用户输入内容input发生变化时，将其传给父组件
  useEffect(() => {
    //将input传给父组件4_.Map.jsx，用于设置父组件POST请求（新增任务）或PUT请求（修改任务）所带的参数
    props.exportData(input);
  }, [input]);

  //———————————————————————————————————————————————事件响应函数
  //<Form>中一般组件变化事件响应函数
  function handleChange(e, { value }, key) {
    if (props.action === "delete") return;
    console.log("value", value, "key", key);
    //设置用户输入内容
    setInput((prev) => {
      return { ...prev, [key]: value };
    });
  }

  //<Form>中检修开始时间<DatePicker>组件变化事件响应函数
  function handleDatePicker1Change(time) {
    if (props.action === "delete") return;
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

  //<Form>中检修结束时间<DatePicker>组件变化事件响应函数
  function handleDatePicker2Change(time) {
    if (props.action === "delete") return;
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
      <Form.Field>
        <label>检修开始时间</label>
        <div id="fatherStart" style={{ position: "relative" }}>
          <DatePicker
            container={() => document.getElementById("fatherStart")}
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
            placeholder="检修开始时间"
            value={datePicker1State.time}
            onChange={handleDatePicker1Change}
          />
        </div>
      </Form.Field>
      <Form.Field>
        <label>检修结束时间</label>
        <div id="fatherEnd" style={{ position: "relative" }}>
          <DatePicker
            container={() => document.getElementById("fatherEnd")}
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
            placeholder="检修结束时间"
            value={datePicker2State.time}
            onChange={handleDatePicker2Change}
          />
        </div>
      </Form.Field>
      <Form.TextArea
        value={input.detail}
        label="详情信息"
        placeholder="请输入检修区域详情信息..."
        onChange={(e, { value }) => {
          handleChange(e, { value }, "detail");
        }}
      />
      {/* <Form.Button
        onClick={() => {
          console.log("datePickerState", datePickerState);
          console.log("hello", input);
        }}
      >
        Submit
      </Form.Button> */}
    </Form>
  );
}

export default DangerAreaForm;
