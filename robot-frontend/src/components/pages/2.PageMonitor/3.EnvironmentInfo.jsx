import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  root: {
    marginLeft: "1.8rem",
    marginTop: "0.5rem",
    width: 218,
    height: 495,
  },
});

function EnvironmentInfo() {
  const classes = useStyles();
  return <Paper className={classes.root}></Paper>;
}

export default EnvironmentInfo;
