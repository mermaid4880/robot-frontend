//packages
import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardContent } from "@material-ui/core";
import { Spin, Table, Input, Button, Tooltip, Space, DatePicker } from "antd";
import { SearchOutlined, FilterFilled } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Label, Icon } from "semantic-ui-react";
//elements
import DownloadRecordModal from "./2_1.DownloadRecordModal.jsx";
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
    height: "410px",
    marginBottom: "4px",
    overflow: "auto",
  },
  label: {
    fontSize: 14,
  },
  downloadRecordModal: {
    width: "280px",
    display: "inline-block",
    margin: "10px 0px 10px 40px",
    verticalAlign: "bottom",
  },
}));

//———————————————————————————————————————————————Table
//DatePicker
const { RangePicker } = DatePicker;

// "id": 1,						记录ID
// "taskName": "测试",					任务名称
// "meterCount": "1000",				总巡检点数
// "meterFinishCount": "980",				已完成巡检点数
// "meterAbnormalCount": "10",				异常数
// "startTime": "2018-11-07 15:44:06",			巡检开始时间
// "endTime": "2018-11-08 15:44:08",			巡检结束时间
// "isFinished": "已完成",				巡检完成状态【"未完成"  "已完成"】
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
      meterAbnormalCount: "", //异常数
      startTime: "", //巡检开始时间
      endTime: "", //巡检结束时间
      isFinished: "", //巡检完成状态【"未完成"  "已完成"】
    };
    newItem.key = index;
    newItem.id = item.id;
    newItem.taskName = item.taskInfoName; //taskInfoName
    newItem.meterCount = item.meterCount;
    newItem.meterFinishCount = item.meterFinishCount;
    newItem.meterAbnormalCount = item.meterAbnormalCount;
    newItem.startTime = item.startTime;
    newItem.endTime = item.endTime;
    newItem.isFinished = item.isFinished;
    return newItem;
  });
  console.log("newList", newList);
  return newList;
}

