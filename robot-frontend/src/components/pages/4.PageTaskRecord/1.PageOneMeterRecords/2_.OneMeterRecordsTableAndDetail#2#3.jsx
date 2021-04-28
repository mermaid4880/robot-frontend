//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Paper, Card, CardContent } from "@material-ui/core";
import { Spin, Table } from "antd";
import { Label } from "semantic-ui-react";
//elements
import CheckRecordModal from "../../../elements/2.CheckRecordModal.jsx";
import OneMeterHistoryModal from "../../../elements/3.OneMeterHistoryModal#4.jsx";
import OneMeterRecordsTableQueryForm from "./2_1.OneMeterRecordsTableQueryForm.jsx";
import OneMeterOneRecordDetail from "./2_2.OneMeterOneRecordDetail.jsx";
//functions
import { getData } from "../../../../functions/requestDataFromAPI.js";
import emitter from "../../../../functions/events.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "1430px",
    height: "850px",
  },
  oneMeterRecordsTable: {
    height: "508px",
  },
  tableTitle: {
    width: "1000px",
    display: "inline-block",
    margin: "0px 0px 0px 102px",
    padding: "0px",
    textAlign: "left",
  },
  oneMeterRecordsTableQueryForm: {
    width: "800px",
    margin: "15px 240px 0px 72px",
    display: "inline-block",
  },
  checkRecordModal: {
    width: "180px",
    display: "inline-block",
    marginBottom: "20px",
    verticalAlign: "bottom",
  },
  oneMeterOneRecordDetail: {
    marginTop: "6px",
    height: "330px",
  },
  detailTitle: {
    width: "1000px",
    display: "inline-block",
    margin: "0px 0px 0px 102px",
    verticalAlign: "bottom",
    textAlign: "left",
  },
}));

//———————————————————————————————————————————————Table
// "id": 10,						                                           巡检记录ID
// "taskName": "测试",					                                   任务名称
// "meterCount": 1000,					                                   总巡检点数
// "meterFinishCount": 980,				                                 已完成巡检点数
// "meterAbnormalCount": 10,				                               异常巡检点数
// "startTime": "2018-11-07 15:44:06",			                       巡检开始时间
// "endTime": "2018-11-08 15:44:08",			                         巡检结束时间
// "isFinished": "已完成",				                                 巡检完成状态【"未完成"  "已完成"】
// "meterDetail": {
//     "resultId": 12,					                                   巡检结果ID
//     "meterId": 3,                                               点位ID
//     "meterName": "北湖#1线冶48",                                 点位名称（检测内容）
//     "detectionType": null,                                      识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
//     "value": "10",                                              识别结果
//     "valuePath": "D:/robot/static/pic/2018-1-1/111/50.jpg",     识别结果图片路径
//     "voicePath": null,                                          音频文件路径
//     "videoPath": null,                                          视频文件路径
//     "vlPath": "D:/robot/static/pic/2018-1-1/111/50.jpg",        可见光图片文件路径（一定有）
//     "irPath": null,                                             红外图片文件路径
//     "status": "异常",                                           巡检结果【"正常"  "异常"】
//     "time": "2018-01-01 01:01:55",                              检测时间
//     "checkStatus": null,                                        巡检审核状态【"待审核"  "已确认"  "已修改"】
//     "checkInfo": null                                           巡检审核信息
// }

