//packages
import React, { useState, useEffect } from "react";
import { Tree, Input } from "antd";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
//functions
import { getData } from "../../functions/requestDataFromAPI";

//————————————————————————————css
const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "830px"
  }
});

const { Search } = Input;

//产生所有节点的list  [{key:node.key,title:node.title},{...},{...}]
const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({ key, title: node.title });
    if (node.children) {
      generateList(node.children);
    }
  }
};

//获取tree中当前key的parentKey
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

//将API返回的json格式数据转化为树所需要的数组格式[{key,title,children:[{key,title,children:[]},...]},{},...]
//1
function generateMeters(node) {
  console.log("generateMeters_node", node);
  //是否有meterName
  var hasMeterName = node.meterName;
  console.log("hasMeterName", hasMeterName);
  if (hasMeterName) {
    return { title: node.meterName, key: "meter" + node.id };
  }
}
//2
function generateDevices(node) {
  console.log("generateDevices_node", node);
  //是否有deviceName
  var hasDeviceName = node.deviceName;
  console.log("hasDeviceName", hasDeviceName);
  //是否有meters
  var hasMeters = Array.isArray(node.meters) && node.meters.length > 0;
  console.log("hasMeters", hasMeters);
  if (hasDeviceName) {
    return {
      title: node.deviceName,
      key: "device" + node.id,
      children: hasMeters && node.meters.map(node => generateMeters(node))
    };
  }
}
//3
function generateDeviceGroupByTypes(node, parentID, index) {
  console.log("generateDeviceGroupByTypes_node", node);
  //是否有deviceTypeName
  var hasDeviceTypeName = node.deviceTypeName;
  console.log("hasDeviceTypeName", hasDeviceTypeName);
  //是否有devices
  var hasDevices = Array.isArray(node.devices) && node.devices.length > 0;
  console.log("hasDevices", hasDevices);
  if (hasDeviceTypeName) {
    return {
      title: node.deviceTypeName,
      key: index + "deviceGroupByType" + parentID,
      children: hasDevices && node.devices.map(node => generateDevices(node))
    };
  }
}
//4
function generateTree(nodes) {
  //是否有areaName
  var hasAreaName = nodes.areaName;
  console.log("hasAreaName", hasAreaName);
  //有areaName
  if (hasAreaName) {
    //是否有children
    var hasChild = Array.isArray(nodes.children) && nodes.children.length > 0;
    console.log("hasChild", hasChild);
    //是否有deviceGroupByTypes
    var hasDeviceGroup =
      Array.isArray(nodes.deviceGroupByTypes) &&
      nodes.deviceGroupByTypes.length > 0;
    console.log("hasDeviceGroup", hasDeviceGroup);
    if (hasChild)
      return {
        title: nodes.areaName,
        key: "children" + nodes.id,
        children: hasChild && nodes.children.map(node => generateTree(node))
      };
    else if (hasDeviceGroup)
      return {
        title: nodes.areaName,
        key: "deviceGroupByType" + nodes.id,
        children:
          hasDeviceGroup &&
          nodes.deviceGroupByTypes.map(function(node, index, arr) {
            return generateDeviceGroupByTypes(node, nodes.id, index);
          })
      };
  }
}

function TreeSearch() {
  const classes = useStyles();

  //树控件的数据的状态
  const [treeData, setTreeData] = useState([]);

  //树控件的状态
  const [state, setState] = useState({
    expandedKeys: [],
    searchValue: "",
    autoExpandParent: true
  });

  useEffect(() => {
    //————————————————————————————GET请求
    getData("areas/tree").then(data => {
      console.log("get结果", data);
      if (data.success) {
        var result = data.data;
        console.log("result", result);
        var newTreeData = [generateTree(result)];
        console.log("newTreeData", newTreeData);
        setTreeData(newTreeData);
        generateList(newTreeData); //产生所有节点的list（供搜索使用）
        console.log("dataList", dataList);
      } else {
        alert(data.data.detail);
      }
    });
  }, []);

  //节点展开事件响应函数
  function handleExpand(expandedKeys) {
    console.log("expandedKeys", expandedKeys);
    setState(prevState => ({
      expandedKeys,
      searchValue: prevState.searchValue,
      autoExpandParent: false
    }));
  }

  //搜索事件响应函数
  function handleChange(e) {
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true
    });
  }

  const [checkedKeys, setCheckedKeys] = useState([]);
  var taskIDs = "";
  //CheckBox事件响应函数
  function handleCheck(checkedKeys) {
    console.log("onCheck", checkedKeys);
    setCheckedKeys(checkedKeys);
    taskIDs = getMetersID(checkedKeys);
    console.log("taskIDs", taskIDs);
  }

  //根据CheckBox的状态获取相应的id
  function getMetersID(checkedKeys) {
    var IDstring = "";
    var arrayID = [];
    checkedKeys.forEach(item => {
      if (item.indexOf("meter") > -1) {
        arrayID.push(item.slice(5));
        console.log("arrayID", arrayID);
        IDstring = arrayID.join(",");
        console.log("IDstring", IDstring);
      }
    });
    return IDstring;
  }


  //根据树控件的数据data画树
  const { searchValue, expandedKeys, autoExpandParent } = state;
  const loop = data =>
    data.map(item => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return { title, key: item.key, children: loop(item.children) };
      }

      return {
        title,
        key: item.key
      };
    });

  return (
    <Paper elevation="5" className={classes.root}>
      <Search
        style={{ marginBottom: 8 }}
        placeholder="Search"
        onChange={handleChange}
      />
      <Tree
        checkable
        onExpand={handleExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={loop(treeData)}
        onCheck={handleCheck}
      />
    </Paper>
  );
}

export default TreeSearch;
