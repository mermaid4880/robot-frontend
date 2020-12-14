//packages
import React, { useState, useRef } from "react";
import { Container, Row, Col } from "reactstrap";
import { Toast } from "primereact/toast";
import { Tooltip } from "antd";
import { makeStyles } from "@material-ui/core/styles";
//images
import imgLuxiang1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/开始录像.png";
import imgLuxiang2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/停止录像.png";
import imgLuyin1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/开始录音.png";
import imgLuyin2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/停止录音.png";
import imgZhuatu1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/抓图_UP.png";
import imgZhuatu2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/抓图_DOWN.png";
import imgDuijiang1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/开始对讲.png";
import imgDuijiang2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/停止对讲.png";
import imgZhaoming1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/打开照明灯.png";
import imgZhaoming2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/关闭照明灯.png";
import imgYushua1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/打开雨刷.png";
import imgYushua2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/关闭雨刷.png";
import imgFangdieluo1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/打开防跌落.png";
import imgFangdieluo2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/关闭防跌落.png";
import imgQianbizhang1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/打开前避障.png";
import imgQianbizhang2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/关闭前避障.png";
import imgHoubizhang1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/打开后避障.png";
import imgHoubizhang2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/关闭后避障.png";
import imgZidongmoshi from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/自动模式.png";
import imgShoudongmoshi from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/手动模式.png";
import imgChongdianmenOpen from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/打开充电门.png";
import imgChongdianmenClose from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/关闭充电门.png";
import imgChongdianmenStop1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/充电门停止_UP.png";
import imgChongdianmenStop2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/充电门停止_DOWN.png";
import imgCheti from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/车体.png";
import imgChetiAUp from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/车体A_UP.png";
import imgChetiADown from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/车体A_DOWN.png";
import imgChetiDUp from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/车体D_UP.png";
import imgChetiDDown from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/车体D_DOWN.png";
import imgChetiWUp from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/车体W_UP.png";
import imgChetiWDown from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/车体W_DOWN.png";
import imgChetiSUp from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/车体S_UP.png";
import imgChetiSDown from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/车体S_DOWN.png";
import imgYuntai from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/云台.png";
import imgYuntaiUpUp from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/云台上_UP.png";
import imgYuntaiUpDown from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/云台上_DOWN.png";
import imgYuntaiRightUp from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/云台右_UP.png";
import imgYuntaiRightDown from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/云台右_DOWN.png";
import imgYuntaiDownUp from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/云台下_UP.png";
import imgYuntaiDownDown from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/云台下_DOWN.png";
import imgYuntaiLeftUp from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/云台左_UP.png";
import imgYuntaiLeftDown from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/云台左_DOWN.png";
import imgYuntaiBianbei1Up from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/变倍加_UP.png";
import imgYuntaiBianbei1Down from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/变倍加_DOWN.png";
import imgYuntaiBianbei2Up from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/变倍减_UP.png";
import imgYuntaiBianbei2Down from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/变倍减_DOWN.png";
import imgYuntaiJiaoju1Up from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/焦距加_UP.png";
import imgYuntaiJiaoju1Down from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/焦距加_DOWN.png";
import imgYuntaiJiaoju2Up from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/焦距减_UP.png";
import imgYuntaiJiaoju2Down from "../../../images/pages/2.PageMonitor/7.ControlPanel/2.轮式控制/焦距减_DOWN.png";

//elements
import Radar from "./7_1_1.Radar.jsx";
import RobotStatus from "./7_1_2.RobotStatus.jsx";

//functions
import { postData } from "../../../functions/requestDataFromAPI.js";

