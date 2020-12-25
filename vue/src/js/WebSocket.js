import BaseByteDeserializer from "./BaseByteDeserializer";
import MyFunction from "./MyFunction"
import axios from 'axios';

const WSS_URL = `ws://192.168.0.119:8001`
const WS_URL_SERVER = 'wss://app.lk-control.com/wss/';
//const WS_URL_SERVER = 'ws://192.168.0.119:6432/';
const UDP_SERVER="47.99.127.199";
//const UDP_SERVER="192.168.0.119";
const UDP_PORT=18123;
let Socket = ''
var Socket4Remote=null;
let setIntervalWesocketPush = null
var list=[];
var reconn_count=0;
var timer=null;
var is_listening_remote=false;
var get_loacal_message_count=false;
var timer_local_message=null;
var _is_resume=false;
var _is_resume_remote=false;

var _is_connecting=false;
var _is_connecting_remote=false;
/**建立连接 */
export function createSocket(receiveHandler,url) {
  //createCordovaWebsocket();
  createRemoteSocket();
  if(!_is_connecting){
    
    if(list.length>0){
      for(var i=0;i<list.length;i++){
        if(list[i].url==url || list[i].url==(url +"/")){
          if(list[i].readyState === 3){
            //实际已断开
            list.splice(i,1);
            break;  
          }
          //MyFunction.log('已有websocket连接')
          return list[i];
        }
      }
    }
    //console.log('建立websocket连接')
    MyFunction.log("开始连接：" + url);
    var s = null;
    if(url.indexOf("192.168.0.119:6432")>-1){
      s = new WebSocket(url,'echo-protocol');
    }else{
      s = new WebSocket(((url==null)?WSS_URL:url));
    }
    s.onopen = onopenWS
    s.onmessage = onmessageWS
    s.onerror = onerrorWS
    s.onclose = oncloseWS
    _is_connecting=true;
    list.push(s);
    window.addEventListener('onmessageWS', function (e) {
      var blob=e.detail.data.data;
      var reader = new FileReader();
      reader.onload = function(){
        var buf = new Uint8Array(this.result);
        if(receiveHandler!=null){
          receiveHandler(buf);
        }
      }
      reader.readAsArrayBuffer(blob);
      get_loacal_message_count=true;
      if(timer_local_message!=null){
        clearTimeout(timer_local_message);
      }
      timer_local_message=setTimeout(function(){
        get_loacal_message_count=false;
      },3000);
    }, false);
    if(!is_listening_remote){
      window.addEventListener('onmessageWSRemote', function (e) {
        //var buf = new Uint8Array(e.data);
        var buf=Buffer.from(e.detail.data.data,"base64");
        if(receiveHandler!=null){
          receiveHandler(buf);
        }
      }, false);
      is_listening_remote=true;
    }
    return s;
  }else{
    return null;
  }
  
    //var that=this;
  
  
  
  
  // else {
  //   console.log('websocket已连接')
  // }
}

export function createRemoteSocket(){
  if(!_is_connecting_remote){
    if(Socket4Remote==null){
      if(MyFunction.golbal!=null && MyFunction.golbal.accessToken.length>0){
        Socket4Remote = new WebSocket(WS_URL_SERVER,'echo-protocol');
        Socket4Remote.onopen = onopenWSRemote;
        Socket4Remote.onmessage = onmessageWSRemote;
        Socket4Remote.onerror = onerrorWSRemote;
        Socket4Remote.onclose = oncloseWSRemote;
        _is_connecting_remote=true;
      }
    }
  }
  
}
function createCordovaWebsocket(){
  console.log(WebSocket);
  if(WebSocket!=null){
    if(Socket4Remote==null){
      var ws = new WebSocket(WS_URL_SERVER);

      ws.onopen = function () {
          console.log('open');
          this.send('hello');         // transmit "hello" after connecting
      };

      ws.onmessage = function (event) {
          console.log(event.data);    // will be "hello"
          this.close();
      };

      ws.onerror = function () {
          console.log('error occurred!');
      };

      ws.onclose = function (event) {
          console.log('close code=' + event.code);
      };
      Socket4Remote=ws;
    }

    
  }
  
}
/**打开WS之后发送心跳 */
export function onopenWS(e) {
  reconn_count=0;
  MyFunction.log("连接成功：" + e.currentTarget.url);
  _is_connecting=false;
  var buses=MyFunction.golbal.myProject.buses;
  for(var i=0;i<buses.length;i++){
    if(buses[i].ws_url==e.currentTarget.url){
      buses.isOnline=true;
    }
  }
  for(var i=0;i<list.length;i++){
    sendPing(list[i]);
  }
  setTimeout(function(){
    MyFunction.sendQueryDeviceStatus();
  },3000);
}
function onopenWSRemote(e) {
  console.log(MyFunction.MyProject.buses);
  MyFunction.log("远程连接成功");
  _is_connecting_remote=false;
  //发送登录消息
  //{"action":"app_login","accessToken":"203942o34joijdfs9iaf","buses":["AQIDBAUGBwgJCgsM","AQIDBAUGBwgJCgsN"]}
  setTimeout(function(){
    var json_req={
      "action":"app_ws_login",
      "accessToken":((MyFunction.golbal!=null)?MyFunction.golbal.accessToken:"111222333"),
      "buses":[],
    }
    var buses_str="";
    for(var i=0;i<MyFunction.MyProject.buses.length;i++){
      var bus=MyFunction.MyProject.buses[i];
      var addr_64=((bus.addr!=null)?(Buffer.from(bus.addr,"hex").toString("base64")):"");
      json_req.buses.push(addr_64);
      buses_str+=addr_64+",";
    }
    Socket4Remote.send(JSON.stringify(json_req));
    MyFunction.log(">>>>" + JSON.stringify(json_req));
    // Socket4Remote.send(stringToByte("hello"),function(){
    //   MyFunction.log(">>>>" +JSON.stringify(json_req));
    // });
    setTimeout(function(){
      MyFunction.sendQueryDeviceStatus();
    },3000);
    setTimeout(sendRemoteAliveWS,5000);
  },3000);
  
  //console.log(global.app.MyProject.buses);
}

