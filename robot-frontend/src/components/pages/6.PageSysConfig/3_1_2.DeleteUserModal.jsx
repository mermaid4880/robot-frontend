//packages
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
}));

function DeleteUserModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //———————————————————————————————————————————————其他函数
  //删除用户PDELETE请求
  function deleteUserDELETE() {
    //————————————————————————————DELETE请求
    //发送DELETE请求
    deleteData("/users/" + props.data.id).then((data) => {
      console.log("delete结果", data);
      if (data.success) {
        //关闭本modal
        setModalOpen(false);
        //alert成功
        swal({
          title: "删除成功",
          text: "用户" + props.data.userName + "删除成功",
          icon: "success",
          timer: 1500,
          buttons: false,
        });
        //调用父组件函数（重新GET用户列表并刷新页面）
        props.updateParent();
        return;
      } else {
        setModalOpen(false);
        //alert失败
        swal({
          title: "删除失败",
          text: data.detail,
          icon: "error",
          timer: 1500,
          buttons: false,
        });
        return;
      }
    });
  }

  return (
    <Modal
      className={classes.root}
      open={modalOpen}
      onOpen={() => setModalOpen(true)}
      onClose={() => setModalOpen(false)}
      dimmer={"inverted"}
      size={"tiny"}
      trigger={<FontAwesomeIcon icon={faTrash} />}
    >
      <Modal.Header>删除用户</Modal.Header>
      <Modal.Content>
        <p>确认删除用户{props.data.userName}？</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          content="确认删除"
          onClick={() => deleteUserDELETE()}
        />
        <Button
          content="取消删除"
          onClick={() => setModalOpen(false)}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteUserModal;
