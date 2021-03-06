//configuration
import {
  IRCameraIP,
  IRUserName,
  IRPassword,
} from "../src/configuration/config.js";
//???
import "core-js/es/map";
import "core-js/es/set";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "raf/polyfill";
//packages
import React from "react";
import ReactDOM from "react-dom";
//elements
import HkwsIR from "../src/components/pages/2.PageMonitor/6_3.HkwsIR.jsx";

ReactDOM.render(
  <HkwsIR cameraIP={IRCameraIP} userName={IRUserName} password={IRPassword} />,
  document.getElementById("videoIR")
);
