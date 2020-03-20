//packages
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardContent } from "@material-ui/core";
//functions
import { getData } from "../../functions/requestDataFromAPI";

const useStyles = makeStyles({
  root: {
    marginLeft: "0.5rem",
    height: 220,
    width: 1250,
    backgroundColor: "#f9f7f7"
  },
  label: {
    fontSize: 14,
    marginBottom: 15
  },
  title: {
    fontSize: 18,
    display: "inline-block",
    margin: "0 0.5rem 1rem 2rem"
  },
  data: {
    color: "#3f72af",
    fontSize: 18,
    display: "inline-block",
    margin: "0 0 1rem 0"
  }
});

function RobotCard() {
  const classes = useStyles();

  const [task, setTask] = useState({
    taskFinishId: "无反馈数据",
    taskName: "无反馈数据",
    meterCount: "无反馈数据",
    inspectMeterCount: "无反馈数据",
    abnormalMeterCount: "无反馈数据",
    nowMeterName: "无反馈数据",
    totalTime: "无反馈数据",
    progress: "无反馈数据"
  });

  var [count,setCount] = useState(true);

  setInterval(() => {
    setCount(count===true?count=false:count=true);
  }, 2000);

  useEffect(() => {
    //————————————————————————————GET请求
    getData("/taskFinish/now/192.168.0.1").then(data => {
      console.log("get结果", data);
      if (data.success) {
        var result = data.data;
        console.log(result);
        setTask(result);
      } else {
        alert(data.data.detail);
      }
    });
  }, [count]);

  return (
    <Card className={classes.root} raised>
      <CardContent>
        <Typography className={classes.label} color="textSecondary">
          机器人信息
        </Typography>
        <Typography align="left" className={classes.title}>
          当前机器人：
        </Typography>
        <Typography className={classes.data}>
          {task.taskFinishId === null ? "无反馈数据" : task.taskFinishId}
        </Typography>
        <Typography className={classes.title}>巡检任务名称：</Typography>
        <Typography className={classes.data}>
          {task.taskName === null ? "无反馈数据" : task.taskName}
        </Typography>
        <Typography className={classes.label} color="textSecondary">
          当前巡检状态
        </Typography>
        <Typography className={classes.title}>巡检节点总数：</Typography>
        <Typography className={classes.data}>
          {task.meterCount === null ? "无反馈数据" : task.meterCount}
        </Typography>
        <Typography className={classes.title}>异常巡检点数：</Typography>
        <Typography className={classes.data}>
          {task.abnormalMeterCount === null
            ? "无反馈数据"
            : task.abnormalMeterCount}
        </Typography>
        <Typography className={classes.title}>当前巡检点：</Typography>
        <Typography className={classes.data}>
          {task.nowMeterName === null ? "无反馈数据" : task.nowMeterName}
        </Typography>
        <Typography className={classes.title}>预计巡检时间：</Typography>
        <Typography className={classes.data}>
          {task.totalTime === null ? "无反馈数据" : task.totalTime}
        </Typography>
        <Typography className={classes.title}>巡检进度：</Typography>
        <Typography className={classes.data}>
          {task.progress === null ? "无反馈数据" : task.progress}
        </Typography>
        <Typography className={classes.title}>已巡检点数：</Typography>
        <Typography className={classes.data}>
          {task.inspectMeterCount === null
            ? "无反馈数据"
            : task.inspectMeterCount}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default RobotCard;
