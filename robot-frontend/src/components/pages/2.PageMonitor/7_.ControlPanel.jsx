import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import RobotControl from "./7_1_.RobotControl.jsx";

const useStyles = makeStyles({
  root: {
    marginLeft: "1.3rem",
    marginTop: "0.5rem",
    width: 625,
    height: 516,
  },
});

function ControlPanel() {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <RobotControl />
    </Paper>
  );
}

export default ControlPanel;
