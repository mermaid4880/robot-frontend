//packages
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from "antd";
import { Input, Button, Modal, Icon, Form } from "semantic-ui-react";
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
}));

function CheckRecordModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //checkData的状态（记录id、点位id和<Form>的状态）
  const [checkData, setCheckData] = useState({
    id: "",
    meterId: "",
    value: "",
    checkStatus: "",
    checkInfo: "",
  });

  //<Form.Radio>的选中状态（3种确认状态checkStatus）
  const [radioState, setRadioState] = useState("");

  //———————————————————————————————————————————————useEffect
  useEffect(() => {
    setRadioState(props.data.checkStatus);
    setCheckData(props.data);
  }, [props.data]);

  //———————————————————————————————————————————————其他函数
  //根据记录ID和点位ID审核单次巡检记录中的某些点位信息PUT请求
  function checkOneRecordPUT() {
    //————————————————————————————PUT请求
    // 用URLSearchParams来传递参数
    let paramData = new URLSearchParams();
    paramData.append("id", checkData.id.toString()); //记录ID
    paramData.append("meterId", checkData.meterId.toString()); //点位ID
    if (props.batch === false && checkData.checkStatus === "已修改") {
      paramData.append("value", checkData.value.toString()); //识别结果（当checkStatus为已修改并且点位ID为单点位时有效）
    }
    paramData.append("checkStatus", checkData.checkStatus.toString()); //巡检审核状态【"待审核"  "已确认"  "已修改"】
    paramData.append("checkInfo", checkData.checkInfo.toString()); //巡检审核信息
    // paramData.append("meters", checkData.meterId.toString());//HJJ 适配现有的API
    console.log("paramData...........", paramData);
    //发送PUT请求
    putData("/taskTemplates/", paramData)
      // putData("/taskTemplates/" + checkData.id, paramData)//HJJ 适配现有的API
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
          //调用父组件函数（重新GET全部详细点位信息列表并刷新页面）
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

  //根据记录ID和点位ID审核多次巡检记录中的单点位信息PUT请求
  function checkOneMeterPUT() {
    //————————————————————————————PUT请求
    // 用URLSearchParams来传递参数
    let paramData = new URLSearchParams();
    paramData.append("id", checkData.id.toString()); //记录ID
    paramData.append("meterId", checkData.meterId.toString()); //点位ID
    if (props.batch === false && checkData.checkStatus === "已修改") {
      paramData.append("value", checkData.value.toString()); //识别结果（当checkStatus为已修改并且点位ID为单点位时有效）
    }
    paramData.append("checkStatus", checkData.checkStatus.toString()); //巡检审核状态【"待审核"  "已确认"  "已修改"】
    paramData.append("checkInfo", checkData.checkInfo.toString()); //巡检审核信息
    // paramData.append("meters", checkData.meterId.toString());//HJJ 适配现有的API
    console.log("paramData...........", paramData);
    //发送PUT请求
    putData("/taskTemplates/", paramData)
      // putData("/taskTemplates/" + checkData.id, paramData)//HJJ 适配现有的API
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
          //调用父组件函数（重新GET全部详细点位信息列表并刷新页面）
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
      // trigger={
      //   props.batch === true ? (
      //     props.data.meterId === "" ? (
      //       <Button
      //         disabled
      //         // basic
      //         // color="grey"
      //         size="small"
      //         icon="clipboard check"
      //         labelPosition="left"
      //         content="批量审核"
      //       />
      //     ) : (
      //       <Button
      //         // basic
      //         // color="grey"
      //         size="small"
      //         icon="clipboard check"
      //         labelPosition="left"
      //         content="批量审核"
      //       />
      //     )
      //   ) : (
      //     <Tooltip placement="bottom" title="审核巡检点位信息">
      //       <Icon name="clipboard check" />
      //     </Tooltip>
      //   )
      // }
      trigger={
        props.batch === true ? (
          props.type === "oneRecord" ? (
            props.data.meterId === "" ? (
              <Button
                disabled
                // basic
                // color="grey"
                size="small"
                icon="clipboard check"
                labelPosition="left"
                content="批量审核"
              />
            ) : (
              <Button
                // basic
                // color="grey"
                size="small"
                icon="clipboard check"
                labelPosition="left"
                content="批量审核"
              />
            )
          ) : props.data.id === "" ? (
            <Button
              disabled
              // basic
              // color="grey"
              size="small"
              icon="clipboard check"
              labelPosition="left"
              content="批量审核"
            />
          ) : (
            <Button
              // basic
              // color="grey"
              size="small"
              icon="clipboard check"
              labelPosition="left"
              content="批量审核"
            />
          )
        ) : (
          <Tooltip placement="bottom" title="审核巡检点位信息">
            <Icon name="clipboard check" />
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
        <p>
          确认审核记录{"（ID=" + checkData.id + "）"}中的点位
          {"（ID=" + checkData.meterId + "）"}？
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          icon="checkmark"
          content="确认"
          onClick={() => {
            props.type === "oneRecord"
              ? checkOneRecordPUT()
              : checkOneMeterPUT();
          }}
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

export default CheckRecordModal;
