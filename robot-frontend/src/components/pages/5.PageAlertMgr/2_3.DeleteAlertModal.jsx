//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button1 from "@material-ui/core/Button";
import { Tooltip } from "antd";
import { Button, Modal } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
//functions
import { deleteData } from "../../../functions/requestDataFromAPI.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "185px",
  },
  startIcon: {
    width: 14,
    height: 14,
  },
}));

function DeleteAlertModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //告警信息的ID
  const [alertId, setAlertId] = useState("");

  //———————————————————————————————————————————————useEffect
  //当父组件2_.AlertTableAndDetail.jsx传来的告警信息ID发生变化时，设置告警信息的ID
  useEffect(() => {
    setAlertId(props.data.alertId);
  }, [props.data.alertId]);

  //———————————————————————————————————————————————其他函数
  //删除告警信息DELETE请求
  function deleteAlertDELETE() {
    //————————————————————————————DELETE请求
    //参数alertIdArray放在Body——raw——JSON里
    var alertIdArray;
    //如果是批量删除，将用","级联组成的告警信息ID字符串转为数字数组
    if (props.batch) alertIdArray = alertId.split(",").map(Number);
    //如果是单条删除，将数字格式的告警信息ID转为单元素数字数组
    else alertIdArray = [alertId];
    //发送DELETE请求
    deleteData("detectionDatas/deletewarns", { data: alertIdArray })
      .then((data) => {
        console.log("delete结果", data);
        if (data.success) {
          //关闭本modal
          setModalOpen(false);
          //sweetalert成功
          swal({
            title: "删除告警信息成功",
            text: "                 ",
            icon: "success",
            timer: 3000,
            buttons: false,
          });
          //调用父组件函数（重新GET告警信息列表并刷新组件）
          props.updateParent();
        } else {
          //关闭本modal
          setModalOpen(false);
          //sweetalert失败
          swal({
            title: "删除告警信息失败",
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
          title: "删除告警信息失败",
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
        props.batch === true ? (
          props.data.alertId === "" ? (
            <Button1
              disabled
              variant="contained"
              color="default"
              startIcon={
                <FontAwesomeIcon icon={faTrash} className={classes.startIcon} />
              }
            >
              批量删除
            </Button1>
          ) : (
            <Button1
              variant="contained"
              color="default"
              startIcon={
                <FontAwesomeIcon icon={faTrash} className={classes.startIcon} />
              }
            >
              批量删除
            </Button1>
          )
        ) : (
          <Tooltip placement="bottom" title="删除告警信息">
            <FontAwesomeIcon icon={faTrash} />
          </Tooltip>
        )
      }
    >
      <Modal.Header>删除告警信息</Modal.Header>
      <Modal.Content>
        <p>确认删除告警信息{"（ID=" + alertId + "）"}？</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          content="确认删除"
          onClick={() => deleteAlertDELETE()}
        />
        <Button content="取消删除" onClick={() => setModalOpen(false)} />
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteAlertModal;
