//packages
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Collapse, Tree, Input, Checkbox, Tooltip, Row, Col } from "antd";
import { makeStyles } from "@material-ui/core/styles";
//functions
import { getData } from "../../functions/requestDataFromAPI.js";
import emitter from "../../functions/events.js";

//———————————————————————————————————————————————css
const useStyles = makeStyles({
  //本组件在  任务管理——Tab 中的root样式
  rootInsideTab: {
    width: "100%",
    height: "798px",
    backgroundColor: "#fafafa",
  },
  //本组件在  任务管理——新增任务或编辑任务 中的root样式
  rootInsideForm: {
    width: "100%",
    backgroundColor: "#fafafa",
  },
  //本组件在  巡检记录——点位巡检记录 中的root样式
  rootInsidePage: {
    width: "100%",
    height: "847px",
    backgroundColor: "#fafafa",
  },
  checkboxGroup: {
    width: "100%",
  },
  //<Tree>组件在  任务管理——Tab 中筛选条件选项卡展开时的样式
  treeSmallInsideTab: {
    height: "522px", //搜索框高度：40px
    overflow: "auto",
  },
  //<Tree>组件在  任务管理——Tab 中筛选条件选项卡折叠时的样式
  treeBigInsideTab: {
    height: "630px", //搜索框高度：40px
    overflow: "auto",
  },
  //<Tree>组件在  巡检记录——点位巡检记录 中筛选条件选项卡展开时的样式
  treeSmallInsidePage: {
    height: "569px", //搜索框高度：40px
    overflow: "auto",
  },
  //<Tree>组件在  巡检记录——点位巡检记录 中筛选条件选项卡折叠时的样式
  treeBigInsidePage: {
    height: "677px", //搜索框高度：40px
    overflow: "auto",
  },
});

//———————————————————————————————————————————————antd???
const { Search } = Input;
const { Panel } = Collapse;

