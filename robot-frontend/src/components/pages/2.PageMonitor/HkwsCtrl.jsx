//packages
import React from "react";
import { Icon } from "semantic-ui-react";
import { Button as ButtonAli } from "antd";
import { Button as ButtonSemantic } from "semantic-ui-react";
import Button from "@material-ui/core/Button";
import { Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faVideo,
  faMicrophone,
  faMicrophoneSlash,
  faStop,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
//images
import imgRadar from "../../../images/control/leida.png";
import imgCheti from "../../../images/control/cheti_00.png";
import imgChetiA from "../../../images/control/cheti_a1.png";
import imgChetiD from "../../../images/control/cheti_d1.png";
import imgChetiW from "../../../images/control/cheti_w1.png";
import imgChetiS from "../../../images/control/cheti_s1.png";
import imgYuntai from "../../../images/control/yuntai_00.png";
import imgYuntaiUp from "../../../images/control/yuntai_shang1.png";
import imgYuntaiRight from "../../../images/control/yuntai_you1.png";
import imgYuntaiDown from "../../../images/control/yuntai_xia1.png";
import imgYuntaiLeft from "../../../images/control/yuntai_zuo1.png";
import imgYuntaiBianbei1 from "../../../images/control/yuntai_bianbei+1.png";
import imgYuntaiBianbei2 from "../../../images/control/yuntai_bianbei-1.png";
import imgYuntaiJiaoju1 from "../../../images/control/yuntai_1.png";
import imgYuntaiJiaoju2 from "../../../images/control/yuntai_-1.png";

import { makeStyles } from "@material-ui/core/styles";
import {
  HkwsStart,
  HkwsStop,
  HkwsCapturePic,
  HkwsStartRecord,
  HkwsStopRecord,
  HkwsStartVoiceTalk,
  HkwsStopVoiceTalk,
} from "../../../functions/hkws";

//functions
import { postData } from "../../../functions/requestDataFromAPI.js";

//————————————————————————————css
const useStyles = makeStyles({
  root: {
    // width: "100%",
    marginLeft: "30px",
    marginTop: "20px",
    width: "600px",
    height: "80px",
    overflow: "hidden",
  },
  radar: {
    width: "150px",
    float: "left",
    marginLeft: "30px",
    // borderLeftWidth: "1px",
    // align: "center",
    // position: "relative",
  },
  cheti: {
    width: "150px",
    float: "left",
    align: "center",
    borderLeftWidth: "1px",
    // borderLeftColor:#ccc,
    borderRightWidth: "1px",
    // borderRightColor:#ccc,
  },
  chetiA: {
    position: "relative",
    top: "-92px",
    left: "6px",
  },
  chetiD: {
    position: "relative",
    top: "-92px",
    left: "60px",
  },
  chetiW: {
    position: "relative",
    top: "-140px",
    left: "-27px",
  },
  chetiS: {
    position: "relative",
    top: "-79px",
    left: "53px",
  },
  yuntai: {
    width: "170px",
    float: "left",
    align: "center",
    marginLeft: "3px",
  },
  yuntaiUp: {
    position: "relative",
    top: "-141px",
    left: "62px",
  },
  yuntaiRight: {
    position: "relative",
    top: "-92px",
    left: "88px",
  },
  yuntaiDown: {
    position: "relative",
    top: "-40px",
    left: "12px",
  },
  yuntaiLeft: {
    position: "relative",
    top: "-92px",
    left: "-64px",
  },
  yuntaiBianbei1: {
    position: "relative",
    top: "-107px",
    left: "-51px",
  },
  yuntaiBianbei2: {
    position: "relative",
    top: "-107px",
    left: "-50px",
  },
  yuntaiJiaoju1: {
    position: "relative",
    top: "-112px",
    left: "49px",
  },
  yuntaiJiaoju2: {
    position: "relative",
    top: "-112px",
    left: "50px",
  },
});

function HkwsCtrl() {
  const classes = useStyles();

  function Control(operation) {
    postData("control/" + operation).then((data) => {
      console.log("post结果", data);
      // alert(operation);
      alert(data.detail);
    });
  }

  return (
    <div>
      <div className={classes.root}>
        {/* <ButtonAli type="primary" size="large" onClick={HkwsStart}>
        开始播放
      </ButtonAli> */}
        {/* <Button variant="contained">
        开始播放
      </Button> */}
        <div>
          <Tooltip placement="bottom" title="开始播放">
            <ButtonSemantic
              content="开始播放"
              primary
              size="large"
              onClick={HkwsStart}
            >
              <FontAwesomeIcon icon={faPlay} />
            </ButtonSemantic>
          </Tooltip>
          <Tooltip placement="bottom" title="停止播放">
            <ButtonSemantic
              content="停止播放"
              primary
              size="large"
              onClick={HkwsStop}
            >
              <FontAwesomeIcon icon={faStop} />
            </ButtonSemantic>
          </Tooltip>
          <Tooltip placement="bottom" title="开始录像">
            <ButtonSemantic
              content="开始录像"
              primary
              size="large"
              onClick={HkwsStartRecord}
            >
              <FontAwesomeIcon icon={faVideo} />
            </ButtonSemantic>
          </Tooltip>
          <Tooltip placement="bottom" title="停止录像">
            <ButtonSemantic
              content="停止录像"
              primary
              size="large"
              onClick={HkwsStopRecord}
            >
              <FontAwesomeIcon icon={faStop} />
            </ButtonSemantic>
          </Tooltip>
          <Tooltip placement="bottom" title="开始对讲">
            <ButtonSemantic
              content="开始对讲"
              primary
              size="large"
              onClick={HkwsStartVoiceTalk}
            >
              <FontAwesomeIcon icon={faMicrophone} />
            </ButtonSemantic>
          </Tooltip>
          <Tooltip placement="bottom" title="停止对讲">
            <ButtonSemantic
              content="停止对讲"
              primary
              size="large"
              onClick={HkwsStopVoiceTalk}
            >
              <FontAwesomeIcon icon={faMicrophoneSlash} />
            </ButtonSemantic>
          </Tooltip>
          <Tooltip placement="bottom" title="抓图">
            <ButtonSemantic
              content="抓图"
              primary
              size="large"
              onClick={HkwsCapturePic}
            >
              <FontAwesomeIcon icon={faCamera} />
            </ButtonSemantic>
          </Tooltip>
          {/* </div> */}

          {/* <div> */}



        </div>
        {/* <ButtonSemantic compact icon onClick={HkwsStart} size="massive">
        <Icon name="play" />
      </ButtonSemantic>
      <ButtonSemantic compact icon onClick={HkwsStop} size="massive">
        <Icon name="stop" />
      </ButtonSemantic>
      <ButtonSemantic compact icon onClick={HkwsStartRecord} size="massive">
        <Icon name="video" />
      </ButtonSemantic>
      <ButtonSemantic compact icon onClick={HkwsStopRecord} size="massive">
        <Icon name="stop" />
      </ButtonSemantic>
      <ButtonSemantic compact icon onClick={HkwsCapturePic} size="massive">
        <Icon name="camera" />
      </ButtonSemantic>
      <ButtonSemantic compact icon onClick={HkwsStartVoiceTalk} size="massive">
        <Icon name="microphone" />
      </ButtonSemantic>
      <ButtonSemantic compact icon onClick={HkwsStopVoiceTalk} size="massive">
        <Icon name="microphone slash" />
      </ButtonSemantic> */}
      </div>
      <div className={classes.radar}>
        <a>
          <img src={imgRadar} onClick={() => alert("radar")} />
        </a>
      </div>
      <div className={classes.cheti}>
        <img src={imgCheti} />
        <a>
          <img
            src={imgChetiA}
            className={classes.chetiA}
            onMouseDown={() => Control("robot-motion?operation=left&speed=200")}
            onMouseUp={() => Control("robot-motion?operation=stop&speed=200")}
          />
        </a>
        <a>
          <img
            src={imgChetiD}
            className={classes.chetiD}
            onMouseDown={() =>
              Control("robot-motion?operation=right&speed=200")
            }
            onMouseUp={() => Control("robot-motion?operation=stop&speed=200")}
          />
        </a>
        <a>
          <img
            src={imgChetiW}
            className={classes.chetiW}
            onMouseDown={() =>
              Control("robot-motion?operation=ahead&speed=200")
            }
            onMouseUp={() => Control("robot-motion?operation=stop&speed=200")}
          />
        </a>
        <a>
          <img
            src={imgChetiS}
            className={classes.chetiS}
            onMouseDown={() => Control("robot-motion?operation=back&speed=200")}
            onMouseUp={() => Control("robot-motion?operation=stop&speed=200")}
          />
        </a>
      </div>
      <div className={classes.yuntai}>
        <img src={imgYuntai} />
        <a>
          <img
            src={imgYuntaiUp}
            className={classes.yuntaiUp}
            onMouseDown={() => Control("ptz/up")}
            onMouseUp={() => Control("ptz/stop")}
          />
        </a>
        <a>
          <img
            src={imgYuntaiRight}
            className={classes.yuntaiRight}
            onMouseDown={() => Control("ptz/right")}
            onMouseUp={() => Control("ptz/stop")}
          />
        </a>
        <a>
          <img
            src={imgYuntaiDown}
            className={classes.yuntaiDown}
            onMouseDown={() => Control("ptz/down")}
            onMouseUp={() => Control("ptz/stop")}
          />
        </a>
        <a>
          <img
            src={imgYuntaiLeft}
            className={classes.yuntaiLeft}
            onMouseDown={() => Control("ptz/left")}
            onMouseUp={() => Control("ptz/stop")}
          />
        </a>
        <a>
          <img
            src={imgYuntaiBianbei1}
            className={classes.yuntaiBianbei1}
            onMouseDown={() => Control("vl/zoom/in")}
            onMouseUp={() => Control("vl/zoom/stop")}
          />
        </a>
        <a>
          <img
            src={imgYuntaiBianbei2}
            className={classes.yuntaiBianbei2}
            onMouseDown={() => Control("vl/zoom/out")}
            onMouseUp={() => Control("vl/zoom/stop")}
          />
        </a>
        <a>
          <img
            src={imgYuntaiJiaoju1}
            className={classes.yuntaiJiaoju1}
            onMouseDown={() => Control("vl/focus/in")}
            onMouseUp={() => Control("vl/focus/stop")}
          />
        </a>
        <a>
          <img
            src={imgYuntaiJiaoju2}
            className={classes.yuntaiJiaoju2}
            onMouseDown={() => Control("vl/focus/out")}
            onMouseUp={() => Control("vl/focus/stop")}
          />
        </a>
      </div>
    </div>
  );
}

export default HkwsCtrl;
