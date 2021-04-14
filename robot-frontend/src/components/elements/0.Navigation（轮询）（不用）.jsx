//packages
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Paper } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import {
  AccessTime, //时间
  NotificationsActive, //告警信息
  BatteryUnknown, //电量未知
  BatteryAlert, //电量报警
  Battery20, //电量%
  Battery30,
  Battery50,
  Battery60,
  Battery80,
  Battery90,
  BatteryFull,
  BatteryCharging20, //电量%（正在充电）
  BatteryCharging30,
  BatteryCharging50,
  BatteryCharging60,
  BatteryCharging80,
  BatteryCharging90,
  BatteryChargingFull,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";
import { Tooltip } from "antd";
import cookie from "react-cookies";
//functions
import emitter from "../../functions/events.js";
import { getData } from "../../functions/requestDataFromAPI.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles({
  root: {
    fontSize: "1.2rem",
    background: "linear-gradient(45deg, #71c9ce 30%, #cbf1f5 90%)",
    boxShadow: "0 3px 5px 2px rgba(113, 203,206, .3)", //71c9ce
  },
  brand: {
    fontSize: "1.5rem",
    paddingRight: "3rem",
  },
  item: {
    paddingRight: "1rem",
  },
});

//———————————————————————————————————————————————Data
// "Charging": 0,                                    是否正在充电【0-否、1-是】
// "BatteryAlert": 0,                                电量报警【0-否、1-是】
// "power": 50,                                      电量百分比【0~100】
// "BatteryUnknown": 1,                              电量未知【0-否、1-是】

//获取电池信息数据（电池信息）
function getBatteryInfo(data) {
  var newData = {
    //电池信息
    Charging: 0, //是否正在充电【0-否、1-是】
    BatteryAlert: 0, //电量报警【0-否、1-是】
    power: 50, //电量百分比【0~100】
    BatteryUnknown: 1, //电量未知【0-否、1-是】
  };

  //电池信息
  newData.Charging = data.Charging;
  newData.BatteryAlert = data.BatteryAlert;
  newData.power = data.power;
  newData.BatteryUnknown = data.BatteryUnknown;

  // console.log("newData", newData);
  return newData;
}

