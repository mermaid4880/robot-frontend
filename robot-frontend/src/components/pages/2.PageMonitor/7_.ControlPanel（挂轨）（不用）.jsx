// （挂轨）
//configuration
import { WebSocketUrl } from "../../../configuration/config.js";
//packages
import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import Paper from "@material-ui/core/Paper";
import { Toast } from "primereact/toast";
import { Tooltip } from "antd";
import { makeStyles } from "@material-ui/core/styles";
//images
import imgLuxiang1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/开始录像.png";
import imgLuxiang2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/停止录像.png";
import imgLuyin1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/开始录音.png";
import imgLuyin2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/停止录音.png";
import imgZhuatu1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/抓图_UP.png";
import imgZhuatu2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/抓图_DOWN.png";
import imgDuijiang1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/开始对讲.png";
import imgDuijiang2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/停止对讲.png";
import imgZhaoming1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/打开照明灯.png";
import imgZhaoming2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/关闭照明灯.png";
import imgBizhang1 from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/打开避障.png";
import imgBizhang2 from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/关闭避障.png";
import imgZidongmoshi from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/自动模式.png";
import imgShoudongmoshi from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/手动模式.png";
import imgYuntaiBianbei1Up from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/变倍加_UP.png";
import imgYuntaiBianbei1Down from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/变倍加_DOWN.png";
import imgYuntaiBianbei2Up from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/变倍减_UP.png";
import imgYuntaiBianbei2Down from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/变倍减_DOWN.png";
import imgYuntaiJiaoju1Up from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/焦距加_UP.png";
import imgYuntaiJiaoju1Down from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/焦距加_DOWN.png";
import imgYuntaiJiaoju2Up from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/焦距减_UP.png";
import imgYuntaiJiaoju2Down from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/焦距减_DOWN.png";
// import imgGuaguiBody from "../../../images/guagui/body_thin.png";//周指导body
import imgGuaguiBody from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/挂轨机器人.png";
import imgGuaguiBack from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/前进.png";
import imgGuaguiAhead from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/后退.png";
import imgGuaguiUp from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/上升.png";
import imgGuaguiDown from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/下降.png";
import imgGuaguiVlUp from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/可见光上.png";
import imgGuaguiVlDown from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/可见光下.png";
import imgGuaguiIrUp from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/红外上.png";
import imgGuaguiIrDown from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/红外下.png";
import imgGuaguiLeft from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/左转.png";
import imgGuaguiRight from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/右转.png";
import imgPd1Up from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/局放加_UP.png";
import imgPd1Down from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/局放加_DOWN.png";
import imgPd2Up from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/局放减_UP.png";
import imgPd2Down from "../../../images/pages/2.PageMonitor/7.ControlPanel/1.挂轨控制/局放减_DOWN.png";

//elements
import RobotStatus from "./7_2.RobotStatus.jsx";
//functions
import { postData, getData } from "../../../functions/requestDataFromAPI.js";

