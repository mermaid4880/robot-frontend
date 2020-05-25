//packages
import React, { useState, useEffect } from "react";
import { Form } from "semantic-ui-react";

//———————————————————————————————————————————————Form.Select
const accessIdsOptions = [
  { key: "1", text: "1", value: "1" },
  { key: "2", text: "2", value: "2" },
  { key: "3", text: "3", value: "3" },
];

//———————————————————————————————————————————————全局函数
//初始化<Form>中所有默认数据（用户输入内容）
function initInput(data) {
  // data = {
  //   //点击的行数据
  //   key: "1234",
  //   id: "11bf48da2e4b458c9aa793812a214c74",
  //   username: "zhang",
  //   showname: "zhang",
  //   accessIds: "1,2,3",
  //   phoneNum: "phoneNum",
  // };
  console.log("data", data);
  let newInput = {
    id: data && data.id ? data.id : "",
    username: data && data.userName ? data.userName : "",
    showname: data && data.showName ? data.showName : "",
    password: "",
    password_: "",
    accessIds: data && data.accessIds ? data.accessIds : "",
    phoneNum: data && data.phoneNum ? data.phoneNum : "",
  };
  // console.log("newInput", newInput);
  return newInput;
}

function UserForm(props) {
  //———————————————————————————————————————————————useState
  //用户输入内容
  const [input, setInput] = useState(initInput(props.data));

  //———————————————————————————————————————————————useEffect
  useEffect(() => {
    //————————————————————————————将input传给父组件
    props.exportData(input);
  }, [input]);

  //———————————————————————————————————————————————事件响应函数
  //<Form>中一般组件变化事件响应函数
  function handleChange(e, { value }, key) {
    console.log("value", value, "key", key);
    //设置用户输入内容
    setInput((prev) => {
      return { ...prev, [key]: value };
    });
  }

  return (
    <Form>
      <Form.Input
        onChange={(e, { value }) => handleChange(e, { value }, "username")}
        fluid
        label="姓名"
        placeholder="姓名"
        // defaultValue={props.row.userName}
        value={input.username}
      />
      <Form.Input
        onChange={(e, { value }) => handleChange(e, { value }, "showname")}
        fluid
        label="显示姓名"
        placeholder="显示姓名"
        // defaultValue={props.row.showName}
        value={input.showname}
      />
      <Form.Input
        onChange={(e, { value }) => handleChange(e, { value }, "password")}
        fluid
        label="密码"
        placeholder="修改密码"
        type="password"
        // defaultValue="password"
      />
      <Form.Input
        onChange={(e, { value }) => handleChange(e, { value }, "password_")}
        fluid
        label="确认密码"
        placeholder="确认修改密码"
        type="password"
        // defaultValue="password"
      />
      <Form.Select
        onChange={(e, { value }) => handleChange(e, { value }, "accessIds")}
        fluid
        label="权限"
        options={accessIdsOptions}
        placeholder="权限"
        // defaultValue={props.row.accessIds}
        value={input.accessIds}
      />
      <Form.Input
        onChange={(e, { value }) => handleChange(e, { value }, "phoneNum")}
        fluid
        label="手机号"
        placeholder="手机号"
        // defaultValue={props.row.phoneNumber}
        value={input.phoneNum}
      />
      
    </Form>
  );
}

export default UserForm;
