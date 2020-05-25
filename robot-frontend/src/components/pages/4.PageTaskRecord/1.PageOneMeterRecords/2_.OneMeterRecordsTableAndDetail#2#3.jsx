//packages
import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Paper, Card, CardContent } from "@material-ui/core";
import { Spin, Table, Tooltip, Input, Button, Space, DatePicker } from "antd";
import { SearchOutlined, FilterFilled } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Label } from "semantic-ui-react";
//elements
import CheckRecordModal from "../../../elements/2.CheckRecordModal.jsx";
import OneMeterHistoryModal from "../../../elements/3.OneMeterHistoryModal.jsx";
import OneMeterOneRecordDetail from "./2_1.OneMeterOneRecordDetail.jsx";
//functions
import { getData } from "../../../../functions/requestDataFromAPI.js";
import emitter from "../../../../functions/events.js";

//———————————————————————————————————————————————全局函数
//转换时间格式"2016-05-12 08:00:00"——>"Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)"
function timeDeformat(convertedTime) {
  convertedTime = convertedTime.replace(new RegExp(/-/gm), "/"); //将所有的'-'转为'/'即可（兼容IE）
  let time = convertedTime === "" ? null : new Date(convertedTime);
  return time;
}

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "840px",
  },
  checkRecordModal: {
    width: "250px",
    display: "inline-block",
    margin: "10px 0px 10px 40px",
    verticalAlign: "bottom",
  },
  tableTitle: {
    width: "1000px",
    display: "inline-block",
    margin: "10px 0px 15px 0px",
    textAlign: "left",
  },
  detailTitle: {
    width: "1000px",
    display: "inline-block",
    margin: "0px 0px 0px 102px",
    verticalAlign: "bottom",
    textAlign: "left",
  },
  taskList: {
    height: "515px",
  },
  taskDetail: {
    height: "335px",
  },
}));

//———————————————————————————————————————————————Table
//DatePicker
const { RangePicker } = DatePicker;

