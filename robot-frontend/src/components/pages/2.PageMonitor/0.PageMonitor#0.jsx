//packages
import React, { useRef, useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { Loader, Dimmer } from "semantic-ui-react";
//elements
import Navigation from "../../elements/0.Navigation.jsx";
import Breadcrumb2 from "./1.Breadcrumb2.jsx";
import TaskStatus from "./2.TaskStatus.jsx";
import IndoorEnvironmentInfo from "./3.IndoorEnvironmentInfo.jsx";
// import OutdoorEnvironmentInfo from "./3.OutdoorEnvironmentInfo.jsx";
import Map from "./4_.Map.jsx";
import TabInfo from "./5.TabInfo.jsx";
import TabVideo from "./6_.TabVideo.jsx";
import ControlPanel from "./7_.ControlPanel.jsx";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#eeeeee",
    height: "962px",
  },
  dimmer: {
    width: "100%",
    padding: "0px",
    margin: "0px",
    height: "892px",
  },
  navBarRow: {
    top: "0",
    height: "70px",
    padding: "0px",
  },
  col: {
    padding: "0px",
  },
}));

function PageMonitor() {
  const classes = useStyles();

  //———————————————————————————————————————————————useRef
  const tabVideoRef = useRef(null); //<TabVideo>组件的ref

  //———————————————————————————————————————————————useState
  //<Dimmer>是否激活的状态
  const [dimmerActive, setDimmerActive] = useState(false);

  //———————————————————————————————————————————————useEffect
  //当组件加载完成后
  useEffect(() => {
    //设置<Dimmer>为取消激活状态
    setDimmerActive(false);
    //当组件销毁时设置<Dimmer>为取消激活状态
    return () => {
      setDimmerActive(false);
    };
  }, []);

  return (
    <Container className={classes.root} fluid={true}>
      <Row className={classes.navBarRow}>
        <Col className={classes.col} sm="12" md={{ size: 12, offset: 0 }}>
          <Navigation
            activeDimmer={() => setDimmerActive(true)} //设置<Dimmer>为激活状态
            closeTabVideoIframe={() => tabVideoRef.current.destroyIframe()} //销毁兄弟组件<TabVideo>的iframe（调用<TabVideo>组件的函数）
          />
        </Col>
      </Row>
      <Row>
        <Breadcrumb2 />
      </Row>
      <Row className={classes.main}>
        <Col className={classes.col} sm="12" md={{ size: 8, offset: 0 }}>
          <Row>
            <TaskStatus />
          </Row>
          <Row>
            <Col className={classes.col} sm={{ size: "auto", offset: 0 }}>
              <IndoorEnvironmentInfo />
              {/* <OutdoorEnvironmentInfo /> */}
            </Col>
            <Col className={classes.col} sm={{ size: "9", offset: 0 }}>
              <Map />
            </Col>
          </Row>
          <Row>
            <TabInfo />
          </Row>
        </Col>
        <Col className={classes.col} sm="12" md={{ size: 4, offset: 0 }}>
          <Row>
            <TabVideo ref={tabVideoRef} />
          </Row>
          <Row>
            {/* <TabControl
              startTabVideoIframeRecord={() => {
                tabVideoRef.current.startRecord(); //调用<TabVideo>组件的函数
              }}
              stopTabVideoIframeRecord={() => {
                tabVideoRef.current.stopRecord(); //调用<TabVideo>组件的函数
              }}
            /> */}
            <ControlPanel />
          </Row>
        </Col>
      </Row>
      <Dimmer active={dimmerActive} page>
        <Loader indeterminate size="large">
          页面跳转中...
        </Loader>
      </Dimmer>
    </Container>
  );
}

export default PageMonitor;
