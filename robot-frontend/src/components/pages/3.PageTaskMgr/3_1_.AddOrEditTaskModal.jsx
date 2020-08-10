//packages
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button1 from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Tooltip } from "antd";
import { Button, Header, Modal } from "semantic-ui-react";
import swal from "sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
//elements
import TaskForm from "./3_1_1.TaskForm#1.jsx";
//functions
import { postData, putData } from "../../../functions/requestDataFromAPI.js";
import emitter from "../../../functions/events.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "800px",
  },
  button: {
    margin: theme.spacing(2),
  },
}));

function AddOrEditTaskModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //新增或修改任务POST请求所带的参数
  const [bodyParams, setBodyParams] = useState({});

  //———————————————————————————————————————————————其他函数
  //新增任务POST请求
  function addTaskPOST() {
    //————————————————————————————POST请求
    // 用URLSearchParams来传递参数
    let BodyParams = new URLSearchParams();
    BodyParams.append("taskName", bodyParams.taskName.toString());
    BodyParams.append("taskDescription", bodyParams.taskDescription.toString());
    BodyParams.append("createTime", bodyParams.createTime.toString());
    BodyParams.append("endAction", bodyParams.endAction.toString());
    BodyParams.append("type", bodyParams.type.toString());
    BodyParams.append("meters", bodyParams.meters.toString());
    BodyParams.append("mode", bodyParams.mode.toString());
    BodyParams.append("startTime", bodyParams.startTime.toString());
    BodyParams.append("period", bodyParams.period.toString());
    BodyParams.append("isStart", bodyParams.isStart.toString());
    //发送POST请求
    postData("task/addnew", BodyParams)
      .then((data) => {
        console.log("post结果", data);
        if (data.success) {
          //关闭本modal
          setModalOpen(false);
          //alert成功
          swal({
            title: "新增任务成功",
            text: "                 ",
            icon: "success",
            timer: 3000,
            buttons: false,
          });
          //调用父组件函数（重新GET任务列表并刷新组件）
          props.updateParent();
          //发送事件到2_1.TaskCalendar中（重新GET任务列表并刷新组件）
          emitter.emit("updateCalendar:");
        } else {
          //alert失败
          swal({
            title: "新增任务失败",
            text: "请重新编辑任务信息！错误信息：" + data.detail.toString(),
            icon: "error",
            timer: 3000,
            buttons: false,
          });
        }
      })
      .catch((error) => {
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
        //alert失败
        swal({
          title: "新增任务失败",
          text: "请重新编辑任务信息！错误信息：" + error.toString(),
          icon: "error",
          timer: 3000,
          buttons: false,
        });
      });
  }

  //修改任务PUT请求
  function editTaskPUT() {
    //————————————————————————————PUT请求
    let BodyParams = new URLSearchParams();
    BodyParams.append("id", bodyParams.id.toString());
    BodyParams.append("taskName", bodyParams.taskName.toString());
    BodyParams.append("taskDescription", bodyParams.taskDescription.toString());
    BodyParams.append("createTime", bodyParams.createTime.toString());
    BodyParams.append("endAction", bodyParams.endAction.toString());
    BodyParams.append("type", bodyParams.type.toString());
    BodyParams.append("meters", bodyParams.meters.toString());
    BodyParams.append("mode", bodyParams.mode.toString());
    BodyParams.append("startTime", bodyParams.startTime.toString());
    BodyParams.append("period", bodyParams.period.toString());
    BodyParams.append("isStart", bodyParams.isStart.toString());
    //发送PUT请求
    putData("task/edit", BodyParams)
      .then((data) => {
        console.log("put结果", data);
        if (data.success) {
          //关闭本modal
          setModalOpen(false);
          //alert成功
          swal({
            title: "修改任务成功",
            text: "                 ",
            icon: "success",
            timer: 3000,
            buttons: false,
          });
          //调用父组件函数（重新GET任务列表并刷新组件）
          props.updateParent();
          //发送事件到2_1.TaskCalendar中（重新GET任务列表并刷新组件）
          emitter.emit("updateCalendar:");
        } else {
          //alert失败
          swal({
            title: "修改任务失败",
            text: "请重新编辑任务信息！错误信息：" + data.detail.toString(),
            icon: "error",
            timer: 3000,
            buttons: false,
          });
        }
      })
      .catch((error) => {
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
        //alert失败
        swal({
          title: "修改任务失败",
          text: "请重新编辑任务信息！错误信息：" + error.toString(),
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
      closeOnDimmerClick={false}
      trigger={
        props.action === "add" ? (
          <Button1
            variant="contained"
            color="default"
            className={classes.button}
            startIcon={<AddCircleIcon />}
          >
            新增任务
          </Button1>
        ) : (
          <Tooltip placement="bottom" title="编辑任务">
            <FontAwesomeIcon icon={faEdit} />
          </Tooltip>
        )
      }
    >
      {props.action === "add" ? (
        <Modal.Header>新增任务</Modal.Header>
      ) : (
        <Modal.Header>修改任务</Modal.Header>
      )}
      <Modal.Content image scrolling>
        <div className="image">
          <FontAwesomeIcon icon={faPencilAlt} className="fa-8x" />
        </div>
        <Modal.Description>
          <Header>编辑任务信息</Header>
          <div className="ui container" style={{ width: "678px" }}>
            <TaskForm
              data={props.data} //将父组件传来的表格行数据传给子组件3_1_1.TaskForm#1.jsx
              exportData={(input) => {
                console.log("TaskForm output：", input);
                setBodyParams(input);
              }} //将子组件3_1_1.TaskForm#1.jsx中的用户输入数据导出，用于设置POST新增任务或PUT修改任务请求的参数
            />
          </div>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          content="提交"
          onClick={() => {
            props.action === "add" ? addTaskPOST() : editTaskPUT();
          }}
        />
        <Button content="取消" onClick={() => setModalOpen(false)} />
      </Modal.Actions>
    </Modal>
  );
}

export default AddOrEditTaskModal;
