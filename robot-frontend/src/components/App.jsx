import React from "react";
import { getData, postData } from "../functions/requestDataFromAPI";

function App() {
  getData("areas/tree").then(data => {
    console.log("get结果", data);
  });

  //用URLSearchParams来传递参数
  let paramData = new URLSearchParams();
  paramData.append("username", "mozhichao");
  paramData.append("password", "123");
  postData("users/login", paramData).then(data => {
    console.log("post结果", data);
  });
  return <div></div>;
}

export default App;
