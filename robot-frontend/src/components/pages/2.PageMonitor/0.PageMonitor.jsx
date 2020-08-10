//packages
import React, { useRef } from "react";
import { Container, Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
//elements
import Navigation from "./1.Navigation.jsx";
import Breadcrumb2 from "./2.Breadcrumb2.jsx";
import TaskStatus from "./3.TaskStatus.jsx";
import Map from "./4.Map.jsx";
import TabInfo from "./5.TabInfo.jsx";
import TabVideo from "./6_.TabVideo.jsx";
import TabControl from "./7.TabControl.jsx";
import HkwsCtrl from "./HkwsCtrl.jsx";



//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#eeeeee",
    height: "962px",
  },
  navBarRow: {
    top: "0",
    height: "70px",
    padding: "0px",
  },
  navBarCol: {
    padding: "0px",
  },
  main: {
    top: "0",
    height: "640px",
  },
}));

function PageMonitor() {
  const classes = useStyles();

  //———————————————————————————————————————————————useRef
  const tabVideoRef = useRef(null); //<TabVideo>组件的ref

  return (
    <Container className={classes.root} fluid={true}>
      <Row className={classes.navBarRow}>
        <Col className={classes.navBarCol} sm="12" md={{ size: 12, offset: 0 }}>
          <Navigation
            closeTabVideoIframe={() => {
              tabVideoRef.current.destroyIframe(); //调用<TabVideo>组件的函数
            }}
          />
        </Col>
      </Row>
      <Row>
        <Breadcrumb2 />
      </Row>
      <Row className={classes.main}>
        <Col sm="12" md={{ size: 8, offset: 0 }}>
          <Row>
            <TaskStatus />
          </Row>
          <Row>
            <Map />
          </Row>
          <Row>
            <TabInfo />
          </Row>
        </Col>
        <Col sm="12" md={{ size: 4, offset: 0 }}>
          <Row>
            <TabVideo ref={tabVideoRef} />
          </Row>
          <Row>{/* <VlcRtsp /> */}</Row>
          <Row>
            {/* <TabControl
              startTabVideoIframeRecord={() => {
                tabVideoRef.current.startRecord(); //调用<TabVideo>组件的函数
              }}
              stopTabVideoIframeRecord={() => {
                tabVideoRef.current.stopRecord(); //调用<TabVideo>组件的函数
              }}
            /> */}
            <HkwsCtrl />
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default PageMonitor;
