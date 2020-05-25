//packages
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { Icon } from "semantic-ui-react";

const useStyles = makeStyles((theme) => ({
  link: {
    display: "flex",
    padding: "0.5rem",
    fontFamily: "幼圆",
    fontSize: "1.1rem",
  },
}));

function Breadcrumb5(props) {
  const classes = useStyles();
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Typography color="inherit" className={classes.link}>
        <Icon name="home" />
        智能巡检机器人系统
      </Typography>
      <Typography color="inherit" className={classes.link}>
        <Icon name="warning sign" />
        异常告警
      </Typography>
    </Breadcrumbs>
  );
}

export default Breadcrumb5;
