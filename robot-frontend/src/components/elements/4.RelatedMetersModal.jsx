//packages
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Modal, Icon, Grid, Card } from "semantic-ui-react";
import { Table, Tooltip, Spin } from "antd";
//functions
import { getData } from "../../functions/requestDataFromAPI.js";
//elements
import MediaModal from "./5.MediaModal.jsx";
//images
import ImageBackground from "../../images/PageLogin-bg.png";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "816px",
  },
}));

//———————————————————————————————————————————————全局函数
//获取所有数据
function getAllData(list) {
  var newList = [];
  newList = list.map((item, index) => {
    var newItem = {
      key: "",
      meterId: "", //点位ID
      meterName: "", //点位名称（检测内容）
      detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
      value: "", //识别结果
      mediaUrl: "", //图片或音频文件路径
      status: "", //巡检结果【"正常"  "异常"】
      time: "", //检测时间
      checkStatus: "", //巡检审核状态【"待审核"  "已确认"  "已修改"】
      checkInfo: "", //巡检审核信息
    };
    newItem.key = index;
    // newItem.meterId = item.meterDetail.meterId?item.meterDetail.meterId:"";
    // newItem.meterName = item.meterDetail.meterName?item.meterDetail.meterName:"";
    // newItem.detectionType = item.meterDetail.detectionType?item.meterDetail.detectionType:"";
    // newItem.value = item.meterDetail.value?item.meterDetail.value:"";
    // newItem.mediaUrl = item.meterDetail.mediaUrl?item.meterDetail.mediaUrl:"";
    // newItem.status = item.meterDetail.status?item.meterDetail.status:"";
    // newItem.time = item.meterDetail.time?item.meterDetail.time:"";
    // newItem.checkStatus = item.meterDetail.checkStatus?item.meterDetail.checkStatus:"";
    // newItem.checkInfo = item.meterDetail.checkInfo?item.meterDetail.checkInfo:"";
    newItem.meterId = item.meterId; //HJJ 适配旧API
    newItem.meterName =
      item.meterName +
      "1111111111111111111111111111111111111111111111111111111111111112"; //HJJ
    newItem.meterName = item.meterName; //HJJ
    newItem.detectionType = item.detectionType; //HJJ
    newItem.value = item.detectionValue; //HJJ
    newItem.mediaUrl = item.irpath; //HJJ
    newItem.status = item.status; //HJJ
    newItem.time = item.time; //HJJ
    newItem.checkStatus = item.checkStatus; //HJJ
    newItem.checkInfo = item.checkInfo; //HJJ
    // console.log("newItem", newItem);
    return newItem;
  });
  // console.log("newList", newList);
  return newList;
}

// "meterId": 1，				点位ID
// "meterName":"A线路避雷器A相_接头",		点位名称（检测内容）
// "detectionType": "表计读取",			识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
// "value": "36度",				识别结果
// "mediaUrl": "/pic/40.jpg",			图片或音频文件路径
// "time": "2018-10-25 17:36:45",			检测时间
// "status"："正常"				巡检结果【"正常"  "异常"】
//获取<Table>数据
function getTableData(list) {
  var newList = [];
  newList = list.map((item) => {
    var newItem = {
      key: "",
      meterId: "", //点位ID
      meterName: "", //点位名称（检测内容）
      detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
      value: "", //识别结果
      mediaUrl: "", //图片或音频文件路径
      time: "", //检测时间
      status: "", //巡检结果【"正常"  "异常"】
    };
    newItem.key = item.key;
    newItem.meterId = item.meterId;
    newItem.meterName = item.meterName;
    newItem.detectionType = item.detectionType;
    newItem.value = item.value;
    newItem.mediaUrl = item.mediaUrl;
    newItem.time = item.time;
    newItem.status = item.status;
    return newItem;
  });
  console.log("newList", newList);
  return newList;
}

