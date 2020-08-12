import BaseByteDeserializer from "./BaseByteDeserializer";

const WSS_URL = `ws://192.168.0.119:8001`
let Socket = ''
let setIntervalWesocketPush = null
var list=[];
var reconn_count=0;
/**建立连接 */
export function createSocket(receiveHandler,url) {
  if(list.length>0){
    for(var i=0;i<list.length;i++){
      if(list[i].url==url || list[i].url==(url +"/")){
        if(list[i].readyState === 3){
          //实际已断开
          list.splice(i,1);
          break;  
        }
        console.log('已有websocket连接')
        return list[i];
      }
    }
  }
  //console.log('建立websocket连接')
  var s = new WebSocket(((url==null)?WSS_URL:url))
  s.onopen = onopenWS
  s.onmessage = onmessageWS
  s.onerror = onerrorWS
  s.onclose = oncloseWS
  list.push(s);
    //var that=this;
  window.addEventListener('onmessageWS', function (e) {
    var blob=e.detail.data.data;
    var reader = new FileReader();
    reader.onload = function(){
    var buf = new Uint8Array(this.result);
    if(receiveHandler!=null){
      receiveHandler(buf);
    }
                //that.form.textReceive=globalvariable.bytes2hex(buf) + "\n" + that.form.textReceive;
                //console.log(globalvariable.bytes2hex(buf));

    }
    reader.readAsArrayBuffer(blob);
  }, false);
  return s;
  // else {
  //   console.log('websocket已连接')
  // }
}
/**打开WS之后发送心跳 */
export function onopenWS(e) {
  reconn_count=0;
  console.log(e);
  for(var i=0;i<list.length;i++){
    sendPing(list[i]);
  }
}
/**连接失败重连 */
export function onerrorWS(e) {
  clearInterval(setIntervalWesocketPush)
  if(list.indexOf(e.target)>=0){
    list.splice(list.indexOf(e.target),1);
  }
  reconn_count+=1;
  if(reconn_count>=10){
    console.log("重连超出10次，重连结束");
    return;
  }
  var url=e.target.url;
  //Socket.close()
  createSocket(BaseByteDeserializer.receiveData,url) //重连
}
/**WS数据接收统一处理 */
export function onmessageWS(e) {
  window.dispatchEvent(new CustomEvent('onmessageWS', {
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
export function sendWSData(data,_socket) {
  if(_socket==null){
    console.log("socket is null");
  }
    if (_socket !== null && _socket.readyState === 3) {
      _socket.close()
      _socket=createSocket(BaseByteDeserializer.receiveData,_socket.url) //重连
    } else if (_socket.readyState === 1) {
      _socket.send(data)
    } else if (_socket.readyState === 0) {
      setTimeout(() => {
        _socket.send(data)
      }, 3000)
    }
  }
/**关闭WS */
export function oncloseWS(e) {
  clearInterval(setIntervalWesocketPush)
  console.log('websocket已断开')
}
/**发送心跳 */
export function sendPing(_socket) {
  _socket.send("pc_client");
  setIntervalWesocketPush = setInterval(() => {
    _socket.send("pc_client")
  }, 5000)
}