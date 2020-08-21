//packages
import React, { useState, useEffect } from "react";
import { List, Label } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo as videoIcon } from "@fortawesome/free-solid-svg-icons";
//elements
import MediaModal from "../../../elements/4.MediaModal.jsx";
//functions
import emitter from "../../../../functions/events.js";

//———————————————————————————————————————————————css
//root
const gridStyle = {
  margin: "0 0 0 1.5rem",
  height: "280px",
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
  width: "120px",
  display: "inline-block",
  verticalAlign: "top",
};
//每条信息的内容
const contentStyle = {
  width: "300px",
  paddingTop: "0.3rem",
  display: "inline-block",
  verticalAlign: "center",
};
//图片
const imageStyle = {
  width: "440px",
  height: "259px",
};

//———————————————————————————————————————————————全局函数
//初始化OneMeterOneRecordDetail的所有默认数据
function initDetail(data) {
  // const data = {
  //   //传入的单条数据
  //   key: "",
  //   id: "1", //巡检记录ID
  //   taskName: "asdfdsafasdfsdafasdfasdfasdfsdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", //任务名称
  //   meterCount: "1000", //总巡检点数
  //   meterFinishCount: "950", //已完成巡检点数
  //   meterAbnormalCount: "22", //异常巡检点数
  //   startTime: "2018-10-26 16:32:16", //巡检开始时间
  //   endTime: "2018-10-26 16:32:16", //巡检结束时间
  //   isFinished: "未完成", //巡检完成状态【"未完成"  "已完成"】
  //   resultId: "2", //巡检结果ID
  //   meterId: "1", //点位ID
  //   meterName: "asdfdsafasdfsdafasdfasdfa", //点位名称（检测内容）
  //   detectionType: "红外测温", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
  //   value: "36度", //识别结果
  //   mediaUrl: {
  //     valuePath: "D:/robot/static/pic/2018-1-1/111/50.jpg", //识别结果图片路径
  //     voicePath: "D:/robot/static/pic/2018-1-1/111/50.wav", //音频文件路径
  //     videoPath: "D:/robot/static/pic/2018-1-1/111/50.mp4", //视频文件路径
  //     vlPath: "D:/robot/static/pic/2018-1-1/111/50.jpg", //可见光图片文件路径（一定有）
  //     irPath: "D:/robot/static/pic/2018-1-1/111/50.jpg", //红外图片文件路径
  //   },
  //   status: "正常", //巡检结果【"正常"  "异常"】
  //   time: "2018-10-26 16:32:16", //检测时间
  //   checkStatus: "已确认", //巡检审核状态【"待审核"  "已确认"  "已修改"】
  //   checkInfo: "张三审核", //巡检审核信息
  // };
  let newDetail = {
    id: data && data.id ? data.id : "",
    taskName: data && data.taskName ? data.taskName : "",
    meterCount: data && data.meterCount ? data.meterCount : "",
    meterFinishCount:
      data && data.meterFinishCount ? data.meterFinishCount : "",
    meterAbnormalCount:
      data && data.meterAbnormalCount ? data.meterAbnormalCount : "",
    startTime: data && data.startTime ? data.startTime : "",
    endTime: data && data.endTime ? data.endTime : "",
    isFinished: data && data.isFinished ? data.isFinished : "",
    resultId: data && data.resultId ? data.resultId : "",
    meterId: data && data.meterId ? data.meterId : "",
    meterName: data && data.meterName ? data.meterName : "",
    detectionType: data && data.detectionType ? data.detectionType : "",
    value: data && data.value ? data.value : "",
    mediaUrl: {
      valuePath:
        data && data.mediaUrl && data.mediaUrl.valuePath
          ? data.mediaUrl.valuePath
          : "",
      voicePath:
        data && data.mediaUrl && data.mediaUrl.voicePath
          ? data.mediaUrl.voicePath
          : "",
      videoPath:
        data && data.mediaUrl && data.mediaUrl.videoPath
          ? data.mediaUrl.videoPath
          : "",
      vlPath:
        data && data.mediaUrl && data.mediaUrl.vlPath
          ? data.mediaUrl.vlPath
          : "",
      irPath:
        data && data.mediaUrl && data.mediaUrl.irPath
          ? data.mediaUrl.irPath
          : "",
    },
    status: data && data.status ? data.status : "",
    time: data && data.time ? data.time : "",
    checkStatus: data && data.checkStatus ? data.checkStatus : "",
    checkInfo: data && data.checkInfo ? data.checkInfo : "",
  };
  return newDetail;
}

