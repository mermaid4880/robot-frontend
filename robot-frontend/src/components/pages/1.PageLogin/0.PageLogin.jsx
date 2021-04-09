//packages
import React from "react";
import { Container, Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
//elements
import UserForm from "./1.UserForm.jsx";
import Typography from "@material-ui/core/Typography";
//images
import ImageBackground from "../../../images/PageLogin-bg1.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "0",
    width: "100%",
    height: "962px",
    // height: "1080px",
    backgroundImage: `url(${ImageBackground})`,
  },
  row1: {
    paddingTop: "30%",
  },
  row2: {
    paddingTop: "5%",
  },
  link1: {
    display: "flex",
    padding: "0.5rem",
    fontFamily: "微软雅黑",
    fontSize: "4rem",
    color: "#eeeeee",
    textShadow: "rgba(0,0,0,0.5) 0 5px 6px, rgba(0,0,0,0.2) 1px 3px 3px",
    webkitBackgroundClip: "text",
    textAlign: "center",
    margin:0,
  },
  link2: {
    display: "flex",
    padding: "20px",
    fontFamily: "微软雅黑",
    fontSize: "2.5rem",
    color: "#eeeeee",
    textShadow: "rgba(0,0,0,0.5) 0 5px 6px, rgba(0,0,0,0.2) 1px 3px 3px",
    webkitBackgroundClip: "text",
    textAlign: "center",
    margin:0,
  },
}));

function PageLogin() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container>
        <Row className={classes.row1}>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Typography className={classes.link1} >
              智能巡检机器人系统
            </Typography>
          </Col>
        </Row>
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Typography>
            <p className={classes.link2}>Monitoring System Of Robot</p>
            </Typography>
          </Col>
        </Row>
        <Row className={classes.row2}>
          <Col sm={{ size: 4, order: 2, offset: 4 }}>
            <UserForm />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PageLogin;
