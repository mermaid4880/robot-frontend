//packages
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { Loader, Dimmer } from "semantic-ui-react";
//elements
import Navigation from "../../elements/0.Navigation.jsx";
import Breadcrumb3 from "./1.Breadcrumb3.jsx";
import TabTreeCalendar from "./2_.TabTreeCalendar#1.jsx";
import TaskTableAndDetail from "./3_.TaskTableAndDetail.jsx";

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
  blankRow: {
    height: "38px",
  },
}));

function PageTaskMgr() {
  const classes = useStyles();

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
        <Col className={classes.navBarCol} sm="12" md={{ size: 12, offset: 0 }}>
          <Navigation
            activeDimmer={() => setDimmerActive(true)} //设置<Dimmer>为激活状态
          />
        </Col>
      </Row>
      <Row>
        <Col sm="12" md={{ size: 3, offset: 0 }}>
          <Row>
            <Breadcrumb3 />
          </Row>
          <Row>
            <TabTreeCalendar />
          </Row>
        </Col>
        <Col sm="12" md={{ size: 9, offset: 0 }}>
          <Row className={classes.blankRow}></Row>
          <Row>
            <TaskTableAndDetail />
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

export default PageTaskMgr;