// "id": 10,						记录ID
// 	"taskName": "测试",					任务名称
// 	"meterCount": "1000",				总巡检点数
// 	"meterFinishCount": "980",				已完成巡检点数
// 	"meterAbnormalCount": "10",				异常巡检点数
// 	"startTime": "2018-11-07 15:44:06",			巡检开始时间
// 	"endTime": "2018-11-08 15:44:08",			巡检结束时间
// 	"isFinished": "已完成",				巡检完成状态【"未完成"  "已完成"】
// 	"meterDetail":{
// 		"meterId": 1，				点位ID
// 		"meterName":"A线路避雷器A相_接头",		点位名称（检测内容）
// 		"detectionType": "表计读取",			识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
// 		"value": "36度",				识别结果
// 		"mediaUrl": "/pic/40.jpg",			图片或音频文件路径
// 		"status"："正常"				巡检结果【"正常"  "异常"】
// 		"time": "2018-10-25 17:36:45",			检测时间
// 		"checkStatus": "待审核",			巡检审核状态【"待审核"  "已确认"  "已修改"】
// 		"checkInfo": "张三审核",			巡检审核信息
// 		},
//获取表数据
function getTableData(list) {
  var newList = [];
  newList = list.map((item, index) => {
    var newItem = {
      key: "",
      id: "", //记录ID
      taskName: "", //任务名称
      meterCount: "", //总巡检点数
      meterFinishCount: "", //已完成巡检点数
      meterAbnormalCount: "", //异常巡检点数
      startTime: "", //巡检开始时间
      endTime: "", //巡检结束时间
      isFinished: "", //巡检完成状态【"未完成"  "已完成"】
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
    newItem.id = item.id ? item.id : "";
    newItem.taskName = item.taskName
      ? item.taskName
      : "asdfdsafasdfsdafasdfasdfasdfsdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"; //CTT
    newItem.meterCount = item.meterCount ? item.meterCount : "9000"; //CTT
    newItem.meterFinishCount = item.meterFinishCount
      ? item.meterFinishCount
      : "800"; //CTT
    newItem.meterAbnormalCount = item.meterAbnormalCount
      ? item.meterAbnormalCount
      : "20"; //CTT
    newItem.startTime = item.startTime ? item.startTime : "2018-10-26 16:32:16"; //CTT
    newItem.endTime = item.endTime ? item.endTime : "2018-10-26 16:32:16"; //CTT
    newItem.isFinished = item.isFinished ? item.isFinished : "未完成"; //CTT
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
    newItem.value = item.value; //HJJ
    newItem.mediaUrl = item.irpath; //HJJ
    newItem.status = item.status; //HJJ
    newItem.time = item.time; //HJJ
    newItem.checkStatus = item.checkStatus; //HJJ
    newItem.checkInfo = item.checkInfo; //HJJ
    console.log("newItem", newItem);
    return newItem;
  });
  console.log("newList", newList);
  return newList;
}

function OneMeterRecordsTableAndDetail() {
  const classes = useStyles();

  //———————————————————————————————————————————————useRef
  //<Table>中taskName列的下拉菜单里的<Input>节点
  const taskNameSearchInput = useRef();

  //———————————————————————————————————————————————useState
  //表格数据是否正在请求的状态
  const [loading, setLoading] = useState(false);

  //页面是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //消息接收到的点位ID
  const [meterId, setMeterId] = useState(null);

  //<Table>的状态
  const [tableState, setTableState] = useState({
    pageIndex: 1, //当前页码
    pageSize: 15, //每页行数
    tableData: [], //全部表数据
    pageData: [], //当前页表数据
  });

  //<Table>中单行任务信息的状态
  const [rowData, setRowData] = useState({
    //点击的行数据
    key: "",
    id: "", //记录ID
    taskName: "", //任务名称
    meterCount: "", //总巡检点数
    meterFinishCount: "", //已完成巡检点数
    meterAbnormalCount: "", //异常巡检点数
    startTime: "", //巡检开始时间
    endTime: "", //巡检结束时间
    isFinished: "", //巡检完成状态【"未完成"  "已完成"】
    meterId: "", //点位ID
    meterName: "", //点位名称（检测内容）
    detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
    value: "", //识别结果
    mediaUrl: "", //图片或音频文件路径
    status: "", //巡检结果【"正常"  "异常"】
    time: "", //检测时间
    checkStatus: "", //巡检审核状态【"待审核"  "已确认"  "已修改"】
    checkInfo: "", //巡检审核信息
  });

  //<Table>中被CheckBox选中的行对应的巡检记录id用","级联组成的字符串
  const [idString, setIdString] = useState("");

  //<Table>中taskName列的搜索状态
  const [taskNameSearch, setTaskNameSearch] = useState({
    searchText: "", //搜索内容
    searchedColumn: "", //搜索的列的dataIndex
  });

  //<Table>中time列的<RangePicker>的状态
  const [timeRange, setTimeRange] = useState({
    start: "",
    end: "",
  });

  //———————————————————————————————————————————————useEffect
  useEffect(() => {
    //————————————————————————————添加监听事件
    emitter.addListener("updateOneMeterRecordsTable:", (message) => {
      //如果由1.TreeSearch发来的点位ID发生了变化
      if (message !== meterId) {
        setMeterId(message);
        setUpdate(!update);
        //发送事件到2_1.OneMeterOneRecordDetail中（清空详情）
        emitter.emit("emptyOneMeterOneRecordDetail");
        //清空rowData
        setRowData({
          key: "",
          id: "",
          taskName: "",
          meterCount: "",
          meterFinishCount: "",
          meterAbnormalCount: "",
          startTime: "",
          endTime: "",
          isFinished: "",
          meterId: "",
          meterName: "",
          detectionType: "",
          value: "",
          mediaUrl: "",
          status: "",
          time: "",
          checkStatus: "",
          checkInfo: "",
        });
      }
    });
    if (meterId) {
      //设置表格数据请求状态为正在请求
      setLoading(true);
      //————————————————————————————GET请求
      // 用URLSearchParams来传递参数
      let paramData = new URLSearchParams();
      //meterId && paramData.append("meterId", meterId.toString());
      meterId && paramData.append("taskID", meterId.toString()); //HJJ 适应旧接口测试
      getData("/detectionDatas", { params: paramData }).then((data) => {
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
          //设置表格数据请求状态为完成
          setLoading(false);
        } else {
          alert(data.data.detail);
        }
      });
    }
  }, [update]);

  //———————————————————————————————————————————————设置<Table>用到的变量
  //<Table>中taskName列的配置描述
  const getTaskNameColumnSearchProps = (dataIndex) => ({
    //filterDropdown:可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys, //<Input>中的搜索内容
      confirm, //确定函数
      clearFilters, //重置函数
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={taskNameSearchInput}
          placeholder={`关键字搜索`}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() =>
            handleColumnSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleColumnSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => handleColumnReset(clearFilters, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
        </Space>
      </div>
    ),
    //filterIcon:自定义 filter 图标
    filterIcon: (filtered) => (
      <Tooltip title="关键字搜索">
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      </Tooltip>
    ),
    //onFilter:本地模式下，确定筛选的运行函数
    onFilter: (value, record) =>
      record[dataIndex] && record[dataIndex].toString().includes(value),
    //onFilterDropdownVisibleChange:自定义筛选菜单可见变化时调用
    onFilterDropdownVisibleChange: (visible) => {
      console.log("visible", visible);
      if (visible) {
        setTimeout(() => taskNameSearchInput.current.select(), 500); //500ms后获取焦点到输入框，否则会飞
      }
    },
    render: (text) =>
      taskNameSearch.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#89F8CE", padding: 0 }}
          searchWords={[taskNameSearch.searchText]}
          autoEscape
          textToHighlight={text && text.toString()}
        />
      ) : (
        text
      ),
  });

  //<Table>中time列的配置描述
  const getTimeColumnRangeSearchProps = (dataIndex) => ({
    //filterDropdown:可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Space>
          <RangePicker
            showTime
            onChange={(dates, dateStrings) => {
              //设置<Table>中time列的<RangePicker>的状态
              setTimeRange((prev) => ({
                start: dateStrings[0],
                end: dateStrings[1],
              }));
              //更新onFilter的处理逻辑（必须setSelectedKeys，否则还是原来的onFilter逻辑）
              setSelectedKeys(
                dateStrings[0] && dateStrings[1]
                  ? [dateStrings[0], dateStrings[1]]
                  : []
              );
            }}
          />
          <Button
            type="primary"
            onClick={() => handleColumnSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            筛选
          </Button>
          <Button
            onClick={() => handleColumnReset(clearFilters, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
        </Space>
      </div>
    ),
    //filterIcon:自定义 filter 图标
    filterIcon: (filtered) => (
      <Tooltip title="按时间范围筛选">
        <FilterFilled style={{ color: filtered ? "#1890ff" : undefined }} />
      </Tooltip>
    ),
    //onFilter:本地模式下，确定筛选的运行函数
    onFilter: (value, record) => {
      return (
        record[dataIndex] &&
        timeDeformat(record[dataIndex]) >= timeDeformat(timeRange.start) &&
        timeDeformat(record[dataIndex]) <= timeDeformat(timeRange.end)
      );
    },
  });

  //<Table>中columns的配置描述
  const columns = [
    {
      title: "记录ID",
      dataIndex: "id",
      align: "center",
      width: 100,
    },
    {
      title: "任务名称",
      dataIndex: "taskName",
      align: "center",
      width: 500,
      ellipsis: true,
      ...getTaskNameColumnSearchProps("taskName"),
    },
    {
      title: "识别结果",
      dataIndex: "value",
      align: "center",
      width: 140,
      ellipsis: true,
      filters: [
        { text: "无结果", value: 0 },
        { text: "有结果", value: 1 },
      ],
      onFilter: (value, record) => {
        console.log("record[value]", record["value"], "value", value);
        if (value === 1) {
          //有结果
          return record["value"];
        } else {
          //无结果
          return !record["value"];
        }
      },
      filterIcon: (filtered) => (
        <Tooltip title="按条件筛选">
          <FilterFilled style={{ color: filtered ? "#1890ff" : undefined }} />
        </Tooltip>
      ),
    },
    {
      title: "巡检结果",
      dataIndex: "status",
      align: "center",
      width: 140,
      filters: [
        { text: "正常", value: "正常" },
        { text: "异常", value: "异常" },
      ],
      onFilter: (value, record) => {
        record["status"] && record["status"].includes(value);
      },
      filterIcon: (filtered) => (
        <Tooltip title="按条件筛选">
          <FilterFilled style={{ color: filtered ? "#1890ff" : undefined }} />
        </Tooltip>
      ),
    },
    {
      title: "检测时间",
      dataIndex: "time",
      align: "center",
      width: 190,
      sorter: (rowA, rowB) => {
        return rowA.time && rowB.time
          ? timeDeformat(rowA.time) - timeDeformat(rowB.time)
          : 0;
      },
      ...getTimeColumnRangeSearchProps("time"),
    },
    {
      title: "审核状态",
      dataIndex: "checkStatus",
      align: "center",
      width: 140,
      filters: [
        { text: "待审核", value: "待审核" },
        { text: "已确认", value: "已确认" },
        { text: "已修改", value: "已修改" },
      ],
      onFilter: (value, record) => record["checkStatus"].includes(value),
      filterIcon: (filtered) => (
        <Tooltip title="按条件筛选">
          <FilterFilled style={{ color: filtered ? "#1890ff" : undefined }} />
        </Tooltip>
      ),
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
                id: rowData.id,
                meterId: rowData.meterId,
              }}
            />
          </a>
          <a>
            <CheckRecordModal
              type="oneMeter" //多个记录ID和一个点位ID
              batch={false}
              data={{
                id: rowData.id,
                meterId: rowData.meterId,
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
    // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      //获取<Table>中被CheckBox选中的行对应的巡检记录id用","级联组成的字符串
      let IDstring = "";
      let arrayID = [];
      selectedRows.forEach((item) => {
        arrayID.push(item.id);
        //console.log("arrayID", arrayID);
        IDstring = arrayID.join(",");
        //console.log("IDstring", IDstring);
      });
      setIdString(IDstring);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

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
    total: tableState.tableData.length,
    showTotal: () => `共${tableState.tableData.length}条`,
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
      }, // 点击行
      onDoubleClick: (event) => {},
      onContextMenu: (event) => {},
      onMouseEnter: (event) => {}, // 鼠标移入行
      onMouseLeave: (event) => {},
    };
  }

  //<Table>中列的确定搜索事件响应函数
  function handleColumnSearch(selectedKeys, confirm, dataIndex) {
    confirm(); //确定函数
    if (dataIndex === "taskName") {
      setTaskNameSearch({
        searchText: selectedKeys[0],
        searchedColumn: dataIndex,
      });
    }
  }

  //<Table>中列的重置搜索事件响应函数
  function handleColumnReset(clearFilters, dataIndex) {
    clearFilters(); //重置函数
    if (dataIndex === "taskName") {
      setTaskNameSearch({ searchText: "", searchedColumn: "" });
    }
  }

  return (
    <Paper className={classes.root} elevation="3">
      <Card className={classes.taskList} raised>
        <CardContent>
          <Typography className={classes.label} color="textSecondary">
            <Label color="teal" ribbon>
              巡检记录列表（包含该点位）
            </Label>
          </Typography>
          <Typography>
            <div className={classes.checkRecordModal}>
              <CheckRecordModal
                type="oneMeter" //多个记录ID和一个点位ID
                batch={true}
                data={{
                  id: idString,
                  meterId: meterId,
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
            <div className={classes.tableTitle}>
              <h4>
                {tableState.tableData[0] &&
                  "点位" +
                    meterId +
                    " \xa0\xa0\xa0\xa0" +
                    tableState.tableData[0].meterName +
                    "（" +
                    tableState.tableData[0].detectionType +
                    "）"}
              </h4>
            </div>
          </Typography>
          <Spin spinning={loading} tip="Loading..." size="large">
            <Table
              bordered="true" //是否展示外边框和列边框
              loading={loading} //页面是否加载中
              size="small" //表格大小
              columns={columns}
              dataSource={tableState.pageData}
              pagination={pagination}
              scroll={{ y: 320 }}
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
      <Card className={classes.taskDetail} raised>
        <CardContent>
          <Typography className={classes.label} color="textSecondary">
            <Label color="teal" ribbon>
              巡检记录详情（包含该点位）
            </Label>
            <div className={classes.detailTitle}>
              <h4>
                {rowData.taskName &&
                  "记录" + rowData.id + " \xa0\xa0\xa0\xa0" + rowData.taskName}
              </h4>
            </div>
          </Typography>
          <OneMeterOneRecordDetail data={rowData} />
        </CardContent>
      </Card>
    </Paper>
  );
}

export default OneMeterRecordsTableAndDetail;
