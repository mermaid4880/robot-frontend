//packages
import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Paper, Card, CardContent } from "@material-ui/core";
import { Spin, Table, Input, Button, Tooltip, Space, DatePicker } from "antd";
import { SearchOutlined, FilterFilled } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Label } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faBan } from "@fortawesome/free-solid-svg-icons";
//elements
import AddOrEditTaskModal from "./3_1_.AddOrEditTaskModal.jsx";
import DeleteTaskModal from "./3_2.DeleteTaskModal.jsx";
import IssueTaskModal from "./3_3.IssueTaskModal.jsx";
import TaskDetail from "./3_4.TaskDetail.jsx";
//functions
import { getData } from "../../../functions/requestDataFromAPI.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "840px",
  },
  taskList: {
    height: "515px",
  },
  taskDetail: {
    height: "335px",
  },
  label: {
    fontSize: 14,
  },
}));

//———————————————————————————————————————————————Table
//DatePicker
const { RangePicker } = DatePicker;

//获取表数据
function getTableData(list) {
  var newList = [];
  newList = list.map((item, index) => {
    var newItem = {
      key: "",
      id: "", //任务ID
      taskName: "", //任务名称
      taskDescription: "", //任务描述
      createTime: "", //任务创建时间
      endAction: "", //结束动作【"自动充电"  "原地待命"】
      type: "", //任务类型【"例行巡检"  "自定义巡检"  "特殊巡检"】
      createUserId: "", //创建任务UserId
      meters: "", //点位信息
      status: "", //任务执行状态【"等待执行"  "执行完成"  "正在执行"  "中途终止"  "任务超期"】
      mode: "", //任务执行方式【"立即执行"  "定期执行"  "周期执行"】
      startTime: "", //任务开始时间（当mode为定期执行和周期执行时有效）
      period: "", //任务执行周期（当mode为周期执行时有效）
      isStart: "", //任务是否启用【"启用"  "禁用"】
    };
    newItem.key = index;
    newItem.id = item.id;
    newItem.taskName = item.taskName;
    newItem.taskDescription = item.taskDescription;
    newItem.createTime = item.createTime;
    newItem.endAction = item.endAction;
    newItem.type = item.type;
    newItem.createUserId = item.createUserId;
    newItem.meters = item.meters;
    newItem.status = item.status;
    newItem.mode = item.mode;
    newItem.startTime = item.startTime;
    newItem.period = item.period;
    newItem.isStart = item.isStart;
    return newItem;
  });
  console.log("newList", newList);
  return newList;
}

//———————————————————————————————————————————————全局函数
//转换时间格式"2016-05-12 08:00:00"——>"Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)"
function timeDeformat(convertedTime) {
  convertedTime = convertedTime.replace(new RegExp(/-/gm), "/"); //将所有的'-'转为'/'即可（兼容IE）
  let time = convertedTime === "" ? null : new Date(convertedTime);
  return time;
}

function TaskTableAndDetail() {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useRef
  //<Table>中taskName列的下拉菜单里的<Input>节点
  const taskNameSearchInput = useRef();

  //———————————————————————————————————————————————useState
  //表格数据是否正在请求的状态
  const [loading, setLoading] = useState(false);

  //组件是否需要更新的状态
  const [update, setUpdate] = useState(false);

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
    id: "", //任务ID
    taskName: "", //任务名称
    taskDescription: "", //任务描述
    createTime: "", //任务创建时间
    endAction: "", //结束动作【"自动充电"  "原地待命"】
    type: "", //任务类型【"例行巡检"  "自定义巡检"  "特殊巡检"】
    createUserId: "", //创建任务UserId
    meters: "", //点位信息
    status: "", //任务执行状态【"等待执行"  "执行完成"  "正在执行"  "中途终止"  "任务超期"】
    mode: "", //任务执行方式【"立即执行"  "定期执行"  "周期执行"】
    startTime: "", //任务开始时间（当mode为定期执行和周期执行时有效）
    period: "", //任务执行周期（当mode为周期执行时有效）
    isStart: "", //任务是否启用【"启用"  "禁用"】
  });

  //<Table>中taskName列的搜索状态
  const [taskNameSearch, setTaskNameSearch] = useState({
    searchText: "", //搜索内容
    searchedColumn: "", //搜索的列的dataIndex
  });

  //<Table>中createTime列的<RangePicker>的状态
  const [createTimeRange, setCreateTimeRange] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    //设置表格数据请求状态为正在请求
    setLoading(true);
    //————————————————————————————GET请求
    getData("task/all")
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

  //<Table>中createTime列的配置描述
  const getCreateTimeColumnRangeSearchProps = (dataIndex) => ({
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
              setCreateTimeRange((prev) => ({
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
        timeDeformat(record[dataIndex]) >=
          timeDeformat(createTimeRange.start) &&
        timeDeformat(record[dataIndex]) <= timeDeformat(createTimeRange.end)
      );
    },
  });

  //<Table>中columns的配置描述
  const columns = [
    {
      title: "任务ID",
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
      title: "创建时间",
      dataIndex: "createTime",
      align: "center",
      width: 250,
      sorter: (rowA, rowB) => {
        return rowA.createTime && rowB.createTime
          ? timeDeformat(rowA.createTime) - timeDeformat(rowB.createTime)
          : 0;
      },
      ...getCreateTimeColumnRangeSearchProps("createTime"),
    },
    {
      title: "执行方式",
      dataIndex: "mode",
      align: "center",
      width: 150,
      filters: [
        { text: "立即执行", value: "立即执行" },
        { text: "定期执行", value: "定期执行" },
        { text: "周期执行", value: "周期执行" },
      ],
      onFilter: (value, record) => record["checkStatus"].includes(value),
      filterIcon: (filtered) => (
        <Tooltip title="按条件筛选">
          <FilterFilled style={{ color: filtered ? "#1890ff" : undefined }} />
        </Tooltip>
      ),
    },
    {
      title: "是否启用",
      dataIndex: "isStart",
      align: "center",
      width: 120,
      render: (x) => {
        if (x === "启用")
          return (
            <FontAwesomeIcon icon={faCheckCircle} style={{ color: "green" }} />
          );
        else return <FontAwesomeIcon icon={faBan} style={{ color: "grey" }} />;
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      render: () => (
        <span className="table-operation">
          <a>
            <AddOrEditTaskModal
              action="edit"
              data={rowData}
              updateParent={() => {
                console.log("updateParent!");
                setUpdate(!update);
              }}
            />
          </a>
          &nbsp;&nbsp;
          <a>
            <DeleteTaskModal
              taskId={rowData.id}
              updateParent={() => {
                console.log("updateParent!");
                setUpdate(!update);
              }}
            />
          </a>
          &nbsp;&nbsp;&nbsp;
          <a>
            <IssueTaskModal
              taskId={rowData.id}
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
    // selections: [Table.SELECTION_ALL,Table.SELECTION_INVERT],
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
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
              任务列表
            </Label>
          </Typography>
          <Typography>
            <AddOrEditTaskModal
              action="add"
              updateParent={() => {
                console.log("updateParent!");
                setUpdate(!update);
              }}
            />
          </Typography>
          <Spin spinning={loading} tip="Loading..." size="large">
            <Table
              bordered="true" //是否展示外边框和列边框
              loading={loading} //表格是否加载中
              size="small" //表格大小
              columns={columns}
              dataSource={tableState.tableData}
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
              任务详细信息
            </Label>
          </Typography>
          <TaskDetail data={rowData} />
        </CardContent>
      </Card>
    </Paper>
  );
}

export default TaskTableAndDetail;
