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

function OneMeterRecordsTableQueryForm(props) {
  //———————————————————————————————————————————————useState
  //组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //   用户输入内容;
  //   const [input, setInput] = useState({
  //     startTime: "2018-10-25 17:36:45", //检测时间的时间段起点
  //     endTime: "2018-10-28 17:36:45", //检测时间的时间段终点
  //   });
  const [input, setInput] = useState({
    startTime: "", //检测时间的时间段起点
    endTime: "", //检测时间的时间段终点
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
  //当（将由父组件2_.OneMeterRecordsTableAndDetail#2#3.jsx传递来的点位ID发生变化时），清空查询条件（用户输入内容）
  useEffect(() => {
    //清空查询条件（用户输入内容）
    setInput({
      startTime: "", //检测时间的时间段起点
      endTime: "", //检测时间的时间段终点
    });
    //清空<DatePicker>的内容
    setDatePicker1State({
      time: timeDeformat(""),
    });
    setDatePicker2State({
      time: timeDeformat(""),
    });
    //设置在组件下个生命周期将清空的input传给父组件2_.OneMeterRecordsTableAndDetail#2#3.jsx（用于设置父组件GET请求（根据点位ID和时间段获取该点位巡检记录详情列表）所带的参数）
    setUpdate(!update);
  }, [props.meterId]); 

  //当（input清空时），将用户输入内容input传给父组件2_.OneMeterRecordsTableAndDetail#2#3.jsx
  useEffect(() => {
    //将input传给父组件2_.OneMeterRecordsTableAndDetail#2#3.jsx，用于设置父组件GET请求（根据点位ID和时间段获取该点位巡检记录详情列表）所带的参数和父组件<Table>的状态
    props.exportData(input);
  }, [update]);

  //———————————————————————————————————————————————事件响应函数
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
          <Form.Button
            style={{ width: "70px" }} //设置查询按钮位置
            onClick={() => {
              // console.log("datePicker1State", datePicker1State);
              // console.log("datePicker2State", datePicker2State);
              // console.log("hello", input);
              //将input传给父组件2_.OneMeterRecordsTableAndDetail#2#3.jsx，用于设置父组件GET请求（根据点位ID和时间段获取该点位巡检记录详情列表）所带的参数和父组件<Table>的状态
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

export default OneMeterRecordsTableQueryForm;
