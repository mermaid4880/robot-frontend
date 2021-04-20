// （挂轨）红外分辨率：640*480
//configuration
import { rtspAddress } from "../../../configuration/config.js";
//packages
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

//———————————————————————————————————————————————css
const useStyles = makeStyles({
  root: {
    top: "0",
    width: "432px",
    height: "324px",
    zIndex: "1000",
    position: "relative",
    display: "inline-block",
  },
});

function VlcRtsp(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useState
  //空<div>是否显示的状态（用于解决vlc插件一开始不显示的bug）
  const [display, setDisplay] = useState(true);

  //———————————————————————————————————————————————useEffect
  useEffect(() => {
    setDisplay(false); //不显示空<div>（组件加载完成后）

    return () => {
      setDisplay(true); //显示空<div>（组件销毁）
    };
  }, [props.display]);

  console.log("enter VlcRtsp...");

  return (
    <div className={classes.root}>
      {display === true && <div style={{ width: "1px", height: "1px" }}></div>}
      <object
        id="vlc"
        classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921"
        codebase="http://downloads.videolan.org/pub/videolan/vlc/latest/win32/axvlc.cab"
        width="432"
        height="324"
        events="False"
        onDoubleClick={(e) => {
          //阻止默认的处理事件
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            window.event.returnValue = false;
          }
        }}
      >
        <param name="mrl" value={rtspAddress} />
        <param name="src" value={rtspAddress} />
        <param name="allowfullscreen" value="True" />
        <param name="autoloop" value="False" />
        <param name="autoplay" value="True" />
        <param name="time" value="True" />
        <param name="showdisplay" value="True" />
        <param name="controls" value="False" />
        {/* 以下<embed>可以不要，仅用于适应高低版本浏览器 */}
        {/* <embed
            className={classes.root}
            pluginspage="http://www.videolan.org"
            type="application/x-vlc-plugin"
            version="VideoLAN.VLCPlugin.2"
            width="432"
            height="324"
            text="Waiting for video"
            name="vlc"
          /> */}
      </object>
    </div>
  );
}

export default VlcRtsp;

// 全屏
// var vlc = document.getElementById("vlc");
// vlc.video.toggleFullscreen();

// 切换
// var hd = vlc.playlist.add("rtsp://admin:zngdzx613@192.168.1.64:554/h264/ch01/main/av_stream");
// vlc.playlist.playItem(hd);
// vlc.playlist.play();
// vlc.video.marquee.refresh();
