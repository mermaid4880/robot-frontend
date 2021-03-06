//packages
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from "antd";
import { Button, Modal } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
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

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //———————————————————————————————————————————————其他函数
  //删除任务DELETE请求
  function deleteTaskDELETE() {
    //————————————————————————————DELETE请求
    //用URLSearchParams来传递参数
    let params = new URLSearchParams();
    params.append("id", props.taskId.toString());
    //发送DELETE请求
    deleteData("task/delete", { params: params })
      .then((data) => {
        console.log("delete结果", data);
        if (data.success) {
          //关闭本modal
          setModalOpen(false);
          //sweetalert成功
          swal({
            title: "删除任务成功",
            text: "                 ",
            icon: "success",
            timer: 3000,
            buttons: false,
          });
          //调用父组件函数（重新GET任务列表并刷新组件）
          props.updateParent();
          //发送事件到2_1.TaskCalendar.jsx中（重新GET任务列表并刷新组件）
          emitter.emit("updateCalendar");
        } else {
          //关闭本modal
          setModalOpen(false);
          //sweetalert失败
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
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
        //sweetalert失败
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
          <FontAwesomeIcon icon={faTrash} />
        </Tooltip>
      }
    >
      <Modal.Header>删除任务</Modal.Header>
      <Modal.Content>
        <p>确认删除该任务？</p>
      </Modal.Content>
      <Modal.Actions>
        <Button primary content="确认删除" onClick={() => deleteTaskDELETE()} />
        <Button content="取消删除" onClick={() => setModalOpen(false)} />
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteTaskModal;
