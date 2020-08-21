//packages
import React, { useState, useEffect } from "react";
import { Input, Form, Dropdown } from "semantic-ui-react";
import { DatePicker } from "rsuite";
//elements
import TreeSearch from "../../elements/1.TreeSearch.jsx";

//———————————————————————————————————————————————Form.Select
//任务类型【"例行巡检"  "自定义巡检"  "特殊巡检"】
const taskTypeOptions = [
  { key: "例行巡检", text: "例行巡检", value: "例行巡检" },
  { key: "自定义巡检", text: "自定义巡检", value: "自定义巡检" },
  { key: "特殊巡检", text: "特殊巡检", value: "特殊巡检" },
];
//结束动作【"自动充电"  "原地待命"】
const endActionOptions = [
  { key: "自动充电", text: "自动充电", value: "自动充电" },
  { key: "原地待命", text: "原地待命", value: "原地待命" },
];
//任务执行方式 【"立即执行"  "定期执行"  "周期执行"】
const taskModeOptions = [
  { key: "立即执行", text: "立即执行", value: "立即执行" },
  { key: "定期执行", text: "定期执行", value: "定期执行" },
  { key: "周期执行", text: "周期执行", value: "周期执行" },
];
//任务周期单位（用于计算任务周期）【"小时"  "天"  "周"】
const periodUnitOptions = [
  { key: "小时", text: "小时", value: "1" },
  { key: "天", text: "天", value: "24" },
  { key: "周", text: "周", value: "168" },
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

//初始化<Form>中所有默认数据（用户输入内容）
function initInput(data) {
  // data = {
  //   //点击的行数据
  //   key: "1234",
  //   id: "1234", //任务ID
  //   taskName: "taskName", //任务名称
  //   taskDescription: "adfadfadsfasdf", //任务描述
  //   createTime: "2020-04-01 08:00:00", //任务创建时间
  //   endAction: "自动充电", //结束动作【"自动充电"  "原地待命"】
  //   type: "例行巡检", //任务类型【"例行巡检"  "自定义巡检"  "特殊巡检"】
  //   createUserId: "1234", //创建任务UserId
  //   meters: "", //点位信息
  //   status: "等待执行", //任务执行状态【"等待执行"  "执行完成"  "正在执行"  "中途终止"  "任务超期"】
  //   mode: "周期执行", //任务执行方式【"立即执行"  "定期执行"  "周期执行"】
  //   startTime: "2020-04-02 08:00:00", //任务开始时间（当mode为定期执行和周期执行时有效）
  //   period: "20", //任务执行周期（当mode为周期执行时有效）
  //   isStart: "启用", //任务是否启用（当mode为周期执行时有效）【"启用"  "禁用"】
  // };

  let newInput = {
    id: data && data.id ? data.id : "",
    taskName: data && data.taskName ? data.taskName : "",
    taskDescription: data && data.taskDescription ? data.taskDescription : "",
    createTime:
      data && data.createTime ? data.createTime : timeFormat(new Date()), //当前时间
    endAction: data && data.endAction ? data.endAction : "",
    type: data && data.type ? data.type : "",
    createUserId: data && data.createUserId ? data.createUserId : "",
    meters: data && data.meters ? data.meters : "",
    status: data && data.status ? data.status : "",
    mode: data && data.mode ? data.mode : "",
    startTime: data && data.startTime ? data.startTime : "",
    period: data && data.period ? data.period : "",
    isStart: data && data.isStart ? data.isStart : "",
  };
  return newInput;
}

function TaskForm(props) {
  //———————————————————————————————————————————————useState
  // //用户输入内容
  // const [input, setInput] = useState({
  //   id: "1234", //任务ID
  //   taskName: "",
  //   taskDescription: "",
  //   createTime: timeFormat(new Date()), //当前时间
  //   endAction:"自动充电",
  //   type: "自定义巡检",
  //   createUserId: "",
  //   meters: "",
  //   status: "等待执行",
  //   mode: "立即执行",
  //   startTime: "",
  //   period: "",
  //   isStart: "禁用",
  // });
  const [input, setInput] = useState(initInput(props.data));

  //任务执行周期组件（值+单位）的状态
  const [periodInput, setPeriodInput] = useState({
    value: props.data && props.data.period ? props.data.period : "", //值（用户输入或从父组件获取）
    unit: "1", //单位【1-"小时"  24-"天"  168-"周"】（默认小时）
  });

  //<Form.Radio>的选中状态
  const [radioState, setRadioState] = useState(input.isStart);

  //<DatePicker>的状态
  const [datePickerState, setDatePickerState] = useState({
    date: timeDeformat(input.startTime),
  });

  //———————————————————————————————————————————————useEffect
  //当用户输入内容input发生变化时，将其传给父组件
  useEffect(() => {
    //将input传给父组件3_1_.AddOrEditTaskModal.jsx，用于设置父组件POST请求（新增任务）或PUT请求（修改任务）所带的参数
    props.exportData(input);
  }, [input]);

  //———————————————————————————————————————————————事件响应函数
  //<Form>中一般组件变化事件响应函数
  function handleChange(e, { value }, key) {
    console.log("value", value, "key", key);
    //设置用户输入内容
    setInput((prev) => {
      return { ...prev, [key]: value };
    });
  }

  //<Form>中（任务执行周期）组件（值+单位）变化事件响应函数
  function handlePeriodChange(e, { value }, key) {
    console.log("value", value, "key", key);
    let periodValueInHour;
    //值
    if (key === "period") {
      //限制用户输入的任务执行周期（值）为float类型
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
      //限制用户输入的任务执行周期（值）为int类型
      value = value.replace(/[^0-9]/gi, "");
      console.log("period value after replace:", value);
      //设置任务执行周期组件（值）的状态
      setPeriodInput((prev) => {
        return { ...prev, value: value };
      });
      //计算以小时为单位的任务执行周期
      periodValueInHour = parseInt(value) * parseInt(periodInput.unit);
      console.log("periodValueInHour:", periodValueInHour);
    }
    //单位
    if (key === "periodUnit") {
      console.log("periodUnit:", value);
      //设置任务执行周期组件（单位）的状态
      setPeriodInput((prev) => {
        return { ...prev, unit: value };
      });
      //计算以小时为单位的任务执行周期
      periodValueInHour = parseInt(periodInput.value) * parseInt(value);
      console.log("periodValueInHour", periodValueInHour);
    }

    //设置用户输入内容
    periodValueInHour
      ? setInput((prev) => {
          return { ...prev, period: periodValueInHour.toString() };
        })
      : setInput((prev) => {
          return { ...prev, period: "" };
        });
  }

  //<Form>中<DatePicker>组件变化事件响应函数
  function handleDatePickerChange(date) {
    //设置<DatePicker>的状态
    setDatePickerState({ date: date });
    //转换时间格式"Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)"——>"2016-05-12 08:00:00"
    let time = date;
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
          value={input.endAction}
          fluid
          label="任务结束动作"
          options={endActionOptions}
          placeholder="任务结束动作"
          onChange={(e, { value }) => handleChange(e, { value }, "endAction")}
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
        {input.mode === "定期执行" || input.mode === "周期执行" ? (
          <Form.Field>
            <label>任务开始时间</label>
            <div id="father" style={{ position: "relative" }}>
              <DatePicker
                container={() => document.getElementById("father")}
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
                placeholder="任务开始时间"
                value={datePickerState.date}
                onChange={handleDatePickerChange}
              />
            </div>
          </Form.Field>
        ) : null}
        {input.mode === "周期执行" ? (
          <Form.Field>
            <label>任务执行周期</label>
            <Input
              value={periodInput.value}
              placeholder="任务执行周期"
              onChange={(e, { value }) =>
                handlePeriodChange(e, { value }, "period")
              }
              label={
                <Dropdown
                  defaultValue="1"
                  options={periodUnitOptions}
                  onChange={(e, { value }) =>
                    handlePeriodChange(e, { value }, "periodUnit")
                  }
                />
              }
              labelPosition="right"
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
          console.log("datePickerState", datePickerState);
          console.log("hello", input);
        }}
      >
        Submit
      </Form.Button> */}
    </Form>
  );
}

export default TaskForm;
