// （不鉴权）
//configuration
import { httpUrl as baseUrl } from "../configuration/config.js";
//packages
import axios from "axios";
import Promise from "promise";

//————————————————————————————GET请求
function getData(url, paramData) {
  return new Promise((resolve, reject) => {
    axios
      .get(baseUrl + url, paramData)
      .then((response) => {
        console.log("[getData] response is", response);
        console.log("[getData] response.data is", response.data);
        resolve(response.data); // fulfilled
      })
      .catch((error) => {
        console.log("[getData] error is", error);
        reject(false); // rejected
      });
  });
}

//调用
// const data = getData("areas/tree");
// getData("areas/tree").then(data => {
//   console.log("get结果", data);
// });

//————————————————————————————POST请求
function postData(url, paramData) {
  return new Promise((resolve, reject) => {
    axios
      .post(baseUrl + url, paramData)
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
// let paramData = new URLSearchParams();
// paramData.append("username", "mozhichao");
// paramData.append("password", "123");
// const data= postData("users/login", paramData);

//————————————————————————————PUT请求
function putData(url, paramData) {
  return new Promise((resolve, reject) => {
    axios
      .put(baseUrl + url, paramData)
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
function deleteData(url, paramData) {
  return new Promise((resolve, reject) => {
    axios
      .delete(baseUrl + url, paramData)
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
