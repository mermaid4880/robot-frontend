//packages
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from "antd";
import { Button, Modal, Icon, Form } from "semantic-ui-react";
import swal from "sweetalert";
//functions
import { postData } from "../../../functions/requestDataFromAPI.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "300px",
  },
}));

function ConfirmAlertModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //<Form.Radio>的选中状态（5种确认状态isDealed）
  const [radioState, setRadioState] = useState("");

  //告警信息的id
  const [alertId, setAlertId] = useState("");

  //———————————————————————————————————————————————useEffect
  useEffect(() => {
    setRadioState(props.alertIsDealed);
  }, [props.alertIsDealed]);

  useEffect(() => {
    setAlertId(props.alertId);
  }, [props.alertId]);

  //———————————————————————————————————————————————其他函数
  //处理告警信息POST请求
  function confirmAlertPOST() {
    //————————————————————————————POST请求
    // 用URLSearchParams来传递参数
    let paramData = new URLSearchParams();
    paramData.append("id", alertId.toString());
    paramData.append("isDealed", radioState.toString());
    //发送POST请求
    postData("/systemAlarms/batch", paramData)
      .then((data) => {
        console.log("post结果", data);
        if (data.success) {
          //关闭本modal
          setModalOpen(false);
          //alert成功
          swal({
            title: "处理告警信息成功",
            text: "                 ",
            icon: "success",
            timer: 3000,
            buttons: false,
          });
          //调用父组件函数（重新GET告警信息列表并刷新页面）
          props.updateParent();
        } else {
          //alert失败
          swal({
            title: "处理告警信息失败",
            text: "请重新处理告警信息！错误信息：" + data.detail.toString(),
            icon: "error",
            timer: 3000,
            buttons: false,
          });
        }
      })
      .catch((error) => {
        //alert失败
        swal({
          title: "处理告警信息失败",
          text: "请重新处理告警信息！错误信息：" + error.toString(),
          icon: "error",
          timer: 3000,
          buttons: false,
        });
      });
  }

  //———————————————————————————————————————————————事件响应函数
  //<Form>中一般组件变化事件响应函数
  function handleChange(e, { value }, key) {
    console.log("value", value, "key", key);
    //设置用户输入内容
    // setInput((prev) => {
    //   return { ...prev, [key]: value };
    // });
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
              icon="wrench"
              labelPosition="left"
              content="批量处理"
            />
          ) : (
            <Button
              // basic
              // color="grey"
              size="small"
              icon="wrench"
              labelPosition="left"
              content="批量处理"
            />
          )
        ) : (
          <Tooltip placement="bottom" title="处理告警信息">
            <Icon name="wrench" />
          </Tooltip>
        )
      }
    >
      <Modal.Header>处理告警信息</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Form.Radio
              label="未确认"
              value="未确认"
              checked={radioState === "未确认"}
              onChange={(e, { value }) => {
                setRadioState("未确认");
                handleChange(e, { value }, "isDealed");
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Radio
              label="现场确认无异常"
              value="现场确认无异常"
              checked={radioState === "现场确认无异常"}
              onChange={(e, { value }) => {
                setRadioState("现场确认无异常");
                handleChange(e, { value }, "isDealed");
              }}
            />
            <Form.Radio
              label="确认异常——已处理"
              value="确认异常——已处理"
              checked={radioState === "确认异常——已处理"}
              onChange={(e, { value }) => {
                setRadioState("确认异常——已处理");
                handleChange(e, { value }, "isDealed");
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Radio
              label="确认异常——需要进一步跟踪"
              value="确认异常——需要进一步跟踪"
              checked={radioState === "确认异常——需要进一步跟踪"}
              onChange={(e, { value }) => {
                setRadioState("确认异常——需要进一步跟踪");
                handleChange(e, { value }, "isDealed");
              }}
            />
            <Form.Radio
              label="确认异常——在允许范围内"
              value="确认异常——在允许范围内"
              checked={radioState === "确认异常——在允许范围内"}
              onChange={(e, { value }) => {
                setRadioState("确认异常——在允许范围内");
                handleChange(e, { value }, "isDealed");
              }}
            />
          </Form.Group>
        </Form>
        <p>确认处理告警信息{"（ID=" + alertId + "）"}？</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          icon="checkmark"
          content="确认"
          onClick={() => confirmAlertPOST()}
        />
        <Button
          icon="cancel"
          content="取消"
          onClick={() => {
            setRadioState(""); //清空Radio的记忆
            setModalOpen(false);
          }}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default ConfirmAlertModal;
