//???
import 'core-js/es/map';
import 'core-js/es/set';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'raf/polyfill';
//packages
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
//components
import App from "./components/App";



ReactDOM.render(<App />, document.getElementById('root'));

