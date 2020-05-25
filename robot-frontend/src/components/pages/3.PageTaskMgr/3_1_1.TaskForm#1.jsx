//packages
import React, { useState, useEffect } from "react";
import { Input, Form } from "semantic-ui-react";
import { Calendar } from "primereact/calendar";
//elements
import TreeSearch from "../../elements/1.TreeSearch.jsx";
//variables
import { userID } from "../../pages/1.PageLogin/1.UserForm.jsx";

//———————————————————————————————————————————————Form.Select
const taskTypeOptions = [
  { key: "全面巡检", text: "全面巡检", value: "全面巡检" },
  { key: "例行巡检", text: "例行巡检", value: "例行巡检" },
  { key: "自定义巡检", text: "自定义巡检", value: "自定义巡检" },
];

const taskModeOptions = [
  { key: "立即执行", text: "立即执行", value: "立即执行" },
  { key: "定期执行", text: "定期执行", value: "定期执行" },
  { key: "周期执行", text: "周期执行", value: "周期执行" },
];

//———————————————————————————————————————————————Calendar（https://www.primefaces.org/primereact/showcase/#/calendar）
//设置Calendar的当前时间
let today = new Date();
let month = today.getMonth();
let year = today.getFullYear();
let prevMonth = month === 0 ? 11 : month - 1;
let prevYear = prevMonth === 11 ? year - 1 : year;
let nextMonth = month === 11 ? 0 : month + 1;
let nextYear = nextMonth === 0 ? year + 1 : year;
//日期选择范围（暂时没用到）
let minDate = new Date();
minDate.setMonth(prevMonth);
minDate.setFullYear(prevYear);
let maxDate = new Date();
maxDate.setMonth(nextMonth);
maxDate.setFullYear(nextYear);
//地区
const location = {
  firstDayOfWeek: 1,
  dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
  dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
  monthNames: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  monthNamesShort: [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ],
};

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

//初始化<Form>中所有默认数据（用户输入内容）
function initInput(data) {
  // data = {
  //   //点击的行数据
  //   key: "1234",
  //   id: "1234", //任务ID
  //   taskName: "taskName", //任务名称
  //   taskDescription: "adfadfadsfasdf", //任务描述
  //   createTime: "2020-04-01 08:00:00", //任务创建时间
  //   type: "自定义巡检", //任务类型
  //   createUserId: "1234", //创建任务UserId
  //   meters: "", //点位信息
  //   status: "等待执行", //任务执行状态
  //   mode: "周期执行", //任务执行方式
  //   startTime: "2020-04-02 08:00:00", //任务开始时间（当mode为定期执行和周期执行时有效）
  //   endTime: "", //任务结束时间
  //   period: "20", //任务执行周期（当mode为周期执行时有效）
  //   isStart: "启用", //任务是否启用（当mode为周期执行时有效）
  // };

  let newInput = {
    id: data && data.id ? data.id : "",
    taskName: data && data.taskName ? data.taskName : "",
    taskDescription: data && data.taskDescription ? data.taskDescription : "",
    createTime:
      data && data.createTime ? data.createTime : timeFormat(new Date()), //当前时间
    type: data && data.type ? data.type : "3",
    createUserId: data && data.createUserId ? data.createUserId : userID,
    meters: data && data.meters ? data.meters : "",
    status: data && data.status ? data.status : "等待执行",
    mode: data && data.mode ? data.mode : "立即执行",
    startTime: data && data.startTime ? data.startTime : "", //当前时间
    endTime: data && data.endTime ? data.endTime : "",
    period: data && data.period ? data.period : "",
    isStart: data && data.isStart ? data.isStart : "禁用",
  };
  return newInput;
}

