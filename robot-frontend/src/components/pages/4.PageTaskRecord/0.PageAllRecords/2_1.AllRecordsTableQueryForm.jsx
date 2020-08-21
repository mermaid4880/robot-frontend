//packages
import React, { useState } from "react";
import { Input, Form } from "semantic-ui-react";
import { DatePicker } from "rsuite";

//———————————————————————————————————————————————Form.Select
//巡检完成状态【"未完成"  "完成"】
const isFinishedOptions = [
  { key: "全部", text: "全部", value: "" },
  { key: "未完成", text: "未完成", value: "未完成" },
  { key: "完成", text: "完成", value: "完成" },
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

function AllRecordsTableQueryForm(props) {
  //———————————————————————————————————————————————useState
  //用户输入内容
  // const [input, setInput] = useState({
  //   startTime: "2018-10-25 17:36:45", //巡检开始时间的时间段起点
  //   endTime: "2018-10-28 17:36:45", //巡检开始时间的时间段终点
  //   taskName: "测", //关键字（任务名称模糊查询）
  //   isFinished: "完成", //巡检完成状态【"未完成"  "完成"】
  // });
  const [input, setInput] = useState({
    startTime: "", //巡检开始时间的时间段起点
    endTime: "", //巡检开始时间的时间段终点
    taskName: "", //关键字（任务名称模糊查询）
    isFinished: "", //巡检完成状态【"未完成"  "完成"】
  });

  //<DatePicker>的状态
  const [datePicker1State, setDatePicker1State] = useState({
    time: timeDeformat(input.startTime),
  });

  //<DatePicker>的状态
  const [datePicker2State, setDatePicker2State] = useState({
    time: timeDeformat(input.endTime),
  });

  //———————————————————————————————————————————————事件响应函数
  //<Form>中一般组件变化事件响应函数
  function handleChange(e, { value }, key) {
    // console.log("value", value, "key", key);
    //设置用户输入内容
    setInput((prev) => {
      return { ...prev, [key]: value };
    });
  }

  //<Form>中巡检开始时间的时间段起点<DatePicker>组件变化事件响应函数
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

  //<Form>中巡检开始时间的时间段终点<DatePicker>组件变化事件响应函数
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
              placeholder="时间段起点"
              value={datePicker1State.time}
              onChange={handleDatePicker1Change}
            />
          </div>
        </Form.Field>
        <Form.Field>
          <label>时间段终点</label>
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
              placeholder="时间段终点"
              value={datePicker2State.time}
              onChange={handleDatePicker2Change}
            />
          </div>
        </Form.Field>
        <Form.Field>
          <label>关键字查询</label>
          <Input
            value={input.taskName}
            placeholder="任务名称关键字"
            onChange={(e, { value }) => handleChange(e, { value }, "taskName")}
          />
        </Form.Field>
        <Form.Select
          value={input.isFinished}
          label="巡检完成状态"
          options={isFinishedOptions}
          placeholder="全部"
          onChange={(e, { value }) => handleChange(e, { value }, "isFinished")}
        />
        <Form.Field>
          <Form.Button
            style={{ width: "70px" }} //设置查询按钮位置
            onClick={() => {
              // console.log("datePicker1State", datePicker1State);
              // console.log("datePicker2State", datePicker2State);
              // console.log("hello", input);
              //将input传给父组件2_.AllRecordsTable.jsx，用于设置父组件GET请求（根据条件获取巡检结果记录列表）所带的参数和父组件<Table>的状态
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

export default AllRecordsTableQueryForm;
