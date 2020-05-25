//???
import "core-js/es/map";
import "core-js/es/set";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "raf/polyfill";
//packages
import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { ConfigProvider } from "antd";// 引入ConfigProvider全局化配置
import zh_CN from "antd/lib/locale-provider/zh_CN";

import "semantic-ui-css/semantic.min.css";

import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

//components
import App from "./components/App.jsx";

ReactDOM.render(
  <ConfigProvider locale={zh_CN}>
    <App />
  </ConfigProvider>,
  document.getElementById("root")
);
