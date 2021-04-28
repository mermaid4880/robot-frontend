//packages
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from "antd";
import { Button, Modal } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
//functions
import { postData } from "../../../functions/requestDataFromAPI.js";
import emitter from "../../../functions/events.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "185px",
  },
}));

function IssueTaskModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //———————————————————————————————————————————————其他函数
  //下发任务POST请求（根据任务执行优先级firstPriority【true-立即执行、false-顺序执行】）
  function issueTaskPOST(firstPriority) {
    //————————————————————————————POST请求
    // 用URLSearchParams来传递参数
    let BodyParams = new URLSearchParams();
    BodyParams.append("id", props.taskId.toString());
    BodyParams.append("firstPriority", firstPriority === true ? true : false);
    //发送POST请求
    postData("taskManager/sendbyid", BodyParams)
      .then((data) => {
        console.log("post结果", data);
        if (data.success) {
          //sweetalert成功
          swal({
            title: "下发任务成功",
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
          //sweetalert失败
          swal({
            title: "下发任务失败",
            text: "请重试！错误信息：" + data.detail.toString(),
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
        //sweetalert失败
        swal({
          title: "下发任务失败",
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
        <Tooltip placement="bottom" title="下发任务">
          <FontAwesomeIcon icon={faPlay} />
        </Tooltip>
      }
    >
      <Modal.Header>下发任务</Modal.Header>
      <Modal.Content>
        <p>确认下发该任务？</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          content="确认下发（立即执行）"
          onClick={() => {
            //关闭本modal
            setModalOpen(false);
            //下发任务POST请求（立即执行）
            issueTaskPOST(true);
          }}
        />
        <Button
          primary
          content="确认下发（顺序执行）"
          onClick={() => {
            //关闭本modal
            setModalOpen(false);
            //下发任务POST请求（顺序执行）
            issueTaskPOST(false);
          }}
        />
        <Button content="取消下发" onClick={() => setModalOpen(false)} />
      </Modal.Actions>
    </Modal>
  );
}

export default IssueTaskModal;
