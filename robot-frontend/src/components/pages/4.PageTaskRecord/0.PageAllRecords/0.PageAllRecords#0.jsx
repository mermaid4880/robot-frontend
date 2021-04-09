//packages
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { Loader, Dimmer } from "semantic-ui-react";
//elements
import Navigation from "../../../elements/0.Navigation.jsx";
import Breadcrumb4_0 from "./1.Breadcrumb4_0.jsx";
import AllRecordsTable from "./2_.AllRecordsTable.jsx";
import OneRecordDetailTable from "./3_.OneRecordDetailTable#2#3#4.jsx";

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
}));

function PageAllRecords() {
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
        <Breadcrumb4_0 />
      </Row>
      <Row>
        <AllRecordsTable />
      </Row>
      <Row>
        <OneRecordDetailTable />
      </Row>
      <Dimmer active={dimmerActive} page>
        <Loader indeterminate size="large">
          页面跳转中...
        </Loader>
      </Dimmer>
    </Container>
  );
}

export default PageAllRecords;
