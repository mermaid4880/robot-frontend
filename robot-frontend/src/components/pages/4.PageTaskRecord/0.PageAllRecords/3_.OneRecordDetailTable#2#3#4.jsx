//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardContent } from "@material-ui/core";
import { Spin, Table, Tooltip } from "antd";
import { Label } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo as videoIcon } from "@fortawesome/free-solid-svg-icons";
//elements
import CheckRecordModal from "../../../elements/2.CheckRecordModal.jsx";
import OneMeterHistoryModal from "../../../elements/3.OneMeterHistoryModal#4.jsx";
import MediaModal from "../../../elements/4.MediaModal.jsx";
import OneRecordDetailTableQueryForm from "./3_1.OneRecordDetailTableQueryForm.jsx";
import RelatedMetersModal from "./3_2.RelatedMetersModal#4.jsx";
//functions
import { getData } from "../../../../functions/requestDataFromAPI.js";
import emitter from "../../../../functions/events.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "430px",
    margin: "7px 10px 0px 10px",
    overflow: "auto",
  },
  label: {
    fontSize: 14,
  },
  oneRecordDetailTableQueryForm: {
    width: "1340px",
    margin: "8px 260px 0px 52px",
    display: "inline-block",
  },
  checkRecordModal: {
    width: "180px",
    display: "inline-block",
    marginBottom: "20px",
    verticalAlign: "bottom",
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

//获取表数据
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
      status: "", //巡检结果【"正常"  "异常"】
      time: "", //检测时间
      checkStatus: "", //巡检审核状态【"待审核"  "已确认"  "已修改"】
      checkInfo: "", //巡检审核信息
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
    newItem.status = item.status;
    newItem.time = item.time;
    newItem.checkStatus = item.checkStatus;
    newItem.checkInfo = item.checkInfo;
    return newItem;
  });
  // console.log("newList", newList);
  return newList;
}

function OneRecordDetailTable() {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //表格数据是否正在请求的状态
  const [loading, setLoading] = useState(false);

  //组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //消息接收到由2_.AllRecordsTable.jsx发来的巡检记录ID
  const [recordId, setRecordId] = useState(null);

  //<Table>的状态
  const [tableState, setTableState] = useState({
    total: 0, //pagination的总条数
    pageIndex: 1, //当前页码
    pageSize: 5, //每页行数
    tableData: [], //全部表数据
    selectedRowKeys: [], //checkbox选中行的key数组
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
    checkStatus: "", //巡检审核状态【"待审核"  "已确认"  "已修改"】
    checkInfo: "", //巡检审核信息
  });

  //<Table>中被CheckBox选中的行对应的巡检结果ID用","级联组成的字符串
  const [idString, setIdString] = useState({
    resultIdString: "",
  });

  //GET请求（按巡检记录ID和条件获取单条巡检记录详情列表）所带的参数
  const [queryConditions, setQueryConditions] = useState({
    startTime: "", //检测时间的时间段起点
    endTime: "", //检测时间的时间段终点
    meterName: "", //关键字（检测内容模糊查询）
    detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
    status: "", //巡检结果【"正常"  "异常"】
    checkStatus: "", //巡检审核状态【"待审核"  "已确认"  "已修改"】
  });

  //———————————————————————————————————————————————useEffect
  //当（本组件加载完成、需要刷新或GET请求所带的条件参数发生变化时），添加监听巡检记录ID变化事件、按巡检记录ID和条件获取单条巡检记录详情列表数据
  useEffect(() => {
    //————————————————————————————添加监听事件
    emitter.addListener("updateOneRecordDetailTable", (message) => {
      //如果由2_.AllRecordsTable.jsx发来的巡检记录ID发生了变化
      if (message !== recordId) {
        setRecordId(message);
        setUpdate(!update);
      }
    });
    //如果存在巡检记录ID
    if (recordId) {
      //设置表格数据请求状态为正在请求
      setLoading(true);
      //设置<Table>中被CheckBox选中的行对应的巡检结果ID用","级联组成的字符串
      setIdString({
        resultIdString: "",
      });
      //————————————————————————————GET请求
      // 用URLSearchParams来传递参数
      let paramData = new URLSearchParams();
      paramData.append("pageNum", tableState.pageIndex);
      paramData.append("pageSize", tableState.pageSize);
      paramData.append("id", recordId.toString());
      queryConditions.startTime &&
        paramData.append("startTime", queryConditions.startTime);
      queryConditions.endTime &&
        paramData.append("endTime", queryConditions.endTime);
      queryConditions.meterName &&
        paramData.append("meterName", queryConditions.meterName);
      queryConditions.detectionType &&
        paramData.append("detectionType", queryConditions.detectionType);
      queryConditions.status &&
        paramData.append("status", queryConditions.status);
      queryConditions.checkStatus &&
        paramData.append("checkStatus", queryConditions.checkStatus);
      //发送GET请求
      getData("detections/bytask", { params: paramData })
        .then((data) => {
          // console.log("get结果", data);
          if (data.success) {
            var total = data.data.list.total;
            var pageIndex = data.data.list.pageNum;
            var pageSize = data.data.list.pageSize;
            var result = data.data.list.list;
            // console.log("result", result);
            //获取单条巡检记录详情列表数据
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
      title: "点位ID",
      dataIndex: "meterId",
      align: "center",
      width: 80,
      ellipsis: true,
    },
    {
      title: "检测内容", //点位名称
      dataIndex: "meterName",
      align: "center",
      width: 500,
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
      width: 130,
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
      title: "巡检结果",
      dataIndex: "status",
      align: "center",
      width: 90,
      ellipsis: true,
    },
    {
      title: "检测时间",
      dataIndex: "time",
      align: "center",
      width: 200,
    },
    {
      title: "审核状态",
      dataIndex: "checkStatus",
      align: "center",
      width: 100,
    },
    {
      title: "审核信息",
      dataIndex: "checkInfo",
      align: "center",
      width: 130,
      ellipsis: true,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: "center",
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
            <RelatedMetersModal
              data={{
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
    setIdString({
      resultIdString: "",
    });
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
    //设置<Table>中被CheckBox选中的行对应的巡检结果ID用","级联组成的字符串为空
    setIdString({
      resultIdString: "",
    });
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
    <Card className={classes.root} raised>
      <CardContent>
        <Typography className={classes.label} color="textSecondary">
          <Label color="teal" ribbon>
            单条巡检记录详情
          </Label>
        </Typography>
        <Typography>
          <div className={classes.oneRecordDetailTableQueryForm}>
            <OneRecordDetailTableQueryForm
              //将由2_.AllRecordsTable.jsx发来的巡检记录ID传递给子组件3_1.OneRecordDetailTableQueryForm.jsx，用于清空子组件的查询条件
              recordId={recordId}
              //将子组件3_1.OneRecordDetailTableQueryForm.jsx中的用户输入数据导出，用于设置GET请求的参数和<Table>的状态
              exportData={(input) => {
                //设置GET请求（按巡检记录ID和条件获取单条巡检记录详情列表）所带的参数
                // console.log("OneRecordDetailTableQueryForm output：", input);
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
            scroll={{ y: 181 }}
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
  );
}

export default OneRecordDetailTable;
