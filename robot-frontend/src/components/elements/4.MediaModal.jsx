//packages
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Modal } from "semantic-ui-react";
import { Tooltip, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage as hdImageIcon } from "@fortawesome/free-regular-svg-icons";
import { faImage as irImageIcon } from "@fortawesome/free-solid-svg-icons";
import { faPhotoVideo as resultImageIcon } from "@fortawesome/free-solid-svg-icons";
import { faVolumeUp as soundIcon } from "@fortawesome/free-solid-svg-icons";
import { faVideo as videoIcon } from "@fortawesome/free-solid-svg-icons";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  rootImage: {
    width: "100%",
    height: "694px",
  },
  rootSound: {
    width: "100%",
    height: "214px",
  },
}));

function MediaModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //由父组件传来的mediaInfo     eg.mediaInfo：{mediaType:"识别结果图片路径", mediaUrl:rowData.mediaUrl.valuePath}
  const [mediaInfo, setMediaInfo] = useState(props.mediaInfo);

  //<Loader>是否显示
  const [loaderDisplay, setLoaderDisplay] = useState(true);

  //———————————————————————————————————————————————useEffect
  //当（由父组件3_.OneRecordDetailTable#2#3#4.jsx或3_2.RelatedMetersModal#4.jsx传递来的mediaInfo发生变化时），重新设置mediaInfo
  useEffect(() => {
    setMediaInfo(props.mediaInfo);
  }, [props.mediaInfo]);

  //当<Loader>是否显示发生变化时，添加定时器（轮询<img>的加载状态img.complete），如果<img>完成加载则设置<Loader>不显示并销毁定时器
  useEffect(() => {
    //添加定时器（轮询<img>的加载状态img.complete）
    var timerID = setInterval(function () {
      console.log("进入轮询<img>的加载状态定时器----------------ID：", timerID);
      var img = document.getElementById(mediaInfo.mediaUrl);
      if (img) {
        console.log("img.complete", img.complete);
        if (img.complete) {
          //设置<Loader>不显示
          setLoaderDisplay(false);
          console.log("img加载完成，销毁定时器----------------ID：", timerID);
          //销毁定时器
          clearInterval(timerID);
        }
      } else {
        console.log("img不存在，销毁定时器----------------ID：", timerID);
        //销毁定时器
        clearInterval(timerID);
      }
    }, 200);
  }, [modalOpen]);

  //———————————————————————————————————————————————设置<Modal>用到的函数
  //根据不同的mediaType设置相应的触发本modal的小图标
  function setTriggerIcon(mediaType) {
    switch (mediaType) {
      case "可见光图片文件路径（一定有）":
        return (
          <Tooltip placement="bottom" title="查看可见光图片">
            <FontAwesomeIcon icon={hdImageIcon} />
          </Tooltip>
        );
      case "红外图片文件路径":
        return (
          <Tooltip placement="bottom" title="查看红外图片">
            <FontAwesomeIcon icon={irImageIcon} />
          </Tooltip>
        );
      case "识别结果图片路径":
        return (
          <Tooltip placement="bottom" title="查看识别结果图片">
            <FontAwesomeIcon icon={resultImageIcon} />
          </Tooltip>
        );
      case "音频文件路径":
        return (
          <Tooltip placement="bottom" title="查看音频文件">
            <FontAwesomeIcon icon={soundIcon} />
          </Tooltip>
        );
      case "视频文件路径":
        return (
          <Tooltip placement="bottom" title="查看视频文件">
            <FontAwesomeIcon icon={videoIcon} />
          </Tooltip>
        );
      default:
        return null;
    }
  }

  //根据不同的mediaType设置相应的Modal.Header
  function setModalHeader(mediaType, meterName) {
    switch (mediaType) {
      case "可见光图片文件路径（一定有）":
        return "可见光图片（检测内容：" + meterName + "）";
      case "红外图片文件路径":
        return "红外图片（检测内容：" + meterName + "）";
      case "识别结果图片路径":
        return "识别结果图片（检测内容：" + meterName + "）";
      case "音频文件路径":
        return "音频（检测内容：" + meterName + "）";
      case "视频文件路径":
        return "视频（检测内容：" + meterName + "）";
      default:
        return "出错啦！";
    }
  }

  //根据不同的mediaType设置相应的Modal.Content（图片或音频）
  function setModalContent(mediaType) {
    switch (mediaType) {
      case "可见光图片文件路径（一定有）":
      case "红外图片文件路径":
      case "识别结果图片路径":
        return (
          <Spin
            style={{
              marginLeft: "83px",
              width: "932px",
              height: "524px",
            }}
            size="large"
            tip="Loading..."
            spinning={loaderDisplay}
          >
            <img
              id={mediaInfo.mediaUrl ? mediaInfo.mediaUrl : "img"} //给图片添加id（用于获取图片加载状态）
              style={{
                marginLeft: "83px",
                width: "932px",
                height: "524px",
              }}
              src={mediaInfo.mediaUrl}
              alt="巡检结果图片"
            />
          </Spin>
        );
      case "音频文件路径":
        return (
          <embed
            id="sound"
            style={{
              margin: "auto",
            }}
            height="44"
            width="300"
            src={mediaInfo.mediaUrl}
            menu="true"
            loop="false"
            align="center"
            preload="auto"
            autostart="false"
          />
        );
      case "视频文件路径":
        return null;
      default:
        return null;
    }
  }

  return (
    <Modal
      className={
        mediaInfo.mediaType === "音频文件路径"
          ? classes.rootSound
          : classes.rootImage
      }
      open={modalOpen}
      onOpen={() => setModalOpen(true)}
      onClose={() => setModalOpen(false)}
      closeOnDimmerClick={false}
      size={mediaInfo.mediaType === "音频文件路径" ? "small" : "large"}
      trigger={setTriggerIcon(mediaInfo.mediaType)}
    >
      <Modal.Header>
        {setModalHeader(mediaInfo.mediaType, mediaInfo.meterName)}
      </Modal.Header>
      <Modal.Content image scrolling>
        {setModalContent(mediaInfo.mediaType)}
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="返回"
          onClick={() => {
            //关闭本modal
            setModalOpen(false);
            //设置<Loader>显示
            setLoaderDisplay(true);
            //关闭Modal时停止播放音频
            document.getElementById("sound") &&
              document.getElementById("sound").stop();
          }}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default MediaModal;
