//packages
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
  link: {
    display: "flex",
    padding: "0.5rem",
    fontFamily: "幼圆",
    fontSize: "1.1rem",
  },
  icon: {
    margin: "3px 4px 0px 4px",
  },
}));

function Breadcrumb5(props) {
  const classes = useStyles();
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Typography color="inherit" className={classes.link}>
        <FontAwesomeIcon icon={faHome} className={classes.icon} />
        智能巡检机器人系统
      </Typography>
      <Typography color="inherit" className={classes.link}>
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className={classes.icon}
        />
        异常告警
      </Typography>
    </Breadcrumbs>
  );
}

export default Breadcrumb5;