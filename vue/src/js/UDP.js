import MyFunction from './MyFunction'
var UDP = {
    // Helper function to create a new socket
    createSocket: function(address, port,receivecallback, callback) {
      MyFunction.log("create socket address:" + address + ",port:" + port);
      MyFunction.log(chrome);
        if(chrome==null)return;
        MyFunction.log(chrome.sockets);
        if(chrome.sockets==null)return;
        MyFunction.log(chrome.sockets.udp);
        if(chrome.sockets.udp==null)return;
        chrome.sockets.udp.create(function(socket) {
          console.log("listener:" + receivecallback);
          chrome.sockets.udp.onReceive.addListener(receivecallback);
          chrome.sockets.udp.bind(socket.socketId, address, port, function() {
            chrome.sockets.udp.setBroadcast(socket.socketId,true,function(){
              console.log("setBroadcast success")
            });
            if(callback!=null){
              callback(socket, chrome.sockets.udp);
            }
            
          });
        });
    },
  
    // All messages must be an ArrayBuffer. This helper
    // converts strings to ArrayBuffers and vice-versa.
    Buffer: {
      fromString: function(string) {
        var buffer = new ArrayBuffer(string.length * 2);
        var bufferView = new Uint16Array(buffer);
        for (var i = 0, strLen = string.length; i < strLen; i++) {
          bufferView[i] = string.charCodeAt(i);
        }
        return buffer;
      },
      fromHexString:function(string){
        var data=MyFunction.hexStringToBytes(string);
        var buffer = new ArrayBuffer(data.length);
        var bufferView = new Uint8Array(buffer);
        for (var i = 0;i<data.length; i++) {
          bufferView[i] = data[i];
        }
        return buffer;
      },
      fromBytes:function(data){
        var buffer = new ArrayBuffer(data.length);
        var bufferView = new Uint8Array(buffer);
        for (var i = 0;i<data.length; i++) {
          bufferView[i] = data[i];
        }
        return buffer;
      },
      stringify: function(buffer) {
        var bufferView = new Uint16Array(buffer);
        return String.fromCharCode.apply(null, bufferView);
      }
    }
  };
  
  window.UDP = UDP;
  