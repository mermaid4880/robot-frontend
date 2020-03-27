//packages
import React from "react";
import { Container, Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
//elements
import Navigation from "../elements/Navigation";
import Breadcrumb4 from "../elements/Breadcrumb4";
import Table4 from "../elements/Table4";
import TaskCalendar from "../elements/TaskCalendar";
import { Collapse } from "antd";

const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#eeeeee"
  },
  topRow: {
    top: "0",
    height: "70px"
  },
  topCol: {
    padding: "0px"
  },
  body: {
    top: "0",
    height: "890px",
    paddingTop: "10px"
  },  
  calendar: {
    height: "833px",
    backgroundColor: "#f5eee6"
  },
  collapse: {
    marginTop: "5px",
    height: "870px",
    backgroundColor: "#f5eee6"
  }
}));

function PageTaskShow() {
  const classes = useStyles();

  return (
    <Container className={classes.root} fluid={true}>
      <Row className={classes.topRow}>
        <Col className={classes.topCol} sm="12" md={{ size: 12, offset: 0 }}>
          <Navigation />
        </Col>
      </Row>
      <Row className={classes.body}>
        <Col sm="12" md={{ size: 6, offset: 0 }}>
          <Row>
            <Breadcrumb4 />
          </Row>
          <Row className={classes.calendar}>
            <TaskCalendar />
          </Row>
        </Col>
        <Col sm="12" md={{ size: 6, offset: 0 }}>
          <Collapse
            className={classes.collapse}
            defaultActiveKey={["1", "2"]}
            onChange={callback}
          >
            <Panel header="This is panel header 1" key="1">
              <p>{text}</p>
            </Panel>
            <Panel header="任务编辑列表" key="2">
              <Table4 />
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </Container>
  );
}

export default PageTaskShow;
