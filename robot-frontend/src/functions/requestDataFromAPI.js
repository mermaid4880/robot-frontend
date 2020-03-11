import axios from "axios";
import Promise from "promise";

const baseUrl = "http://127.0.0.1:8080/";

//————————————————————————————GET请求
function getData(url) {
  return new Promise((resolve, reject) => {
    axios
      .get(baseUrl + url)
      .then(response => {
        console.log("[getData] response is", response);
        console.log("[getData] response.data is", response.data);
        resolve(response.data); // fulfilled
      })
      .catch(error => {
        console.log("[getData] error is", error);
        reject(false); // rejected
      });
  });
}

//调用
// const data = getData("areas/tree");

//————————————————————————————POST请求
function postData(url, paramData) {
  return new Promise((resolve, reject) => {
    axios
      .post(baseUrl + url, paramData)
      .then(response => {
        console.log("[postData] response is", response);
        console.log("[postData] response.data is", response.data);
        resolve(response.data); // fulfilled
      })
      .catch(error => {
        console.log("[postData] error is", error);
        reject(false); // rejected
      });
  });
}

//调用
//用URLSearchParams来传递参数
// let paramData = new URLSearchParams();
// paramData.append("username", "mozhichao");
// paramData.append("password", "123");
// const data= postData("users/login", paramData);

export { getData, postData };
