//packages
import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Spin } from "antd";
import FullCalendar from "@fullcalendar/react";
import zh_cn from "@fullcalendar/core/locales/zh-cn"; //地区
import dayGridPlugin from "@fullcalendar/daygrid"; //dayGridView
import timeGridPlugin from "@fullcalendar/timegrid"; //timeGridView
import listPlugin from "@fullcalendar/list"; //listView
import momentPlugin from "@fullcalendar/moment"; //格式化时间（eg."YYYY/MM/DD"）
import interactionPlugin from "@fullcalendar/interaction"; //events（eg.dayClick eventClick）
import bootstrapPlugin from "@fullcalendar/bootstrap"; //theme
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
    marginTop: "8px",
    width: "100%",
    height: "785px",
    fontFamily: "Arial, Helvetica Neue, Helvetica, sans-serif",
    fontSize: "14px",
  },
}));

//———————————————————————————————————————————————全局函数
//转换时间格式"Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)"——>"2016-05-12"
function timeFormat(time) {
  if (!time) return ""; //如果time是null返回空字符串""
  var yy = time.getFullYear();
  var mm = time.getMonth() + 1;
  var dd = time.getDate();
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (dd < 10) {
    dd = "0" + dd;
  }
  let convertedDate = yy + "-" + mm + "-" + dd;
  // console.log("convertedDate", convertedDate);
  return convertedDate;
}

//转换时间格式"2016-05-12 08:00:00"——>"Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)"
function timeDeformat(convertedTime) {
  convertedTime = convertedTime.replace(new RegExp(/-/gm), "/"); //将所有的'-'转为'/'即可（为了兼容IE）
  let time = convertedTime === "" ? null : new Date(convertedTime);
  // console.log("time", time);
  return time;
}

//调整23点以后的时间"2016-05-12 23:01:00"——>"2016-05-12 23:59:59"
function timeAdjust(time) {
  let adjustedTime = time.substring(0, 11) + "23:59:59";
  // console.log("adjustedTime", adjustedTime);
  return adjustedTime;
}

//将日历title"2020/07/01 – 2020/07/31"——>{startTime: "2020-07-01 00:00:00", endTime: "2020-07-31 23:59:59"}
//或
//将日历title"2020/07/01"——>{startTime: "2020-07-01 00:00:00", endTime: "2020-07-01 23:59:59"}
function getTimeRange(title) {
  let timeRange = {
    startTime: dateTransform(title.substring(0, 10), "00:00:00"),
    endTime: dateTransform(
      title.substring(13, 23)
        ? title.substring(13, 23)
        : title.substring(0, 10),
      "23:59:59"
    ),
  };
  // console.log("timeRange", timeRange);
  return timeRange;
}

