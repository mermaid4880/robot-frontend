//packages
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardContent } from "@material-ui/core";
import { Spin, Table, Badge } from "antd";
import { Label } from "semantic-ui-react";
//elements
import AlertQueryForm from "./2_1.AlertQueryForm.jsx";
import ConfirmAlertModal from "./2_2.ConfirmAlertModal.jsx";
import DeleteAlertModal from "./2_3.DeleteAlertModal.jsx";
import AlertDetail from "./2_4.AlertDetail.jsx";
//functions
import { getData } from "../../../functions/requestDataFromAPI.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  alertTable: {
    height: "520px",
    marginBottom: "4px",
    overflow: "auto",
  },
  alertDetail: {
    width: "100%",
    height: "330px",
  },
  label: {
    fontSize: 14,
  },
  alertQueryForm: {
    width: "1400px",
    margin: "8px 140px 0px 30px",
    display: "inline-block",
  },
  alertModal: {
    width: "280px",
    display: "inline-block",
    marginBottom: "20px",
    verticalAlign: "bottom",
  },
}));

//———————————————————————————————————————————————全局函数
//获取表数据
function getTableData(list) {
  var newList = [];
  newList = list.map((item, index) => {
    var newItem = {
      key: "",
      id: "", //告警信息的id
      source: "", //告警信息来源的机器人id
      detail: "", //告警信息详细描述
      time: "", //识别时间
      meter: "", //点位id
      meterName: "", //点位名称（检测内容）
      level: "", //点位状态（告警等级）【"正常"  "预警"  "一般告警"  "严重告警"  "危急告警"】
      detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
      value: "", //识别结果
      imgUrl: "", //图片路径
      isDealed: "", //确认状态（5种）【"未确认"  "现场确认无异常"  "确认异常——已处理"  "确认异常——需要进一步跟踪"  "确认异常——在允许范围内"】
    };
    newItem.key = index;
    newItem.id = item.id;
    newItem.source = item.source;
    newItem.detail = item.detail;
    newItem.time = item.time;
    newItem.meter = item.meter;
    newItem.meterName = item.meterName;
    newItem.level = item.level;
    newItem.detectionType = item.detectionType;
    newItem.value = item.value;
    newItem.imgUrl = item.imgUrl;
    newItem.isDealed = item.isDealed;
    return newItem;
  });
  console.log("newList", newList);
  return newList;
}

function AlertTableAndDetail() {
  const classes = useStyles();

  //———————————————————————————————————————————————useState
  //表格数据是否正在请求的状态
  const [loading, setLoading] = useState(false);

  //页面是否需要更新的状态
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
    id: "", //告警信息的id
    source: "", //告警信息来源的机器人id
    detail: "", //告警信息详细描述
    time: "", //识别时间
    meter: "", //点位id
    meterName: "", //点位名称（检测内容）
    level: "", //点位状态（告警等级）【"正常"  "预警"  "一般告警"  "严重告警"  "危急告警"】
    detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
    value: "", //识别结果
    imgUrl: "", //图片路径
    isDealed: "", //确认状态（5种）【"未确认"  "现场确认无异常"  "确认异常——已处理"  "确认异常——需要进一步跟踪"  "确认异常——在允许范围内"】
  });

  //<Table>中被CheckBox选中的行对应的任务信息的id用","级联组成的字符串
  const [idString, setIdString] = useState("");

  useEffect(() => {
    //设置表格数据请求状态为正在请求
    setLoading(true);
    //————————————————————————————GET请求
    getData("/systemAlarms").then((data) => {
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
  //<Table>中columns的配置描述
  const columns = [
    {
      title: "告警信息ID",
      dataIndex: "id",
      align: "center",
      width: 100,
    },
    {
      title: "识别时间",
      dataIndex: "time",
      align: "center",
      width: 180,
    },
    {
      title: "检测内容",
      dataIndex: "meterName",
      align: "center",
      width: 350,
      ellipsis: true,
    },

    {
      title: "详细描述",
      dataIndex: "detail",
      align: "center",
      width: 350,
      ellipsis: true,
    },
    {
      title: "识别类型",
      dataIndex: "detectionType",
      align: "center",
      width: 200,
      ellipsis: true,
    },
    {
      title: "识别结果",
      dataIndex: "value",
      align: "center",
      width: 200,
      ellipsis: true,
    },
    {
      title: "告警等级",
      dataIndex: "level",
      align: "center",
      width: 100,
      render: (x) => {
        switch (x) {
          case "正常":
            return <Badge color="rgb(0,128,0)" text={x} />;
          case "预警":
            return <Badge color="rgb(0,0,255)" text={x} />;
          case "一般告警":
            return <Badge color="rgb(255,255,0)" text={x} />;
          case "严重告警":
            return <Badge color="rgb(255,128,10)" text={x} />;
          case "危急告警":
            return <Badge color="rgb(255,0,0)" text={x} />;
          default:
            return <Badge color="#FF0000" text={x} />;
        }
      },
    },
    {
      title: "确认状态",
      dataIndex: "isDealed",
      align: "center",
      width: 200,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      render: () => (
        <span className="table-operation">
          <a>
            <ConfirmAlertModal
              batch={false}
              alertId={rowData.id}
              alertIsDealed={rowData.isDealed}
              updateParent={() => {
                console.log("updateParent!");
                setUpdate(!update);
              }}
            />
          </a>
          <a>
            <DeleteAlertModal
              batch={false}
              alertId={rowData.id}
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

  return (
    <>
      <Card className={classes.alertTable} raised>
        <CardContent>
          <Typography className={classes.label} color="textSecondary">
            <Label color="teal" ribbon>
              告警信息列表
            </Label>
          </Typography>
          <Typography>
            <div className={classes.alertQueryForm}>
              <AlertQueryForm
                exportDataAndSetTable={(list) => {
                  console.log("list", list);
                  //获取表数据
                  const tableData = getTableData(list);
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
                }}
              />
            </div>
            <div className={classes.alertModal}>
              <ConfirmAlertModal
                batch={true}
                alertId={idString}
                alertIsDealed={""}
                updateParent={() => {
                  console.log("updateParent!");
                  setUpdate(!update);
                }}
              />
              <DeleteAlertModal
                batch={true}
                alertId={idString}
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
      <Card className={classes.alertDetail} raised>
        <CardContent>
          <Typography className={classes.label} color="textSecondary">
            <Label color="teal" ribbon>
              告警详细信息
            </Label>
          </Typography>
          <AlertDetail data={rowData} />
        </CardContent>
      </Card>
    </>
  );
}

export default AlertTableAndDetail;
