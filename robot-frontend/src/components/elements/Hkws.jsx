//packages
import React from "react";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { HkwsStart, HkwsStop } from "../../functions/hkws";

//————————————————————————————css
const useStyles = makeStyles({
  root: {
    // width: "100%",
    top: "0",
    width: "640px",
    height: "360px"
  }
});

function Hkws() {
  const classes = useStyles();

  console.log("enter Hkws...");

  setTimeout(function() {
    // alert("start view...."); //可以是一句或是很多句代码，也可以是个函数
    HkwsStart();
    // alert("stop view...."); //可以是一句或是很多句代码，也可以是个函数
    // HkwsStop();
  }, 2000); //延时2秒
  return (
    // <Paper elevation="5" className={classes.root}>
      <div id="divPlugin" className="plugin"></div>
    // </Paper>
  );
}

export default Hkws;