function sendRemoteAliveHTTP(){
  MyFunction.log("远程心跳");
  try{
    var buses_str="";
    for(var i=0;i<MyFunction.MyProject.buses.length;i++){
      var bus=MyFunction.MyProject.buses[i];
      var addr_64=((bus.addr!=null)?(Buffer.from(bus.addr,"hex").toString("base64")):"");
      buses_str+=addr_64+",";
    }
    var url=MyFunction.golbal.HOST + "/api?action=app_ws_heart&accessToken=" + ((MyFunction.golbal!=null)?MyFunction.golbal.accessToken:"111222333") +"&buses=" + escape(buses_str);
    MyFunction.log("远程心跳" + url);
    axios.post(url).then(function(response){
      try{
        if(response.data.status=="SUCCESS"){
          if(response.data.messageList!=null){
            var datalist_64=response.data.messageList;
            for(var i=0;i<datalist_64.length;i++){
              window.dispatchEvent(new CustomEvent('onmessageWSRemote', {
                detail: {
                  data: datalist_64[i]
                }
              }));
            }
          }
        }
        //console.log(response);
      }catch(e){
        MyFunction.log("远程心跳失败1:" + e.message);
        console.log(e);
      }
          
    }).catch(function (error) { // 请求失败处理
      console.log(error);
      MyFunction.log("远程心跳失败2:" + error.message);
      //that.onLog(error);
      //alert("获取失败")
    });
  }catch(e){
    MyFunction.log("远程心跳失败3:" + e.message);
  }
  
  
}
function sendRemoteAliveWS(){
  try{
    if(Socket4Remote!=null){
      var json_req={
        "action":"app_ws_heart",
        "accessToken":((MyFunction.golbal!=null)?MyFunction.golbal.accessToken:"111222333"),
        "buses":[],
      }
      var buses_str="";
      for(var i=0;i<MyFunction.MyProject.buses.length;i++){
        var bus=MyFunction.MyProject.buses[i];
        var addr_64=((bus.addr!=null)?(Buffer.from(bus.addr,"hex").toString("base64")):"");
        json_req.buses.push(addr_64);
        buses_str+=addr_64+",";
      }
      Socket4Remote.send(JSON.stringify(json_req));
      setTimeout(sendRemoteAliveWS,30000);
    }
  }catch(e){
    MyFunction.log("远程心跳失败3:" + e.message);
  }
  
  
}
/**连接失败重连 */
export function onerrorWS(e) {
  MyFunction.log("连接失败：" + e.currentTarget.url + ",正在尝试重连");
  clearInterval(setIntervalWesocketPush)
  
  if(list.indexOf(e.target)>=0){
    list.splice(list.indexOf(e.target),1);
  }

  //屏蔽限制重连10次代码
  reconn_count+=1;
  if(reconn_count>=10){
    MyFunction.log("重连超出10次，重连结束");
    reconn_count=0;
    return;
  }
  

  var url=e.target.url;
  var buses=MyFunction.golbal.myProject.buses;
  for(var i=0;i<buses.length;i++){
    if(buses[i].source_url==e.currentTarget.url && buses[i].ws_url!=e.currentTarget.url){  
      url=buses[i].ws_url;
    }
  }
  

  //Socket.close()
  setTimeout(function(){
    createSocket(BaseByteDeserializer.receiveData,url) //重连
  },5000);
  
}
function onerrorWSRemote(e) {
  console.log(e);
  
  MyFunction.log("远程连接错误,5秒后重连");
  MyFunction.log(JSON.stringify(e));
  
  
  setTimeout(function(){
    Socket4Remote=null;
    createRemoteSocket();
  },5000);
  //createSocket() //重连
}
/**WS数据接收统一处理 */
export function onmessageWS(e) {
  window.dispatchEvent(new CustomEvent('onmessageWS', {
    detail: {
      data: e
    }
  }))
}
export function onmessageWSRemote(e) {
  console.log(e);
  window.dispatchEvent(new CustomEvent('onmessageWSRemote', {
    detail: {
      data: e
    }
  }))
}
export function onmessageUDPRemote(e) {
  window.dispatchEvent(new CustomEvent('onmessageWSRemote', {
    detail: {
      data: e
    }
  }))
}
// /**发送数据
//  * @param eventType
//  */
// export function sendWSPush(eventTypeArr) {
//   const obj = {
//     appId: 'airShip',
//     cover: 0,
//     event: eventTypeArr
//   }
//   if (Socket !== null && Socket.readyState === 3) {
//     Socket.close()
//     createSocket() //重连
//   } else if (Socket.readyState === 1) {
//     Socket.send(JSON.stringify(obj))
//   } else if (Socket.readyState === 0) {
//     setTimeout(() => {
//       Socket.send(JSON.stringify(obj))
//     }, 3000)
//   }
// }
/**发送ArrayBuffer数据
 * @param data
 */
