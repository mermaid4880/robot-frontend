//packages
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from "antd";
import { Button, Modal, Icon } from "semantic-ui-react";
import swal from "sweetalert";
//functions
import { deleteData } from "../../../functions/requestDataFromAPI.js";
import emitter from "../../../functions/events.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "185px",
  },
}));

function DeleteTaskModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //———————————————————————————————————————————————其他函数
  //删除任务DELETE请求
  function deleteTaskDELETE() {
    //————————————————————————————DELETE请求
    deleteData("/taskTemplates/" + props.taskId)
      .then((data) => {
        console.log("delete结果", data);
        if (data.success) {
          //关闭本modal
          setModalOpen(false);
          //alert成功
          swal({
            title: "删除任务成功",
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
          //关闭本modal
          setModalOpen(false);
          //alert失败
          swal({
            title: "删除任务失败",
            text: "请重试！错误信息：" + data.detail.toString(),
            icon: "error",
            timer: 3000,
            buttons: false,
          });
        }
      })
      .catch((error) => {
        //关闭本modal
        setModalOpen(false);
        //alert失败
        swal({
          title: "删除任务失败",
          text: "请重试！错误信息：" + error.toString(),
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
      size={"tiny"}
      trigger={
        <Tooltip placement="bottom" title="删除任务">
          <Icon name="trash" />
        </Tooltip>
      }
    >
      <Modal.Header>删除任务</Modal.Header>
      <Modal.Content>
        <p>确认删除该任务？</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          icon="checkmark"
          content="确认删除"
          onClick={() => deleteTaskDELETE()}
        />
        <Button
          icon="cancel"
          content="取消删除"
          onClick={() => setModalOpen(false)}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteTaskModal;
