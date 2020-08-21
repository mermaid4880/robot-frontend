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

//———————————————————————————————————————————————FullCalendar（https://fullcalendar.io/）
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
  left: "myPrevButton,myTodayButton,myNextButton", //自定义
  center: "title",
  right: "dayGridMonth,listMonth",
};
//Toolbar的buttonText设置
const buttonText = {
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
  listMonth: {
    titleFormat: "YYYY/MM/DD",
  },
};

//———————————————————————————————————————————————全局函数
//转换时间格式"2016-05-12 08:00:00"——>"Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)"
function timeDeformat(convertedTime) {
  convertedTime = convertedTime.replace(new RegExp(/-/gm), "/"); //将所有的'-'转为'/'即可（为了兼容IE）
  let time = convertedTime === "" ? null : new Date(convertedTime);
  // console.log("time", time);
  return time;
}

//将日历title"2020/07/01 – 2020/07/31"——>{startTime: "2020-07-01 00:00:00", endTime: "2020-07-31 23:59:59"}
function getTimeRange(title) {
  const timeRange = {
    startTime: dateTransform(title.substring(0, 10), "00:00:00"),
    endTime: dateTransform(title.substring(13, 23), "23:59:59"),
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
      newEvent.end = null;
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

  //———————————————————————————————————————————————事件响应函数
  //myPrevButton（<）点击事件响应函数
  function handlePrevClick() {
    //调用<FullCalendar>组件自带的prev函数
    calendarComponentRef.current.getApi().prev();
    //设置日历数据请求的时间段（根据日历title）
    setTimeRange(
      getTimeRange(calendarComponentRef.current.getApi().view.title)
    );
  }

  //myTodayButton（本月）点击事件响应函数
  function handleTodayClick() {
    //调用<FullCalendar>组件自带的today函数
    calendarComponentRef.current.getApi().today();
    //设置日历数据请求的时间段（根据日历title）
    setTimeRange(
      getTimeRange(calendarComponentRef.current.getApi().view.title)
    );
  }

  //myNextButton（>）点击事件响应函数
  function handleNextClick() {
    //调用<FullCalendar>组件自带的next函数
    calendarComponentRef.current.getApi().next();
    //设置日历数据请求的时间段（根据日历title）
    setTimeRange(
      getTimeRange(calendarComponentRef.current.getApi().view.title)
    );
  }

  //event点击事件响应函数
  function handleEventClick(arg) {
    // console.log("event id:",arg.event.id);
    //根据日历event的id获取相应的单条任务信息
    const message = getTaskDetailById(arg.event.id, calendarState.taskList);
    //发送事件到3_4.TaskDetail.jsx中（刷新任务详细信息）
    message && emitter.emit("taskDetail", message);
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
          //Toolbar里的自定义按钮
          customButtons={{
            myPrevButton: {
              text: "<",
              click: handlePrevClick,
            },
            myTodayButton: {
              text: "本月",
              click: handleTodayClick,
            },
            myNextButton: {
              text: ">",
              click: handleNextClick,
            },
          }}
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
