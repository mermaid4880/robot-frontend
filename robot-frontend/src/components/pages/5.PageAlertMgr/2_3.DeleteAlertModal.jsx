//packages
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from "antd";
import { Button, Modal, Icon } from "semantic-ui-react";
import swal from "sweetalert";
//functions
import { deleteData } from "../../../functions/requestDataFromAPI.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "185px",
  },
}));

function DeleteAlertModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //告警信息的id
  const [alertId, setAlertId] = useState("");

  //———————————————————————————————————————————————useEffect
  useEffect(() => {
    setAlertId(props.alertId);
  }, [props.alertId]);

  //———————————————————————————————————————————————其他函数
  //删除告警信息DELETE请求
  function deleteAlertDELETE() {
    //————————————————————————————DELETE请求
    // 用URLSearchParams来传递参数
    let paramData = new URLSearchParams();
    paramData.append("id", alertId.toString());
    deleteData("systemAlarms/batch" + paramData)
      .then((data) => {
        console.log("delete结果", data);
        if (data.success) {
          //关闭本modal
          setModalOpen(false);
          //alert成功
          swal({
            title: "删除告警信息成功",
            text: "                 ",
            icon: "success",
            timer: 3000,
            buttons: false,
          });
          //调用父组件函数（重新GET告警信息列表并刷新页面）
          props.updateParent();
        } else {
          //关闭本modal
          setModalOpen(false);
          //alert失败
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
        //alert失败
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
          props.alertId === "" ? (
            <Button
              disabled
              // basic
              // color="grey"
              size="small"
              icon="trash"
              labelPosition="left"
              content="批量删除"
            />
          ) : (
            <Button
              // basic
              // color="grey"
              size="small"
              icon="trash"
              labelPosition="left"
              content="批量删除"
            />
          )
        ) : (
          <Tooltip placement="bottom" title="删除告警信息">
          <Icon name="trash" />
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
          icon="checkmark"
          content="确认删除"
          onClick={() => deleteAlertDELETE()}
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

export default DeleteAlertModal;
