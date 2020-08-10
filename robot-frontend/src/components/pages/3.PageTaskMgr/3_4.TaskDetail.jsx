//packages
import React, { useState, useEffect } from "react";
import { List, Label } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
//functions
import emitter from "../../../functions/events.js";

//———————————————————————————————————————————————css
//root
const gridStyle = {
  margin: "0.5rem 0 0 1rem",
  height: "270px",
  overflow: "auto",
};
//每条信息
const listItemStyle = {
  padding: "10px 0px 5px 0px",
  whiteSpace: "normal",
  wordBreak: "break-all",
  overflow: "hidden",
};
//每条信息的标题
const labelStyle = {
  fontSize: "1.1rem",
  width: "100px",
  display: "inline-block",
  verticalAlign: "top",
};
//每条信息的内容
const contentStyle = {
  width: "310px",
  paddingTop: "0.3rem",
  display: "inline-block",
  verticalAlign: "center",
};

//———————————————————————————————————————————————全局函数
//初始化TaskDetail的所有默认数据
function initDetail(data) {
  // const data = {
  //   //传入的单条数据
  //   key: "1",
  //   id: "21", //任务ID
  //   taskName: "asdfdsafasdfsdafasdfasdfasdfsdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", //任务名称
  //   taskDescription:
  //     "asdfdsafasdfsdafasdfasdfasdfsdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", //任务描述
  //   createTime: "2018-10-26 16:32:16", //任务创建时间
  //   endAction: "自动充电", //结束动作【"自动充电"  "原地待命"】
  //   type: "例行巡检", //任务类型【"例行巡检"  "自定义巡检"  "特殊巡检"】
  //   createUserId: "", //创建任务UserId
  //   meters:
  //     "k执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk", //点位信息
  //   status: "执行完成", //任务执行状态【"等待执行"  "执行完成"  "正在执行"  "中途终止"  "任务超期"】
  //   mode: "立即执行", //任务执行方式【"立即执行"  "定期执行"  "周期执行"】
  //   startTime: "2018-10-26 16:32:16", //任务开始时间（当mode为定期执行和周期执行时有效）
  //   period: "72", //任务执行周期（当mode为周期执行时有效）
  //   isStart: "启用", //任务是否启用（当mode为周期执行时有效）【"启用"  "禁用"】
  // };
  let newDetail = {
    id: data && data.id ? data.id : "",
    taskName: data && data.taskName ? data.taskName : "",
    taskDescription: data && data.taskDescription ? data.taskDescription : "",
    createTime: data && data.createTime ? data.createTime : "",
    endAction: data && data.endAction ? data.endAction : "",
    type: data && data.type ? data.type : "",
    createUserId: data && data.createUserId ? data.createUserId : "",
    meters: data && data.meters ? data.meters : "",
    status: data && data.status ? data.status : "",
    mode: data && data.mode ? data.mode : "",
    startTime: data && data.startTime ? data.startTime : "",
    period: data && data.period ? data.period : "",
    isStart: data && data.isStart ? data.isStart : "",
  };
  return newDetail;
}

function TaskDetail(props) {
  // const props = {
  //   data: {
  //     //点击的行数据
  //     key: "1",
  //     id: "21", //任务ID
  //     taskName:
  //       "asdfdsafasdfsdafasdfasdfasdfsdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", //任务名称
  //     taskDescription:
  //       "asdfdsafasdfsdafasdfasdfasdfsdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", //任务描述
  //     createTime: "2018-10-26 16:32:16", //任务创建时间
  //     endAction: "自动充电", //结束动作【"自动充电"  "原地待命"】
  //     type: "例行巡检", //任务类型【"例行巡检"  "自定义巡检"  "特殊巡检"】
  //     createUserId: "", //创建任务UserId
  //     meters:
  //       "k执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成执行完成kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk", //点位信息
  //     status: "执行完成", //任务执行状态【"等待执行"  "执行完成"  "正在执行"  "中途终止"  "任务超期"】
  //     mode: "立即执行", //任务执行方式【"立即执行"  "定期执行"  "周期执行"】
  //     startTime: "2018-10-26 16:32:16", //任务开始时间（当mode为定期执行和周期执行时有效）
  //     period: "72", //任务执行周期（当mode为周期执行时有效）
  //     isStart: "启用", //任务是否启用（当mode为周期执行时有效）【"启用"  "禁用"】
  //   },
  // };
  //———————————————————————————————————————————————useState
  //显示的详细信息内容
  const [detail, setDetail] = useState({});

  //———————————————————————————————————————————————useEffect
  useEffect(() => {
    setDetail(initDetail(props.data));
  }, [props.data]);

  useEffect(() => {
    //————————————————————————————添加监听事件
    emitter.addListener("taskDetail:", (message) => {
      //如果由2_1.TaskCalendar.jsx发来消息（显示的详细信息内容）
      // console.log("message", message);
      setDetail(message);
    });
  }, []);

  return (
    <Grid style={gridStyle} columns={3} divided>
      <Grid.Row stretched>
        <Grid.Column>
          <List divided>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                ID
              </Label>
              <div style={contentStyle}>{detail.id}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                名称
              </Label>
              <div style={contentStyle}>{detail.taskName}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                创建时间
              </Label>
              <div style={contentStyle}>{detail.createTime}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                类型
              </Label>
              <div style={contentStyle}>{detail.type}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                是否启用
              </Label>
              <div style={contentStyle}>{detail.isStart}</div>
            </List.Item>
          </List>
        </Grid.Column>
        <Grid.Column>
          <List divided>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                执行方式
              </Label>
              <div style={contentStyle}>{detail.mode}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                执行状态
              </Label>
              <div style={contentStyle}>{detail.status}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                开始时间
              </Label>
              <div style={contentStyle}>{detail.startTime}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                执行周期
              </Label>
              <div style={contentStyle}>{detail.period}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                结束动作
              </Label>
              <div style={contentStyle}>{detail.endAction}</div>
            </List.Item>
          </List>
        </Grid.Column>
        <Grid.Column>
          <List divided>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                点位信息
              </Label>
              <div style={contentStyle}>{detail.meters}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                详情描述
              </Label>
              <div style={contentStyle}>{detail.taskDescription}</div>
            </List.Item>
          </List>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default TaskDetail;
