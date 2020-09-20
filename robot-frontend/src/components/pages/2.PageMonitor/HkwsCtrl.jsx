//packages
import React, { useState, useRef } from "react";
import { Icon } from "semantic-ui-react";
import { Button as ButtonAli } from "antd";
import { Button as ButtonSemantic } from "semantic-ui-react";
//import Button from "@material-ui/core/Button";
import { Toast } from "primereact/toast";
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
import imgLuxiang1 from "../../../images/control/lx1.png";
import imgLuxiang2 from "../../../images/control/lx2.png";
import imgLuyin1 from "../../../images/control/ly1.png";
import imgLuyin2 from "../../../images/control/ly2.png";
import imgZhuatu1 from "../../../images/control/zp1.png";
import imgZhuatu2 from "../../../images/control/zp2.png";
import imgDuijiang1 from "../../../images/control/yydj1.png";
import imgDuijiang2 from "../../../images/control/yydj2.png";
import imgZhaoming1 from "../../../images/control/jqrkz1.png";
import imgZhaoming2 from "../../../images/control/jqrkz2.png";
import imgYushua1 from "../../../images/control/jqrkz1.png";
import imgYushua2 from "../../../images/control/jqrkz2.png";
import imgFangdieluo1 from "../../../images/control/jqrkz1.png";
import imgFangdieluo2 from "../../../images/control/jqrkz2.png";
import imgQianbizhang1 from "../../../images/control/jqrkz1.png";
import imgQianbizhang2 from "../../../images/control/jqrkz2.png";
import imgHoubizhang1 from "../../../images/control/jqrkz1.png";
import imgHoubizhang2 from "../../../images/control/jqrkz2.png";
import imgZidongmoshi from "../../../images/control/rwms1.png";
import imgShoudongmoshi from "../../../images/control/rwms2.png";
import imgRadar from "../../../images/control/leida.png";
import imgCheti from "../../../images/control/cheti_00.png";
import imgChetiAUp from "../../../images/control/cheti_a1.png";
import imgChetiADown from "../../../images/control/cheti_a2.png";
import imgChetiDUp from "../../../images/control/cheti_d1.png";
import imgChetiDDown from "../../../images/control/cheti_d2.png";
import imgChetiWUp from "../../../images/control/cheti_w1.png";
import imgChetiWDown from "../../../images/control/cheti_w2.png";
import imgChetiSUp from "../../../images/control/cheti_s1.png";
import imgChetiSDown from "../../../images/control/cheti_s2.png";
import imgYuntai from "../../../images/control/yuntai_00.png";
import imgYuntaiUpUp from "../../../images/control/yuntai_shang1.png";
import imgYuntaiUpDown from "../../../images/control/yuntai_shang2.png";
import imgYuntaiRightUp from "../../../images/control/yuntai_you1.png";
import imgYuntaiRightDown from "../../../images/control/yuntai_you2.png";
import imgYuntaiDownUp from "../../../images/control/yuntai_xia1.png";
import imgYuntaiDownDown from "../../../images/control/yuntai_xia2.png";
import imgYuntaiLeftUp from "../../../images/control/yuntai_zuo1.png";
import imgYuntaiLeftDown from "../../../images/control/yuntai_zuo2.png";
import imgYuntaiBianbei1Up from "../../../images/control/yuntai_bianbei+1.png";
import imgYuntaiBianbei1Down from "../../../images/control/yuntai_bianbei+2.png";
import imgYuntaiBianbei2Up from "../../../images/control/yuntai_bianbei-1.png";
import imgYuntaiBianbei2Down from "../../../images/control/yuntai_bianbei-2.png";
import imgYuntaiJiaoju1Up from "../../../images/control/yuntai_+1.png";
import imgYuntaiJiaoju1Down from "../../../images/control/yuntai_+2.png";
import imgYuntaiJiaoju2Up from "../../../images/control/yuntai_-1.png";
import imgYuntaiJiaoju2Down from "../../../images/control/yuntai_-2.png";

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
    marginLeft: "0px",
    marginTop: "20px",
    width: "620px",
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
  //———————————————————————————————————————————————useState
  //控件按钮的显示状态
  const [buttonStatus, setButtonStatus] = useState({
    imgChetiA: imgChetiAUp,
    imgChetiD: imgChetiDUp,
    imgChetiW: imgChetiWUp,
    imgChetiS: imgChetiSUp,
    imgYuntaiUp: imgYuntaiUpUp,
    imgYuntaiRight: imgYuntaiRightUp,
    imgYuntaiDown: imgYuntaiDownUp,
    imgYuntaiLeft: imgYuntaiLeftUp,
    imgYuntaiBianbei1: imgYuntaiBianbei1Up,
    imgYuntaiBianbei2: imgYuntaiBianbei2Up,
    imgYuntaiJiaoju1: imgYuntaiJiaoju1Up,
    imgYuntaiJiaoju2: imgYuntaiJiaoju2Up,
    imgLuxiang: imgLuxiang1,
    imgLuyin: imgLuyin1,
    imgZhuatu: imgZhuatu1,
    imgDuijiang: imgDuijiang1,
    imgZhaoming: imgZhaoming1,
    imgYushua: imgYushua1,
    imgFangdieluo: imgFangdieluo1,
    imgQianbizhang: imgQianbizhang1,
    imgHoubizhang: imgHoubizhang1,
    imgKongzhimoshi: imgZidongmoshi,
  });

  function Control(operation) {
    postData("control/" + operation).then((data) => {
      console.log("post结果", data);
      // alert(operation);
      // alert(data.detail);
      this.toast.show({
        severity: "error",
        summary: "Error Message",
        detail: data.detail,
        life: 3000,
      });
    });
  }

  return (
    <div>
      <Toast ref={(el) => (this.toast = el)} position="top-center" />
      <div className={classes.root}>
        <div>
          <Tooltip
            placement="bottom"
            title={
              buttonStatus.imgLuxiang === imgLuxiang1 ? "开始录像" : "停止录像"
            }
          >
            <a>
              <img
                alt="录像"
                src={buttonStatus.imgLuxiang}
                onClick={() => {
                  // HkwsStartRecord();
                  setButtonStatus((prev) => {
                    return buttonStatus.imgLuxiang === imgLuxiang1
                      ? { ...prev, imgLuxiang: imgLuxiang2 }
                      : { ...prev, imgLuxiang: imgLuxiang1 };
                  });
                }}
              />
            </a>
          </Tooltip>
          <Tooltip
            placement="bottom"
            title={
              buttonStatus.imgLuyin === imgLuyin1 ? "开始录音" : "停止录音"
            }
          >
            <a>
              <img
                alt="录音"
                src={buttonStatus.imgLuyin}
                onClick={() => {
                  // HkwsStartRecord();
                  setButtonStatus((prev) => {
                    return buttonStatus.imgLuyin === imgLuyin1
                      ? { ...prev, imgLuyin: imgLuyin2 }
                      : { ...prev, imgLuyin: imgLuyin1 };
                  });
                }}
              />
            </a>
          </Tooltip>
          <Tooltip placement="bottom" title="抓图">
            <a>
              <img
                alt="抓图"
                src={buttonStatus.imgZhuatu}
                onMouseDown={() => {
                  // HkwsStartRecord();
                  setButtonStatus((prev) => {
                    return { ...prev, imgZhuatu: imgZhuatu2 };
                  });
                }}
                onMouseUp={() => {
                  setButtonStatus((prev) => {
                    return { ...prev, imgZhuatu: imgZhuatu1 };
                  });
                }}
              />
            </a>
          </Tooltip>
          <Tooltip
            placement="bottom"
            title={
              buttonStatus.imgDuijiang === imgDuijiang1
                ? "开始对讲"
                : "停止对讲"
            }
          >
            <a>
              <img
                alt="对讲"
                src={buttonStatus.imgDuijiang}
                onClick={() => {
                  // HkwsStartRecord();
                  setButtonStatus((prev) => {
                    return buttonStatus.imgDuijiang === imgDuijiang1
                      ? { ...prev, imgDuijiang: imgDuijiang2 }
                      : { ...prev, imgDuijiang: imgDuijiang1 };
                  });
                }}
              />
            </a>
          </Tooltip>
          <Tooltip
            placement="bottom"
            title={
              buttonStatus.imgZhaoming === imgZhaoming1
                ? "打开照明灯"
                : "关闭照明灯"
            }
          >
            <a>
              <img
                alt="照明灯"
                src={buttonStatus.imgZhaoming}
                onClick={() => {
                  // HkwsStartRecord();
                  setButtonStatus((prev) => {
                    return buttonStatus.imgZhaoming === imgZhaoming1
                      ? { ...prev, imgZhaoming: imgZhaoming2 }
                      : { ...prev, imgZhaoming: imgZhaoming1 };
                  });
                }}
              />
            </a>
          </Tooltip>
          <Tooltip
            placement="bottom"
            title={
              buttonStatus.imgYushua === imgYushua1 ? "打开雨刷" : "关闭雨刷"
            }
          >
            <a>
              <img
                alt="雨刷"
                src={buttonStatus.imgYushua}
                onClick={() => {
                  // HkwsStartRecord();
                  setButtonStatus((prev) => {
                    return buttonStatus.imgYushua === imgYushua1
                      ? { ...prev, imgYushua: imgYushua2 }
                      : { ...prev, imgYushua: imgYushua1 };
                  });
                }}
              />
            </a>
          </Tooltip>
          <Tooltip
            placement="bottom"
            title={
              buttonStatus.imgFangdieluo === imgFangdieluo1
                ? "打开防跌落"
                : "关闭防跌落"
            }
          >
            <a>
              <img
                src={buttonStatus.imgFangdieluo}
                onClick={() => {
                  // HkwsStartRecord();
                  setButtonStatus((prev) => {
                    return buttonStatus.imgFangdieluo === imgFangdieluo1
                      ? { ...prev, ["imgFangdieluo"]: imgFangdieluo2 }
                      : { ...prev, ["imgFangdieluo"]: imgFangdieluo1 };
                  });
                }}
              />
            </a>
          </Tooltip>
          <Tooltip
            placement="bottom"
            title={
              buttonStatus.imgQianbizhang === imgQianbizhang1
                ? "打开前避障"
                : "关闭前避障"
            }
          >
            <a>
              <img
                src={buttonStatus.imgQianbizhang}
                onClick={() => {
                  // HkwsStartRecord();
                  setButtonStatus((prev) => {
                    return buttonStatus.imgQianbizhang === imgQianbizhang1
                      ? { ...prev, ["imgQianbizhang"]: imgQianbizhang2 }
                      : { ...prev, ["imgQianbizhang"]: imgQianbizhang1 };
                  });
                }}
              />
            </a>
          </Tooltip>
          <Tooltip
            placement="bottom"
            title={
              buttonStatus.imgHoubizhang === imgHoubizhang1
                ? "打开后避障"
                : "关闭后避障"
            }
          >
            <a>
              <img
                alt="后避障"
                src={buttonStatus.imgHoubizhang}
                onClick={() => {
                  // HkwsStartRecord();
                  setButtonStatus((prev) => {
                    return buttonStatus.imgHoubizhang === imgHoubizhang1
                      ? { ...prev, "imgHoubizhang": imgHoubizhang2 }
                      : { ...prev, "imgHoubizhang": imgHoubizhang1 };
                  });
                }}
              />
            </a>
          </Tooltip>
          <Tooltip
            placement="bottom"
            title={
              buttonStatus.imgKongzhimoshi === imgZidongmoshi
                ? "切换为手动模式"
                : "切换为自动模式"
            }
          >
            <a>
              <img
                alt="机器人控制模式"
                src={buttonStatus.imgKongzhimoshi}
                onClick={() => {
                  // HkwsStartRecord();
                  setButtonStatus((prev) => {
                    return buttonStatus.imgKongzhimoshi === imgZidongmoshi
                      ? { ...prev, "imgKongzhimoshi": imgShoudongmoshi }
                      : { ...prev, "imgKongzhimoshi": imgZidongmoshi };
                  });
                }}
              />
            </a>
          </Tooltip>

          {/* <Tooltip placement="bottom" title="停止录像">
            <ButtonSemantic
              content="停止录像"
              primary
              size="large"
              onClick={HkwsStopRecord}
            >
              停止录像
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
              开始对讲
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
              停止对讲
              <FontAwesomeIcon icon={faMicrophoneSlash} />
            </ButtonSemantic>
          </Tooltip>
          <Tooltip placement="bottom" title="打开照明灯">
            <ButtonSemantic
              content="打开照明灯"
              primary
              size="large"
              onClick={() => alert("打开照明灯")}
            >
              打开照明灯
            </ButtonSemantic>
          </Tooltip>
          <Tooltip placement="bottom" title="关闭照明灯">
            <ButtonSemantic
              content="关闭照明灯"
              primary
              size="large"
              onClick={() => alert("关闭照明灯")}
            >
              关闭照明灯
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
          </Tooltip> */}
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
            src={buttonStatus.imgChetiA}
            className={classes.chetiA}
            onMouseDown={() => {
              Control("robot-motion?operation=left&speed=200");
              setButtonStatus((prev) => {
                return { ...prev, ["imgChetiA"]: imgChetiADown };
              });
            }}
            onMouseUp={() => {
              Control("robot-motion?operation=stop&speed=200");
              setButtonStatus((prev) => {
                return { ...prev, ["imgChetiA"]: imgChetiAUp };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgChetiD}
            className={classes.chetiD}
            onMouseDown={() => {
              Control("robot-motion?operation=right&speed=200");
              setButtonStatus((prev) => {
                return { ...prev, ["imgChetiD"]: imgChetiDDown };
              });
            }}
            onMouseUp={() => {
              Control("robot-motion?operation=stop&speed=200");
              setButtonStatus((prev) => {
                return { ...prev, ["imgChetiD"]: imgChetiDUp };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgChetiW}
            className={classes.chetiW}
            onMouseDown={() => {
              Control("robot-motion?operation=ahead&speed=200");
              setButtonStatus((prev) => {
                return { ...prev, ["imgChetiW"]: imgChetiWDown };
              });
            }}
            onMouseUp={() => {
              Control("robot-motion?operation=stop&speed=200");
              setButtonStatus((prev) => {
                return { ...prev, ["imgChetiW"]: imgChetiWUp };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgChetiS}
            className={classes.chetiS}
            onMouseDown={() => {
              Control("robot-motion?operation=back&speed=200");
              setButtonStatus((prev) => {
                return { ...prev, ["imgChetiS"]: imgChetiSDown };
              });
            }}
            onMouseUp={() => {
              Control("robot-motion?operation=stop&speed=200");
              setButtonStatus((prev) => {
                return { ...prev, ["imgChetiS"]: imgChetiSUp };
              });
            }}
          />
        </a>
      </div>
      <div className={classes.yuntai}>
        <img src={imgYuntai} />
        <a>
          <img
            src={buttonStatus.imgYuntaiUp}
            className={classes.yuntaiUp}
            onMouseDown={() => {
              Control("ptz/up");
              setButtonStatus((prev) => {
                return { ...prev, ["imgYuntaiUp"]: imgYuntaiUpDown };
              });
            }}
            onMouseUp={() => {
              Control("ptz/stop");
              setButtonStatus((prev) => {
                return { ...prev, ["imgYuntaiUp"]: imgYuntaiUpUp };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgYuntaiRight}
            className={classes.yuntaiRight}
            onMouseDown={() => {
              Control("ptz/right");
              setButtonStatus((prev) => {
                return { ...prev, ["imgYuntaiRight"]: imgYuntaiRightDown };
              });
            }}
            onMouseUp={() => {
              Control("ptz/stop");
              setButtonStatus((prev) => {
                return { ...prev, ["imgYuntaiRight"]: imgYuntaiRightUp };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgYuntaiDown}
            className={classes.yuntaiDown}
            onMouseDown={() => {
              Control("ptz/down");
              setButtonStatus((prev) => {
                return { ...prev, ["imgYuntaiDown"]: imgYuntaiDownDown };
              });
            }}
            onMouseUp={() => {
              Control("ptz/stop");
              setButtonStatus((prev) => {
                return { ...prev, ["imgYuntaiDown"]: imgYuntaiDownUp };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgYuntaiLeft}
            className={classes.yuntaiLeft}
            onMouseDown={() => {
              Control("ptz/left");
              setButtonStatus((prev) => {
                return { ...prev, ["imgYuntaiLeft"]: imgYuntaiLeftDown };
              });
            }}
            onMouseUp={() => {
              Control("ptz/stop");
              setButtonStatus((prev) => {
                return { ...prev, ["imgYuntaiLeft"]: imgYuntaiLeftUp };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgYuntaiBianbei1}
            className={classes.yuntaiBianbei1}
            onMouseDown={() => {
              Control("vl/zoom/in");
              setButtonStatus((prev) => {
                return {
                  ...prev,
                  ["imgYuntaiBianbei1"]: imgYuntaiBianbei1Down,
                };
              });
            }}
            onMouseUp={() => {
              Control("vl/zoom/stop");
              setButtonStatus((prev) => {
                return { ...prev, ["imgYuntaiBianbei1"]: imgYuntaiBianbei1Up };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgYuntaiBianbei2}
            className={classes.yuntaiBianbei2}
            onMouseDown={() => {
              Control("vl/zoom/out");
              setButtonStatus((prev) => {
                return {
                  ...prev,
                  ["imgYuntaiBianbei2"]: imgYuntaiBianbei2Down,
                };
              });
            }}
            onMouseUp={() => {
              Control("vl/zoom/stop");
              setButtonStatus((prev) => {
                return { ...prev, ["imgYuntaiBianbei2"]: imgYuntaiBianbei2Up };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgYuntaiJiaoju1}
            className={classes.yuntaiJiaoju1}
            onMouseDown={() => {
              Control("vl/focus/in");
              setButtonStatus((prev) => {
                return { ...prev, ["imgYuntaiJiaoju1"]: imgYuntaiJiaoju1Down };
              });
            }}
            onMouseUp={() => {
              Control("vl/focus/stop");
              setButtonStatus((prev) => {
                return { ...prev, ["imgYuntaiJiaoju1"]: imgYuntaiJiaoju1Up };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgYuntaiJiaoju2}
            className={classes.yuntaiJiaoju2}
            onMouseDown={() => {
              Control("vl/focus/out");
              setButtonStatus((prev) => {
                return { ...prev, ["imgYuntaiJiaoju2"]: imgYuntaiJiaoju2Down };
              });
            }}
            onMouseUp={() => {
              Control("vl/focus/stop");
              setButtonStatus((prev) => {
                return { ...prev, ["imgYuntaiJiaoju2"]: imgYuntaiJiaoju2Up };
              });
            }}
          />
        </a>
      </div>
    </div>
  );
}

export default HkwsCtrl;
