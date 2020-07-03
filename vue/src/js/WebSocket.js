//import global from "../vbs/GlobalVariable";

const WSS_URL = `ws://192.168.0.119:8001`
let Socket = ''
let setIntervalWesocketPush = null

/**建立连接 */
export function createSocket(receiveHandler) {
  if (!Socket) {
    //console.log('建立websocket连接')
    Socket = new WebSocket(WSS_URL)
    Socket.onopen = onopenWS
    Socket.onmessage = onmessageWS
    Socket.onerror = onerrorWS
    Socket.onclose = oncloseWS
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
  } 
  // else {
  //   console.log('websocket已连接')
  // }
}
/**打开WS之后发送心跳 */
export function onopenWS() {
  sendPing() //发送心跳
}
/**连接失败重连 */
export function onerrorWS() {
  clearInterval(setIntervalWesocketPush)
  Socket.close()
  createSocket() //重连
}
/**WS数据接收统一处理 */
export function onmessageWS(e) {
  window.dispatchEvent(new CustomEvent('onmessageWS', {
    detail: {
      data: e
    }
  }))
}
/**发送数据
 * @param eventType
 */
export function sendWSPush(eventTypeArr) {
  const obj = {
    appId: 'airShip',
    cover: 0,
    event: eventTypeArr
  }
  if (Socket !== null && Socket.readyState === 3) {
    Socket.close()
    createSocket() //重连
  } else if (Socket.readyState === 1) {
    Socket.send(JSON.stringify(obj))
  } else if (Socket.readyState === 0) {
    setTimeout(() => {
      Socket.send(JSON.stringify(obj))
    }, 3000)
  }
}
/**发送ArrayBuffer数据
 * @param data
 */
export function sendWSData(data) {
    if (Socket !== null && Socket.readyState === 3) {
      Socket.close()
      createSocket() //重连
    } else if (Socket.readyState === 1) {
      Socket.send(data)
    } else if (Socket.readyState === 0) {
      setTimeout(() => {
        Socket.send(data)
      }, 3000)
    }
  }
/**关闭WS */
export function oncloseWS() {
  clearInterval(setIntervalWesocketPush)
  console.log('websocket已断开')
}
/**发送心跳 */
export function sendPing() {
  Socket.send("pc_client");
  setIntervalWesocketPush = setInterval(() => {
    Socket.send("pc_client")
  }, 5000)
}