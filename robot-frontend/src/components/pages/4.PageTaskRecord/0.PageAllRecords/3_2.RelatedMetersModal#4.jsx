//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Modal, Grid, Card } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { faVideo as videoIcon } from "@fortawesome/free-solid-svg-icons";
import { Table, Tooltip, Spin } from "antd";
//elements
import MediaModal from "../../../elements/4.MediaModal.jsx";
//functions
import { getData } from "../../../../functions/requestDataFromAPI.js";
//images
import ImageNotFound from "../../../../images/image_not_found.png";
import ImageWaiting from "../../../../images/image_waiting.png";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    // width: "100%",
    width: "120%",
    height: "816px",
  },
  imageStyle: {
    margin: "auto",
    height: "255px",
  },
}));

//———————————————————————————————————————————————Table
// "resultId": 12,					                                   巡检结果ID
// "meterId": 3,                                               点位ID
// "meterName": "北湖#1线冶48",                                 点位名称（检测内容）
// "detectionType": null,                                      识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
// "value": "10",                                              识别结果
// "valuePath": "D:/robot/static/pic/2018-1-1/111/50.jpg",     识别结果图片路径
// "voicePath": null,                                          音频文件路径
// "videoPath": null,                                          视频文件路径
// "vlPath": "D:/robot/static/pic/2018-1-1/111/50.jpg",        可见光图片文件路径（一定有）
// "irPath": null,                                             红外图片文件路径
// "status": "异常",                                           巡检结果【"正常"  "异常"】
// "time": "2018-01-01 01:01:55",                              检测时间
// "checkStatus": null,                                        巡检审核状态【"待审核"  "已确认"  "已修改"】
// "checkInfo": null                                           巡检审核信息

//获取表数据（关联点位巡检记录详情列表的部分数据）
function getTableData(list) {
  var newList = [];
  newList = list.map((item, index) => {
    var newItem = {
      key: "",
      resultId: "", //巡检结果ID
      meterId: "", //点位ID
      meterName: "", //点位名称（检测内容）
      detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
      value: "", //识别结果
      mediaUrl: {
        valuePath: "", //识别结果图片路径
        voicePath: "", //音频文件路径
        videoPath: "", //视频文件路径
        vlPath: "", //可见光图片文件路径（一定有）
        irPath: "", //红外图片文件路径
      },
      time: "", //检测时间
      status: "", //巡检结果【"正常"  "异常"】
    };
    newItem.key = index;
    newItem.resultId = item.resultId;
    newItem.meterId = item.meterId;
    newItem.meterName = item.meterName;
    newItem.detectionType = item.detectionType;
    newItem.value = item.value;
    newItem.mediaUrl.valuePath = item.valuePath;
    newItem.mediaUrl.voicePath = item.voicePath;
    newItem.mediaUrl.videoPath = item.videoPath;
    newItem.mediaUrl.vlPath = item.vlPath;
    newItem.mediaUrl.irPath = item.irPath;
    newItem.time = item.time;
    newItem.status = item.status;
    return newItem;
  });
  console.log("newList", newList);
  return newList;
}

//———————————————————————————————————————————————全局函数
//获取<Card.Group>数据
function getCardGroupData(list) {
  var newList = [];
  newList = list.map((item, index) => {
    var newItem = {
      style: {
        width: "384px",
      },
      //image: ImageBackground,
      header: "检测内容",
      description: "识别结果",
      meta: "检测类型",
    };
    item.mediaUrl.vlPath && (newItem.image = item.mediaUrl.vlPath); //HJJ 原来屏蔽了
    newItem.header = item.resultId + " " + item.meterName;
    newItem.description = "识别结果：" + item.value;
    newItem.meta = item.detectionType;
    return newItem;
  });
  console.log("newList", newList);
  return newList;
}

