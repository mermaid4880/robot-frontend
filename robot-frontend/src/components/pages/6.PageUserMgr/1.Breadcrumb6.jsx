//packages
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { Icon } from "semantic-ui-react";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AccountBoxIcon from "@material-ui/icons/AccountBox";

const useStyles = makeStyles((theme) => ({
  link: {
    display: "flex",
    padding: "0.5rem",
    fontFamily: "幼圆",
    fontSize: "1.1rem",
  },
}));

function Breadcrumb6(props) {
  const classes = useStyles();
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Typography color="inherit" className={classes.link}>
        <Icon name="home" />
        智能巡检机器人系统
      </Typography>
      <Link color="inherit" className={classes.link}>
      <Icon name="setting" />
        系统配置
      </Link>
      <Typography color="inherit" className={classes.link}>
        <Icon name="user" />
        用户管理
      </Typography>
    </Breadcrumbs>
  );
}

export default Breadcrumb6;
