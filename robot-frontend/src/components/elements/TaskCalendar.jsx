//packages
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Calendar, Badge } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
// moment.locale("zh-cn");

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#f5eee6",
    width: "100%"
  }
}));

const locale = {
  lang: {
    locale: "zh-cn",
    placeholder: "Select date",
    rangePlaceholder: ["Start date", "End date"],
    today: "Today",
    now: "Now",
    backToToday: "Back to today",
    ok: "Ok",
    clear: "Clear",
    month: " 月 ",
    year: " 年 ",
    timeSelect: "Select time",
    dateSelect: "Select date",
    monthSelect: "Choose a month",
    yearSelect: "Choose a year",
    decadeSelect: "Choose a decade",
    yearFormat: "YYYY",
    dateFormat: "M/D/YYYY",
    dayFormat: "D",
    dateTimeFormat: "M/D/YYYY HH:mm:ss",
    monthFormat: "MMMM",
    monthBeforeYear: true,
    previousMonth: "Previous month (PageUp)",
    nextMonth: "Next month (PageDown)",
    previousYear: "Last year (Control + left)",
    nextYear: "Next year (Control + right)",
    previousDecade: "Last decade",
    nextDecade: "Next decade",
    previousCentury: "Last century",
    nextCentury: "Next century"
  },
  timePickerLocale: {
    placeholder: "Select time"
  },
  dateFormat: "YYYY-MM-DD",
  dateTimeFormat: "YYYY-MM-DD HH:mm:ss",
  weekFormat: "YYYY-wo",
  monthFormat: "YYYY-MM"
};

function getListData(value) {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." }
      ];
      break;
    case 10:
      listData = [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." },
        { type: "error", content: "This is error event." }
      ];
      break;
    case 15:
      listData = [
        { type: "warning", content: "This is warning event" },
        { type: "success", content: "This is very long usual event。。...." },
        { type: "error", content: "This is error event 1." },
        { type: "error", content: "This is error event 2." },
        { type: "error", content: "This is error event 3." },
        { type: "error", content: "This is error event 4." }
      ];
      break;
    default:
  }
  return listData || [];
}

function dateCellRender(value) {
  const listData = getListData(value);
  return (
    <ul className="events">
      {listData.map(item => (
        <li key={item.content}>
          <Badge
            style={{ width: "100%" }}
            status={item.type}
            text={item.content}
          />
        </li>
      ))}
    </ul>
  );
}

function getMonthData(value) {
  if (value.month() === 0) {
    return 1394;
  }
}

function monthCellRender(value) {
  const num = getMonthData(value);
  return num ? (
    <div className="notes-month">
      <section>{num}</section>
      <span>Backlog number</span>
    </div>
  ) : null;
}

function getListData1(value) {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." }
      ];
      break;
    case 10:
      listData = [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." },
        { type: "error", content: "This is error event." }
      ];
      break;
    case 15:
      listData = [
        { type: "warning", content: "This is warning event" },
        { type: "success", content: "This is very long usual event。。...." },
        { type: "error", content: "This is error event 1." },
        { type: "error", content: "This is error event 2." },
        { type: "error", content: "This is error event 3." },
        { type: "error", content: "This is error event 4." }
      ];
      break;
    default:
  }
  return listData || [];
}

function dateCellRender1(value) {
  const listData = getListData1(value);
  return (
    <ul className="events">
      {listData.map(item => (
        <li key={item.content}>
          <Badge
            style={{ width: "100%" }}
            status={item.type}
            text={item.content}
          />
        </li>
      ))}
    </ul>
  );
}

function handleSelect(value) {
  console.log(value.year(),value.month(),value.date());
}

function handleChange(value) {
  // alert(value.month());
}


function TaskCalendar() {
  const classes = useStyles();
  //console.log(moment.calendarFormat);

  return (
    <Calendar
      className={classes.root}
      locale={locale}
      dateCellRender={dateCellRender}
      monthCellRender={monthCellRender}
      onSelect={handleSelect}
      onChange={handleChange}
    />
  );
}

export default TaskCalendar;