//获取<Card.Group>数据
function getCardGroupData(list) {
  var newList = [];
  newList = list.map((item, index) => {
    var newItem = {
      style: {
        width: "384px",
      },
      image: ImageBackground,
      header: "Project Report - May",
      description:
        "Bring to the table win-win survival strategies to ensure proactive domination.",
      meta: "ROI: 34%",
    };
    //newItem.image = item.mediaUrl;
    newItem.header = item.meterName;
    newItem.description = "识别结果：" + item.value;
    newItem.meta = item.detectionType;
    return newItem;
  });
  console.log("newList", newList);
  return newList;
}

function RelatedMetersModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //页面是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //Table数据是否正在请求的状态
  const [loading, setLoading] = useState(false);

  //<Table>的状态
  const [tableState, setTableState] = useState({
    pageIndex: 1, //当前页码
    pageSize: 4, //每页行数
    tableData: [], //全部表数据
    pageData: [], //当前页表数据
  });

  //<Table>中单行任务信息的状态
  const [rowData, setRowData] = useState({
    //点击的行数据
    key: "",
    meterId: "", //点位ID
    meterName: "", //点位名称（检测内容）
    detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
    value: "", //识别结果
    mediaUrl: "", //图片或音频文件路径
    time: "", //检测时间
    status: "", //巡检结果【"正常"  "异常"】
  });

  //<Card.Group>的数据
  const [cardItems, setCardItems] = useState([]);

  //<Card.Group>的宽度
  const [cardGroupWidth, setCardGroupWidth] = useState(0);

  //———————————————————————————————————————————————useEffect
  useEffect(() => {
    //设置Chart数据请求状态为正在请求
    setLoading(true);
    //————————————————————————————GET请求(GET根据记录ID和单点位ID获取该巡检记录中该点位的关联点位信息列表)
    // 用URLSearchParams来传递参数
    let paramData = new URLSearchParams();
    // paramData.append("id", props.data.id.toString());
    // paramData.append("meterId", props.data.meterId.toString());
    paramData.append("taskID", props.data.id.toString()); //HJJ 适应旧接口测试
    //发送GET请求
    getData("/detectionDatas", { params: paramData }).then((data) => {
      console.log("get结果", data);
      if (data.success) {
        var result = data.data.list;
        console.log("result", result);
        //获取所有数据
        const allData = getAllData(result);
        //获取表数据
        const tableData = getTableData(allData);
        //设置<Table>的状态
        setTableState((prev) => ({
          pageIndex: prev.pageIndex,
          pageSize: prev.pageSize,
          tableData: tableData,
          pageData: tableData.slice(
            (prev.pageIndex - 1) * prev.pageSize,
            prev.pageIndex * prev.pageSize
          ),
        }));
        //获取并设置<Card.Group>数据
        const cardGroupData = getCardGroupData(tableData);
        setCardItems(cardGroupData);
        //设置<Card.Group>和其所在<div>的宽度
        setCardGroupWidth(cardGroupData.length * 400);
        //设置表格数据请求状态为完成
        setLoading(false);
      } else {
        alert(data.data.detail);
      }
    });
  }, [update]);

  //———————————————————————————————————————————————设置<Table>用到的变量
  //<Table>中columns的配置描述
  const columns = [
    {
      title: "点位ID",
      dataIndex: "meterId",
      align: "center",
      width: 60,
    },
    {
      title: "检测内容",
      dataIndex: "meterName",
      align: "center",
      width: 350,
      ellipsis: true,
    },
    {
      title: "识别类型",
      dataIndex: "detectionType",
      align: "center",
      width: 150,
      ellipsis: true,
    },

    {
      title: "识别结果",
      dataIndex: "value",
      align: "center",
      width: 150,
      ellipsis: true,
    },
    {
      title: "结果路径",
      dataIndex: "mediaUrl",
      key: "mediaUrl",
      align: "center",
      width: 80,
      render: (x) => (
        <span className="table-operation">
          <a>
            <MediaModal
              data={{
                detectionType: rowData.detectionType,
                mediaUrl: rowData.mediaUrl,
              }}
            />
          </a>
        </span>
      ),
    },
    {
      title: "检测时间",
      dataIndex: "time",
      align: "center",
      width: 160,
    },
    {
      title: "巡检结果",
      dataIndex: "status",
      align: "center",
      width: 80,
    },
  ];

  //<Table>设置上一页、下一页
  function itemRender(current, type, originalElement) {
    if (type === "prev") {
      return <a>上一页</a>;
    }
    if (type === "next") {
      return <a>下一页</a>;
    }
    return originalElement;
  }

  //<Table>中pagination的配置描述
  const pagination = {
    pageIndex: tableState.pageIndex,
    pageSize: tableState.pageSize,
    pageSizeOptions: ["5", "10", "20", "50", "100"],
    onChange: (pageIndex, pageSize) =>
      handleTablePaginationChange(pageIndex, pageSize, false), // 页码改变的回调
    onShowSizeChange: (pageIndex, pageSize) =>
      handleTablePaginationChange(pageIndex, pageSize, true), //pageSize 变化的回调
    showSizeChanger: false,
    showTotal: (total, range) => `共${total}条`,
    itemRender: itemRender,
  };

  //———————————————————————————————————————————————事件响应函数
  //获取<Table>中pagination变化事件响应函数(pageIndex: 当前页码，pageSize：每页行数，backToPage1：是否跳回第一页)
  function handleTablePaginationChange(pageIndex, pageSize, backToPage1) {
    console.log("当前页码：", pageIndex, "每页行数：", pageSize);
    // 如果改变了每页的条数，就让它跳到第一页
    if (backToPage1) {
      pageIndex = 1;
    }
    // 只展示当前页的数据
    const pageData = tableState.tableData.slice(
      (pageIndex - 1) * pageSize,
      pageIndex * pageSize
    );
    console.log("当前页表数据：", pageData);
    setTableState((prev) => ({
      pageIndex: pageIndex,
      pageSize: pageSize,
      tableData: prev.tableData,
      pageData: pageData,
    }));
  }

  //<Table>中的行点击事件响应函数
  function handleTableRowClick(row) {
    return {
      onClick: (event) => {
        console.log("event", event, "row", row);
        setRowData(row);
      }, // 单击行
      onDoubleClick: (event) => {},
      onContextMenu: (event) => {},
      onMouseEnter: (event) => {}, // 鼠标移入行
      onMouseLeave: (event) => {},
    };
  }

  return (
    <Modal
      className={classes.root}
      open={modalOpen}
      onOpen={() => {
        setModalOpen(true);
        setUpdate(!update);
      }}
      onClose={() => setModalOpen(false)}
      closeOnDimmerClick={false}
      size="large"
      trigger={
        <Tooltip placement="bottom" title="查看关联点位巡检记录">
          <Icon name="code branch" />
        </Tooltip>
      }
    >
      <Modal.Header>关联点位巡检记录</Modal.Header>
      <Modal.Content image>
        <Grid centered>
          <Grid.Row>
            <Spin spinning={loading} tip="Loading..." size="large">
              <div
                style={{
                  height: "256px",
                }}
              >
                <Table
                  bordered="true" //是否展示外边框和列边框
                  loading={loading} //页面是否加载中
                  size="small" //表格大小
                  columns={columns}
                  dataSource={tableState.tableData}
                  pagination={pagination}
                  onRow={handleTableRowClick}
                />
              </div>
            </Spin>
          </Grid.Row>
          <Grid.Row>
            <div
              style={{
                overflow: "auto",
                width: cardGroupWidth,
                height: "360px",
              }}
            >
              <Card.Group
                centered
                items={cardItems}
                style={{ width: cardGroupWidth }}
              />
            </div>
          </Grid.Row>
        </Grid>
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

export default RelatedMetersModal;