function Navigation(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //本组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //当前系统时间
  const [time, setTime] = useState(new Date().toLocaleString());

  //<Badge>中设备告警信息的条数
  const [alertCount, setAlertCount] = useState(0);

  //机器人电量信息
  const [batteryInfo, setBatteryInfo] = useState({
    Charging: 0, //是否正在充电【0-否、1-是】
    BatteryAlert: 0, //电量报警【0-否、1-是】
    power: 50, //电量百分比【0~100】
    BatteryUnknown: 1, //电量未知【0-否、1-是】
  });

  //页面跳转路径
  const [jumpPath, setJumpPath] = useState("/");

  //页面跳转定时器开关状态
  const [startTimer, setStartTimer] = useState(false);

  //页面跳转状态
  const [jump, setJump] = useState(false);

  //———————————————————————————————————————————————Timer
  //开启定时器（重新获取电池信息、刷新组件）
  var timerID = setTimeout(() => {
    setUpdate(!update);
  }, 5000);

  //———————————————————————————————————————————————useEffect
  //当（本组件销毁时），销毁定时器（重新获取电池信息、刷新组件）
  useEffect(() => {
    //当组件销毁时，销毁定时器（重新获取电池信息、刷新组件）
    return () => {
      clearTimeout(timerID);
    };
  }, []);

  //当（本组件加载完成或需要更新时），GET请求获取电池信息
  useEffect(() => {
    //————————————————————————————GET请求
    getData("robots/batteryAndAlarm")
      .then((data) => {
        // console.log("get结果", data);
        if (data.success) {
          var result = data.data;
          // console.log("result", result);
          //获取电池信息
          const batteryInfo = getBatteryInfo(result.batteryInfo);
          //设置电池信息
          setBatteryInfo(batteryInfo);
          //获取<Badge>中设备告警信息的条数
          const alertCount = result.robotDeviceAlarm.count;
          //设置<Badge>中设备告警信息的条数
          setAlertCount(alertCount);
        } else {
          alert(data.detail);
        }
      })
      .catch((error) => {
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
      });
  }, [update]);

  //当本组件加载完成后，开启定时器（刷新系统时间time）
  useEffect(() => {
    //————————————————————————————开启定时器（每秒刷新系统时间time）
    let intervalID = setInterval(function updateTime() {
      const newTime = new Date().toLocaleString();
      setTime(newTime);
    }, 1000);

    //当本组件销毁时，销毁定时器（刷新系统时间time）
    return () => {
      //————————————————————————————销毁定时器（每秒刷新系统时间time）
      clearInterval(intervalID);
    };
  }, []);

  //——————————————页面跳转
  useEffect(() => {
    if (startTimer === true) {
      //开启定时器（页面跳转）
      setTimeout(() => {
        console.log("页面跳转定时器：开启！");
        setJump(true); //在组件下个生命周期进行页面跳转
      }, 200);
    }
  }, [startTimer]);

  useEffect(() => {
    if (jump === true) {
      //进行页面跳转
      console.log("页面即将跳转！");
      history.push(jumpPath);
    }
  }, [jump]);

  //———————————————————————————————————————————————全局函数
  //设置电池图标（根据电池信息）
  function setBatteryIcon(batteryInfo) {
    var tooltipTitle = "电量" + batteryInfo.power + "%";

    if (batteryInfo.BatteryAlert == 1) {
      return (
        <Tooltip placement="bottom" title="电量报警">
          <BatteryAlert fontSize="large" />
        </Tooltip>
      );
    } else if (batteryInfo.BatteryUnknown == 1) {
      return (
        <Tooltip placement="bottom" title="电量未知">
          <BatteryUnknown fontSize="large" />
        </Tooltip>
      );
    } else if (batteryInfo.power >= 0 && batteryInfo.power <= 20) {
      return batteryInfo.Charging ? (
        <Tooltip placement="bottom" title={tooltipTitle}>
          <BatteryCharging20 fontSize="large" />
        </Tooltip>
      ) : (
        <Tooltip placement="bottom" title={tooltipTitle}>
          <Battery20 fontSize="large" />
        </Tooltip>
      );
    } else if (batteryInfo.power > 20 && batteryInfo.power <= 30) {
      return batteryInfo.Charging ? (
        <Tooltip placement="bottom" title={tooltipTitle}>
          <BatteryCharging30 fontSize="large" />
        </Tooltip>
      ) : (
        <Tooltip placement="bottom" title={tooltipTitle}>
          <Battery30 fontSize="large" />
        </Tooltip>
      );
    } else if (batteryInfo.power > 30 && batteryInfo.power <= 50) {
      return batteryInfo.Charging ? (
        <Tooltip placement="bottom" title={tooltipTitle}>
          <BatteryCharging50 fontSize="large" />
        </Tooltip>
      ) : (
        <Tooltip placement="bottom" title={tooltipTitle}>
          <Battery50 fontSize="large" />
        </Tooltip>
      );
    } else if (batteryInfo.power > 50 && batteryInfo.power <= 60) {
      return batteryInfo.Charging ? (
        <Tooltip placement="bottom" title={tooltipTitle}>
          <BatteryCharging60 fontSize="large" />
        </Tooltip>
      ) : (
        <Tooltip placement="bottom" title={tooltipTitle}>
          <Battery60 fontSize="large" />
        </Tooltip>
      );
    } else if (batteryInfo.power > 60 && batteryInfo.power <= 80) {
      return batteryInfo.Charging ? (
        <Tooltip placement="bottom" title={tooltipTitle}>
          <BatteryCharging80 fontSize="large" />
        </Tooltip>
      ) : (
        <Tooltip placement="bottom" title={tooltipTitle}>
          <Battery80 fontSize="large" />
        </Tooltip>
      );
    } else if (batteryInfo.power > 80 && batteryInfo.power < 100) {
      return batteryInfo.Charging ? (
        <Tooltip placement="bottom" title={tooltipTitle}>
          <BatteryCharging90 fontSize="large" />
        </Tooltip>
      ) : (
        <Tooltip placement="bottom" title={tooltipTitle}>
          <Battery90 fontSize="large" />
        </Tooltip>
      );
    } else if (batteryInfo.power == 100) {
      return batteryInfo.Charging ? (
        <Tooltip placement="bottom" title={tooltipTitle} color="primary">
          <BatteryChargingFull fontSize="large" />
        </Tooltip>
      ) : (
        <Tooltip placement="bottom" title={tooltipTitle} color="primary">
          <BatteryFull fontSize="large" />
        </Tooltip>
      );
    }
  }

  //———————————————————————————————————————————————事件响应函数
  //调用父组件<Page...#0>的函数（设置<Dimmer>为激活状态、如果父组件是<PageMonitor>销毁其子组件<TabVideo>的iframe）并在组件下个生命周期开启定时器（页面跳转）
  function handleNavLinkClick(path) {
    //如果非当前页面路径
    if ("#" + path !== window.location.hash) {
      //调用父组件<Page...#0>的函数（设置<Dimmer>为激活状态）
      props.activeDimmer();
      //如果当前父组件是<PageMonitor>，调用其函数（销毁其子组件<TabVideo>的iframe、设置<Dimmer>为激活状态）
      if (window.location.hash === "#/Monitor") {
        props.closeTabVideoIframe();
      }
      //在组件下个生命周期开启定时器（页面跳转）
      setStartTimer(true);
      //设置页面跳转路径
      setJumpPath(path);
    }
  }

  //删除cookie并跳转至登录页
  function handleExitClick() {
    //删除cookie
    cookie.remove("userId", { path: "/" });
    cookie.remove("token", { path: "/" });
    //跳转至登录页
    history.push("/");
  }

  return (
    <Paper elevation="10">
      <Navbar light expand="lg" className={classes.root}>
        <NavbarBrand className={classes.brand}>智能巡检机器人系统</NavbarBrand>
        <Nav className="mr-auto" navbar>
          <NavItem className={classes.item}>
            <NavLink onClick={() => handleNavLinkClick("/Monitor")}>
              实时监控
            </NavLink>
          </NavItem>
          <NavItem className={classes.item}>
            <NavLink onClick={() => handleNavLinkClick("/TaskMgr")}>
              任务管理
            </NavLink>
          </NavItem>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle className={classes.item} nav caret>
              巡检记录
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={() => handleNavLinkClick("/AllRecords")}>
                全部巡检记录
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem
                onClick={() => handleNavLinkClick("/OneMeterRecords")}
              >
                点位巡检记录
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <NavItem className={classes.item}>
            <NavLink onClick={() => handleNavLinkClick("/AlertMgr")}>
              异常告警
            </NavLink>
          </NavItem>
          <NavItem className={classes.item}>
            <NavLink onClick={() => handleNavLinkClick("/SysConfig")}>
              系统配置
            </NavLink>
          </NavItem>
        </Nav>
        <NavbarText>
          <Tooltip placement="bottom" title="系统当前时间">
            <NavLink>
              <AccessTime fontSize="large" />
              &nbsp;{time}
            </NavLink>
          </Tooltip>
        </NavbarText>
        <NavbarText>
          <NavLink>&nbsp;{setBatteryIcon(batteryInfo)}&nbsp;</NavLink>
        </NavbarText>
        <NavbarText>
          <Tooltip placement="bottom" title="查看未确认的设备告警信息">
            <Link to={{ pathname: "/AlertMgr", query: { filter: "undealed" } }}>
              <Badge
                style={{ marginRight: "10px" }}
                badgeContent={alertCount}
                color="secondary"
                onClick={() => {
                  //发送事件到5.PageAlertMgr/2_.AlertTableAndDetail.jsx中（重新GET未处理告警信息列表并刷新组件）
                  emitter.emit("updateAlertTable");
                }}
              >
                <NotificationsActive fontSize="large" />
              </Badge>
            </Link>
          </Tooltip>
        </NavbarText>
        <NavbarText>
          <Link to="/">
            <NavLink
              onClick={() => {
                handleExitClick();
              }}
            >
              退出
            </NavLink>
          </Link>
        </NavbarText>
      </Navbar>
    </Paper>
  );
}

export default Navigation;
