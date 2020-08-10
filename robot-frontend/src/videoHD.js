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
import HkwsHD from "../src/components/pages/2.PageMonitor/6_2.HkwsHD.jsx";

ReactDOM.render(
  <HkwsHD cameraIP="192.168.1.65" />,
  document.getElementById("videoHD")
);