//————————————————————————————css
const useStyles = makeStyles({
  root: {
    marginLeft: "50px",
    marginTop: "20px",
    width: "620px",
    height: "80px",
    overflow: "hidden",
  },
  button: {
    width: "90px",
    height: "50px",
    overflow: "hidden",
    float: "left",
  },
  radar: {
    width: "281px",
    height: "200px",
    float: "left",
    overflow: "hidden",
    marginLeft: "0px",
  },
  status: {
    width: "300px",
    height: "200px",
    float: "right",
    overflow: "hidden",
    marginRight: "60px",
  },
  cheti: {
    width: "150px",
    height: "140px",
    float: "left",
    align: "center",
    marginTop: "20px",
    marginLeft: "120px",
    borderLeftWidth: "1px",
    // borderLeftColor:#ccc,
    borderRightWidth: "1px",
    // borderRightColor:#ccc,
    overflow: "hidden",
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
    height: "150px",
    float: "left",
    align: "center",
    marginLeft: "110px",
    marginTop: "23px",
    overflow: "hidden",
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

function RobotControl() {
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
    imgChongdianmen: imgChongdianmenOpen,
    imgChongdianmenStop: imgChongdianmenStop1,
  });

  function Control(operation) {
    postData(operation).then((data) => {
      if (data.success) {
        this.toast.show({
          severity: "success",
          summary: "Success Message",
          detail: data.detail,
          life: 3000,
        });
      } else {
        this.toast.show({
          severity: "error",
          summary: "Error Message",
          detail: data.detail,
          life: 3000,
        });
      }
    });
  }

  return (
    <div>
      <Toast ref={(el) => (this.toast = el)} position="top-center" />
      <div className={classes.root}>
        <div>
          <div className={classes.button}>
            <Tooltip
              placement="bottom"
              title={
                buttonStatus.imgLuxiang === imgLuxiang1
                  ? "开始录像"
                  : "停止录像"
              }
            >
              <a>
                <img
                  alt="录像"
                  src={buttonStatus.imgLuxiang}
                  onClick={() => {
                    buttonStatus.imgLuxiang === imgLuxiang1
                      ? Control("control/vl/record_video/start")
                      : Control("control/vl/record_video/stop");
                    setButtonStatus((prev) => {
                      return buttonStatus.imgLuxiang === imgLuxiang1
                        ? { ...prev, imgLuxiang: imgLuxiang2 }
                        : { ...prev, imgLuxiang: imgLuxiang1 };
                    });
                  }}
                />
              </a>
            </Tooltip>
          </div>
          <div className={classes.button}>
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
                    buttonStatus.imgLuyin === imgLuyin1
                      ? Control("control/vl/record_voice/start")
                      : Control("control/vl/record_voice/stop");
                    setButtonStatus((prev) => {
                      return buttonStatus.imgLuyin === imgLuyin1
                        ? { ...prev, imgLuyin: imgLuyin2 }
                        : { ...prev, imgLuyin: imgLuyin1 };
                    });
                  }}
                />
              </a>
            </Tooltip>
          </div>
          <div className={classes.button}>
            <Tooltip placement="bottom" title="抓图">
              <a>
                <img
                  alt="抓图"
                  src={buttonStatus.imgZhuatu}
                  onMouseDown={() => {
                    setButtonStatus((prev) => {
                      return { ...prev, imgZhuatu: imgZhuatu2 };
                    });
                    Control("control/vl/capture_picture");
                  }}
                  onMouseUp={() => {
                    setButtonStatus((prev) => {
                      return { ...prev, imgZhuatu: imgZhuatu1 };
                    });
                  }}
                />
              </a>
            </Tooltip>
          </div>
          <div className={classes.button}>
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
                    buttonStatus.imgDuijiang === imgDuijiang1
                      ? Control("control/vl/voice_talk/start")
                      : Control("control/vl/voice_talk/stop");
                    setButtonStatus((prev) => {
                      return buttonStatus.imgDuijiang === imgDuijiang1
                        ? { ...prev, imgDuijiang: imgDuijiang2 }
                        : { ...prev, imgDuijiang: imgDuijiang1 };
                    });
                  }}
                />
              </a>
            </Tooltip>
          </div>
          <div className={classes.button}>
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
                    buttonStatus.imgZhaoming === imgZhaoming1
                      ? Control("control/ptz/headlampOn")
                      : Control("control/ptz/headlampOff");
                    setButtonStatus((prev) => {
                      return buttonStatus.imgZhaoming === imgZhaoming1
                        ? { ...prev, imgZhaoming: imgZhaoming2 }
                        : { ...prev, imgZhaoming: imgZhaoming1 };
                    });
                  }}
                />
              </a>
            </Tooltip>
          </div>
          <div className={classes.button}>
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
                    buttonStatus.imgYushua === imgYushua1
                      ? Control("control/ptz/wiperOn")
                      : Control("control/ptz/wiperOff");
                    setButtonStatus((prev) => {
                      return buttonStatus.imgYushua === imgYushua1
                        ? { ...prev, imgYushua: imgYushua2 }
                        : { ...prev, imgYushua: imgYushua1 };
                    });
                  }}
                />
              </a>
            </Tooltip>
          </div>
          <div className={classes.button}>
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
                  alt="防跌落"
                  src={buttonStatus.imgFangdieluo}
                  onClick={() => {
                    buttonStatus.imgFangdieluo === imgFangdieluo1
                      ? Control("control/drop_sensor/open")
                      : Control("control/drop_sensor/close");
                    setButtonStatus((prev) => {
                      return buttonStatus.imgFangdieluo === imgFangdieluo1
                        ? { ...prev, imgFangdieluo: imgFangdieluo2 }
                        : { ...prev, imgFangdieluo: imgFangdieluo1 };
                    });
                  }}
                />
              </a>
            </Tooltip>
          </div>
          <div className={classes.button}>
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
                  alt="前避障"
                  src={buttonStatus.imgQianbizhang}
                  onClick={() => {
                    buttonStatus.imgQianbizhang === imgQianbizhang1
                      ? Control("control/front_obstacle_sensor/open")
                      : Control("control/front_obstacle_sensor/close");
                    setButtonStatus((prev) => {
                      return buttonStatus.imgQianbizhang === imgQianbizhang1
                        ? { ...prev, imgQianbizhang: imgQianbizhang2 }
                        : { ...prev, imgQianbizhang: imgQianbizhang1 };
                    });
                  }}
                />
              </a>
            </Tooltip>
          </div>
          <div className={classes.button}>
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
                    buttonStatus.imgHoubizhang === imgHoubizhang1
                      ? Control("control/back_obstacle_sensor/open")
                      : Control("control/back_obstacle_sensor/close");
                    setButtonStatus((prev) => {
                      return buttonStatus.imgHoubizhang === imgHoubizhang1
                        ? { ...prev, imgHoubizhang: imgHoubizhang2 }
                        : { ...prev, imgHoubizhang: imgHoubizhang1 };
                    });
                  }}
                />
              </a>
            </Tooltip>
          </div>
          <div className={classes.button}>
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
                    buttonStatus.imgKongzhimoshi === imgZidongmoshi
                      ? Control("robotMode/backEndControl")
                      : Control("robotMode/task");
                    setButtonStatus((prev) => {
                      return buttonStatus.imgKongzhimoshi === imgZidongmoshi
                        ? { ...prev, imgKongzhimoshi: imgShoudongmoshi }
                        : { ...prev, imgKongzhimoshi: imgZidongmoshi };
                    });
                  }}
                />
              </a>
            </Tooltip>
          </div>
          <div className={classes.button}>
            <Tooltip
              placement="bottom"
              title={
                buttonStatus.imgChongdianmen === imgChongdianmenOpen
                  ? "打开充电门"
                  : "关闭充电门"
              }
            >
              <a>
                <img
                  alt="充电门"
                  src={buttonStatus.imgChongdianmen}
                  onClick={() => {
                    buttonStatus.imgChongdianmen === imgChongdianmenOpen
                      ? Control("control/door/control?command=open")
                      : Control("control/door/control?command=close");
                    setButtonStatus((prev) => {
                      return buttonStatus.imgChongdianmen ===
                        imgChongdianmenOpen
                        ? { ...prev, imgChongdianmen: imgChongdianmenClose }
                        : { ...prev, imgChongdianmen: imgChongdianmenOpen };
                    });
                  }}
                />
              </a>
            </Tooltip>
          </div>
          <div className={classes.button}>
            <Tooltip placement="bottom" title={"充电门停止"}>
              <a>
                <img
                  alt="充电门停止"
                  src={buttonStatus.imgChongdianmenStop}
                  onMouseDown={() => {
                    setButtonStatus((prev) => {
                      return {
                        ...prev,
                        imgChongdianmenStop: imgChongdianmenStop2,
                      };
                    });
                    Control("control/door/control?command=stop");
                  }}
                  onMouseUp={() => {
                    setButtonStatus((prev) => {
                      return {
                        ...prev,
                        imgChongdianmenStop: imgChongdianmenStop1,
                      };
                    });
                  }}
                />
              </a>
            </Tooltip>
          </div>
        </div>
      </div>
      <Row>
        <div className={classes.radar}>
          <Radar />
        </div>
        <div className={classes.status}>
          <RobotStatus />
        </div>
      </Row>
      <div className={classes.cheti}>
        <img src={imgCheti} />
        <a>
          <img
            src={buttonStatus.imgChetiA}
            className={classes.chetiA}
            onMouseDown={() => {
              Control("control/robot-motion?operation=left&speed=200");
              setButtonStatus((prev) => {
                return { ...prev, imgChetiA: imgChetiADown };
              });
            }}
            onMouseUp={() => {
              Control("control/robot-motion?operation=stop&speed=200");
              setButtonStatus((prev) => {
                return { ...prev, imgChetiA: imgChetiAUp };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgChetiD}
            className={classes.chetiD}
            onMouseDown={() => {
              Control("control/robot-motion?operation=right&speed=200");
              setButtonStatus((prev) => {
                return { ...prev, imgChetiD: imgChetiDDown };
              });
            }}
            onMouseUp={() => {
              Control("control/robot-motion?operation=stop&speed=200");
              setButtonStatus((prev) => {
                return { ...prev, imgChetiD: imgChetiDUp };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgChetiW}
            className={classes.chetiW}
            onMouseDown={() => {
              Control("control/robot-motion?operation=ahead&speed=200");
              setButtonStatus((prev) => {
                return { ...prev, imgChetiW: imgChetiWDown };
              });
            }}
            onMouseUp={() => {
              Control("control/robot-motion?operation=stop&speed=200");
              setButtonStatus((prev) => {
                return { ...prev, imgChetiW: imgChetiWUp };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgChetiS}
            className={classes.chetiS}
            onMouseDown={() => {
              Control("control/robot-motion?operation=back&speed=200");
              setButtonStatus((prev) => {
                return { ...prev, imgChetiS: imgChetiSDown };
              });
            }}
            onMouseUp={() => {
              Control("control/robot-motion?operation=stop&speed=200");
              setButtonStatus((prev) => {
                return { ...prev, imgChetiS: imgChetiSUp };
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
              Control("control/ptz/up");
              setButtonStatus((prev) => {
                return { ...prev, imgYuntaiUp: imgYuntaiUpDown };
              });
            }}
            onMouseUp={() => {
              Control("control/ptz/stop");
              setButtonStatus((prev) => {
                return { ...prev, imgYuntaiUp: imgYuntaiUpUp };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgYuntaiRight}
            className={classes.yuntaiRight}
            onMouseDown={() => {
              Control("control/ptz/right");
              setButtonStatus((prev) => {
                return { ...prev, imgYuntaiRight: imgYuntaiRightDown };
              });
            }}
            onMouseUp={() => {
              Control("control/ptz/stop");
              setButtonStatus((prev) => {
                return { ...prev, imgYuntaiRight: imgYuntaiRightUp };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgYuntaiDown}
            className={classes.yuntaiDown}
            onMouseDown={() => {
              Control("control/ptz/down");
              setButtonStatus((prev) => {
                return { ...prev, imgYuntaiDown: imgYuntaiDownDown };
              });
            }}
            onMouseUp={() => {
              Control("control/ptz/stop");
              setButtonStatus((prev) => {
                return { ...prev, imgYuntaiDown: imgYuntaiDownUp };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgYuntaiLeft}
            className={classes.yuntaiLeft}
            onMouseDown={() => {
              Control("control/ptz/left");
              setButtonStatus((prev) => {
                return { ...prev, imgYuntaiLeft: imgYuntaiLeftDown };
              });
            }}
            onMouseUp={() => {
              Control("control/ptz/stop");
              setButtonStatus((prev) => {
                return { ...prev, imgYuntaiLeft: imgYuntaiLeftUp };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgYuntaiBianbei1}
            className={classes.yuntaiBianbei1}
            onMouseDown={() => {
              Control("control/vl/zoom/in");
              setButtonStatus((prev) => {
                return {
                  ...prev,
                  imgYuntaiBianbei1: imgYuntaiBianbei1Down,
                };
              });
            }}
            onMouseUp={() => {
              Control("control/vl/zoom/stop");
              setButtonStatus((prev) => {
                return { ...prev, imgYuntaiBianbei1: imgYuntaiBianbei1Up };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgYuntaiBianbei2}
            className={classes.yuntaiBianbei2}
            onMouseDown={() => {
              Control("control/vl/zoom/out");
              setButtonStatus((prev) => {
                return {
                  ...prev,
                  imgYuntaiBianbei2: imgYuntaiBianbei2Down,
                };
              });
            }}
            onMouseUp={() => {
              Control("control/vl/zoom/stop");
              setButtonStatus((prev) => {
                return { ...prev, imgYuntaiBianbei2: imgYuntaiBianbei2Up };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgYuntaiJiaoju1}
            className={classes.yuntaiJiaoju1}
            onMouseDown={() => {
              Control("control/vl/focus/in");
              setButtonStatus((prev) => {
                return { ...prev, imgYuntaiJiaoju1: imgYuntaiJiaoju1Down };
              });
            }}
            onMouseUp={() => {
              Control("control/vl/focus/stop");
              setButtonStatus((prev) => {
                return { ...prev, imgYuntaiJiaoju1: imgYuntaiJiaoju1Up };
              });
            }}
          />
        </a>
        <a>
          <img
            src={buttonStatus.imgYuntaiJiaoju2}
            className={classes.yuntaiJiaoju2}
            onMouseDown={() => {
              Control("control/vl/focus/out");
              setButtonStatus((prev) => {
                return { ...prev, imgYuntaiJiaoju2: imgYuntaiJiaoju2Down };
              });
            }}
            onMouseUp={() => {
              Control("control/vl/focus/stop");
              setButtonStatus((prev) => {
                return { ...prev, imgYuntaiJiaoju2: imgYuntaiJiaoju2Up };
              });
            }}
          />
        </a>
      </div>
    </div>
  );
}

export default RobotControl;
