import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import HkwsCtrl from "./HkwsCtrl.jsx";

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
      <HkwsCtrl />
    </Paper>
  );
}

export default ControlPanel;
