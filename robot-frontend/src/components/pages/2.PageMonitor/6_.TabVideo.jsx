//packages
import React, { useState, useImperativeHandle, forwardRef } from "react"; //需要引入useImperativeHandle,forwardRef，用于使其父组件获取本组件节点
import { makeStyles } from "@material-ui/core/styles";
import { Tabs } from "antd";
import tabStyle from "./6_.TabVideo.css"; //自定义theme
//elements
import VlcRtsp from "./6_1.VlcRtsp.jsx";

//———————————————————————————————————————————————css
const useStyles = makeStyles({
  root: {
    marginLeft: "1.3rem",
    // width: "630px",//3个tab
    width: "613px",
    height: "325px",
  },
  vlcVideo: {
    top: "0",
    padding: "0px 72px 0px 72px",
    height: "324px",
  },
});

//———————————————————————————————————————————————antd???
const { TabPane } = Tabs;

//——————————————————————使其父组件<PageMonitor>获取本组件<TabVideo>节点（实现ref的透传）
//React.forwardRef：该方法返回一个组件，参数为函数（props callback，并不是函数组件）
//函数的第一个参数为父组件传递的props，第二个参数为父组件传递的ref，其目的就是希望可以在封装组件时，外层组件可以通过ref直接控制内层组件或元素的行为。
const TabVideo = forwardRef((props, ref) => {
  const classes = useStyles();

  //———————————————————————————————————————————————useState
  //<Tabs>中当前被激活的TabPane
  const [activeTabIndex, setActiveTabIndex] = useState("1");

  //———————————————————————————————————————————————useImperativeHandle
  //将子组件的实例属性输出到父组件
  useImperativeHandle(ref, () => ({
    //销毁本组件中的所有的iframe
    destroyIframe: () => {
      console.log("当前激活Tab Index", activeTabIndex);
      if (activeTabIndex === "1") {
        postMessageToIframe("iframeHD", 20);
      } else if (activeTabIndex === "2") {
        postMessageToIframe("iframeHD", 0);
      }
      // if (activeTabIndex === "1") {
      //   postMessageToIframe("iframeHD", 20);
      //   postMessageToIframe("iframeIR", 0);
      // } else if (activeTabIndex === "2") {
      //   postMessageToIframe("iframeHD", 0);
      //   postMessageToIframe("iframeIR", 0);
      // } else if (activeTabIndex === "3") {
      //   postMessageToIframe("iframeIR", 20);
      //   postMessageToIframe("iframeHD", 0);
      // }
    },
    //开始录像
    startRecord: () => {
      console.log("当前激活Tab Index", activeTabIndex);
      if (activeTabIndex === "1") {
        postMessageToIframe("iframeHD", 4);
      }
      // if (activeTabIndex === "1") {
      //   postMessageToIframe("iframeHD", 4);
      // } else if (activeTabIndex === "3") {
      //   postMessageToIframe("iframeIR", 4);
      // }
    },
    //停止录像
    stopRecord: () => {
      console.log("当前激活Tab Index", activeTabIndex);
      if (activeTabIndex === "1") {
        postMessageToIframe("iframeHD", 5);
      }
      // if (activeTabIndex === "1") {
      //   postMessageToIframe("iframeHD", 5);
      // } else if (activeTabIndex === "3") {
      //   postMessageToIframe("iframeIR", 5);
      // }
    },
  }));

  //———————————————————————————————————————————————其他函数
  //发送消息给iframe
  function postMessageToIframe(iframeID, messageCode) {
    const iframe = document.getElementById(iframeID);
    console.log("iframe", iframe);
    if (iframe && iframe.contentWindow)
      iframe.contentWindow.postMessage(messageCode, "*");
  }

  //———————————————————————————————————————————————事件响应函数
  function handleTabsChange(key) {
    console.log(key);
    setActiveTabIndex(key);
    if (key === "1") {
      postMessageToIframe("iframeHD", 1);
    } else if (key === "2") {
      postMessageToIframe("iframeHD", 2);
    }
    // if (key === "1") {
    //   postMessageToIframe("iframeIR", 2);
    //   postMessageToIframe("iframeHD", 1);
    // } else if (key === "2") {
    //   postMessageToIframe("iframeHD", 2);
    //   postMessageToIframe("iframeIR", 2);
    // } else if (key === "3") {
    //   postMessageToIframe("iframeHD", 2);
    //   postMessageToIframe("iframeIR", 1);
    // }
  }

  return (
    <Tabs
      tabPosition="right"
      size="large"
      className={classes.root}
      style={tabStyle}
      onChange={handleTabsChange}
    >
      <TabPane key="1" tab="&nbsp;&nbsp;&nbsp;HD">
        <iframe
          id="iframeHD"
          title="高清视频"
          style={{
            border: 0,
            margin: 0,
            padding: 0,
            width: "576px",
            height: "324px",
          }}
          src="./videoHD.html"
        />
      </TabPane>
      <TabPane className={classes.vlcVideo} key="2" tab="&nbsp;&nbsp;&nbsp;IR">
        <VlcRtsp display={true} />
      </TabPane>
      {/* <TabPane tab="&nbsp;&nbsp;&nbsp;IR" key="2">
        <iframe
          id="iframeIR"
          title="红外视频"
          style={{
            border: 0,
            width: "576px",
            height: "324px",
          }}
          src="./videoIR.html"
        />
      </TabPane> */}
    </Tabs>
  );
});

export default TabVideo;