function TaskForm(props) {
  //———————————————————————————————————————————————useState
  //用户输入内容
  // const [input, setInput] = useState({
  //   taskName: "",
  //   taskDescription: "",
  //   createTime: timeFormat(new Date()), //当前时间
  //   type: "自定义巡检",
  //   createUserId: userID,
  //   meters: "",
  //   status: "等待执行",
  //   mode: "立即执行",
  //   startTime: "",
  //   endTime: "",
  //   period: "",
  //   isStart: "禁用",
  // });
  const [input, setInput] = useState(initInput(props.data));

  //<Form.Radio>的选中状态
  const [radioState, setRadioState] = useState(input.isStart);

  //<Calendar>的状态（暂时只用到了date）
  const [calendarState, setCalendarState] = useState({
    date: timeDeformat(input.startTime),
    minDate: minDate,
    maxDate: maxDate,
    invalidDates: [today],
  });

  useEffect(() => {
    //————————————————————————————将input传给父组件
    props.exportData(input);
  }, [input]);

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

  //<Form>中<Calendar>组件变化事件响应函数
  function handleCalendarChange(e) {
    //设置<Calendar>的状态
    setCalendarState((prev) => {
      return { ...prev, date: e.value };
    });
    //转换时间格式"Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)"——>"2016-05-12 08:00:00"
    let time = e.value;
    let convertedTime = timeFormat(time);
    console.log("convertedTime", convertedTime);
    //设置用户输入内容
    setInput((prev) => {
      return { ...prev, startTime: convertedTime };
    });
  }

  return (
    <Form>
      <Form.Field>
        <label>任务名称</label>
        <Input
          value={input.taskName}
          placeholder="任务名称"
          onChange={(e, { value }) => handleChange(e, { value }, "taskName")}
        />
      </Form.Field>
      <Form.TextArea
        value={input.taskDescription}
        label="任务描述"
        placeholder="请输入任务相关描述..."
        onChange={(e, { value }) =>
          handleChange(e, { value }, "taskDescription")
        }
      />
      <Form.Group widths="equal">
        <Form.Select
          value={input.type}
          fluid
          label="任务类型"
          options={taskTypeOptions}
          placeholder="任务类型"
          onChange={(e, { value }) => handleChange(e, { value }, "type")}
        />
        <Form.Select
          value={input.mode}
          fluid
          label="任务执行方式"
          options={taskModeOptions}
          placeholder="任务执行方式"
          onChange={(e, { value }) => handleChange(e, { value }, "mode")}
        />
      </Form.Group>
      <Form.Group widths="equal">
        {input.mode !== "立即执行" ? (
          <Form.Field>
            <label>任务开始时间</label>
            <Calendar
              style={{ width: "317px" }}
              value={calendarState.date}
              locale={location}
              dateFormat="yy/mm/dd"
              showTime={true}
              showSeconds={true}
              placeholder="任务开始时间"
              onChange={handleCalendarChange}
            />
          </Form.Field>
        ) : null}
        {input.mode === "周期执行" ? (
          <Form.Field>
            <label>任务执行周期（小时）</label>
            <Input
              value={input.period}
              placeholder="任务执行周期（小时）"
              onChange={(e, { value }) => handleChange(e, { value }, "period")}
            />
          </Form.Field>
        ) : null}
      </Form.Group>
      <Form.Field>
        <label>请选择点位</label>
        <TreeSearch
          type={"insideForm"}
          meters={input.meters}
          exportMeters={({ value }) => handleChange(null, { value }, "meters")}
        />
      </Form.Field>
      <Form.Group inline>
        <Form.Radio
          label="禁用该任务"
          value="禁用"
          checked={radioState === "禁用"}
          onChange={(e, { value }) => {
            setRadioState("禁用");
            handleChange(e, { value }, "isStart");
          }}
        />
        <Form.Radio
          label="启用该任务"
          value="启用"
          checked={radioState === "启用"}
          onChange={(e, { value }) => {
            setRadioState("启用");
            handleChange(e, { value }, "isStart");
          }}
        />
      </Form.Group>
      {/* <Form.Button
        onClick={() => {
          console.log("calendarState", calendarState);
          console.log("hello", input);
        }}
      >
        Submit
      </Form.Button> */}
    </Form>
  );
}

export default TaskForm;