//————————————————————————————css
const useStyles = makeStyles({
  root: {
    marginLeft: "1.3rem",
    marginTop: "0.5rem",
    width: 625,
    height: 516,
  },
  root1: {
    marginLeft: "50px",
    marginTop: "25px",
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
  GuaguiControl: {
    width: "270px", //
    height: "405px",
    float: "left",
    overflow: "hidden",
    marginLeft: "20px",
  },
  top: {
    width: "270px",
    height: "40px",
    margin: "5px",
    display: "block",
  },
  GuaguiControlBack: {
    width: "70px",
    height: "30px",
    float: "left",
    margin: "5px",
    marginLeft: "55px",
    overflow: "hidden",
  },
  GuaguiControlAhead: {
    width: "70px",
    height: "30px",
    float: "left",
    margin: "5px",
    overflow: "hidden",
  },
  center: {
    width: "270px",
    height: "290px",
    margin: "5px",
    display: "block",
  },
  left: {
    width: "50px",
    height: "260px",
    float: "left",
    margin: "0px",
    marginTop: "50px",
    overflow: "hidden",
  },
  GuaguiControlBody: {
    // width: "113px",//周指导body
    width: "162px",
    height: "290px",
    float: "left",
    marginleft: "125px",
    overflow: "hidden",
  },
  right: {
    width: "50px",
    height: "260px",
    float: "left",
    margin: "0px",
    marginTop: "50px",
    overflow: "hidden",
  },
  GuaguiControlUp: {
    width: "30px",
    height: "70px",
    float: "right",
    margin: "5px",
    overflow: "hidden",
  },
  GuaguiControlDown: {
    width: "30px",
    height: "70px",
    float: "left",
    margin: "5px",
    overflow: "hidden",
  },
  GuaguiControlVlUp: {
    width: "40px",
    height: "70px",
    float: "left",
    margin: "5px",
    marginTop: "40px",
    overflow: "hidden",
  },
  GuaguiControlVlDown: {
    width: "40px",
    height: "70px",
    float: "left",
    margin: "5px",
    marginTop: "0px",
    overflow: "hidden",
  },
  GuaguiControlIrUp: {
    width: "40px",
    height: "70px",
    float: "right",
    margin: "5px",
    marginTop: "40px",
    overflow: "hidden",
  },
  GuaguiControlIrDown: {
    width: "40px",
    height: "70px",
    float: "right",
    margin: "5px",
    marginTop: "0px",
    overflow: "hidden",
  },
  bottom: {
    width: "270px",
    height: "60px",
    margin: "5px",
    display: "block",
  },
  GuaguiControlRight: {
    width: "70px",
    height: "40px",
    float: "left",
    margin: "5px",
    marginTop: "0px",
    marginLeft: "58px",
    overflow: "hidden",
  },
  GuaguiControlLeft: {
    width: "70px",
    height: "40px",
    float: "left",
    margin: "5px",
    overflow: "hidden",
  },
  pdvlControl: {
    width: "60px",
    height: "405px",
    overflow: "hidden",
  },
  pdControl: {
    width: "60px",
    height: "32px",
    marginTop: "180px",
    float: "left",
    overflow: "hidden",
  },
  vlControl: {
    width: "60px",
    height: "70px",
    float: "left",
    margin: "0px",
    marginTop: "50px",
    overflow: "hidden",
    // backgroundColor: "#c2e9fb",
  },
  status: {
    width: "270px",
    height: "405px",
    float: "right",
    overflow: "hidden",
    margin: "5px",
  },
});

function ControlPanel() {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //控件按钮的显示状态
  const [buttonStatus, setButtonStatus] = useState({
    imgLuxiang: imgLuxiang1,
    imgLuyin: imgLuyin1,
    imgZhuatu: imgZhuatu1,
    imgDuijiang: imgDuijiang1,
    imgZhaoming: imgZhaoming1,
    imgBizhang: imgBizhang1,
    imgKongzhimoshi: imgZidongmoshi,
    imgYuntaiBianbei1: imgYuntaiBianbei1Up,
    imgYuntaiBianbei2: imgYuntaiBianbei2Up,
    imgYuntaiJiaoju1: imgYuntaiJiaoju1Up,
    imgYuntaiJiaoju2: imgYuntaiJiaoju2Up,
    imgPd1: imgPd1Up,
    imgPd2: imgPd2Up,
  });

  function Control(operation) {
    postData(operation)
      .then((data) => {
        if (data.success) {
          toast.show({
            severity: "success",
            summary: "Success Message",
            detail: data.detail,
            life: 3000,
          });
        } else {
          toast.show({
            severity: "error",
            summary: "Error Message",
            detail: data.detail,
            life: 3000,
          });
        }
      })
      .catch((error) => {
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
      });
  }

  const ws = useRef(null);
  useEffect(() => {
    ws.current = new WebSocket("ws://127.0.0.1:8900");
    try {
      ws.current.onmessage = function (event) {
        toast.show({
          severity: "success",
          summary: "Success Message",
          detail: event.data,
          life: 3000,
        });
      };
      ws.current.onclose = function (event) {
        toast.show({
          severity: "error",
          summary: "Error Message",
          detail: "已经与服务器断开连接\r\n当前连接状态：" + this.readyState,
          life: 3000,
        });
      };
      ws.current.onerror = function (event) {
        toast.show({
          severity: "error",
          summary: "Error Message",
          detail: "WebSocket异常！",
          life: 3000,
        });
      };
    } catch (ex) {
      toast.show({
        severity: "error",
        summary: "Error Message",
        detail: ex.message,
        life: 3000,
      });
    }
    getData("/robots/robotconfiglist")
      .then((data) => {
        if (data.success) {
          for (let index = 0; index < data.data.robotList.length; index++) {
            if (data.data.robotList[index].robotId === data.data.curId) {
              ws.current.send("ip:" + data.data.robotList[index].robotIp);
            }
          }
        }
      })
      .catch((error) => {
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
      });

    //组件销毁时断开websocket连接
    return () => {
      try {
        ws.current.close();
      } catch (ex) {
        toast.show({
          severity: "error",
          summary: "Error Message",
          detail: ex.message,
          life: 3000,
        });
      }
    };
  }, []);

  function SendStartData() {
    try {
      var content = "ctrl:s";
      if (content) {
        ws.current.send(content);
      }
    } catch (ex) {
      toast.show({
        severity: "error",
        summary: "Error Message",
        detail: ex.message,
        life: 3000,
      });
    }
  }

  function SendStopData() {
    try {
      var content = "ctrl:f";
      if (content) {
        ws.current.send(content);
      }
    } catch (ex) {
      toast.show({
        severity: "error",
        summary: "Error Message",
        detail: ex.message,
        life: 3000,
      });
    }
  }

  return (
    <Paper className={classes.root} elevation="10" raised>
      <Toast ref={(el) => (this.toast = el)} position="top-center" />
      <Row>
        <div className={classes.root1}>
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
                      ? SendStartData()
                      : SendStopData();
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
                      ? Control("rail_control/ptz/headLampOn")
                      : Control("rail_control/ptz/headLampOff");
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
                buttonStatus.imgBizhang === imgBizhang1
                  ? "打开避障"
                  : "关闭避障"
              }
            >
              <a>
                <img
                  alt="避障"
                  src={buttonStatus.imgBizhang}
                  onClick={() => {
                    buttonStatus.imgBizhang === imgBizhang1
                      ? Control("control/back_obstacle_sensor/open")
                      : Control("control/back_obstacle_sensor/close");
                    setButtonStatus((prev) => {
                      return buttonStatus.imgBizhang === imgBizhang1
                        ? { ...prev, imgBizhang: imgBizhang2 }
                        : { ...prev, imgBizhang: imgBizhang1 };
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
        </div>
      </Row>
      <Row>
        <div className={classes.GuaguiControl}>
          <div className={classes.top}>
            <div className={classes.GuaguiControlBack}>
              <Tooltip placement="bottom" title={"后退"}>
                <a>
                  <img
                    src={imgGuaguiBack}
                    onMouseDown={() => {
                      Control("rail_control/robot/back");
                    }}
                    onMouseUp={() => {
                      Control("rail_control/robot/stop");
                    }}
                  />
                </a>
              </Tooltip>
            </div>
            <div className={classes.GuaguiControlAhead}>
              <Tooltip placement="bottom" title={"前进"}>
                <a>
                  <img
                    src={imgGuaguiAhead}
                    onMouseDown={() => {
                      Control("rail_control/robot/ahead");
                    }}
                    onMouseUp={() => {
                      Control("rail_control/robot/stop");
                    }}
                  />
                </a>
              </Tooltip>
            </div>
          </div>
          <div className={classes.center}>
            <div className={classes.left}>
              <div className={classes.GuaguiControlUp}>
                <Tooltip placement="left" title={"上升"}>
                  <a>
                    <img
                      src={imgGuaguiUp}
                      onMouseDown={() => {
                        Control("rail_control/robot/up");
                      }}
                      onMouseUp={() => {
                        Control("rail_control/lift/stop");
                      }}
                    />
                  </a>
                </Tooltip>
              </div>
              <div className={classes.GuaguiControlIrUp}>
                <Tooltip placement="left" title={"红外上"}>
                  <a>
                    <img
                      src={imgGuaguiIrUp}
                      onMouseDown={() => {
                        Control("rail_control/ptz/ir/up");
                      }}
                      onMouseUp={() => {
                        Control("rail_control/ptz/stop");
                      }}
                    />
                  </a>
                </Tooltip>
              </div>
              <div className={classes.GuaguiControlIrDown}>
                <Tooltip placement="left" title={"红外下"}>
                  <a>
                    <img
                      src={imgGuaguiIrDown}
                      onMouseDown={() => {
                        Control("rail_control/ptz/ir/down");
                      }}
                      onMouseUp={() => {
                        Control("rail_control/ptz/stop");
                      }}
                    />
                  </a>
                </Tooltip>
              </div>
            </div>
            <div className={classes.GuaguiControlBody}>
              <img src={imgGuaguiBody} />
            </div>
            <div className={classes.right}>
              <div className={classes.GuaguiControlDown}>
                <Tooltip placement="right" title={"下降"}>
                  <a>
                    <img
                      src={imgGuaguiDown}
                      onMouseDown={() => {
                        Control("rail_control/robot/down");
                      }}
                      onMouseUp={() => {
                        Control("rail_control/lift/stop");
                      }}
                    />
                  </a>
                </Tooltip>
              </div>
              <div className={classes.GuaguiControlVlUp}>
                <Tooltip placement="right" title={"可见光上"}>
                  <a>
                    <img
                      src={imgGuaguiVlUp}
                      onMouseDown={() => {
                        Control("rail_control/ptz/vl/up");
                      }}
                      onMouseUp={() => {
                        Control("rail_control/ptz/stop");
                      }}
                    />
                  </a>
                </Tooltip>
              </div>
              <div className={classes.GuaguiControlVlDown}>
                <Tooltip placement="right" title={"可见光下"}>
                  <a>
                    <img
                      src={imgGuaguiVlDown}
                      onMouseDown={() => {
                        Control("rail_control/ptz/vl/down");
                      }}
                      onMouseUp={() => {
                        Control("rail_control/ptz/stop");
                      }}
                    />
                  </a>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className={classes.bottom}>
            <div className={classes.GuaguiControlRight}>
              <Tooltip placement="bottom" title={"向右转"}>
                <a>
                  <img
                    src={imgGuaguiRight}
                    onMouseDown={() => {
                      Control("rail_control/ptz/right");
                    }}
                    onMouseUp={() => {
                      Control("rail_control/ptz/stop");
                    }}
                  />
                </a>
              </Tooltip>
            </div>
            <div className={classes.GuaguiControlleft}>
              <Tooltip placement="bottom" title={"向左转"}>
                <a>
                  <img
                    src={imgGuaguiLeft}
                    onMouseDown={() => {
                      Control("rail_control/ptz/left");
                    }}
                    onMouseUp={() => {
                      Control("rail_control/ptz/stop");
                    }}
                  />
                </a>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className={classes.pdvlControl}>
          <div className={classes.pdControl}>
            <Tooltip placement="bottom" title={"局放伸"}>
              <a>
                <img
                  src={buttonStatus.imgPd1}
                  onMouseDown={() => {
                    Control("rail_control/pd_stretch_out");
                    setButtonStatus((prev) => {
                      return {
                        ...prev,
                        imgPd1: imgPd1Down,
                      };
                    });
                  }}
                  onMouseUp={() => {
                    //Control("");
                    setButtonStatus((prev) => {
                      return { ...prev, imgPd1: imgPd1Up };
                    });
                  }}
                />
              </a>
            </Tooltip>
            <Tooltip placement="bottom" title={"局放缩"}>
              <a>
                <img
                  src={buttonStatus.imgPd2}
                  onMouseDown={() => {
                    Control("rail_control/pd_take_back");
                    setButtonStatus((prev) => {
                      return {
                        ...prev,
                        imgPd2: imgPd2Down,
                      };
                    });
                  }}
                  onMouseUp={() => {
                    //Control("");
                    setButtonStatus((prev) => {
                      return { ...prev, imgPd2: imgPd2Up };
                    });
                  }}
                />
              </a>
            </Tooltip>
          </div>
          <div className={classes.vlControl}>
            <a>
              <img
                src={buttonStatus.imgYuntaiBianbei1}
                onMouseDown={() => {
                  Control("rail_control/vl_zoomIn");
                  setButtonStatus((prev) => {
                    return {
                      ...prev,
                      imgYuntaiBianbei1: imgYuntaiBianbei1Down,
                    };
                  });
                }}
                onMouseUp={() => {
                  Control("rail_control/vl_zoomStop");
                  setButtonStatus((prev) => {
                    return { ...prev, imgYuntaiBianbei1: imgYuntaiBianbei1Up };
                  });
                }}
              />
            </a>
            <a>
              <img
                src={buttonStatus.imgYuntaiBianbei2}
                onMouseDown={() => {
                  Control("rail_control/vl_zoomOut");
                  setButtonStatus((prev) => {
                    return {
                      ...prev,
                      imgYuntaiBianbei2: imgYuntaiBianbei2Down,
                    };
                  });
                }}
                onMouseUp={() => {
                  Control("rail_control/vl_zoomStop");
                  setButtonStatus((prev) => {
                    return { ...prev, imgYuntaiBianbei2: imgYuntaiBianbei2Up };
                  });
                }}
              />
            </a>
            <a>
              <img
                src={buttonStatus.imgYuntaiJiaoju1}
                onMouseDown={() => {
                  Control("rail_control/vl_focusIn");
                  setButtonStatus((prev) => {
                    return { ...prev, imgYuntaiJiaoju1: imgYuntaiJiaoju1Down };
                  });
                }}
                onMouseUp={() => {
                  Control("rail_control/vl_focusStop");
                  setButtonStatus((prev) => {
                    return { ...prev, imgYuntaiJiaoju1: imgYuntaiJiaoju1Up };
                  });
                }}
              />
            </a>
            <a>
              <img
                src={buttonStatus.imgYuntaiJiaoju2}
                onMouseDown={() => {
                  Control("rail_control/vl_focusOut");
                  setButtonStatus((prev) => {
                    return { ...prev, imgYuntaiJiaoju2: imgYuntaiJiaoju2Down };
                  });
                }}
                onMouseUp={() => {
                  Control("rail_control/vl_focusStop");
                  setButtonStatus((prev) => {
                    return { ...prev, imgYuntaiJiaoju2: imgYuntaiJiaoju2Up };
                  });
                }}
              />
            </a>
          </div>
        </div>
        <div className={classes.status}>
          <RobotStatus />
        </div>
      </Row>
    </Paper>
  );
}

export default ControlPanel;
