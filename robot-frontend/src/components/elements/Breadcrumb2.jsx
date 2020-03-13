//packages
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import HomeIcon from "@material-ui/icons/Home";
import ListAltIcon from "@material-ui/icons/ListAlt";


const useStyles = makeStyles(theme => ({
  link: {
    display: "flex",
    padding: "0.5rem",
    fontFamily: "幼圆",
    fontSize: "1.1rem"
  },
  icon: {
    marginTop: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20
  }
}));

function Breadcrumb2(props) {
  const classes = useStyles();
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link color="textPrimary" className={classes.link}>
        <HomeIcon className={classes.icon} />
        智能巡检机器人系统
      </Link>
      <Link color="inherit" className={classes.link}>
        <ListAltIcon className={classes.icon} />
        机器人管理
      </Link>
    </Breadcrumbs>
  );
}

export default Breadcrumb2;
