//packages
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button1 from "@material-ui/core/Button";
import { Button, Header, Modal } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
//elements
import UserForm from "./3_1_1_1.UserForm.jsx";
//functions
import { postData, putData } from "../../../functions/requestDataFromAPI.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "630px",
  },
  startIcon: {
    width: 14,
    height: 14,
  },
}));

function EditUserModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //POST和PUT请求的参数
  const [paramData, setParamData] = useState({});

  //———————————————————————————————————————————————其他函数
  //新增用户POST请求
  function addUserPOST() {
    // 输入格式判断
    if (
      paramData.username === "" ||
      paramData.password === "" ||
      paramData.password_ === "" ||
      paramData.showname === "" ||
      paramData.accessIds === "" ||
      paramData.phoneNum === ""
    ) {
      swal({
        title: "新增失败",
        text: "以上内容为必填消息，均不能为空",
        icon: "warning",
        timer: 3000,
        buttons: false,
      });
      return;
    } else {
      //密码验证
      if (paramData.password !== paramData.password_) {
        swal({
          title: "新增失败",
          text: "前后密码不一致",
          icon: "warning",
          timer: 3000,
          buttons: false,
        });
        return;
      }

      //空格验证
      var nbsp = /^\s+|\s+$/;
      //整数验证
      var Phone = /[0-9]{11}/;
      //特殊字符
      var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

      if (
        regEn.test(paramData.username) ||
        regCn.test(paramData.username) ||
        nbsp.test(paramData.username)
      ) {
        swal({
          title: "新增失败",
          text: "姓名不能包含特殊字符和空格",
          icon: "warning",
          timer: 3000,
          buttons: false,
        });
        return;
      }
      if (
        regEn.test(paramData.showname) ||
        regCn.test(paramData.showname) ||
        nbsp.test(paramData.showname)
      ) {
        swal({
          title: "新增失败",
          text: "显示姓名不能包含特殊字符和空格",
          icon: "warning",
          timer: 3000,
          buttons: false,
        });
        return;
      }
      if (
        regEn.test(paramData.phoneNum) ||
        regCn.test(paramData.phoneNum) ||
        nbsp.test(paramData.phoneNum)
      ) {
        swal({
          title: "新增失败",
          text: "手机号不能包含特殊字符和空格",
          icon: "warning",
          timer: 3000,
          buttons: false,
        });
        return;
      }
      if (!Phone.test(paramData.phoneNum)) {
        swal({
          title: "新增失败",
          text: "手机号必须为11位数字",
          icon: "warning",
          timer: 3000,
          buttons: false,
        });
        return;
      }
    }

    //————————————————————————————POST请求
    console.log("paramData", paramData);
    let postParamData = new URLSearchParams();
    postParamData.append("username", paramData.username.toString());
    postParamData.append("password", paramData.password.toString());
    postParamData.append("password_", paramData.password_.toString());
    postParamData.append("showname", paramData.showname.toString());
    postParamData.append("accessIds", paramData.accessIds.toString());
    postParamData.append("phoneNum", paramData.phoneNum.toString());
    //发送POST请求
    postData("/users", postParamData)
      .then((data) => {
        console.log("post结果", data);
        if (data.success) {
          //关闭本modal
          setModalOpen(false);
          //alert成功
          swal({
            title: "新增成功",
            text: "用户" + paramData.username + "新增成功",
            icon: "success",
            timer: 3000,
            buttons: false,
          });
          //调用父组件函数（重新GET用户列表并刷新页面）
          props.updateParent();
        } else {
          //alert失败
          swal({
            title: "新增失败",
            text: data.detail,
            icon: "error",
            timer: 3000,
            buttons: false,
          });
        }
      })
      .catch((error) => {
        //关闭本modal
        setModalOpen(false);
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
        //alert失败
        swal({
          title: "新增失败",
          text: error.toString(),
          icon: "error",
          timer: 3000,
          buttons: false,
        });
      });
  }

  //修改用户PUT请求
  function editUserPUT() {
    console.log("paramData", paramData);
    // 输入格式判断
    if (
      paramData.username === "" ||
      paramData.showname === "" ||
      paramData.accessIds === "" ||
      paramData.phoneNum === ""
    ) {
      swal({
        title: "编辑失败",
        text: "以上内容为必填消息，均不能为空",
        icon: "warning",
        timer: 3000,
        buttons: false,
      });
      return;
    } else {
      //密码验证
      if (paramData.password !== paramData.password_) {
        swal({
          title: "编辑失败",
          text: "前后密码不一致",
          icon: "warning",
          timer: 3000,
          buttons: false,
        });
        return;
      }

      //空格验证
      var nbsp = /^\s+|\s+$/;
      //整数验证
      var Phone = /[0-9]{11}/;
      //特殊字符
      var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

      if (
        regEn.test(paramData.username) ||
        regCn.test(paramData.username) ||
        nbsp.test(paramData.username)
      ) {
        swal({
          title: "编辑失败",
          text: "姓名不能包含特殊字符和空格",
          icon: "warning",
          timer: 3000,
          buttons: false,
        });
        return;
      }
      if (
        regEn.test(paramData.showname) ||
        regCn.test(paramData.showname) ||
        nbsp.test(paramData.showname)
      ) {
        swal({
          title: "编辑失败",
          text: "显示姓名不能包含特殊字符和空格",
          icon: "warning",
          timer: 3000,
          buttons: false,
        });
        return;
      }
      if (
        regEn.test(paramData.phoneNum) ||
        regCn.test(paramData.phoneNum) ||
        nbsp.test(paramData.phoneNum)
      ) {
        swal({
          title: "编辑失败",
          text: "手机号不能包含特殊字符和空格",
          icon: "warning",
          timer: 3000,
          buttons: false,
        });
        return;
      }
      if (!Phone.test(paramData.phoneNum)) {
        swal({
          title: "编辑失败",
          text: "手机号必须为11位数字",
          icon: "warning",
          timer: 3000,
          buttons: false,
        });
        return;
      }
    }

    //————————————————————————————PUT请求
    console.log("paramData", paramData);
    let putParamData = new URLSearchParams();
    putParamData.append("username", paramData.username.toString());
    if (paramData.password !== "") {
      putParamData.append("password", paramData.password.toString());
    }
    putParamData.append("showname", paramData.showname.toString());
    putParamData.append("accessIds", paramData.accessIds.toString());
    putParamData.append("phoneNum", paramData.phoneNum.toString());
    //发送PUT请求
    putData("/users/" + props.data.id, putParamData)
      .then((data) => {
        console.log("post结果", data);
        if (data.success) {
          //关闭本modal
          setModalOpen(false);
          //alert成功
          swal({
            title: "编辑成功",
            text: "用户" + paramData.username + "编辑成功",
            icon: "success",
            timer: 3000,
            buttons: false,
          });
          //调用父组件函数（重新GET用户列表并刷新页面）
          props.updateParent();
        } else {
          //alert失败
          swal({
            title: "编辑失败",
            text: data.detail,
            icon: "error",
            timer: 3000,
            buttons: false,
          });
        }
      })
      .catch((error) => {
        //关闭本modal
        setModalOpen(false);
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
        //alert失败
        swal({
          title: "编辑失败",
          text: error.toString(),
          icon: "error",
          timer: 3000,
          buttons: false,
        });
      });
  }

  return (
    <Modal
      className={classes.root}
      open={modalOpen}
      onOpen={() => setModalOpen(true)}
      onClose={() => setModalOpen(false)}
      dimmer={"inverted"}
      trigger={
        props.action === "add" ? (
          <Button1
            variant="contained"
            color="default"
            startIcon={
              <FontAwesomeIcon
                icon={faUserPlus}
                className={classes.startIcon}
              />
            }
          >
            新增用户
          </Button1>
        ) : (
          <FontAwesomeIcon icon={faEdit} />
        )
      }
    >
      {props.action === "add" ? (
        <Modal.Header>新增用户</Modal.Header>
      ) : (
        <Modal.Header>修改用户</Modal.Header>
      )}
      <Modal.Content>
        <Modal.Description>
          <Header>用户信息</Header>
          <div className="ui container" style={{ width: "678px" }}>
            <UserForm
              data={props.data}
              exportData={(input) => {
                console.log("input", input);
                setParamData(input);
              }}
            />
          </div>
          <div></div>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          content="提交"
          onClick={() => {
            props.action === "add" ? addUserPOST() : editUserPUT();
          }}
        />
        <Button content="取消" onClick={() => setModalOpen(false)} />
      </Modal.Actions>
    </Modal>
  );
}

export default EditUserModal;
