//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardContent } from "@material-ui/core";
import { Spin, Table, Tooltip } from "antd";
import { Label } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";
//elements
import AllRecordsTableQueryForm from "./2_1.AllRecordsTableQueryForm.jsx";
import DownloadRecordModal from "./2_2.DownloadRecordModal.jsx";
//functions
import { getData } from "../../../../functions/requestDataFromAPI.js";
import emitter from "../../../../functions/events.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0px 10px 0px 10px",
    width: "100%",
    height: "410px",
    overflow: "auto",
  },
  label: {
    fontSize: 14,
  },
  allRecordsTableQueryForm: {
    margin: "8px 100px 0px 52px",
    width: "1500px",
    display: "inline-block",
  },
  downloadRecordModal: {
    marginBottom: "20px",
    width: "180px",
    display: "inline-block",
    verticalAlign: "bottom",
  },
}));

//———————————————————————————————————————————————Table
// "id": 1,                                    巡检记录ID
// "taskName": "测试",                         任务名称
// "meterCount": 1000,                         总巡检点数
// "meterFinishCount": 980,                    已完成巡检点数
// "meterAbnormalCount": 10,                   异常巡检点数
// "startTime": "2018-11-07 15:44:06",         巡检开始时间
// "endTime": "2018-11-08 15:44:08",           巡检结束时间
// "isFinished": "完成",                       巡检完成状态【"未完成"  "完成"】

//获取表数据
function getTableData(list) {
  var newList = [];
  newList = list.map((item, index) => {
    var newItem = {
      key: "",
      id: "", //巡检记录ID
      taskName: "", //任务名称
      meterCount: "", //总巡检点数
      meterFinishCount: "", //已完成巡检点数
      meterAbnormalCount: "", //异常巡检点数
      startTime: "", //巡检开始时间
      endTime: "", //巡检结束时间
      isFinished: "", //巡检完成状态【"未完成"  "完成"】
    };
    newItem.key = index;
    newItem.id = item.id;
    newItem.taskName = item.taskName;
    newItem.meterCount = item.meterCount;
    newItem.meterFinishCount = item.meterFinishCount;
    newItem.meterAbnormalCount = item.meterAbnormalCount;
    newItem.startTime = item.startTime;
    newItem.endTime = item.endTime;
    newItem.isFinished = item.isFinished;
    return newItem;
  });
  // console.log("newList", newList);
  return newList;
}

