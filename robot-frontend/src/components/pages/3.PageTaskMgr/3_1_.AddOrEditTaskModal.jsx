//packages
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button1 from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Tooltip } from "antd";
import { Button, Icon, Header, Modal } from "semantic-ui-react";
import swal from "sweetalert";
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

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  const [postParamData, setPostParamData] = useState({}); //

  //———————————————————————————————————————————————其他函数
  //新增任务POST请求
  function addTaskPOST() {
    //————————————————————————————POST请求
    // 用URLSearchParams来传递参数
    let paramData = new URLSearchParams();
    paramData.append("taskName", postParamData.taskName.toString());
    // paramData.append("taskDescription", postParamData.taskDescription.toString());
    // paramData.append("createTime", postParamData.createTime.toString());
    paramData.append("type", postParamData.type.toString());
    paramData.append("createUserId", postParamData.createUserId.toString());
    paramData.append("meters", postParamData.meters.toString());
    // paramData.append("status", postParamData.status.toString());
    // paramData.append("mode", postParamData.mode.toString());
    // paramData.append("startTime", postParamData.startTime.toString());
    // paramData.append("endTime", postParamData.endTime.toString());
    // paramData.append("period", postParamData.period.toString());
    // paramData.append("isStart", postParamData.isStart.toString());
    //发送POST请求
    postData("/taskTemplates", paramData)
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
          //调用父组件函数（重新GET任务列表并刷新页面）
          props.updateParent();
          //发送事件到2_1.TaskCalendar中（重新GET任务列表并刷新页面）
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
    // 用URLSearchParams来传递参数
    let paramData = new URLSearchParams();
    // paramData.append("id", postParamData.id.toString());
    // paramData.append("taskName", postParamData.taskName.toString());
    // paramData.append("taskDescription", postParamData.taskDescription.toString());
    // paramData.append("createTime", postParamData.createTime.toString());
    // paramData.append("type", postParamData.type.toString());
    // paramData.append("createUserId", postParamData.createUserId.toString());
    paramData.append("meters", postParamData.meters.toString());//HJJ 适配现有的API
    // paramData.append("status", postParamData.status.toString());
    // paramData.append("mode", postParamData.mode.toString());
    // paramData.append("startTime", postParamData.startTime.toString());
    // paramData.append("endTime", postParamData.endTime.toString());
    // paramData.append("period", postParamData.period.toString());
    // paramData.append("isStart", postParamData.isStart.toString());

    //发送PUT请求
    putData("/taskTemplates/" + postParamData.id, paramData)
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
          //调用父组件函数（重新GET任务列表并刷新页面）
          props.updateParent();
          //发送事件到2_1.TaskCalendar中（重新GET任务列表并刷新页面）
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
            <Icon name="edit" />
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
          <Icon name="pencil alternate" />
        </div>
        <Modal.Description>
          <Header>编辑任务信息</Header>
          <div className="ui container" style={{ width: "678px" }}>
            <TaskForm
              data={props.data}
              exportData={(input) => {
                console.log("input", input);
                setPostParamData(input);
              }}
            />
          </div>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          icon="check"
          content="提交"
          onClick={() => {
            props.action === "add" ? addTaskPOST() : editTaskPUT();
          }}
        />
        <Button
          icon="cancel"
          content="取消"
          onClick={() => setModalOpen(false)}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default AddOrEditTaskModal;
