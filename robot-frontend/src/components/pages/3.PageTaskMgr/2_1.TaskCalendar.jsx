//packages
import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Spin } from "antd";
import FullCalendar from "@fullcalendar/react";
import zh_cn from "@fullcalendar/core/locales/zh-cn"; //地区
import dayGridPlugin from "@fullcalendar/daygrid"; //dayGridView
import timeGridPlugin from "@fullcalendar/timegrid"; //timeGridView
import listPlugin from "@fullcalendar/list"; //listView
import momentPlugin from "@fullcalendar/moment"; //格式化时间（eg."YYYY/MM/DD"）
import interactionPlugin from "@fullcalendar/interaction"; //events（eg.dayClick eventClick）
import bootstrapPlugin from "@fullcalendar/bootstrap"; // theme
//css文件（must manually import the stylesheets for each plugin）
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";
// import "bootswatch/dist/minty/bootstrap.min.css";//theme
import taskCalendarStyle from "./2_1.TaskCalendar.css"; //自定义theme
//functions
import { getData } from "../../../functions/requestDataFromAPI.js";
import emitter from "../../../functions/events.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "20px",
    width: "100%",
    height: "785px",
    fontFamily: "Arial, Helvetica Neue, Helvetica, sans-serif",
    fontSize: "14px",
  },
}));

//———————————————————————————————————————————————Calendar（https://fullcalendar.io/）
//Premium Plugins
const plugins = [
  bootstrapPlugin,
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  momentPlugin,
  interactionPlugin,
];
//Toolbar的header设置（包含的view）
const header = {
  left: "prev,today,next",
  center: "title",
  right: "dayGridMonth,listWeek",
};
//Toolbar的buttonText设置
const buttonText = {
  prev: "<",
  next: ">",
  today: "本月",
  month: "月",
  list: "任务",
};
//Views
const views = {
  // name of view
  dayGridMonth: {
    titleFormat: "YYYY/MM/DD",
    eventLimit: 5, // adjust to 5 only for timeGridWeek/timeGridDay
    eventLimitText: "more", //Determines the text of the link created by the eventLimit setting.
    eventLimitClick: "list", //Determines the action taken when the user clicks on a “more” link created by the eventLimit option.
  },
  // name of view
  listWeek: {
    titleFormat: "YYYY/MM/DD",
  },
};

//———————————————————————————————————————————————全局函数
//转换时间格式"2016-05-12 08:00:00"——>"Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)"
function timeDeformat(convertedTime) {
  convertedTime = convertedTime.replace(new RegExp(/-/gm), "/"); //将所有的'-'转为'/'即可（为了兼容IE）
  let time = convertedTime === "" ? null : new Date(convertedTime);
  return time;
}

//获取包含全部任务的list
function getTaskList(list) {
  var newList = [];
  newList = list.map((item, index) => {
    var newItem = {
      key: "",
      id: "", //任务ID
      taskName: "", //任务名称
      createTime: "", //任务创建时间
      type: "", //任务类型
      createUserId: "", //创建任务UserId
      meters: "", //点位信息
      status: "", //任务执行状态
      mode: "", //任务执行方式
      startTime: "", //任务开始时间（当mode为定期执行和周期执行时有效）
      endTime: "", //任务结束时间
      period: "", //任务执行周期（当mode为周期执行时有效）
      isStart: "", //任务是否启用（当mode为周期执行时有效）
    };
    newItem.key = index;
    newItem.id = item.id;
    newItem.taskName = item.taskName;
    newItem.createTime = item.createTime;
    newItem.type = item.type;
    newItem.createUserId = item.createUserId;
    newItem.meters = item.meters;
    newItem.status = item.status;
    newItem.mode = item.mode;
    newItem.startTime = item.startTime;
    newItem.endTime = item.endTime;
    newItem.period = item.period;
    newItem.isStart = item.isStart;
    return newItem;
  });
  console.log("newList", newList);
  return newList;
}