function AllRecordsTable() {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //表格数据是否正在请求的状态
  const [loading, setLoading] = useState(false);

  //组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //<Table>的状态
  const [tableState, setTableState] = useState({
    total: 0, //pagination的总条数
    pageIndex: 1, //当前页码
    pageSize: 8, //每页行数
    tableData: [], //全部表数据
    selectedRowKeys: [], //checkbox选中行的key数组
  });

  //<Table>中单行巡检记录的状态
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
    isFinished: "", //巡检完成状态【"未完成"  "完成"】
  });

  //<Table>中被CheckBox选中的行对应的巡检记录ID用","级联组成的字符串
  const [idString, setIdString] = useState("");

  //GET请求（按条件获取巡检记录列表）所带的参数
  const [queryConditions, setQueryConditions] = useState({
    startTime: "", //巡检开始时间的时间段起点
    endTime: "", //巡检开始时间的时间段终点
    taskName: "", //关键字（任务名称模糊查询）
    isFinished: "", //巡检完成状态【"未完成"  "完成"】
  });

  //———————————————————————————————————————————————useEffect
  //当（本组件加载完成或GET请求所带的条件参数发生变化时），按条件获取巡检记录列表数据
  useEffect(() => {
    //设置表格数据请求状态为正在请求
    setLoading(true);
    //————————————————————————————GET请求
    //用URLSearchParams来传递参数
    let paramData = new URLSearchParams();
    paramData.append("pageNum", tableState.pageIndex);
    paramData.append("pageSize", tableState.pageSize);
    queryConditions.startTime &&
      paramData.append("startTime", queryConditions.startTime);
    queryConditions.endTime &&
      paramData.append("endTime", queryConditions.endTime);
    queryConditions.taskName &&
      paramData.append("taskName", queryConditions.taskName);
    queryConditions.isFinished &&
      paramData.append("isFinished", queryConditions.isFinished);
    //发送GET请求
    getData("taskFinish/search/conditions", { params: paramData })
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
          //获取巡检记录列表数据
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
      width: 500,
      ellipsis: true,
    },
    {
      title: "总巡检点数",
      dataIndex: "meterCount",
      align: "center",
      width: 130,
      ellipsis: true,
    },

    {
      title: "已完成巡检点数",
      dataIndex: "meterFinishCount",
      align: "center",
      width: 130,
      ellipsis: true,
    },
    {
      title: "异常巡检点数",
      dataIndex: "meterAbnormalCount",
      align: "center",
      width: 130,
      ellipsis: true,
    },
    {
      title: "巡检开始时间",
      dataIndex: "startTime",
      align: "center",
      width: 200,
    },
    {
      title: "巡检结束时间",
      dataIndex: "endTime",
      align: "center",
      width: 200,
    },
    {
      title: "巡检完成状态",
      dataIndex: "isFinished",
      align: "center",
      width: 150,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      render: (text, record, index) => (
        <span className="table-operation">
          <a>
            <Tooltip placement="bottom" title="查看该条巡检记录详情">
              <FontAwesomeIcon
                icon={faListUl}
                onClick={() => {
                  //发送事件到3_.OneRecordDetailTable#2#3#4.jsx中（重新根据记录ID获取该巡检记录全部详细点位信息列表并刷新）
                  emitter.emit("updateOneRecordDetailTable", record.id);
                }}
              />
            </Tooltip>
          </a>
          &nbsp;&nbsp;
          <a>
            <DownloadRecordModal batch={false} recordId={rowData.id} />
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
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
      //设置<Table>的状态（更新checkbox选中行的key数组）
      setTableState((prev) => ({
        total: prev.total,
        pageIndex: prev.pageIndex,
        pageSize: prev.pageSize,
        tableData: prev.tableData,
        selectedRowKeys: selectedRowKeys,
      }));
      //获取<Table>中被CheckBox选中的行对应的巡检记录ID用","级联组成的字符串
      let IDstring = "";
      let arrayID = [];
      selectedRows.forEach((item) => {
        arrayID.push(item.id);
        // console.log("arrayID", arrayID);
        IDstring = arrayID.join(",");
        // console.log("IDstring", IDstring);
      });
      //设置<Table>中被CheckBox选中的行对应的巡检记录ID用","级联组成的字符串
      setIdString(IDstring);
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
    //设置<Table>中被CheckBox选中的行对应的巡检记录ID用","级联组成的字符串为空
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
        //发送事件到3_.OneRecordDetailTable#2#3#4.jsx中（重新根据记录ID获取该巡检记录全部详细点位信息列表并刷新）
        emitter.emit("updateOneRecordDetailTable", row.id);
      }, // 单击行
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
            全部巡检记录列表
          </Label>
        </Typography>
        <Typography>
          <div className={classes.allRecordsTableQueryForm}>
            <AllRecordsTableQueryForm
              //将子组件2_1.AllRecordsTableQueryForm.jsx中的用户输入数据导出，用于设置GET请求的参数和<Table>的状态
              exportData={(input) => {
                //设置GET请求（根据条件获取巡检结果记录列表）所带的参数
                // console.log("AllRecordsTableQueryForm output：", input);
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
          <div className={classes.downloadRecordModal}>
            <DownloadRecordModal batch={true} recordId={idString} />
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
            scroll={{ y: 182 }}
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

export default AllRecordsTable;
