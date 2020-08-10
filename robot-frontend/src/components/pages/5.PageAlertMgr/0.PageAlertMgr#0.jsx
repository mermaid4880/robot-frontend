//packages
import React from "react";
import { Container, Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
//elements
import Navigation from "../../elements/0.Navigation.jsx";
import Breadcrumb5 from "./1.Breadcrumb5.jsx";
import AlertTableAndDetail from "./2_.AlertTableAndDetail.jsx";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#eeeeee",
    width: "1920px",
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
    height: "530px",
    padding: "0px 8px 0px 8px",
  },
}));

function PageAlertMgr(props) {
  const classes = useStyles();

  return (
    <Container className={classes.root} fluid={true}>
      <Row className={classes.navBarRow}>
        <Col className={classes.navBarCol} sm="12" md={{ size: 12, offset: 0 }}>
          <Navigation />
        </Col>
      </Row>
      <Row>
        <Breadcrumb5 />
      </Row>
      <Row className={classes.main}>
        <AlertTableAndDetail
          filter={props.location.query && props.location.query.filter} //从导航栏小铃铛进入告警页面时带参数
        />
      </Row>
    </Container>
  );
}

export default PageAlertMgr;
