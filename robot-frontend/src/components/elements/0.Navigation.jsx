//packages
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Paper } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
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
import { connect } from "mqtt";
import cookie from "react-cookies";
//functions
import emitter from "../../functions/events.js";

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

function Navigation() {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //<Badge>中设备告警信息的条数
  const [alertCount, setAlertCount] = useState(0);

  //———————————————————————————————————————————————useEffect
  //当组件加载完成后
  useEffect(() => {
    //————————————————————————————mqtt
    //创建mqtt连接
    const client = connect("ws://127.0.0.1:8083/mqtt");
    //订阅主题（设备告警条数）
    client.on("connect", function () {
      client.subscribe("testtopic", function (err) {
        if (!err) {
          // console.log("订阅成功！");
        }
      });
    });
    //处理mqtt消息
    client.on("message", function (topic, message) {
      // console.log(typeof message);
      // console.log(message);
      // console.log(message.toString());
      message && parseAlertCount(message.toString());
    });

    //当组件销毁时取消主题订阅并关闭mqtt连接
    return () => {
      // console.log("导航栏client.end");
      client.unsubscribe("testtopic");
      client.end();
    };
  }, []);

  //———————————————————————————————————————————————全局函数
  //根据收到的一条string格式的mqtt消息获取设备告警信息的条数
  function parseAlertCount(stringData) {
    if (typeof stringData !== "string") {
      return;
    }

    try {
      let objectData = JSON.parse(stringData);
      setAlertCount(parseInt(objectData.count));
    } catch (e) {
      console.log("parseMessageToDiv error：" + stringData + "!!!" + e);
      return;
    }
  }

  //———————————————————————————————————————————————事件响应函数
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
            <Link to="/Monitor">
              <NavLink>实时监控</NavLink>
            </Link>
          </NavItem>
          <NavItem className={classes.item}>
            <Link to="/TaskMgr">
              <NavLink>任务管理</NavLink>
            </Link>
          </NavItem>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle className={classes.item} nav caret>
              巡检记录
            </DropdownToggle>
            <DropdownMenu right>
              <Link to="/AllRecords">
                <DropdownItem>全部巡检记录</DropdownItem>
              </Link>
              <DropdownItem divider />
              <Link to="/OneMeterRecords">
                <DropdownItem>点位巡检记录</DropdownItem>
              </Link>
            </DropdownMenu>
          </UncontrolledDropdown>
          <NavItem className={classes.item}>
            <Link to="/AlertMgr">
              <NavLink>异常告警</NavLink>
            </Link>
          </NavItem>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle className={classes.item} nav caret>
              系统配置
            </DropdownToggle>
            <DropdownMenu right>
              <Link to="">
                <DropdownItem>机器人管理</DropdownItem>
              </Link>
              <DropdownItem divider />
              <Link to="/UserMgr">
                <DropdownItem>用户管理</DropdownItem>
              </Link>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
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
                <NotificationsIcon fontSize="large" />
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
