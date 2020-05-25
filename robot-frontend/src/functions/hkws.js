import {WebVideoCtrl} from "../../HKWS/codebase/webVideoCtrl.js";

function HkwsStart() {
    console.log("enter hkwstest...");
  // 检查插件是否已经安装过
  console.log("WebVideoCtrl",WebVideoCtrl);
  var iRet = WebVideoCtrl.I_CheckPluginInstall();
  console.log("WebVideoCtrl.I_CheckPluginInstall()",iRet);
  if (-1 === iRet) {
    alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
    return;
  }

  var oPlugin = {
    iWidth: 640, // plugin width
    iHeight: 360 // plugin height
  };

  var oLiveView = {
    iProtocol: 1, // protocol 1：http, 2:https
    szIP: "192.168.0.65", // protocol ip
    //szIP: "192.168.0.40", // protocol ip
    szPort: "80", // protocol port
    szUsername: "admin", // device username
    szPassword: "zngdzx613", // device password
    iStreamType: 1, // stream 1：main stream  2：sub-stream  3：third stream  4：transcode stream
    iChannelID: 1, // channel no
    bZeroChannel: false // zero channel
  };

  // 初始化插件参数及插入插件
  WebVideoCtrl.I_InitPlugin(oPlugin.iWidth, oPlugin.iHeight, {
    bWndFull: true, //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
    iWndowType: 1,
    cbInitPluginComplete: function() {
      WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
      console.log("WebVideoCtrl.I_InsertOBJECTPlugin(divPlugin)",WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin"));

      // 检查插件是否最新
      console.log("WebVideoCtrl.I_CheckPluginVersion()",WebVideoCtrl.I_CheckPluginVersion());
      if (-1 === WebVideoCtrl.I_CheckPluginVersion()) {
        console.log("检查插件是否最新");
        alert(
          "检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！"
        );
        return;
      }

      // 登录设备
      console.log("准备登录设备");
      console.log("oLiveView.szIP",oLiveView.szIP);
      console.log("oLiveView.iProtocol",oLiveView.iProtocol);
      console.log("oLiveView.szPort",oLiveView.szPort);
      console.log("oLiveView.szUsername",oLiveView.szUsername);
      console.log("oLiveView.szPassword",oLiveView.szPassword);

      WebVideoCtrl.I_Login(
        oLiveView.szIP,
        oLiveView.iProtocol,
        oLiveView.szPort,
        oLiveView.szUsername,
        oLiveView.szPassword,
        {
        

          success: function(xmlDoc) {

            console.log("开始预览");
            // 开始预览
            var szDeviceIdentify = oLiveView.szIP + "_" + oLiveView.szPort;
            setTimeout(function() {
              WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
                iStreamType: oLiveView.iStreamType,
                iChannelID: oLiveView.iChannelID,
                bZeroChannel: oLiveView.bZeroChannel
              });
            }, 1000);
          }
        }
      );
    }
  });

  // 关闭浏览器
  // $(window).unload(function() {
  //   WebVideoCtrl.I_Stop();
  // });
}

function HkwsStop()
{
  WebVideoCtrl.I_Stop();
}
// //导出组件
// // class Hkws extends React.Component{
// //     render(){
// //         return <div>
// //             <div id="divPlugin" class="plugin"></div>
// //         </div>
// //     }
// // }

export {HkwsStart,HkwsStop};