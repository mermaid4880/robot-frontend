//packages
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

//———————————————————————————————————————————————css
const useStyles = makeStyles({
  root: {
    // width: "100%",
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
    setDisplay(false); //空<div>不显示（组件加载完成后）

    return () => {
      setDisplay(true); //空<div>显示（组件销毁）
    };
  }, [props.display]);

  console.log("enter VlcRtsp...");

  return (
    <div className={classes.root} id="111">
      {display === true && <div style={{ width: "1px", height: "1px" }}></div>}
      <object
        classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921"
        id="vlc"
        codebase=""
        width="432"
        height="324"
        id="vlc"
        events="True"
      >
        <param
          name="mrl"
          // value="rtsp://admin:zngdzx613@192.168.1.40:554/h264/ch01/main/av_stream"
          value="rtsp://888888:888888@192.168.1.29:8554/stream1"          
        />
        <param
          name="src"
          // value="rtsp://admin:zngdzx613@192.168.1.64:554/h264/ch01/main/av_stream"
          value="rtsp://888888:888888@192.168.1.29:8554/stream1"  
        />
        <param name="autoloop" value="False" />
        <param name="autoplay" value="True" />
        <param name="time" value="True" />
        <param name="showdisplay" value="True" />
        <param name="controls" value="False" />
        <embed
          className={classes.root}
          pluginspage="http://www.videolan.org"
          type="application/x-vlc-plugin"
          version="VideoLAN.VLCPlugin.2"
          width="432"
          height="324"
          text="Waiting for video"
          name="vlc"
        />
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
