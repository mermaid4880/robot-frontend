import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tabs, Select, Space } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faVideo } from "@fortawesome/free-solid-svg-icons";
import tabStyle from "./6_.TabVideo.css"; //自定义theme

//———————————————————————————————————————————————css
const useStyles = makeStyles({
  root: {
    top: "0",
    width: "640px",
    height: "360px",
  },
});

const { TabPane } = Tabs;

function TabControl(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————事件响应函数
  //调用父组件<PageMonitor>的函数（调用其子组件<TabVideo>的iframe开始录像）并在组件下个生命周期开启定时器（页面跳转）
  function handleClick1(path) {
    //调用父组件<PageMonitor>的函数（销毁其子组件<TabVideo>的iframe）
    props.startTabVideoIframeRecord();
  }

  function handleClick2(path) {
    //调用父组件<PageMonitor>的函数（销毁其子组件<TabVideo>的iframe）
    props.stopTabVideoIframeRecord();
  }

  return (
    <Tabs
      tabPosition="right"
      size="large"
      className={classes.root}
      style={tabStyle}
    >
      <TabPane
        tab={<FontAwesomeIcon icon={faHome} className={classes.icon} />}
        key="1"
      >
        <button
          onClick={() => {
            handleClick1();
          }}
        >
          HD开始录像
        </button>
        <button
          onClick={() => {
            handleClick2();
          }}
        >
          HD停止录像
        </button>
      </TabPane>
      <TabPane tab="Tab 2" key="2"></TabPane>
      <TabPane tab="Tab 3" key="3">
        <button>IR开始录像</button>
        <button>IR停止录像</button>
      </TabPane>
    </Tabs>
  );
}

export default TabControl;