export function sendWSData(data,_socket,bus) {
  var needremote=false;
  if(_socket==null){
    MyFunction.log("socket is null");
    needremote=true;
  }
  if(!needremote){
    if (_socket !== null && _socket.readyState === 3) {
      _socket.close()
      _socket=createSocket(BaseByteDeserializer.receiveData,_socket.url) //重连
      needremote=true;
    } else if (_socket.readyState === 1) {
      _socket.send(data)
    } else if (_socket.readyState === 0) {
      setTimeout(() => {
        _socket.send(data)
      }, 3000);
      needremote=true;
    }
  }
    
    if(needremote){
      if(Socket4Remote!=null){
        //包装消息
        var json_req={
          "action":"message",
          "accessToken":((MyFunction.golbal!=null)?MyFunction.golbal.accessToken:"111222333"),
          "bus":Buffer.from(bus.addr,"hex").toString("base64"),
          "data":Buffer.from(data).toString("base64")
        }
        
        // var url=MyFunction.golbal.HOST + "/api?action=app_ws_message&accessToken=" + ((MyFunction.golbal!=null)?MyFunction.golbal.accessToken:"111222333") +"&bus=" + escape(Buffer.from(bus.addr,"hex").toString("base64")) + "&data=" + escape(Buffer.from(data).toString("base64"));
        // axios.post(url).then(function(response){
        //   try{
        //     MyFunction.log(">>>>" + JSON.stringify(json_req));
        //     console.log(response);
        //   }catch(e){
        //     MyFunction.log("心跳发送失败:" + JSON.stringify(e));
        //     console.log(e);
        //   }
              
        // }).catch(function (error) { // 请求失败处理
        //   MyFunction.log("心跳发送失败:" + JSON.stringify(error));
        //   MyFunction.log("url:" + url);
        //   //console.log(error);
        // });
        Socket4Remote.send(JSON.stringify(json_req));
        MyFunction.log(">>>>" + JSON.stringify(json_req));
      }
    }
  }
/**关闭WS */
export function oncloseWS(e) {
  _is_connecting=false;
  var time_count=5000;
  if(_is_resume){
    time_count=100;
  }
  _is_resume=false;
  clearInterval(setIntervalWesocketPush);
  MyFunction.log('websocket已断开,类型：' + e.type + ',' + time_count + '毫秒后重连');
  //重连
  setTimeout(function(){
    createSocket(BaseByteDeserializer.receiveData,e.currentTarget.url);
  },time_count);
  //createSocket(BaseByteDeserializer.receiveData,e.currentTarget.url);

}
function oncloseWSRemote(e) {
  var time_count=5000;
  if(_is_resume_remote){
    time_count=100;
  }
  _is_resume_remote=false;
  MyFunction.log('远程连接已断开,信息：' + e.code + ' ' + e.reason + ' ' + e.wasClean +"," + time_count + "毫秒后重连");
  _is_connecting_remote=false;
  //重连
  setTimeout(function(){
    Socket4Remote=null;
    createRemoteSocket();
  },time_count);
}
/**发送心跳 */
export function sendPing(_socket) {
  //_socket.send("pc_client");
  setIntervalWesocketPush = setInterval(() => {
    //_socket.send("pc_client")
  }, 30000)
}
export function onResume(){
  _is_resume=true;
  _is_resume_remote=true;
  MyFunction.log("onResume Called");
}

function stringToByte(str) {
  var bytes = new Array();
  var len, c;
  len = str.length;
  for(var i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if(c >= 0x010000 && c <= 0x10FFFF) {
          bytes.push(((c >> 18) & 0x07) | 0xF0);
          bytes.push(((c >> 12) & 0x3F) | 0x80);
          bytes.push(((c >> 6) & 0x3F) | 0x80);
          bytes.push((c & 0x3F) | 0x80);
      } else if(c >= 0x000800 && c <= 0x00FFFF) {
          bytes.push(((c >> 12) & 0x0F) | 0xE0);
          bytes.push(((c >> 6) & 0x3F) | 0x80);
          bytes.push((c & 0x3F) | 0x80);
      } else if(c >= 0x000080 && c <= 0x0007FF) {
          bytes.push(((c >> 6) & 0x1F) | 0xC0);
          bytes.push((c & 0x3F) | 0x80);
      } else {
          bytes.push(c & 0xFF);
      }
  }
  return bytes;


}