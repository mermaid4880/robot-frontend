//configuration
import { HDCameraIP, IRCameraIP } from "../../../configuration/config.js";
//packages
import React, { useState, useEffect } from "react";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
//functions
import {
  hkwsInit,
  hkwsLoginAndStart,
  hkwsStopAndLogout,
  hkwsCapturePic,
  hkwsStartRecord,
  hkwsStopRecord,
  hkwsStartVoiceTalk,
  hkwsStopVoiceTalk,
} from "../../../functions/hkws";

//———————————————————————————————————————————————css
const useStyles = makeStyles({
  root: {
    // width: "100%",
    top: "0",
    width: "576px",
    height: "324px",
  },
});

function HkwsIR(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————全局函数

  //销毁iframe
  function destroyIframe() {
    console.log("destroyIframe............");
    var el;

    console.log(
      "window.parent.parent.document.getIframe...",
      window.parent.parent.document.getElementById("iframeHD")
    );

    console.log("props.cameraIP", props.cameraIP);
    if (props.cameraIP == HDCameraIP)
      el = window.parent.parent.document.getElementById("iframeHD");
    else if (props.cameraIP == IRCameraIP)
      el = window.parent.parent.document.getElementById("iframeIR");
    console.log("el", el);
    var iframe = el.contentWindow;
    console.log("iframe", iframe);
    if (el) {
      el.src = "about:blank";
      console.log("after el.src = blank");
      try {
        iframe.document.write("");
        console.log("after iframe.document.write()");
        iframe.document.clear();
        console.log("after iframe.document.clear()");
      } catch (e) {
        console.log("e", e);
        console.log("inside catch");
      }
    }
    //以上可以清除大部分的内存和文档节点记录数了
    //最后删除掉这个 iframe 就哦咧。
    window.parent.parent.document.body.removeChild(el);
    console.log("after window.parent.document.body.removeChild(el)");
  }

  //处理收到TabVideo发来的postMessage的回调函数
  function eventHandler(event) {
    //初始化HKWS、登录并开始预览
    if (event.data === 1) {
      console.log("我是iframeIR，我收到了：1");
      hkwsInit(576, 324); //初始化HKWS
      hkwsLoginAndStart(props.cameraIP, props.userName, props.password); //登录并开始预览（设备IP）
    }
    //停止预览并登出
    else if (event.data === 2) {
      console.log("我是iframeIR，我收到了：2");
      hkwsStopAndLogout(); //停止预览并登出
    }
    //拍照
    else if (event.data === 3) {
      console.log("我是iframeIR，我收到了：3");
      hkwsCapturePic(); //拍照
    }
    //开始录像
    else if (event.data === 4) {
      console.log("我是iframeIR，我收到了：4");
      hkwsStartRecord(); //开始录像
    }
    //停止录像
    else if (event.data === 5) {
      console.log("我是iframeIR，我收到了：5");
      hkwsStopRecord(); //停止录像
    }
    //开始对讲
    else if (event.data === 6) {
      console.log("我是iframeIR，我收到了：6");
      hkwsStartVoiceTalk(); //开始录像
    }
    //停止对讲
    else if (event.data === 7) {
      console.log("我是iframeIR，我收到了：7");
      hkwsStopVoiceTalk(); //停止录像
    }
    //销毁iframeIR
    else if (event.data === 0) {
      console.log("我是iframeIR，我收到了：0");
      destroyIframe(); //销毁iframeIR
    }
    //停止预览并登出、销毁iframeIR
    else if (event.data === 20) {
      console.log("我是iframeIR，我收到了：20");
      hkwsStopAndLogout(); //停止预览并登出
      destroyIframe(); //销毁iframeIR
    }
  }

  useEffect(() => {
    //初始化海康并开始播放
    hkwsInit(576, 324);
    hkwsLoginAndStart(props.cameraIP, props.userName, props.password);

    //添加监听message事件
    window.addEventListener("message", eventHandler, false);
  }, []);

  return (
    <Paper elevation="5" className={classes.root}>
      <div id="divPlugin" className="plugin"></div>
    </Paper>
  );
}

export default HkwsIR;