//获取表数据
function getTableData(list) {
  var newList = [];
  newList = list.map((item, index) => {
    var newItem = {
      key: "",
      //包含该点位的巡检记录信息
      id: "", //巡检记录ID
      taskName: "", //任务名称
      meterCount: "", //总巡检点数
      meterFinishCount: "", //已完成巡检点数
      meterAbnormalCount: "", //异常巡检点数
      startTime: "", //巡检开始时间
      endTime: "", //巡检结束时间
      isFinished: "", //巡检完成状态【"未完成"  "已完成"】
      //该点位的巡检记录详情
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
      checkStatus: "", //巡检审核状态【"待审核"  "已确认"  "已修改"】
      checkInfo: "", //巡检审核信息
    };

    newItem.key = index;
    //包含该点位的巡检记录信息
    newItem.id = item.id;
    newItem.taskName = item.taskName;
    newItem.meterCount = item.meterCount;
    newItem.meterFinishCount = item.meterFinishCount;
    newItem.meterAbnormalCount = item.meterAbnormalCount;
    newItem.startTime = item.startTime;
    newItem.endTime = item.endTime;
    newItem.isFinished = item.isFinished;
    //该点位的巡检记录详情
    newItem.resultId = item.meterDetail.resultId;
    newItem.meterId = item.meterDetail.meterId;
    newItem.meterName = item.meterDetail.meterName;
    newItem.detectionType = item.meterDetail.detectionType;
    newItem.value = item.meterDetail.value;
    newItem.mediaUrl.valuePath = item.meterDetail.valuePath;
    newItem.mediaUrl.voicePath = item.meterDetail.voicePath;
    newItem.mediaUrl.videoPath = item.meterDetail.videoPath;
    newItem.mediaUrl.vlPath = item.meterDetail.vlPath;
    newItem.mediaUrl.irPath = item.meterDetail.irPath;
    newItem.status = item.meterDetail.status;
    newItem.time = item.meterDetail.time;
    newItem.checkStatus = item.meterDetail.checkStatus;
    newItem.checkInfo = item.meterDetail.checkInfo;
    return newItem;
  });
  // console.log("newList", newList);
  return newList;
}

