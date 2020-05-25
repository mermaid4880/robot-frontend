//packages
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Modal, Icon, Grid } from "semantic-ui-react";
import { Tooltip, Spin } from "antd";
//images
import ImageBackground from "../../images/PageLogin-bg.png";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "694px",
  },
}));

//———————————————————————————————————————————————全局函数

function MediaModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //———————————————————————————————————————————————事件响应函数

  return (
    <Modal
      className={classes.root}
      open={modalOpen}
      onOpen={() => setModalOpen(true)}
      onClose={() => setModalOpen(false)}
      closeOnDimmerClick={false}
      size={"large"}
      trigger={
        <Tooltip placement="bottom" title="查看结果图片">
          <Icon name="image" />
        </Tooltip>
      }
    >
      <Modal.Header>单点位巡检结果图片</Modal.Header>
      <Modal.Content image scrolling>
        <img
          style={{
            marginLeft: "83px",
            width: "932px",
            height: "524px",
          }}
          src={ImageBackground}
          // src={props.data.mediaUrl}
          alt="巡检结果图片"
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon="cancel"
          content="关闭"
          onClick={() => setModalOpen(false)}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default MediaModal;
