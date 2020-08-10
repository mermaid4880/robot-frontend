import axios from "axios";
import Promise from "promise";
import cookie from "react-cookies";

// const baseUrl = "http://127.0.0.1:8080/";
// const baseUrl = "http://112.126.66.90:8082/";//郑凯
// const baseUrl = "http://192.168.8.137:8082/"; //局域网
const baseUrl = "http://103.149.26.221:8082/"; //风奇

//————————————————————————————从cookie里获取token
function getTokenConfig() {
  const token = cookie.load("token");
  console.log("token", token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return config;
}

//————————————————————————————GET请求
function getData(url, config) {
  return new Promise((resolve, reject) => {
    axios
      .get(baseUrl + url, { ...getTokenConfig(), ...config })
      .then((response) => {
        console.log("[getData] response is", response);
        console.log("[getData] response.data is", response.data);
        resolve(response.data); // fulfilled
      })
      .catch((error) => {
        console.log("[getData] error is", error);
        reject(error); // rejected
      });
  });
}

//调用
// const data = getData("areas/tree");
// getData("areas/tree").then(data => {
//   console.log("get结果", data);
// });

//————————————————————————————POST请求
function postData(url, data, config) {
  return new Promise((resolve, reject) => {
    axios
      .post(baseUrl + url, data, { ...getTokenConfig(), ...config })
      .then((response) => {
        console.log("[postData] response is", response);
        console.log("[postData] response.data is", response.data);
        resolve(response.data); // fulfilled
      })
      .catch((error) => {
        console.log("[postData] error is", error);
        reject(error); // rejected
      });
  });
}

//调用
//用URLSearchParams来传递参数
// let data = new URLSearchParams();
// data.append("username", "mozhichao");
// data.append("password", "123");
// const data= postData("users/login", data);

//————————————————————————————PUT请求
function putData(url, data, config) {
  return new Promise((resolve, reject) => {
    axios
      .put(baseUrl + url, data, { ...getTokenConfig(), ...config })
      .then((response) => {
        console.log("[putData] response is", response);
        console.log("[putData] response.data is", response.data);
        resolve(response.data); // fulfilled
      })
      .catch((error) => {
        console.log("[putData] error is", error);
        reject(error); // rejected
      });
  });
}

//————————————————————————————DELETE请求
function deleteData(url, config) {
  return new Promise((resolve, reject) => {
    axios
      .delete(baseUrl + url, { ...getTokenConfig(), ...config })
      .then((response) => {
        console.log("[deleteData] response is", response);
        console.log("[deleteData] response.data is", response.data);
        resolve(response.data); // fulfilled
      })
      .catch((error) => {
        console.log("[deleteData] error is", error);
        reject(error); // rejected
      });
  });
}

export { getData, postData, putData, deleteData };