//获取日历事件数据
function generateCalendarEvents(list) {
  var events = [];
  list.map((item, index) => {
    var newEvent = {
      //https://fullcalendar.io/docs/event-object
      id: "",
      title: "",
      start: "",
      end: "",
      backgroundColor: "",
      borderColor: "#FFFFFF",
      textColor: "#818281",
    };
    //CTT createTime->startTime
    if (item.createTime) {
      //CTT 去掉item.isStart
      if (item.id % 5 === 0) {
        item.isStart = true;
      }
      newEvent.id = item.id;
      newEvent.title = item.taskName;
      newEvent.start = timeDeformat(item.createTime); //CTT createTime->startTime
      newEvent.end = item.endTime ? timeDeformat(item.endTime) : null;
      newEvent.backgroundColor = item.isStart ? "#b0eacd" : "#fbf4f9";
      events.push(newEvent);
    }
    return item;
  });
  // console.log("events", events);
  return events;
}

//根据日历event的id获取相应的单条任务信息
function getTaskDetailById(id, list) {
  let filteredListArray = list.filter((item) => {
    return item.id == id; //id：string item.id：number
  });

  if (filteredListArray.length > 0) {
    return filteredListArray[0];
  }
  return null;
}

function TaskCalendar() {
  const classes = useStyles();

  //———————————————————————————————————————————————useRef
  const calendarComponentRef = useRef();

  //———————————————————————————————————————————————useState
  //calendar的状态
  const [calendarState, setCalendarState] = useState({
    calendarWeekends: true,
    calendarEvents: [
      // initial event data
      //{ title: "Event Now", start: new Date() },
    ],
    taskList: [], //全部任务数据
  });

  //日历数据是否正在请求的状态
  const [loading, setLoading] = useState(false);

  //页面是否需要更新的状态
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    //————————————————————————————添加监听事件
    emitter.addListener("updateCalendar:", () => {
      setUpdate(!update);
    });
    //设置表格数据请求状态为正在请求
    setLoading(true);
    //————————————————————————————GET请求
    getData("/taskTemplates").then((data) => {
      console.log("get结果", data);
      if (data.success) {
        var result = data.data.list;
        console.log("result", result);
        //获取全部任务数据和日历事件数据
        const taskList = getTaskList(result);
        const calendarEvents = generateCalendarEvents(taskList);
        //设置<Calendar>的状态
        setCalendarState({
          calendarWeekends: true,
          calendarEvents: calendarEvents,
          taskList: taskList,
        });
        //设置日历数据请求状态为完成
        setLoading(false);
      } else {
        alert(data.data.detail);
      }
    });
  }, [update]);

  //———————————————————————————————————————————————事件响应函数
  //event点击事件响应函数
  function handleEventClick(arg) {
    // console.log("event id:",arg.event.id);
    //根据日历event的id获取相应的单条任务信息
    const message = getTaskDetailById(arg.event.id, calendarState.taskList);
    //发送事件到3_3.TaskDetail中（刷新任务详细信息）
    message && emitter.emit("taskDetail:", message);
  }

  return (
    <div className={classes.root}>
      <Spin spinning={loading} tip="Loading..." size="large">
        <FullCalendar
          //Premium Plugins
          plugins={plugins}
          //Toolbar
          header={header}
          buttonText={buttonText}
          //Theme
          themeSystem="bootstrap" //自定义style需要这一行！
          style={taskCalendarStyle}
          //Sizing
          contentHeight={730}
          //view表格
          views={views}
          defaultView="dayGridMonth"
          ref={calendarComponentRef}
          //Locale
          locale={zh_cn} //地区设置
          //State
          weekends={calendarState.calendarWeekends}
          events={calendarState.calendarEvents}
          //Events
          eventClick={handleEventClick}
        />
      </Spin>
    </div>
  );
}

export default TaskCalendar;