//转换时间格式"2016/05/12"——>"2016-05-12 00:00:00"
function dateTransform(convertedTime, hhmmss) {
  convertedTime = convertedTime.replace(new RegExp(/[/]+/gm), "-"); //将所有的'/'转为'-'即可
  let time = convertedTime + " " + hhmmss;
  // console.log("time", time);
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
      taskDescription: "", //任务描述
      createTime: "", //任务创建时间
      endAction: "", //结束动作【"自动充电"  "原地待命"】
      type: "", //任务类型【"例行巡检"  "自定义巡检"  "特殊巡检"】
      createUserId: "", //创建任务UserId
      meters: "", //点位信息
      status: "", //任务执行状态【"等待执行"  "执行完成"  "正在执行"  "中途终止"  "任务超期"】
      mode: "", //任务执行方式【"立即执行"  "定期执行"  "周期执行"】
      startTime: "", //任务开始时间（当mode为定期执行和周期执行时有效）
      period: "", //任务执行周期（当mode为周期执行时有效）
      isStart: "", //任务是否启用【"启用"  "禁用"】
    };
    newItem.key = index;
    newItem.id = item.id;
    newItem.taskName = item.taskName;
    newItem.taskDescription = item.taskDescription;
    newItem.createTime = item.createTime;
    newItem.endAction = item.endAction;
    newItem.type = item.type;
    newItem.createUserId = item.createUserId;
    newItem.meters = item.meters;
    newItem.status = item.status;
    newItem.mode = item.mode;
    newItem.startTime = item.startTime;
    newItem.period = item.period;
    newItem.isStart = item.isStart;
    return newItem;
  });
  // console.log("getTaskList", newList);
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

    if (item.startTime) {
      newEvent.id = item.id;
      newEvent.title = item.taskName;
      newEvent.start = timeDeformat(item.startTime);
      newEvent.end = //如果任务开始时间超过23点，则设置任务结束时间为23:59:59
        item.startTime.substring(11, 13) === "23"
          ? timeAdjust(item.startTime)
          : null;
      newEvent.backgroundColor =
        item.isStart === "启用" ? "#b0eacd" : "#fbf4f9";
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

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useRef
  const calendarComponentRef = useRef();

  //———————————————————————————————————————————————useState
  //FullCalendar的状态
  const [calendarState, setCalendarState] = useState({
    calendarWeekends: true,
    calendarEvents: [
      // initial event data
      //{ title: "Event Now", start: new Date() },
    ],
    taskList: [], //全部任务数据
  });

  //日历Toolbar中自定义按钮myToday显示的文字（“本月”或“今天”）
  const [myTodayText, setMyTodayText] = useState("本月");

  //日历数据请求的时间段
  const [timeRange, setTimeRange] = useState({
    startTime: "", //时间段起点
    endTime: "", //时间段终点
  });

  //日历数据是否正在请求的状态
  const [loading, setLoading] = useState(false);

  //组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //———————————————————————————————————————————————useEffect
  //当（本组件加载完成后），设置日历数据请求的时间段（根据日历title）
  useEffect(() => {
    //————————————————————————————设置日历数据请求的时间段（根据日历title）
    handleTodayClick();
  }, []);

  //当（监听到事件"updateCalendar"）或（日历数据请求的时间段变化）时，重新添加监听事件、请求日历数据
  useEffect(() => {
    //————————————————————————————添加监听事件
    emitter.addListener("updateCalendar", () => {
      //如果由3_1_.AddOrEditTaskModal.jsx、3_2.DeleteTaskModal.jsx、3_3.IssueTaskModal.jsx发来消息（新增、修改、删除、下发任务）
      setUpdate(!update);
    });
    //设置日历数据请求状态为正在请求
    setLoading(true);
    //————————————————————————————GET请求
    //用URLSearchParams来传递参数
    let params = new URLSearchParams();
    timeRange.startTime &&
      params.append("startTime", timeRange.startTime.toString());
    timeRange.endTime && params.append("endTime", timeRange.endTime.toString());
    //发送GET请求
    getData("task/calendar", { params: params })
      .then((data) => {
        console.log("get结果", data);
        if (data.success) {
          var result = data.data.list;
          // console.log("result", result);
          //获取全部任务数据和日历事件数据
          const taskList = getTaskList(result);
          const calendarEvents = generateCalendarEvents(taskList);
          //设置<FullCalendar>的状态
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
      })
      .catch((error) => {
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
      });
  }, [update, timeRange]);

  //———————————————————————————————————————————————设置<FullCalendar>用到的变量（https://fullcalendar.io/）
  //———————————————————————————插件
  //Premium Plugins
  const plugins = [
    bootstrapPlugin,
    dayGridPlugin,
    timeGridPlugin,
    listPlugin,
    momentPlugin,
    interactionPlugin,
  ];
  //———————————————————————————Toolbar
  //Toolbar的header设置（包含的view）
  const header = {
    left: "myPrev,myToday,myNext", //自定义
    center: "title",
    right: "myDayGridMonth,myListMonth",
  };
  //Toolbar的buttonText设置（对应的view的按钮显示文字）
  const buttonText = {
    myDayGridMonth: "月",
    myListMonth: "任务",
  };
  //Toolbar里的自定义按钮
  const customButtons = {
    myPrev: {
      text: "<",
      click: handlePrevClick,
    },
    myToday: {
      text: myTodayText,
      click: handleTodayClick,
    },
    myNext: {
      text: ">",
      click: handleNextClick,
    },
    myDayGridMonth: {
      text: "月",
      click: handleDayGridMonthClick,
    },
    myListMonth: {
      text: "任务",
      click: handleListMonthClick,
    },
  };
  //———————————————————————————Views
  //Views
  const views = {
    // name of view     月——天——任务
    dayGridMonth: {
      titleFormat: "YYYY/MM/DD",
      eventLimit: 5, // adjust to 5 only for timeGridWeek/timeGridDay
      eventLimitText: "more", //Determines the text of the link created by the eventLimit setting.
    },
    // name of view     月——任务列表
    listMonth: {
      titleFormat: "YYYY/MM/DD",
    },
    // name of view     天——任务列表
    listDay: {
      titleFormat: "YYYY/MM/DD",
    },
  };

  //———————————————————————————————————————————————事件响应函数
  //myPrev（<）点击事件响应函数
  function handlePrevClick() {
    //调用<FullCalendar>组件自带的prev函数
    calendarComponentRef.current.getApi().prev();
    //设置日历数据请求的时间段（根据日历title）
    setTimeRange(
      getTimeRange(calendarComponentRef.current.getApi().view.title)
    );
  }

  //myToday（本月）或（今天）点击事件响应函数
  function handleTodayClick() {
    //调用<FullCalendar>组件自带的today函数
    calendarComponentRef.current.getApi().today();
    //设置日历数据请求的时间段（根据日历title）
    setTimeRange(
      getTimeRange(calendarComponentRef.current.getApi().view.title)
    );
  }

  //myNext（>）点击事件响应函数
  function handleNextClick() {
    //调用<FullCalendar>组件自带的next函数
    calendarComponentRef.current.getApi().next();
    //设置日历数据请求的时间段（根据日历title）
    setTimeRange(
      getTimeRange(calendarComponentRef.current.getApi().view.title)
    );
  }

  //myDayGridMonth（月）点击事件响应函数
  function handleDayGridMonthClick() {
    //设置日历Toolbar中自定义按钮myToday显示的文字为（“本月”）
    setMyTodayText("本月");
    //调用<FullCalendar>组件自带的changeView函数    切换至dayGridMonth（月——天——任务）
    calendarComponentRef.current.getApi().changeView("dayGridMonth");
    //设置日历数据请求的时间段（根据日历title）
    setTimeRange(
      getTimeRange(calendarComponentRef.current.getApi().view.title)
    );
    console.log("（月）点击后calendarState", calendarState);
  }

  //myListMonth（任务）点击事件响应函数
  function handleListMonthClick() {
    //设置日历Toolbar中自定义按钮myToday显示的文字为（“本月”）
    setMyTodayText("本月");
    //调用<FullCalendar>组件自带的changeView函数    切换至listMonth（月——任务列表）
    calendarComponentRef.current.getApi().changeView("listMonth");
    //设置日历数据请求的时间段（根据日历title）
    setTimeRange(
      getTimeRange(calendarComponentRef.current.getApi().view.title)
    );
    console.log("（任务）点击后calendarState", calendarState);
  }

  //event点击事件响应函数
  function handleEventClick(arg) {
    // console.log("event id:",arg.event.id);
    //根据日历event的id获取相应的单条任务信息
    const message = getTaskDetailById(arg.event.id, calendarState.taskList);
    //发送事件到3_4.TaskDetail.jsx中（刷新任务详细信息）
    message && emitter.emit("taskDetail", message);
    console.log("event点击后calendarState", calendarState);
  }

  //event（more）点击事件响应函数
  function handleEventLimitClick(arg) {
    // console.log("event id:",arg.event.id);
    //设置日历Toolbar中自定义按钮myToday显示的文字为（“今天”）
    setMyTodayText("今天");
    //调用<FullCalendar>组件自带的changeView函数    切换至listDay（天——任务列表）
    calendarComponentRef.current
      .getApi()
      .changeView("listDay", timeFormat(arg.date));

    console.log(
      "event（more）点击后timeFormat(arg.date)",
      timeFormat(arg.date)
    );
    console.log("event（more）点击后calendarState", calendarState);
  }

  return (
    <div className={classes.root}>
      <Spin spinning={loading} tip="Loading..." size="large">
        <FullCalendar
          ref={calendarComponentRef}
          //Locale（地区设置）
          locale={zh_cn}
          //Premium Plugins
          plugins={plugins}
          //Toolbar
          header={header}
          buttonText={buttonText}
          //Toolbar里的自定义按钮
          customButtons={customButtons}
          //Theme
          themeSystem="bootstrap" //自定义style需要这一行！
          style={taskCalendarStyle}
          //Sizing
          contentHeight={730}
          //view（视图）
          views={views}
          defaultView="dayGridMonth"
          //State
          weekends={calendarState.calendarWeekends}
          events={calendarState.calendarEvents}
          //Events
          eventClick={handleEventClick}
          eventLimitClick={handleEventLimitClick}
        />
      </Spin>
    </div>
  );
}

export default TaskCalendar;
