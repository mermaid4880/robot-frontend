//packages
import React, { useState, useEffect } from "react";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

//————————————————————————————css
const useStyles = makeStyles({
  root: {
    // width: "100%",
    top: "0",
    width: "640px",
    height: "360px"
  }
});

function VlcRtsp() {
  const classes = useStyles();

  console.log("enter VlcRtsp...");

  setTimeout(function() {
    console.log("enter VlcRtsp Play...");

    var vlc = document.getElementById("vlc");
    console.log(vlc.VersionInfo);

    //切换
    // var hd = vlc.playlist.add("rtsp://admin:zngdzx613@192.168.1.64:554/h264/ch01/main/av_stream");
    // vlc.playlist.playItem(hd);
    // vlc.playlist.play();

    //全屏
    // vlc.video.toggleFullscreen();
  }, 6000); //延时6秒

  return (
    <Paper elevation="5" className={classes.root} id="111">
      <embed
        pluginspage="http://www.videolan.org"
        type="application/x-vlc-plugin"
        version="VideoLAN.VLCPlugin.2"
        width="640"
        height="427"
        src="rtsp://admin:zngdzx613@192.168.2.13:554/h264/ch01/main/av_stream"
        mrl="rtsp://admin:zngdzx613@192.168.2.13:554/h264/ch01/main/av_stream"
        name="vlc"
        id="vlc"
        autoplay="true"
        showdisplay="true"
        toolbar="false"
      />
    </Paper>
  );
}

export default VlcRtsp;

// <object
//   classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921"
//   id="vlc"
//   codebase=""
//   width="640"
//   height="400"
//   events="True"
// >
//   <param
//     name="mrl"
//     value="rtsp://admin:zngdzx613@192.168.2.13:554/h264/ch01/main/av_stream"
//   />
//   <param
//     name="src"
//     value="rtsp://admin:zngdzx613@192.168.2.13:554/h264/ch01/main/av_stream"
//   />
//   <param name="autoloop" value="False" />
//   <param name="autoplay" value="False" />
//   <param name="time" value="True" />
//   <param name="showdisplay" value="True" />
//   <param name="controls" value="False" />
//   <param name="autostart" value="True" />
//   <embed
//     pluginspage="http://www.videolan.org"
//     type="application/x-vlc-plugin"
//     version="VideoLAN.VLCPlugin.2"
//     width="640"
//     height="400"
//     text="Waiting for video"
//     name="vlc"
//   />
// </object>
