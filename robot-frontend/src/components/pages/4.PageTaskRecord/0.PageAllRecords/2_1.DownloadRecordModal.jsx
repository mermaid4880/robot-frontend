//packages
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from "antd";
import { Button, Modal, Icon } from "semantic-ui-react";
import swal from "sweetalert";
//functions
import { getData } from "../../../../functions/requestDataFromAPI.js";
import { postData } from "../../../../functions/requestDataFromAPI.js"; //HJJ 测试旧API

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "185px",
  },
}));

function DownloadRecordModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //巡检记录的id
  const [recordId, setRecordId] = useState("");

  //———————————————————————————————————————————————useEffect
  useEffect(() => {
    setRecordId(props.recordId);
  }, [props.recordId]);

  //———————————————————————————————————————————————其他函数
  //下载巡检结果记录报表GET请求
  function downloadRecordGET() {
    //————————————————————————————GET请求
    // 用URLSearchParams来传递参数
    let paramData = new URLSearchParams();
    // paramData.append("id", recordId.toString());
    paramData.append(
      "fields",
      "area,meterType,meterName,deviceType,detectionValue,detectionStatus,time,temperature,VLPath"
    ); //HJJ 测试旧API
    paramData.append("taskId", recordId.toString()); //HJJ 测试旧API
    // getData("/report/task", paramData);
    postData("/report/task", paramData) //HJJ 测试旧API
      .then((data) => {
        console.log("get结果", data);
        if (data.success) {
          //关闭本modal
          setModalOpen(false);
          //弹出文件下载窗口
          const aTag = document.createElement("a");
          aTag.setAttribute("href", data.data); //设置下载文件的url地址
          aTag.click();
        } else {
          //关闭本modal
          setModalOpen(false);
          //alert失败
          swal({
            title: "下载巡检结果记录报表失败",
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
          title: "下载巡检结果记录报表失败",
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
          props.recordId === "" ? (
            <Button
              disabled
              // basic
              // color="grey"
              size="small"
              icon="download"
              labelPosition="left"
              content="批量下载"
            />
          ) : (
            <Button
              // basic
              // color="grey"
              size="small"
              icon="download"
              labelPosition="left"
              content="批量下载"
            />
          )
        ) : (
          <Tooltip placement="bottom" title="下载巡检记录">
            <Icon name="download" />
          </Tooltip>
        )
      }
    >
      <Modal.Header>下载巡检记录</Modal.Header>
      <Modal.Content>
        <p>确认下载巡检记录{"（ID=" + recordId + "）"}？</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          icon="checkmark"
          content="确认下载"
          onClick={() => downloadRecordGET()}
        />
        <Button
          icon="cancel"
          content="取消下载"
          onClick={() => setModalOpen(false)}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default DownloadRecordModal;
