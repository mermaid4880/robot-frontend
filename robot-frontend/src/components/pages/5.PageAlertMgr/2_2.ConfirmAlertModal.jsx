//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button1 from "@material-ui/core/Button";
import { Tooltip } from "antd";
import { Button, Modal, Form } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
//functions
import { postData } from "../../../functions/requestDataFromAPI.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "300px",
  },
  startIcon: {
    width: 14,
    height: 14,
  },
}));

function ConfirmAlertModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

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
          //调用父组件函数（重新GET告警信息列表并刷新组件）
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
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
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
            <Button1
              disabled
              variant="contained"
              color="default"
              startIcon={
                <FontAwesomeIcon
                  icon={faWrench}
                  className={classes.startIcon}
                />
              }
            >
              批量处理
            </Button1>
          ) : (
            <Button1
              variant="contained"
              color="default"
              startIcon={
                <FontAwesomeIcon
                  icon={faWrench}
                  className={classes.startIcon}
                />
              }
            >
              批量处理
            </Button1>
          )
        ) : (
          <Tooltip placement="bottom" title="处理告警信息">
            <FontAwesomeIcon icon={faWrench} />
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
        <Button primary content="确认" onClick={() => confirmAlertPOST()} />
        <Button
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