function RelatedMetersModal(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //本modal是否打开状态
  const [modalOpen, setModalOpen] = useState(false);

  //组件是否需要更新的状态
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

  //<Table>中单行单条巡检记录详情的状态
  const [rowData, setRowData] = useState({
    //点击的行数据
    key: "",
    resultId: "", //巡检结果ID
    meterId: "", //点位ID
    meterName: "", //点位名称（检测内容）
    detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
    value: "", //识别结果
    mediaUrl: {
      valuePath: "", //识别结果图片路径
      voicePath: "", //音频文件路径
      videoPath: "", //视频文件路径
      vlPath: "", //可见光图片文件路径（一定有）
      irPath: "", //红外图片文件路径
    },
    status: "", //巡检结果【"正常"  "异常"】
    time: "", //检测时间
  });

  //<Card.Group>的数据
  const [cardItems, setCardItems] = useState([]);

  //<Card.Group>的宽度
  const [cardGroupWidth, setCardGroupWidth] = useState(0);

  //———————————————————————————————————————————————useEffect
  //当（本modal组件窗口打开时），按巡检结果ID获取关联点位巡检记录详情列表数据
  useEffect(() => {
    //设置Chart数据请求状态为正在请求
    setLoading(true);
    //————————————————————————————GET请求
    // 用URLSearchParams来传递参数
    let paramData = new URLSearchParams();
    paramData.append("resultId", props.data.resultId.toString());
    //发送GET请求
    getData("detectionDatas/relation", { params: paramData })
      .then((data) => {
        console.log("get结果", data);
        if (data.success) {
          var result = data.data.list;
          console.log("result", result);
          //获取表数据
          const tableData = getTableData(result);
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
      })
      .catch((error) => {
        //如果鉴权失败，跳转至登录页
        if (error.response.status === 401) {
          history.push("/");
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
      ellipsis: true,
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
      title: "巡检结果ID",
      dataIndex: "resultId",
      align: "center",
      width: 90,
      ellipsis: true,
    },
    {
      title: "识别结果",
      dataIndex: "value",
      align: "center",
      width: 90,
      ellipsis: true,
    },
    {
      title: "结果详情",
      dataIndex: "mediaUrl",
      key: "mediaUrl",
      align: "center",
      render: (x) => (
        <span className="table-operation">
          {x.vlPath && ( //可见光图片文件路径（一定有）
            <a>
              <MediaModal
                mediaInfo={{
                  meterName: rowData.meterName,
                  mediaType: "可见光图片文件路径（一定有）",
                  mediaUrl: x.vlPath,
                }}
              />
            </a>
          )}
          &nbsp;&nbsp;
          {x.irPath && ( //红外图片文件路径
            <a>
              <MediaModal
                mediaInfo={{
                  meterName: rowData.meterName,
                  mediaType: "红外图片文件路径",
                  mediaUrl: x.irPath,
                }}
              />
            </a>
          )}
          &nbsp;&nbsp;
          {x.valuePath && ( //识别结果图片路径
            <a>
              <MediaModal
                mediaInfo={{
                  meterName: rowData.meterName,
                  mediaType: "识别结果图片路径",
                  mediaUrl: x.valuePath,
                }}
              />
            </a>
          )}
          &nbsp;&nbsp;
          {x.voicePath && ( //音频文件路径
            <a>
              <MediaModal
                mediaInfo={{
                  meterName: rowData.meterName,
                  mediaType: "音频文件路径",
                  mediaUrl: x.voicePath,
                }}
              />
            </a>
          )}
          &nbsp;&nbsp;
          {x.videoPath && ( //视频文件路径
            <a
              href={x.videoPath}
              download="video"
              style={{ color: "#6C6C6C", textDecoration: "none" }}
            >
              <Tooltip placement="bottom" title="查看视频文件">
                <FontAwesomeIcon icon={videoIcon} />
              </Tooltip>
            </a>
          )}
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
    //当前页数
    current: tableState.pageIndex,
    //每页条数
    pageSize: tableState.pageSize,
    //指定每页可以显示多少条
    pageSizeOptions: ["5", "10", "20", "50", "100"],
    //页码改变的回调，参数是改变后的页码及每页条数
    onChange: (pageIndex, pageSize) =>
      handleTablePaginationChange(pageIndex, pageSize, false),
    //pageSize 变化的回调
    onShowSizeChange: (pageIndex, pageSize) =>
      handleTablePaginationChange(pageIndex, pageSize, true),
    //是否展示 pageSize 切换器，当 total 大于 50 时默认为 true
    showSizeChanger: false,
    //数据总数
    total: tableState.tableData.length,
    //用于显示数据总量和当前数据顺序
    showTotal: () => `共${tableState.tableData.length}条`,
    //用于自定义页码的结构，可用于优化 SEO
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
          <FontAwesomeIcon icon={faCodeBranch} />
        </Tooltip>
      }
    >
      <Modal.Header>关联点位巡检记录</Modal.Header>
      <Modal.Content image>
        <Grid centered>
          <Grid.Row>
            <Spin spinning={loading} tip="Loading..." size="large">
              {loading ? ( //Table数据正在请求
                <img
                  className={classes.imageStyle}
                  src={ImageWaiting}
                  alt="加载中"
                />
              ) : (
                <div
                  style={{
                    height: "256px",
                  }}
                >
                  <Table
                    bordered="true" //是否展示外边框和列边框
                    loading={loading} //表格是否加载中
                    size="small" //表格大小
                    columns={columns}
                    dataSource={tableState.tableData}
                    pagination={pagination}
                    onRow={handleTableRowClick}
                  />
                </div>
              )}
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
          content="返回"
          onClick={() => {
            setModalOpen(false);
            //清空<Card.Group>的数据
            setCardItems([]);
          }}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default RelatedMetersModal;
