//packages
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCogs, faUserCog } from "@fortawesome/free-solid-svg-icons";

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

function Breadcrumb6(props) {
  const classes = useStyles();
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Typography color="inherit" className={classes.link}>
        <FontAwesomeIcon icon={faHome} className={classes.icon} />
        智能巡检机器人系统
      </Typography>
      <Link color="inherit" className={classes.link}>
        <FontAwesomeIcon icon={faCogs} className={classes.icon} />
        系统配置
      </Link>
      <Typography color="inherit" className={classes.link}>
        <FontAwesomeIcon icon={faUserCog} className={classes.icon} />
        用户管理
      </Typography>
    </Breadcrumbs>
  );
}

export default Breadcrumb6;
