//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button1 from "@material-ui/core/Button";
import { Tooltip } from "antd";
import { Button, Modal } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
//functions
import { getData } from "../../../../functions/requestDataFromAPI.js";

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

function DownloadRecordModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //巡检记录的id
  const [recordId, setRecordId] = useState("");

  //———————————————————————————————————————————————useEffect
  //当父组件2_.AllRecordsTable.jsx传入参数recordId后更新巡检记录的id
  useEffect(() => {
    setRecordId(props.recordId);
  }, [props.recordId]);

  //———————————————————————————————————————————————其他函数
  //下载巡检结果记录报表GET请求
  function downloadRecordGET() {
    //————————————————————————————GET请求
    // 用URLSearchParams来传递参数
    let paramData = new URLSearchParams();
    paramData.append("id", recordId.toString());
    //发送GET请求
    getData("/report/bytask", { params: paramData })
      .then((data) => {
        console.log("get结果", data);
        if (data.success) {
          //关闭本modal
          setModalOpen(false);
          //弹出文件下载窗口
          console.log("data.data", data.data);
          const aTag = document.createElement("a");
          aTag.setAttribute("href", "http://" + data.data); //设置下载文件的url地址
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
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
        }
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
            <Button1
              disabled
              variant="contained"
              color="default"
              startIcon={
                <FontAwesomeIcon
                  icon={faDownload}
                  className={classes.startIcon}
                />
              }
            >
              批量下载
            </Button1>
          ) : (
            <Button1
              variant="contained"
              color="default"
              startIcon={
                <FontAwesomeIcon
                  icon={faDownload}
                  className={classes.startIcon}
                />
              }
            >
              批量下载
            </Button1>
          )
        ) : (
          <Tooltip placement="bottom" title="下载巡检记录">
            <FontAwesomeIcon icon={faDownload} />
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
          content="确认下载"
          onClick={() => downloadRecordGET()}
        />
        <Button content="取消下载" onClick={() => setModalOpen(false)} />
      </Modal.Actions>
    </Modal>
  );
}

export default DownloadRecordModal;
