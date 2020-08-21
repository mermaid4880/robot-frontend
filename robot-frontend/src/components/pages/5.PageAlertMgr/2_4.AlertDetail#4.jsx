//packages
import React from "react";
import { List, Label } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo as videoIcon } from "@fortawesome/free-solid-svg-icons";
//elements
import MediaModal from "../../elements/4.MediaModal.jsx";

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
  //     id: "1", //告警信息ID
  //     source: "1", //告警信息来源的机器人ID
  //     detail: "asdfdsafasdfsdafasdfasdfasdfsdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", //告警信息详细描述
  //     time: "2018-10-26 16:32:16", //识别时间
  //     meter: "1", //点位ID
  //     meterName: "asdfdsafasdfsdafasdfasdfa", //点位名称（检测内容）
  //     level: "一般告警", //点位状态（告警等级）【"正常"  "预警"  "一般告警"  "严重告警"  "危急告警"】
  //     detectionType: "表计读取", //识别类型 【"红外测温"  "表计读取"  "位置状态识别"  "设备外观查看（可识别）"  "设备外观查看（不可识别）"  "声音检测"】
  //     value: "36度", //识别结果
  //     mediaUrl: {
  //       valuePath: "D:/robot/static/pic/2018-1-1/111/50.jpg", //识别结果图片路径
  //       voicePath: "D:/robot/static/pic/2018-1-1/111/50.wav", //音频文件路径
  //       videoPath: "D:/robot/static/pic/2018-1-1/111/50.mp4", //视频文件路径
  //       vlPath: "D:/robot/static/pic/2018-1-1/111/50.jpg", //可见光图片文件路径（一定有）
  //       irPath: "D:/robot/static/pic/2018-1-1/111/50.jpg", //红外图片文件路径
  //     },
  //     isDealed: "现场确认无异常", //确认状态（5种）【"未确认"  "现场确认无异常"  "确认异常——已处理"  "确认异常——需要进一步跟踪"  "确认异常——在允许范围内"】
  //   },
  // };

  return (
    <Grid style={gridStyle} columns={4} divided>
      <Grid.Row stretched>
        <Grid.Column>
          {props.data && props.data.mediaUrl && props.data.mediaUrl.vlPath && (
            <img
              style={imageStyle}
              src={props.data.mediaUrl.vlPath}
              alt="告警信息图片（可见光）"
            />
          )}
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
            <List.Item style={listItemStyle}>
              <Label style={labelStyle} horizontal>
                结果信息
              </Label>
              <div style={contentStyle}>
                {props.data && props.data.mediaUrl && (
                  <span>
                    {props.data.mediaUrl.vlPath && ( //可见光图片文件路径（一定有）
                      <a>
                        <MediaModal
                          mediaInfo={{
                            meterName: props.data.meterName,
                            mediaType: "可见光图片文件路径（一定有）",
                            mediaUrl: props.data.mediaUrl.vlPath,
                          }}
                        />
                      </a>
                    )}
                    &nbsp;&nbsp;
                    {props.data.mediaUrl.irPath && ( //红外图片文件路径
                      <a>
                        <MediaModal
                          mediaInfo={{
                            meterName: props.data.meterName,
                            mediaType: "红外图片文件路径",
                            mediaUrl: props.data.mediaUrl.irPath,
                          }}
                        />
                      </a>
                    )}
                    &nbsp;&nbsp;
                    {props.data.mediaUrl.valuePath && ( //识别结果图片路径
                      <a>
                        <MediaModal
                          mediaInfo={{
                            meterName: props.data.meterName,
                            mediaType: "识别结果图片路径",
                            mediaUrl: props.data.mediaUrl.valuePath,
                          }}
                        />
                      </a>
                    )}
                    &nbsp;&nbsp;
                    {props.data.mediaUrl.voicePath && ( //音频文件路径
                      <a>
                        <MediaModal
                          mediaInfo={{
                            meterName: props.data.meterName,
                            mediaType: "音频文件路径",
                            mediaUrl: props.data.mediaUrl.voicePath,
                          }}
                        />
                      </a>
                    )}
                    &nbsp;&nbsp;
                    {props.data.mediaUrl.videoPath && ( //视频文件路径
                      <a
                        href={props.data.mediaUrl.videoPath}
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
      </Grid.Row>
    </Grid>
  );
}

export default AlertDetail;
