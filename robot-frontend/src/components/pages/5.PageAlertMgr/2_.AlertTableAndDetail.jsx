//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardContent } from "@material-ui/core";
import { Spin, Table, Badge } from "antd";
import { Label } from "semantic-ui-react";
//elements
import AlertQueryForm from "./2_1.AlertQueryForm.jsx";
import ConfirmAlertModal from "./2_2.ConfirmAlertModal.jsx";
import DeleteAlertModal from "./2_3.DeleteAlertModal.jsx";
import AlertDetail from "./2_4.AlertDetail#4.jsx";
//functions
import { getData } from "../../../functions/requestDataFromAPI.js";
import emitter from "../../../functions/events.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles((theme) => ({
  alertTable: {
    margin: "0px 10px 0px 10px",
    width: "100%",
    height: "510px",
    overflow: "auto",
  },
  alertDetail: {
    margin: "6px 10px 0px 10px",
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

//———————————————————————————————————————————————Table
// id: "1", //告警信息ID
// source: "1", //告警信息来源的机器人ID
// detail: "asdfdsafasdfsdafasdfasdfasdfsdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", //告警信息详细描述
// time: "2018-10-26 16:32:16", //识别时间
// meter: "1", //点位ID
// meterName: "asdfdsafasdfsdafasdfasdfa", //点位名称（检测内容）
// level: "一般告警", //点位状态（告警等级）【"正常"  "预警"  "一般告警"  "严重告警"  "危急告警"】
// detectionType: "表计读取", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
// value: "36度", //识别结果
// mediaUrl: {
//   valuePath: "D:/robot/static/pic/2018-1-1/111/50.jpg", //识别结果图片路径
//   voicePath: "D:/robot/static/pic/2018-1-1/111/50.wav", //音频文件路径
//   videoPath: "D:/robot/static/pic/2018-1-1/111/50.mp4", //视频文件路径
//   vlPath: "D:/robot/static/pic/2018-1-1/111/50.jpg", //可见光图片文件路径（一定有）
//   irPath: "D:/robot/static/pic/2018-1-1/111/50.jpg", //红外图片文件路径
// },
// isDealed: "现场确认无异常", //确认状态（5种）【"未确认"  "现场确认无异常"  "确认异常——已处理"  "确认异常——需要进一步跟踪"  "确认异常——在允许范围内"】

//获取表数据
function getTableData(list) {
  var newList = [];
  newList = list.map((item, index) => {
    var newItem = {
      key: "",
      id: "", //告警信息ID
      source: "", //告警信息来源的机器人ID
      detail: "", //告警信息详细描述
      time: "", //识别时间
      meter: "", //点位ID
      meterName: "", //点位名称（检测内容）
      level: "", //点位状态（告警等级）【"正常"  "预警"  "一般告警"  "严重告警"  "危急告警"】
      detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
      value: "", //识别结果
      mediaUrl: {
        valuePath: "", //识别结果图片路径
        voicePath: "", //音频文件路径
        videoPath: "", //视频文件路径
        vlPath: "", //可见光图片文件路径（一定有）
        irPath: "", //红外图片文件路径
      },
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
    newItem.mediaUrl.valuePath = item.valuePath;
    newItem.mediaUrl.voicePath = item.voicePath;
    newItem.mediaUrl.videoPath = item.videoPath;
    newItem.mediaUrl.vlPath = item.vlPath;
    newItem.mediaUrl.irPath = item.irPath;
    newItem.isDealed = item.isDealed;
    return newItem;
  });
  console.log("newList", newList);
  return newList;
}

function AlertTableAndDetail(props) {
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
    pageSize: 10, //每页行数
    tableData: [], //全部表数据
    selectedRowKeys: [], //checkbox选中行的key数组
  });

  //<Table>中单行任务信息的状态
  const [rowData, setRowData] = useState({
    //点击的行数据
    key: "",
    id: "", //告警信息ID
    source: "", //告警信息来源的机器人ID
    detail: "", //告警信息详细描述
    time: "", //识别时间
    meter: "", //点位ID
    meterName: "", //点位名称（检测内容）
    level: "", //点位状态（告警等级）【"正常"  "预警"  "一般告警"  "严重告警"  "危急告警"】
    detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
    value: "", //识别结果
    mediaUrl: {
      valuePath: "", //识别结果图片路径
      voicePath: "", //音频文件路径
      videoPath: "", //视频文件路径
      vlPath: "", //可见光图片文件路径（一定有）
      irPath: "", //红外图片文件路径
    },
    isDealed: "", //确认状态（5种）【"未确认"  "现场确认无异常"  "确认异常——已处理"  "确认异常——需要进一步跟踪"  "确认异常——在允许范围内"】
  });

  //<Table>中被CheckBox选中的行对应的告警信息ID用","级联组成的字符串
  const [idString, setIdString] = useState({
    alertIdString: "",
  });

  //GET请求（按条件获取告警信息列表）所带的参数
  const [queryConditions, setQueryConditions] = useState({
    meterName: "", //关键字（检测内容模糊查询）
    startTime: "", //识别时间的时间段起点
    endTime: "", //识别时间的时间段终点
    level: "", //点位状态（告警等级）【"正常"  "预警"  "一般告警"  "严重告警"  "危急告警"】
    detectionType: "", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
    isDealed: "", //确认状态（5种）【"未确认"  "现场确认无异常"  "确认异常——已处理"  "确认异常——需要进一步跟踪"  "确认异常——在允许范围内"】
  });

  //是否收到来自0.Navigation.jsx的消息（updateAlertTable）的状态
  const [hasMessage, setHasMessage] = useState(false);

  //———————————————————————————————————————————————useEffect
  //当（本组件加载完成、需要刷新或GET请求所带的条件参数发生变化时），添加监听事件（updateAlertTable）、GET请求获取告警信息列表
  useEffect(() => {
    //————————————————————————————添加监听事件
    emitter.addListener("updateAlertTable", () => {
      //设置收到来自0.Navigation.jsx的消息（updateAlertTable）的状态
      setHasMessage(!hasMessage);
    });
    //设置表格数据请求状态为正在请求
    setLoading(true);
    //设置<Table>中被CheckBox选中的行对应的告警信息ID用","级联组成的字符串为空
    setIdString({
      alertIdString: "",
    });
    //————————————————————————————GET请求
    // 用URLSearchParams来传递参数
    let paramData = new URLSearchParams();
    paramData.append("pageNum", tableState.pageIndex);
    paramData.append("pageSize", tableState.pageSize);
    queryConditions.meterName &&
      paramData.append("meterName", queryConditions.meterName);
    queryConditions.startTime &&
      paramData.append("startTime", queryConditions.startTime);
    queryConditions.endTime &&
      paramData.append("endTime", queryConditions.endTime);
    queryConditions.level && paramData.append("level", queryConditions.level);
    queryConditions.detectionType &&
      paramData.append("detectionType", queryConditions.detectionType);
    props.filter
      ? paramData.append("isDealed", "未确认") //如果是从0.Navigation.jsx的【小铃铛】进入本组件，设置GET请求的isDealed参数为"未确认"
      : queryConditions.isDealed &&
        paramData.append("isDealed", queryConditions.isDealed); //如果是从0.Navigation.jsx的导航栏的【异常告警】进入本组件，设置GET请求的isDealed参数为用户输入内容
    console.log("paramData.get isDealed", paramData.get("isDealed"));
    //发送GET请求
    getData("detectionDatas/warn", { params: paramData })
      .then((data) => {
        // console.log("get结果", data);
        if (data.success) {
          var total = data.data.total;
          var pageIndex = data.data.pageNum;
          var pageSize = data.data.pageSize;
          var result = data.data.list;
          // console.log("result", result);
          //获取告警信息列表数据
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

  //当（收到来自0.Navigation.jsx的消息（updateAlertTable）时[即导航栏小铃铛按下时]），设置GET请求参数、发送事件到2_1.AlertQueryForm.jsx、设置组件需要更新
  useEffect(() => {
    //如果是从0.Navigation.jsx的【小铃铛】进入本组件
    if (props.filter) {
      //设置GET请求（按条件获取告警信息列表）所带的isDealed参数为"未确认"
      setQueryConditions((prev) => ({
        meterName: prev.meterName,
        startTime: prev.startTime,
        endTime: prev.endTime,
        level: prev.level,
        detectionType: prev.detectionType,
        isDealed: "未确认",
      }));
      //发送事件到2_1.AlertQueryForm.jsx中（设置其用户输入内容中的isDealed为"未确认"）
      emitter.emit("setInputIsDealed");
      //设置组件需要更新
      setUpdate(!update);
    }
  }, [hasMessage]);

  //———————————————————————————————————————————————设置<Table>用到的变量
  //<Table>中columns的配置描述
  const columns = [
    {
      title: "告警信息ID",
      dataIndex: "id",
      align: "center",
      width: 100,
      ellipsis: true,
    },
    {
      title: "识别时间",
      dataIndex: "time",
      align: "center",
      width: 200,
    },
    {
      title: "告警信息详细描述",
      dataIndex: "detail",
      align: "center",
      width: 500,
      ellipsis: true,
    },
    {
      title: "检测内容",
      dataIndex: "meterName",
      align: "center",
      width: 500,
      ellipsis: true,
    },
    {
      title: "告警等级",
      dataIndex: "level",
      align: "center",
      width: 150,
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
      width: 250,
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
            <ConfirmAlertModal
              batch={false}
              data={{
                alertId: rowData.id,
                alertIsDealed: rowData.isDealed,
              }}
              updateParent={() => {
                console.log("updateParent!");
                setUpdate(!update);
              }}
            />
          </a>
          &nbsp;&nbsp;
          <a>
            <DeleteAlertModal
              batch={false}
              data={{
                alertId: rowData.id,
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
      //获取<Table>中被CheckBox选中的行对应的告警信息ID用","级联组成的字符串
      let alertIdString = "";
      let arrayAlertID = [];
      selectedRows.forEach((item) => {
        arrayAlertID.push(item.id);
        alertIdString = arrayAlertID.join(",");
        console.log("arrayAlertID", arrayAlertID);
        console.log("alertIdString", alertIdString);
      });
      //设置<Table>中被CheckBox选中的行对应的告警信息ID用","级联组成的字符串
      setIdString({
        alertIdString: alertIdString,
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
    //设置<Table>中被CheckBox选中的行对应的告警信息ID用","级联组成的字符串为空
    setIdString({
      alertIdString: "",
    });
    //设置组件需要更新
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
    //设置<Table>中被CheckBox选中的行对应的告警信息ID用","级联组成的字符串为空
    setIdString({
      alertIdString: "",
    });
    //设置组件需要更新
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
                //将子组件2_1.AlertQueryForm.jsx中的用户输入数据导出，用于设置GET请求的参数和<Table>的状态
                exportData={(input) => {
                  //设置GET请求（按条件获取告警信息列表）所带的参数
                  // console.log("AlertQueryForm output：", input);
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
            <div className={classes.alertModal}>
              <ConfirmAlertModal
                batch={true}
                data={{
                  alertId: idString.alertIdString,
                  alertIsDealed: "",
                }}
                updateParent={() => {
                  console.log("updateParent!");
                  setUpdate(!update);
                }}
              />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <DeleteAlertModal
                batch={true}
                data={{
                  alertId: idString.alertIdString,
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
              scroll={{ y: 271 }}
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
