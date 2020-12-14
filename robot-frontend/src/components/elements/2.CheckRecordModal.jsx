//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button1 from "@material-ui/core/Button";
import { Tooltip } from "antd";
import { Input, Button, Modal, Form } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
//functions
import { putData } from "../../functions/requestDataFromAPI.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  rootSmall: {
    width: "100%",
    height: "336px",
  },
  rootBig: {
    width: "100%",
    height: "410px",
  },
  startIcon: {
    width: 14,
    height: 14,
  },
}));

function CheckRecordModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //checkData的状态（巡检结果ID、和<Form>的状态[识别结果、巡检审核状态、巡检审核信息]）
  const [checkData, setCheckData] = useState({
    resultId: "",
    value: "",
    checkStatus: "",
    checkInfo: "",
  });

  //<Form.Radio>的选中状态（3种确认状态checkStatus）
  const [radioState, setRadioState] = useState(""); //"待审核"、"已确认"、"已修改"

  //———————————————————————————————————————————————useEffect
  //父组件传入data后更新checkData的状态、<Form.Radio>的选中状态
  //父组件1（pages\4.PageTaskRecord\0.PageAllRecords\3_.OneRecordDetailTable#2#3#4#5.jsx）
  //父组件2（pages\4.PageTaskRecord\1.PageOneMeterRecords\2_.OneMeterRecordsTableAndDetail#2#3.jsx）
  useEffect(() => {
    setRadioState(props.data.checkStatus);
    setCheckData(props.data);
  }, [props.data]);

  //———————————————————————————————————————————————其他函数
  //审核单条巡检结果（按巡检结果ID）PUT请求
  function checkResultPUT() {
    // console.log("checkData", checkData);
    //————————————————————————————PUT请求
    // 用URLSearchParams来传递参数
    let BodyParams = new URLSearchParams();
    checkData.resultId &&
      BodyParams.append("resultId", checkData.resultId.toString());
    checkData.value &&
      props.batch === false &&
      BodyParams.append("value", checkData.value.toString());
    checkData.checkStatus &&
      BodyParams.append("checkStatus", checkData.checkStatus.toString());
    checkData.checkInfo &&
      BodyParams.append("checkInfo", checkData.checkInfo.toString());
    //发送PUT请求
    putData(
      props.batch === false
        ? "checkDetectionDatas/byid"
        : "checkDetectionDatas/bybatchid",
      BodyParams
    )
      .then((data) => {
        console.log("put结果", data);
        if (data.success) {
          //关闭本modal
          setModalOpen(false);
          //alert成功
          swal({
            title: "审核巡检点位信息成功",
            text: "                 ",
            icon: "success",
            timer: 3000,
            buttons: false,
          });
          //调用父组件函数（重新GET全部详细点位信息列表并刷新组件）
          props.updateParent();
        } else {
          //alert失败
          swal({
            title: "审核巡检点位信息失败",
            text: "请重新审核巡检点位信息！错误信息：" + data.detail.toString(),
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
          title: "审核巡检点位信息",
          text: "请重新审核巡检点位信息！错误信息：" + error.toString(),
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
    setCheckData((prev) => {
      return { ...prev, [key]: value };
    });
  }

  return (
    <Modal
      className={props.batch === false ? classes.rootBig : classes.rootSmall}
      open={modalOpen}
      onOpen={() => setModalOpen(true)}
      onClose={() => setModalOpen(false)}
      closeOnDimmerClick={false}
      size={"tiny"}
      trigger={
        props.batch === true ? (
          props.data.resultId === "" ? (
            <Button1
              disabled //不可用
              variant="contained"
              color="default"
              startIcon={
                <FontAwesomeIcon
                  icon={faClipboardCheck}
                  className={classes.startIcon}
                />
              }
            >
              批量审核
            </Button1>
          ) : (
            <Button1
              variant="contained"
              color="default"
              startIcon={
                <FontAwesomeIcon
                  icon={faClipboardCheck}
                  className={classes.startIcon}
                />
              }
            >
              批量审核
            </Button1>
          )
        ) : (
          <Tooltip placement="bottom" title="审核巡检点位信息">
            <FontAwesomeIcon icon={faClipboardCheck} />
          </Tooltip>
        )
      }
    >
      <Modal.Header>审核巡检点位信息</Modal.Header>
      <Modal.Content>
        <Form>
          {props.batch === false && (
            <Form.Field>
              <label>识别结果</label>
              <Input
                value={checkData.value}
                placeholder="识别结果"
                onChange={(e, { value }) => handleChange(e, { value }, "value")}
              />
            </Form.Field>
          )}
          <Form.TextArea
            value={checkData.checkInfo}
            label="审核信息"
            placeholder="请输入审核信息..."
            onChange={(e, { value }) => handleChange(e, { value }, "checkInfo")}
          />
          <Form.Group widths="equal">
            <Form.Radio
              label="待审核"
              value="待审核"
              checked={radioState === "待审核"}
              onChange={(e, { value }) => {
                setRadioState("待审核");
                handleChange(e, { value }, "checkStatus");
              }}
            />
            <Form.Radio
              label="已确认"
              value="已确认"
              checked={radioState === "已确认"}
              onChange={(e, { value }) => {
                setRadioState("已确认");
                handleChange(e, { value }, "checkStatus");
              }}
            />
            <Form.Radio
              label="已修改"
              value="已修改"
              checked={radioState === "已修改"}
              onChange={(e, { value }) => {
                setRadioState("已修改");
                handleChange(e, { value }, "checkStatus");
              }}
            />
          </Form.Group>
        </Form>
        <p>确认审核记录{"（巡检结果ID=" + checkData.resultId + "）"}？</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          content="确认"
          onClick={() => {
            //审核单条巡检结果（按巡检结果ID）
            checkResultPUT();
          }}
        />
        <Button
          content="取消"
          onClick={() => {
            //清空用户输入的所有记忆，设置为父组件传来的参数
            setRadioState(props.data.checkStatus);
            setCheckData(props.data);
            //关闭本modal
            setModalOpen(false);
          }}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default CheckRecordModal;