function OneMeterRecordsTableAndDetail() {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //表格数据是否正在请求的状态
  const [loading, setLoading] = useState(false);

  //组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //消息接收到由1.TreeSearch.jsx发来的点位ID
  const [meterId, setMeterId] = useState(null);

  //<Table>的状态
  const [tableState, setTableState] = useState({
    total: 0, //pagination的总条数
    pageIndex: 1, //当前页码
    pageSize: 7, //每页行数
    tableData: [], //全部表数据
    selectedRowKeys: [], //checkbox选中行的key数组
  });

  //<Table>中单行任务信息的状态
  const [rowData, setRowData] = useState({
    //点击的行数据
    key: "",
    id: "", //巡检记录ID
    taskName: "", //任务名称
    meterCount: "", //总巡检点数
    meterFinishCount: "", //已完成巡检点数
    meterAbnormalCount: "", //异常巡检点数
    startTime: "", //巡检开始时间
    endTime: "", //巡检结束时间
    isFinished: "", //巡检完成状态【"未完成"  "已完成"】
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
    checkStatus: "", //巡检审核状态【"待审核"  "已确认"  "已修改"】
    checkInfo: "", //巡检审核信息
  });

  //<Table>中被CheckBox选中的行对应的巡检结果ID用","级联组成的字符串
  const [idString, setIdString] = useState({
    resultIdString: "",
  });

  //GET请求（根据点位ID和时间段获取单点位巡检记录详情列表）所带的参数
  const [queryConditions, setQueryConditions] = useState({
    startTime: "", //检测时间的时间段起点
    endTime: "", //检测时间的时间段终点
  });

  //———————————————————————————————————————————————useEffect
  //当（本组件加载完成或GET请求所带的条件参数发生变化时），添加监听点位ID变化事件、按点位ID和时间段获取单点位巡检记录详情列表数据
  useEffect(() => {
    //————————————————————————————添加监听事件
    emitter.addListener("updateOneMeterRecordsTable", (message) => {
      //如果由1.TreeSearch.jsx发来的点位ID发生了变化
      if (message !== meterId) {
        setMeterId(message);
        setUpdate(!update);
        //发送事件到2_2.OneMeterOneRecordDetail.jsx中（清空详情）
        emitter.emit("emptyOneMeterOneRecordDetail");
        //清空rowData
        setRowData({
          key: "",
          id: "", //巡检记录ID
          taskName: "", //任务名称
          meterCount: "", //总巡检点数
          meterFinishCount: "", //已完成巡检点数
          meterAbnormalCount: "", //异常巡检点数
          startTime: "", //巡检开始时间
          endTime: "", //巡检结束时间
          isFinished: "", //巡检完成状态【"未完成"  "已完成"】
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
          checkStatus: "", //巡检审核状态【"待审核"  "已确认"  "已修改"】
          checkInfo: "", //巡检审核信息
        });
      }
    });
    //如果存在点位ID
    if (meterId) {
      //设置表格数据请求状态为正在请求
      setLoading(true);
      //设置<Table>中被CheckBox选中的行对应的巡检结果ID用","级联组成的字符串
      setIdString({
        resultIdString: "",
      });
      //————————————————————————————GET请求
      //用URLSearchParams来传递参数
      let paramData = new URLSearchParams();
      paramData.append("pageNum", tableState.pageIndex);
      paramData.append("pageSize", tableState.pageSize);
      paramData.append("id", meterId.toString());
      queryConditions.startTime &&
        paramData.append("startTime", queryConditions.startTime);
      queryConditions.endTime &&
        paramData.append("endTime", queryConditions.endTime);
      //发送GET请求
      getData("detections/bymeter", { params: paramData })
        .then((data) => {
          // console.log("get结果", data);
          if (data.success) {
            var total = data.data.total;
            var pageIndex = data.data.pageNum;
            var pageSize = data.data.pageSize;
            var result = data.data.list;
            // console.log(
            //   "total",
            //   total,
            //   "pageIndex",
            //   pageIndex,
            //   "pageSize",
            //   pageSize,
            //   "result",
            //   result
            // );
            //获取单点位巡检记录详情列表数据
            const tableData = getTableData(result);
            //设置<Table>的状态（更新pagination的总条数、当前页码、每页行数、全部表数据、checkbox选中行的key数组））
            setTableState((prev) => ({
              total: total,
              pageIndex: pageIndex,
              pageSize: pageSize,
              tableData: tableData,
              selectedRowKeys: [],
            }));
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
    }
  }, [update, queryConditions]);

  //———————————————————————————————————————————————设置<Table>用到的变量
  //<Table>中columns的配置描述
  const columns = [
    {
      title: "记录ID",
      dataIndex: "id",
      align: "center",
      width: 80,
      ellipsis: true,
    },
    {
      title: "任务名称",
      dataIndex: "taskName",
      align: "center",
      width: 450,
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
      width: 140,
      ellipsis: true,
    },
    {
      title: "巡检结果",
      dataIndex: "status",
      align: "center",
      width: 140,
      ellipsis: true,
    },
    {
      title: "检测时间",
      dataIndex: "time",
      align: "center",
      width: 160,
      ellipsis: true,
    },
    {
      title: "审核状态",
      dataIndex: "checkStatus",
      align: "center",
      width: 140,
      ellipsis: true,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      width: 120,
      render: () => (
        <span className="table-operation">
          <a>
            <OneMeterHistoryModal
              data={{
                meterId: rowData.meterId,
                resultId: rowData.resultId,
              }}
            />
          </a>
          &nbsp;&nbsp;
          <a>
            <CheckRecordModal
              batch={false}
              data={{
                resultId: rowData.resultId,
                value: rowData.value,
                checkStatus: rowData.checkStatus,
                checkInfo: rowData.checkInfo,
              }}
              updateParent={() => {
                console.log("updateParent!");
                setUpdate(!update);
              }}
            />
          </a>
        </span>
      ),
    },
  ];

  //<Table>中rowSelection的配置描述（indicates the need for row selection）
  const rowSelection = {
    //自定义选择项 配置项, 设为 true 时使用默认选择项
    // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
    //指定选中项的 key 数组，需要和 onChange 进行配合
    selectedRowKeys: tableState.selectedRowKeys,
    //选中项发生变化时的回调
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      //设置<Table>的状态（更新checkbox选中行的key数组）
      setTableState((prev) => ({
        total: prev.total,
        pageIndex: prev.pageIndex,
        pageSize: prev.pageSize,
        tableData: prev.tableData,
        selectedRowKeys: selectedRowKeys,
      }));
      //获取<Table>中被CheckBox选中的行对应的巡检结果ID用","级联组成的字符串
      let resultIdString = "";
      let arrayResultID = [];
      selectedRows.forEach((item) => {
        arrayResultID.push(item.resultId);
        resultIdString = arrayResultID.join(",");
        console.log("arrayResultID", arrayResultID);
        console.log("resultIdString", resultIdString);
      });
      //设置<Table>中被CheckBox选中的行对应的巡检结果ID用","级联组成的字符串
      setIdString({
        resultIdString: resultIdString,
      });
    },
  };

  //<Table>中pagination的配置描述
  const pagination = {
    //当前页数
    current: tableState.pageIndex,
    //每页条数
    pageSize: tableState.pageSize,
    //指定每页可以显示多少条
    // pageSizeOptions: ["5", "10", "20", "50", "100"],
    //页码改变的回调，参数是改变后的页码及每页条数
    onChange: (pageIndex, pageSize) =>
      handleTablePaginationChange(pageIndex, pageSize, false),
    //pageSize 变化的回调
    onShowSizeChange: (pageIndex, pageSize) =>
      handleTablePaginationChange(pageIndex, pageSize, true),
    //是否展示 pageSize 切换器，当 total 大于 50 时默认为 true
    showSizeChanger: false,
    //数据总数
    total: tableState.total,
    //用于显示数据总量和当前数据顺序
    showTotal: () => `共${tableState.total}条`,
    //用于自定义页码的结构，可用于优化 SEO
    itemRender: itemRender,
  };

  //定义<Table>中pagination的配置描述项itemRender（自定义页码的结构，如设置<Table>上一页、下一页）
  function itemRender(current, type, originalElement) {
    if (type === "prev") {
      return <a>上一页</a>;
    }
    if (type === "next") {
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      return <a onClick={() => handleTableNextPageClick()}>下一页</a>;
    }
    return originalElement;
  }

  //———————————————————————————————————————————————事件响应函数
  //获取<Table>中pagination变化事件响应函数(pageIndex: 当前页码，pageSize：每页行数，backToPage1：是否跳回第一页)
  function handleTablePaginationChange(pageIndex, pageSize, backToPage1) {
    // console.log("当前页码：", pageIndex, "每页行数：", pageSize);
    //如果改变了每页的条数，就让它跳到第一页
    if (backToPage1) {
      pageIndex = 1;
    }
    //设置<Table>的状态（更新当前页码、每页行数、checkbox选中行的key数组）
    setTableState((prev) => ({
      total: prev.total,
      pageIndex: pageIndex,
      pageSize: pageSize,
      tableData: prev.tableData,
      selectedRowKeys: [],
    }));
    //设置<Table>中被CheckBox选中的行对应的巡检结果ID用","级联组成的字符串为空
    setIdString("");
    //重新请求当前页巡检结果记录数据
    setUpdate(!update);
  }

  //点击<Table>中下一页的事件响应函数（因为分页请求数据导致pagination变化事件响应函数并不响应下一页）
  function handleTableNextPageClick() {
    //设置<Table>的状态（更新当前页码、每页行数、checkbox选中行的key数组）
    setTableState((prev) => ({
      total: prev.total,
      pageIndex: parseInt(prev.pageIndex) + 1, //下一页
      pageSize: prev.pageSize,
      tableData: prev.tableData,
      selectedRowKeys: [],
    }));
    //设置<Table>中被CheckBox选中的行对应的巡检记录ID用","级联组成的字符串为空
    setIdString("");
    //重新请求当前页巡检结果记录数据
    setUpdate(!update);
  }

  //<Table>中的行点击事件响应函数
  function handleTableRowClick(row) {
    return {
      onClick: (event) => {
        console.log("event", event, "row", row);
        setRowData(row);
      }, // 点击行
      onDoubleClick: (event) => {},
      onContextMenu: (event) => {},
      onMouseEnter: (event) => {}, // 鼠标移入行
      onMouseLeave: (event) => {},
    };
  }

  return (
    <div className={classes.root}>
      <Card className={classes.oneMeterRecordsTable} raised>
        <CardContent>
          <Typography className={classes.label} color="textSecondary">
            <Label color="teal" ribbon>
              巡检记录列表（包含该点位）
            </Label>
            <div className={classes.tableTitle}>
              <h5>
                {tableState.tableData[0] &&
                  "点位" +
                    meterId +
                    " \xa0\xa0\xa0\xa0" +
                    tableState.tableData[0].meterName +
                    "（" +
                    tableState.tableData[0].detectionType +
                    "）"}
              </h5>
            </div>
          </Typography>
          <Typography>
            <div className={classes.oneMeterRecordsTableQueryForm}>
              <OneMeterRecordsTableQueryForm
                //将由1.TreeSearch.jsx发来的点位ID传递给子组件2_1.OneMeterRecordsTableQueryForm.jsx，用于清空查询条件
                meterId={meterId}
                //将子组件2_1.OneMeterRecordsTableQueryForm.jsx中的用户输入数据导出，用于设置GET请求的参数和<Table>的状态
                exportData={(input) => {
                  //设置GET请求（根据点位ID和时间段获取单点位巡检记录详情列表）所带的参数
                  // console.log("OneMeterRecordsTableQueryForm output：", input);
                  setQueryConditions(input);
                  //设置<Table>的状态（设置当前页码为第1页、清空checkbox选中行的key数组）
                  setTableState((prev) => ({
                    total: prev.total,
                    pageIndex: 1, //设置当前页码为第1页
                    pageSize: prev.pageSize,
                    tableData: prev.tableData,
                    selectedRowKeys: [], //清空checkbox选中行的key数组
                  }));
                }}
              />
            </div>
            <div className={classes.checkRecordModal}>
              <CheckRecordModal
                batch={true}
                data={{
                  resultId: idString.resultIdString,
                  value: "",
                  checkStatus: "",
                  checkInfo: "",
                }}
                updateParent={() => {
                  console.log("updateParent!");
                  setUpdate(!update);
                }}
              />
            </div>
          </Typography>
          <Spin spinning={loading} tip="Loading..." size="large">
            <Table
              bordered="true" //是否展示外边框和列边框
              loading={loading} //表格是否加载中
              size="small" //表格大小
              columns={columns}
              dataSource={tableState.tableData}
              pagination={pagination}
              scroll={{ y: 280 }}
              onRow={handleTableRowClick}
              rowSelection={{
                //表格行是否可选择，配置项
                type: "checkbox",
                ...rowSelection,
              }}
            />
          </Spin>
        </CardContent>
      </Card>
      <Card className={classes.oneMeterOneRecordDetail} raised>
        <CardContent>
          <Typography className={classes.label} color="textSecondary">
            <Label color="teal" ribbon>
              巡检记录详情（包含该点位）
            </Label>
            <div className={classes.detailTitle}>
              <h5>
                {rowData.taskName &&
                  "记录" +
                    rowData.id +
                    " \xa0\xa0\xa0\xa0" +
                    rowData.taskName +
                    "（巡检结果ID=" +
                    rowData.resultId +
                    "）"}
              </h5>
            </div>
          </Typography>
          <OneMeterOneRecordDetail data={rowData} />
        </CardContent>
      </Card>
    </div>
  );
}

export default OneMeterRecordsTableAndDetail;
