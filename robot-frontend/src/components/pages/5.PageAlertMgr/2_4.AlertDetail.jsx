//packages
import React from "react";
import { List, Label } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
//images
import ImageBackground from "../../../images/PageLogin-bg.png";

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
  width: "110px",
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
//图片
const imageStyle = {
  width: "440px",
  height: "259px",
};

function AlertDetail(props) {
  // const props = {
  //   data: {
  //     //点击的行数据
  //     key: "1",
  //     id: "21", //告警信息的id
  //     source: "1", //告警信息来源的机器人id
  //     detail:
  //       "A线路避雷器A相_泄露电流asdfdsafasdfsdafA线路避雷器A相_泄露电流A线路避雷器A相_泄露电流A线路避雷器A相_泄露电流A线路避雷器A相_泄露电流asdasdfdsafasdfsdafasdfasdfasdfsdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaafasdfasdfsdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", //告警信息详细描述
  //     time: "2018-10-26 16:32:16", //识别时间
  //     meter: "100", //点位id
  //     meterName: "A线路避雷器A相_泄露电流表", //点位名称（检测内容）
  //     level: "正常", //点位状态（告警等级）【"正常"  "预警"  "一般告警"  "严重告警"  "危急告警"】
  //     detectionType: "表计读取", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
  //     value: "36度", //识别结果
  //     imgUrl: "/pic/40.jpg", //图片路径
  //     isDealed: "未确认", //确认状态（5种）【"未确认"  "现场确认无异常"  "确认异常——已处理"  "确认异常——需要进一步跟踪"  "确认异常——在允许范围内"】
  //   },
  // };

  return (
    <Grid style={gridStyle} columns={4} divided>
      <Grid.Row stretched>
        <Grid.Column>
          <img
            style={imageStyle}
            src={ImageBackground}
            alt="告警信息图片"
          />
        </Grid.Column>
        <Grid.Column>
          <List divided>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                告警信息ID
              </Label>
              <div style={contentStyle}>{props.data.id}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                机器人ID
              </Label>
              <div style={contentStyle}>{props.data.source}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                识别时间
              </Label>
              <div style={contentStyle}>{props.data.time}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                告警等级
              </Label>
              <div style={contentStyle}>{props.data.level}</div>
            </List.Item>
          </List>
        </Grid.Column>
        <Grid.Column>
          <List divided>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                点位名称
              </Label>
              <div style={contentStyle}>{props.data.meterName}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                识别类型
              </Label>
              <div style={contentStyle}>{props.data.detectionType}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                识别结果
              </Label>
              <div style={contentStyle}>{props.data.value}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                详情描述
              </Label>
              <div style={contentStyle}>{props.data.detail}</div>
            </List.Item>
          </List>
        </Grid.Column>
        <Grid.Column>
          <List divided>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                确认状态
              </Label>
              <div style={contentStyle}>{props.data.isDealed}</div>
            </List.Item>
            <List.Item style={listItemStyle}></List.Item>
          </List>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default AlertDetail;