function OneMeterOneRecordDetail(props) {
  // const props = {
  //   data: {
  //     //点击的行数据
  //     key: "",
  //     id: "1", //巡检记录ID
  //     taskName:
  //       "asdfdsafasdfsdafasdfasdfasdfsdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", //任务名称
  //     meterCount: "1000", //总巡检点数
  //     meterFinishCount: "950", //已完成巡检点数
  //     meterAbnormalCount: "22", //异常巡检点数
  //     startTime: "2018-10-26 16:32:16", //巡检开始时间
  //     endTime: "2018-10-26 16:32:16", //巡检结束时间
  //     isFinished: "未完成", //巡检完成状态【"未完成"  "已完成"】
  //     resultId: "2", //巡检结果ID
  //     meterId: "1", //点位ID
  //     meterName: "asdfdsafasdfsdafasdfasdfa", //点位名称（检测内容）
  //     detectionType: "红外测温", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
  //     value: "36度", //识别结果
  //     mediaUrl: {
  //       valuePath: "D:/robot/static/pic/2018-1-1/111/50.jpg", //识别结果图片路径
  //       voicePath: "D:/robot/static/pic/2018-1-1/111/50.wav", //音频文件路径
  //       videoPath: "D:/robot/static/pic/2018-1-1/111/50.mp4", //视频文件路径
  //       vlPath: "D:/robot/static/pic/2018-1-1/111/50.jpg", //可见光图片文件路径（一定有）
  //       irPath: "D:/robot/static/pic/2018-1-1/111/50.jpg", //红外图片文件路径
  //     },
  //     status: "正常", //巡检结果【"正常"  "异常"】
  //     time: "2018-10-26 16:32:16", //检测时间
  //     checkStatus: "已确认", //巡检审核状态【"待审核"  "已确认"  "已修改"】
  //     checkInfo: "张三审核", //巡检审核信息
  //   },
  // };

  //———————————————————————————————————————————————useState
  //显示的详细信息内容
  const [detail, setDetail] = useState({});

  //———————————————————————————————————————————————useEffect
  //当（父组件2_.OneMeterRecordsTableAndDetail#2#3.jsx传来的data发生变化时），设置显示的详细信息内容
  useEffect(() => {
    setDetail(initDetail(props.data));
  }, [props.data]);

  //当（本组件加载完成时），添加监听清空详情事件
  useEffect(() => {
    //————————————————————————————添加监听事件
    emitter.addListener("emptyOneMeterOneRecordDetail", () => {
      //如果由2_.OneMeterRecordsTableAndDetail#2#3.jsx发来消息（清空详情）
      setDetail(initDetail({}));
    });
  }, []);

  return (
    <Grid style={gridStyle} columns={3} divided>
      <Grid.Row stretched>
        <Grid.Column>
          <List divided>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                巡检完成状态
              </Label>
              <div style={contentStyle}>{detail.isFinished}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                总巡检点数
              </Label>
              <div style={contentStyle}>{detail.meterCount}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                已完成点数
              </Label>
              <div style={contentStyle}>{detail.meterFinishCount}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                异常点数
              </Label>
              <div style={contentStyle}>{detail.meterAbnormalCount}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                巡检开始时间
              </Label>
              <div style={contentStyle}>{detail.startTime}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                巡检结束时间
              </Label>
              <div style={contentStyle}>{detail.endTime}</div>
            </List.Item>
          </List>
        </Grid.Column>
        <Grid.Column>
          <List divided>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                点位巡检结果
              </Label>
              <div style={contentStyle}>{detail.status}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                点位识别结果
              </Label>
              <div style={contentStyle}>{detail.value}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                点位检测时间
              </Label>
              <div style={contentStyle}>{detail.time}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                点位审核状态
              </Label>
              <div style={contentStyle}>{detail.checkStatus}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                点位审核信息
              </Label>
              <div style={contentStyle}>{detail.checkInfo}</div>
            </List.Item>
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                点位结果详情
              </Label>
              <div style={contentStyle}>
                {detail && detail.mediaUrl && (
                  <span>
                    {detail.mediaUrl.vlPath && ( //可见光图片文件路径（一定有）
                      <a>
                        <MediaModal
                          mediaInfo={{
                            meterName: detail.meterName,
                            mediaType: "可见光图片文件路径（一定有）",
                            mediaUrl: detail.mediaUrl.vlPath,
                          }}
                        />
                      </a>
                    )}
                    &nbsp;&nbsp;
                    {detail.mediaUrl.irPath && ( //红外图片文件路径
                      <a>
                        <MediaModal
                          mediaInfo={{
                            meterName: detail.meterName,
                            mediaType: "红外图片文件路径",
                            mediaUrl: detail.mediaUrl.irPath,
                          }}
                        />
                      </a>
                    )}
                    &nbsp;&nbsp;
                    {detail.mediaUrl.valuePath && ( //识别结果图片路径
                      <a>
                        <MediaModal
                          mediaInfo={{
                            meterName: detail.meterName,
                            mediaType: "识别结果图片路径",
                            mediaUrl: detail.mediaUrl.valuePath,
                          }}
                        />
                      </a>
                    )}
                    &nbsp;&nbsp;
                    {detail.mediaUrl.voicePath && ( //音频文件路径
                      <a>
                        <MediaModal
                          mediaInfo={{
                            meterName: detail.meterName,
                            mediaType: "音频文件路径",
                            mediaUrl: detail.mediaUrl.voicePath,
                          }}
                        />
                      </a>
                    )}
                    &nbsp;&nbsp;
                    {detail.mediaUrl.videoPath && ( //视频文件路径
                      <a
                        href={detail.mediaUrl.videoPath}
                        download="video"
                        style={{
                          color: "#6C6C6C",
                          textDecoration: "none",
                        }}
                      >
                        <Tooltip placement="bottom" title="查看视频文件">
                          <FontAwesomeIcon icon={videoIcon} />
                        </Tooltip>
                      </a>
                    )}
                  </span>
                )}
              </div>
            </List.Item>
          </List>
        </Grid.Column>
        <Grid.Column>
          {detail && detail.mediaUrl && detail.mediaUrl.vlPath && (
            <img
              style={imageStyle}
              src={detail.mediaUrl.vlPath}
              alt="巡检结果图片（可见光）"
            />
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default OneMeterOneRecordDetail;
