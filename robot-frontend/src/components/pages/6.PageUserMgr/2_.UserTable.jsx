//packages
import React, { useState, useEffect } from "react";
import { Table, Spin } from "antd";
//elements
import AddOrEditUserModal from "./2_1_.AddOrEditUserModal.jsx";
import DeleteUserModal from "./2_2.DeleteUserModal.jsx";
//functions
import { getData } from "../../../functions/requestDataFromAPI.js";

//———————————————————————————————————————————————全局函数
//获取表数据
function getTableData(list) {
  var newList = [];
  newList = list.map((item, index) => {
    var newItem = {
      key: "",
      id: "", //用户ID
      userName: "", //姓名
      showName: "", //显示姓名
      accessIds: "", //权限
      phoneNumber: "", //手机号
    };
    newItem.key = index;
    newItem.id = item.id;
    newItem.userName = item.username;
    newItem.showName = item.showname;
    newItem.accessIds = item.accessIds;
    newItem.phoneNumber = item.phoneNum;

    return newItem;
  });
  console.log("newList", newList);
  return newList;
}

function UserTable() {
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
    id: "", //用户ID
    userName: "", //姓名
    showName: "", //显示姓名
    accessIds: "", //权限
    phoneNumber: "", //手机号
  });

  useEffect(() => {
    //设置表格数据请求状态为正在请求
    setLoading(true);
    //————————————————————————————GET请求
    getData("/users").then((data) => {
      console.log("get结果", data.success);
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
      title: "姓名",
      dataIndex: "userName",
      align: "center",
      ellipsis: true,
    },
    {
      title: "显示姓名",
      dataIndex: "showName",
      align: "center",
      ellipsis: true,
    },
    {
      title: "权限",
      dataIndex: "accessIds",
      align: "center",
      ellipsis: true,
    },
    {
      title: "手机号",
      dataIndex: "phoneNumber",
      align: "center",
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
            <AddOrEditUserModal
              action="edit"
              data={rowData}
              updateParent={() => {
                console.log("updateParent!");
                setUpdate(!update);
              }}
            />
          </a>
          <a>
            <DeleteUserModal
              data={rowData}
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
        console.log("event", event, "-----row-----", row);
        setRowData(row);
      }, // 点击行
      onDoubleClick: (event) => {},
      onContextMenu: (event) => {},
      onMouseEnter: (event) => {}, // 鼠标移入行
      onMouseLeave: (event) => {},
    };
  }

  return (
    <div>
      <div>
        <AddOrEditUserModal
          action="add"
          updateParent={() => {
            console.log("updateParent!");
            setUpdate(!update);
          }}
        />
      </div>
      <Spin spinning={loading} tip="Loading..." size="large">
        <Table
          bordered="true" //是否展示外边框和列边框
          size="large" //表格大小
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
    </div>
  );
}

export default UserTable;