function AllRecordsTable() {
  const classes = useStyles();

  //———————————————————————————————————————————————useRef
  //<Table>中taskName列的下拉菜单里的<Input>节点
  const taskNameSearchInput = useRef();

  //———————————————————————————————————————————————useState
  //表格数据是否正在请求的状态
  const [loading, setLoading] = useState(false);

  //页面是否需要更新的状态
  const [update, setUpdate] = useState(false);

  //<Table>的状态
  const [tableState, setTableState] = useState({
    pageIndex: 1, //当前页码
    pageSize: 10, //每页行数
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
    meterAbnormalCount: "", //异常数
    startTime: "", //巡检开始时间
    endTime: "", //巡检结束时间
    isFinished: "", //巡检完成状态【"未完成"  "已完成"】
    checkStatus: "", //巡检审核状态【"待审核"  "已审核"】
    checkInfo: "", //巡检审核信息
  });

  //<Table>中被CheckBox选中的行对应的任务信息的id用","级联组成的字符串
  const [idString, setIdString] = useState("");

  //<Table>中taskName列的搜索状态
  const [taskNameSearch, setTaskNameSearch] = useState({
    searchText: "", //搜索内容
    searchedColumn: "", //搜索的列的dataIndex
  });

  //<Table>中startTime列的<RangePicker>的状态
  const [startTimeRange, setStartTimeRange] = useState({
    start: "",
    end: "",
  });

  //<Table>中endTime列的<RangePicker>的状态
  const [endTimeRange, setEndTimeRange] = useState({
    start: "",
    end: "",
  });

  //———————————————————————————————————————————————useEffect
  useEffect(() => {
    //设置表格数据请求状态为正在请求
    setLoading(true);
    //————————————————————————————GET请求
    getData("/taskFinish//search/timeAndTypes").then((data) => {
      console.log("get结果", data);
      if (data.success) {
        var result = data.data;
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

  //<Table>中startTime列的配置描述
  const getStartTimeColumnRangeSearchProps = (dataIndex) => ({
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
              //设置<Table>中startTime列的<RangePicker>的状态
              setStartTimeRange((prev) => ({
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
        timeDeformat(record[dataIndex]) >= timeDeformat(startTimeRange.start) &&
        timeDeformat(record[dataIndex]) <= timeDeformat(startTimeRange.end)
      );
    },
  });

  //<Table>中endTime列的配置描述
  const getEndTimeColumnRangeSearchProps = (dataIndex) => ({
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
              //设置<Table>中endTime列的<RangePicker>的状态
              setEndTimeRange((prev) => ({
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
        timeDeformat(record[dataIndex]) >= timeDeformat(endTimeRange.start) &&
        timeDeformat(record[dataIndex]) <= timeDeformat(endTimeRange.end)
      );
    },
  });

  //<Table>中columns的配置描述
  const columns = [
    {
      title: "记录ID",
      dataIndex: "id",
      align: "center",
      width: 80,
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
      title: "总巡检点数",
      dataIndex: "meterCount",
      align: "center",
      width: 130,
    },

    {
      title: "已完成巡检点数",
      dataIndex: "meterFinishCount",
      align: "center",
      width: 130,
    },
    {
      title: "异常巡检点数",
      dataIndex: "meterAbnormalCount",
      align: "center",
      width: 130,
      filters: [
        { text: "无异常", value: 0 },
        { text: "有异常", value: 1 },
      ],
      onFilter: (value, record) => {
        console.log(
          "record[meterAbnormalCount]",
          record["meterAbnormalCount"],
          "value",
          value
        );
        if (value === 1) {
          //有异常
          return parseInt(record["meterAbnormalCount"]) >= value;
        } else {
          //无异常
          let num = parseInt(record["meterAbnormalCount"]);
          return !num || num <= value;
        }
      },
      filterIcon: (filtered) => (
        <Tooltip title="按条件筛选">
          <FilterFilled style={{ color: filtered ? "#1890ff" : undefined }} />
        </Tooltip>
      ),
    },
    {
      title: "巡检开始时间",
      dataIndex: "startTime",
      align: "center",
      width: 200,
      sorter: (rowA, rowB) => {
        return rowA.startTime && rowB.startTime
          ? timeDeformat(rowA.startTime) - timeDeformat(rowB.startTime)
          : 0;
      },
      ...getStartTimeColumnRangeSearchProps("startTime"),
    },
    {
      title: "巡检结束时间",
      dataIndex: "endTime",
      align: "center",
      width: 200,
      sorter: (rowA, rowB) => {
        return rowA.endTime && rowB.endTime
          ? timeDeformat(rowA.endTime) - timeDeformat(rowB.endTime)
          : 0;
      },
      ...getEndTimeColumnRangeSearchProps("endTime"),
    },
    {
      title: "巡检完成状态",
      dataIndex: "isFinished",
      align: "center",
      width: 150,
      filters: [
        { text: "未完成", value: "未完成" },
        { text: "已完成", value: "已完成" },
      ],
      onFilter: (value, record) => {
        return record["checkStatus"] && record["checkStatus"].includes(value);
      },
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
      render: (text, record, index) => (
        <span className="table-operation">
          <a>
            <Tooltip placement="bottom" title="查看该条巡检记录详情">
              <Icon
                name="list ul"
                onClick={() => {
                  //发送事件到3_.OneRecordDetailTable中（重新根据记录ID获取该巡检记录全部详细点位信息列表并刷新）
                  emitter.emit("updateOneRecordDetailTable:", record.id);
                }}
              />
            </Tooltip>
          </a>
          <a>
            <DownloadRecordModal batch={false} recordId={rowData.id} />
          </a>
        </span>
      ),
    },
  ];

  //<Table>中rowSelection的配置描述（indicates the need for row selection）
  const rowSelection = {
    // selections: [Table.SELECTION_ALL,Table.SELECTION_INVERT],
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      //获取<Table>中被CheckBox选中的行对应的任务信息的id用","级联组成的字符串
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
        //发送事件到3_.OneRecordDetailTable中（重新根据记录ID获取该巡检记录全部详细点位信息列表并刷新）
        emitter.emit("updateOneRecordDetailTable:", row.id);
      }, // 单击行
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
    <Card className={classes.root} raised>
      <CardContent>
        <Typography className={classes.label} color="textSecondary">
          <Label color="teal" ribbon>
            全部巡检记录列表
          </Label>
        </Typography>
        <Typography>
          <div className={classes.downloadRecordModal}>
            <DownloadRecordModal batch={true} recordId={idString} />
          </div>
        </Typography>
        <Spin spinning={loading} tip="Loading..." size="large">
          <Table
            bordered="true" //是否展示外边框和列边框
            loading={loading} //页面是否加载中
            size="small" //表格大小
            columns={columns}
            dataSource={tableState.tableData}
            pagination={pagination}
            scroll={{ y: 192 }}
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
