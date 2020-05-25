//packages
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Icon } from "semantic-ui-react";

const useStyles = makeStyles((theme) => ({
  link: {
    display: "flex",
    padding: "0.5rem",
    fontFamily: "幼圆",
    fontSize: "1.1rem",
  }
}));

function Breadcrumb4_1(props) {
  const classes = useStyles();
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Typography color="inherit" className={classes.link}>
        <Icon name="home" />
        智能巡检机器人系统
      </Typography>
      <Typography color="inherit" className={classes.link}>
        <Icon name="table" />
        巡检记录
      </Typography>
      <Typography color="inherit" className={classes.link}>
        <Icon name="tasks" />
        点位巡检记录
      </Typography>
    </Breadcrumbs>
  );
}

export default Breadcrumb4_1;