//———————————————————————————————————————————————获取TREE节点函数
//产生所有节点的list  [{key:node.key,title:node.title},{...},{...}]
const dataList = [];
const generateList = (data) => {
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
      if (node.children.some((item) => item.key === key)) {
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
  // console.log("generateMeters_node", node);
  //是否有meterName
  var hasMeterName = node.meterName;
  // console.log("hasMeterName", hasMeterName);
  if (hasMeterName) {
    return {
      title: node.meterName + "（" + node.detectionType + "）",
      key: "meter" + node.id,
    };
  }
}
//2
function generateDevices(node) {
  // console.log("generateDevices_node", node);
  //是否有deviceName
  var hasDeviceName = node.deviceName;
  // console.log("hasDeviceName", hasDeviceName);
  //是否有meters
  var hasMeters = Array.isArray(node.meters) && node.meters.length > 0;
  // console.log("hasMeters", hasMeters);
  if (hasDeviceName) {
    return {
      title: node.deviceName,
      key: "device" + node.id,
      children: hasMeters && node.meters.map((node) => generateMeters(node)),
    };
  }
}
//3
function generateDeviceGroupByTypes(node, parentID, index) {
  // console.log("generateDeviceGroupByTypes_node", node);
  //是否有deviceTypeName
  var hasDeviceTypeName = node.deviceTypeName;
  // console.log("hasDeviceTypeName", hasDeviceTypeName);
  //是否有devices
  var hasDevices = Array.isArray(node.devices) && node.devices.length > 0;
  // console.log("hasDevices", hasDevices);
  if (hasDeviceTypeName) {
    return {
      title: node.deviceTypeName,
      key: index + "deviceGroupByType" + parentID,
      children: hasDevices && node.devices.map((node) => generateDevices(node)),
    };
  }
}
//4
function generateTree(nodes) {
  //是否有areaName
  var hasAreaName = nodes.areaName;
  // console.log("hasAreaName", hasAreaName);
  //有areaName
  if (hasAreaName) {
    //是否有children
    var hasChild = Array.isArray(nodes.children) && nodes.children.length > 0;
    // console.log("hasChild", hasChild);
    //是否有deviceGroupByTypes
    var hasDeviceGroup =
      Array.isArray(nodes.deviceGroupByTypes) &&
      nodes.deviceGroupByTypes.length > 0;
    // console.log("hasDeviceGroup", hasDeviceGroup);
    if (hasChild)
      return {
        title: nodes.areaName,
        key: "children" + nodes.id,
        children: hasChild && nodes.children.map((node) => generateTree(node)),
      };
    else if (hasDeviceGroup)
      return {
        title: nodes.areaName,
        key: "deviceGroupByType" + nodes.id,
        children:
          hasDeviceGroup &&
          nodes.deviceGroupByTypes.map(function (node, index, arr) {
            return generateDeviceGroupByTypes(node, nodes.id, index);
          }),
      };
  }
}

//———————————————————————————————————————————————其他函数
//合并两个数组并去重
function MergeArray(arr1, arr2) {
  var _arr = [];
  var i = 0;
  for (i = 0; i < arr1.length; i++) {
    _arr.push(arr1[i]);
  }
  for (i = 0; i < arr2.length; i++) {
    var flag = true;
    for (var j = 0; j < arr1.length; j++) {
      if (arr2[i] === arr1[j]) {
        flag = false;
        break;
      }
    }
    if (flag) {
      _arr.push(arr2[i]);
    }
  }
  return _arr;
}

//根据<Tree>中的CheckBox的状态获取相应的id
function getMetersID(checkedKeys) {
  var IDstring = "";
  var arrayID = [];
  checkedKeys.forEach((item) => {
    if (item.indexOf("meter") > -1) {
      arrayID.push(item.slice(5));
      // console.log("arrayID", arrayID);
      IDstring = arrayID.join(",");
      console.log("IDstring", IDstring);
    }
  });
  return IDstring;
}

//根据<Tree>中鼠标选中的节点的状态获取其相应的id
function getMeterID(selectedKey) {
  var ID = "";
  if (selectedKey && selectedKey.indexOf("meter") > -1)
    ID = selectedKey.slice(5);
  return ID;
}

function TreeSearch(props) {
  const classes = useStyles();

  //———————————————————————————————————————————————useHistory
  const history = useHistory();

  //———————————————————————————————————————————————useState
  //<Collapse>的展开状态
  const [collapseState, setCollapseState] = useState({
    CheckGroup: true, //筛选条件的<Collapse>
    Tree: true, //设备点位树的<Collapse>
  });

  //<Checkbox.Group>中被选中的<Checkbox>
  const [checkValue, setcheckValue] = useState([]); //eg.["红外测温","设备外观查看（不可识别）"]

  //<Search>中的文字
  const [searchText, setSearchText] = useState("");

  //<Tree>的数据
  const [treeData, setTreeData] = useState([]);

  //<Tree>的状态
  const [treeState, setTreeState] = useState({
    expandedKeys: [],
    searchValue: "",
    autoExpandParent: true,
  });

  //<Tree>中CheckBox被勾选的节点的Keys
  const [checkedTreeKeys, setCheckedTreeKeys] = useState([]);

  //———————————————————————————————————————————————useEffect
  //当组件加载完成后GET请求获取点位树
  useEffect(() => {
    //————————————————————————————GET请求
    getData("areas/tree")
      .then((data) => {
        console.log("get结果", data);
        if (data.success) {
          var result = data.data;
          // console.log("result", result);
          var newTreeData = [generateTree(result)];
          // console.log("newTreeData", newTreeData);
          setTreeData(newTreeData);
          generateList(newTreeData); //产生所有节点的list（供搜索使用）
          // console.log("dataList", dataList);
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
  }, []);

  //GET请求获取点位树完成后根据传入的meters字符串（eg."1,2,6"）展开并勾选树
  useEffect(() => {
    //————————————————————————————根据传入的meters字符串（eg."1,2,6"）展开并勾选树
    if (props.meters) {
      // console.log("props.meters", props.meters);
      expandAndCheckTree(props.meters);
    }
  }, [treeData]);

  //———————————————————————————————————————————————其他函数
  //根据字符串keywords展开树
  function expandTree(keywords) {
    //把输入的内容value按空格分割并删掉空元素，获取搜索关键字数组keywordArray
    var keywordArray = keywords
      .split(" ") //（按空格分割）
      .filter((keyword) => keyword && keyword.trim()); //删掉空元素
    // console.log("keywordArray", keywordArray);
    //设置<Checkbox.Group>中被选中的<Checkbox>
    setcheckValue(keywordArray);
    //如果输入的内容被清空（关键字数组keywordArray为空），合上树
    if (keywordArray.length === 0) {
      setTreeState((prevState) => ({
        expandedKeys: [],
        searchValue: prevState.searchValue,
        autoExpandParent: true,
      }));
    }
    //根据产生需展开的树节点key数组expandedKeys，展开树
    var expandedKeys = [];
    keywordArray.map((keyword) => {
      var nowExpandedKeys = dataList //根据关键字数组keywordArray中的每个关键字产生每个树节点key数组nowExpandedKeys
        .map((item) => {
          if (item.title.indexOf(keyword) > -1) {
            return getParentKey(item.key, treeData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      expandedKeys = MergeArray(nowExpandedKeys, expandedKeys); //去重合并
      setTreeState({
        expandedKeys,
        searchValue: keyword,
        autoExpandParent: true,
      });
      // console.log(
      //   "dataList",
      //   dataList,
      //   "keywordArray",
      //   keywordArray,
      //   "keyword",
      //   keyword,
      //   "nowExpandedKeys",
      //   nowExpandedKeys,
      //   "expandedKeys",
      //   expandedKeys
      // );
      return null;
    });
  }

  //根据meters字符串（eg."1,2,6"）展开并勾选树
  function expandAndCheckTree(meters) {
    // console.log("meters", meters);
    //把字符串meters按逗号分割，获取点位ID数组metersIdArray
    var metersIdArray = meters.split(",");
    // console.log("metersIdArray", metersIdArray);
    //如果点位ID数组metersIdArray为空，合上树
    if (metersIdArray.length === 0) {
      setTreeState((prevState) => ({
        expandedKeys: [],
        searchValue: prevState.searchValue,
        autoExpandParent: true,
      }));
    }
    //根据产生需展开的树节点key数组expandedKeys，展开树
    var expandedKeys = [];
    var checkedKeys = [];
    metersIdArray.map((meterId) => {
      var nowExpandedKeys = dataList //根据点位ID数组metersIdArray中的每个meterId，勾选该节点并产生每个树节点key数组nowExpandedKeys
        .map((item) => {
          if (item.key === "meter" + meterId) {
            checkedKeys.push(item.key); //勾选该节点
            return getParentKey(item.key, treeData); //返回父节点
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      expandedKeys = MergeArray(nowExpandedKeys, expandedKeys); //去重合并
      setTreeState((prevState) => ({
        expandedKeys,
        searchValue: prevState.searchValue,
        autoExpandParent: true,
      }));
      // console.log("checkedKeys", checkedKeys);
      setCheckedTreeKeys(checkedKeys);
      // console.log(
      //   "dataList",
      //   dataList,
      //   "metersIdArray",
      //   metersIdArray,
      //   "meterId",
      //   meterId,
      //   "nowExpandedKeys",
      //   nowExpandedKeys,
      //   "expandedKeys",
      //   expandedKeys
      // );
      return null;
    });
  }

  //———————————————————————————————————————————————事件响应函数
  //获取<Collapse>变化事件响应函数
  function handleCollapseChange(expandKeys) {
    // console.log("", expandKeys);
    expandKeys.indexOf("1") !== -1
      ? setCollapseState((prev) => {
          return { ...prev, CheckGroup: true };
        })
      : setCollapseState((prev) => {
          return { ...prev, CheckGroup: false };
        });

    expandKeys.indexOf("2") !== -1
      ? setCollapseState((prev) => {
          return { ...prev, Tree: true };
        })
      : setCollapseState((prev) => {
          return { ...prev, Tree: false };
        });
    // console.log("collapseState", collapseState);
  }

  //<Checkbox>变化事件响应函数
  function handleCheckboxChange(checkedValues) {
    console.log("checkedValues = ", checkedValues);
    var keywords = checkedValues.join(" ");
    console.log("keywords", keywords);
    setSearchText(keywords);
    expandTree(keywords);
  }

  //<Search>变化事件响应函数
  function handleSearchChange(e) {
    console.log("进入SearchChange事件 e.target", e.target);
    const { value } = e.target;
    setSearchText(value);
    expandTree(value);
  }

  //<Search>搜索事件响应函数
  function handleSearchSearch(e) {
    console.log("进入SearchSearch事件 e", e);
    expandTree(e);
  }

  //<Tree>节点展开事件响应函数
  function handleTreeExpand(expandedKeys) {
    console.log("expandedKeys", expandedKeys);
    setTreeState((prevState) => ({
      expandedKeys,
      searchValue: prevState.searchValue,
      autoExpandParent: false,
    }));
  }

  //<Tree>勾选CheckBox事件响应函数
  var meterIDs = "";
  function handleTreeCheck(checkedKeys) {
    console.log("checkedKeys", checkedKeys);
    setCheckedTreeKeys(checkedKeys);
    meterIDs = getMetersID(checkedKeys);
    console.log("taskIDs", meterIDs);
    //向父组件传taskIDs
    props.exportMeters && props.exportMeters({ value: meterIDs });
  }

  //<Tree>鼠标选中某节点事件响应函数
  var meterID = "";
  function handleTreeSelect(selectedKeys, e) {
    console.log("selectedKeys", selectedKeys);
    meterID = getMeterID(selectedKeys[0]);
    console.log("meterID", meterID);
    //发送事件到4.PageTaskRecord/1.PageOneMeterRecords/2_.OneMeterRecordsTableAndDetail#2#3.jsx中（根据点位ID获取记录巡检记录列表并刷新）
    props.type === "insidePage" &&
      emitter.emit("updateOneMeterRecordsTable", meterID);
  }

  //———————————————————————————————————————————————画树
  //根据树控件的数据data画树
  const { searchValue, expandedKeys, autoExpandParent } = treeState;
  const loop = (data) =>
    data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          props.type === "insidePage" && item.key.indexOf("meter") > -1 ? (
            <Tooltip title="单击该点位查询全部巡检记录">
              <span>
                {beforeStr}
                <span className="site-tree-search-value">{searchValue}</span>
                {afterStr}
              </span>
            </Tooltip>
          ) : (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          )
        ) : props.type === "insidePage" && item.key.indexOf("meter") > -1 ? (
          <Tooltip title="单击该点位查询全部巡检记录">
            <span>{item.title}</span>
          </Tooltip>
        ) : (
          <span>{item.title}</span>
        );

      if (item.children) {
        return { title, key: item.key, children: loop(item.children) };
      }

      return {
        title,
        key: item.key,
      };
    });

  return (
    <Collapse
      className={
        props.type && props.type === "insideTab"
          ? classes.rootInsideTab
          : props.type && props.type === "insideForm"
          ? classes.rootInsideForm
          : props.type && props.type === "insidePage" && classes.rootInsidePage
      }
      defaultActiveKey={["1", "2"]}
      onChange={handleCollapseChange}
    >
      <Panel header="筛选条件" key="1">
        <Checkbox.Group
          className={classes.checkboxGroup}
          onChange={handleCheckboxChange}
          value={checkValue}
        >
          <Row>
            <Col span={12}>
              <Checkbox value="红外测温">红外测温</Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value="表计读取">表计读取</Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value="位置状态识别">位置状态识别</Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value="设备外观查看（可识别）">
                设备外观查看（可识别）
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value="设备外观查看（不可识别）">
                设备外观查看（不可识别）
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value="声音检测">声音检测</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </Panel>
      <Panel header="设备点位树" key="2">
        <Search
          style={{ marginBottom: 8, height: 50 }}
          // placeholder="Search"
          onChange={handleSearchChange}
          onSearch={handleSearchSearch}
          value={searchText}
          id="searchBox"
        />
        <Tree
          className={
            props.type && props.type === "insideTab"
              ? collapseState.CheckGroup
                ? classes.treeSmallInsideTab
                : classes.treeBigInsideTab
              : props.type && props.type === "insidePage"
              ? collapseState.CheckGroup
                ? classes.treeSmallInsidePage
                : classes.treeBigInsidePage
              : null
          }
          height={
            collapseState.CheckGroup
              ? props.type && props.type === "insidePage"
                ? classes.treeSmallInsidePage.height
                : classes.treeSmallInsideTab.height
              : props.type && props.type === "insidePage"
              ? classes.treeBigInsideTab.height
              : classes.treeBigInsideTab.height
          }
          checkable={props.type && props.type === "insideForm" ? true : false}
          checkedKeys={checkedTreeKeys}
          onCheck={handleTreeCheck}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onExpand={handleTreeExpand}
          treeData={loop(treeData)}
          onSelect={handleTreeSelect}
        />
      </Panel>
    </Collapse>
  );
}

export default TreeSearch;
