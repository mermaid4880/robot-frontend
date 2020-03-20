//packages
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, TextField, Button } from "@material-ui/core";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
//functions
import { getData } from "../../functions/requestDataFromAPI";

const useStyles = makeStyles({
  root: {
    height: 830,
    backgroundColor: "#f9f7f7"
  },
  title: {
    padding: 12,
    paddingLeft: 40,
    backgroundColor: "#f5eee6"
  },
  tree: {
    flexGrow: 1,
    maxWidth: 800,
    padding: 50,
    paddingTop: 20
  },
  input: {
    marginTop: 15,
    marginLeft: 45
  },
  button: {
    marginTop: 18,
    marginLeft: 25
  }
});


function Tree1() {
  const classes = useStyles();

  const [treeData, setTreeData] = useState({});

  useEffect(() => {
    //————————————————————————————GET请求
    getData("areas/tree").then(data => {
      console.log("get结果", data);
      if (data.success) {
        var result = data.data;
        setTreeData(result);
      } else {
        alert(data.data.detail);
      }
    });
  }, []);

  function drawTree(nodes) {
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
      return (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.areaName}>
          {hasChild ? nodes.children.map(node => drawTree(node)) : <TreeItem />}
          {hasDeviceGroup ? (
            nodes.deviceGroupByTypes.map(node => drawDeviceGroupByTypes(node))
          ) : (
            <TreeItem />
          )}
        </TreeItem>
      );
    }
  }

  function drawDeviceGroupByTypes(node) {
    console.log("node", node);
    //是否有deviceTypeName
    var hasDeviceTypeName = node.deviceTypeName;
    console.log("hasDeviceTypeName", hasDeviceTypeName);
    //是否有devices
    var hasDevices = Array.isArray(node.devices) && node.devices.length > 0;
    console.log("hasDevices", hasDevices);
    if (hasDeviceTypeName) {
      return (
        <TreeItem nodeId={node.deviceTypeName} label={node.deviceTypeName}>
          {hasDevices ? (
            node.devices.map(node => drawDevices(node))
          ) : (
            <TreeItem />
          )}
        </TreeItem>
      );
    } else {
      return <TreeItem />;
    }
  }

  function drawDevices(node) {
    console.log("drawDevices_node", node);
    //是否有deviceName
    var hasDeviceName = node.deviceName;
    console.log("hasDeviceName", hasDeviceName);
    //是否有meters
    var hasMeters = Array.isArray(node.meters) && node.meters.length > 0;
    console.log("hasMeters", hasMeters);
    if (hasDeviceName) {
      return (
        <TreeItem nodeId={node.deviceName} label={node.deviceName}>
          {hasMeters ? node.meters.map(node => drawMeters(node)) : <TreeItem />}
        </TreeItem>
      );
    } else {
      return <TreeItem />;
    }
  }

  function drawMeters(node) {
    console.log("drawMeters_node", node);
    //是否有meterName
    var hasMeterName = node.meterName;
    console.log("hasMeterName", hasMeterName);
    if (hasMeterName) {
      return <TreeItem nodeId={node.meterName} label={node.meterName}></TreeItem>;
    } else {
      return <TreeItem />;
    }
  }


  return (
    <Paper className={classes.root} elevation="3">
      <Typography className={classes.title} variant="h6" gutterBottom>
        点位树
      </Typography>
      <TextField
        className={classes.input}
        size="small"
        margin="dense"
        id="outlined-basic"
        label="关键字查询"
        variant="outlined"
      />
      <Button
        className={classes.button}
        variant="outlined"
        component="span"
      >
        查询
      </Button>
      <TreeView
        className={classes.tree}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={["root"]}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {drawTree(treeData)}
      </TreeView>
    </Paper>
  );
}

export default Tree1;
