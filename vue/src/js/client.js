// Constructor. The address and port should point to a UDP server.
//import UDP from './UDP'
import MyFunction from './MyFunction'
var Client = function(address, port, receivecallback) {
    this.address = address;
    this.port = port || 0; // Port zero will auto-assign
    this.udp=null;
    this.socket=null;
    var that=this;
    if(networkinterface){
      networkinterface.getWiFiIPAddress( function onSuccess( ipInformation ) {
        console.log( "IP: " + ipInformation.ip + " subnet:" + ipInformation.subnet );
        UDP.createSocket(ipInformation.ip, 0,receivecallback, function(socket, udp) {
          that.udp=udp;
          that.socket=socket;
          MyFunction.log("connected");
          MyFunction.log(that.udp);
          MyFunction.log(that.socket);
          // if(callback!=null){
            
          // }
          
        });
            
      }, function onError( error ) {
        // Note: onError() will be called when an IP address can't be
        // found, e.g. WiFi is disabled, no SIM card, Airplane mode
        console.log( error );
      });
    }else{
      UDP.createSocket("192.168.0.119", 0,receivecallback, function(socket, udp) {
        that.udp=udp;
        that.socket=socket;
        MyFunction.log("connected");
        MyFunction.log(that.udp);
        MyFunction.log(that.socket);
        
      });
    }
    
    
  }
  Client.prototype.onReceive = function(callback) {
    console.log("ready to onReceive");
    console.log("call back " + callback);
    chrome.sockets.udp.onReceive.addListener(callback);
  }
  // Send a message to the server. The callback is called once
  // the message is sent.
  Client.prototype.send = function(data, callback) {
    // var address = this.address,
    //     port    = this.port,
    var buffer  = UDP.Buffer.fromBytes(data);
    MyFunction.log("udp:" + this.udp);
    MyFunction.log("socket:" + this.socket);
    if(this.udp!=null && this.socket!=null){
      this.udp.send(this.socket.socketId, buffer, this.address, this.port, function(info) {
        callback(info);
        //udp.close(socket.socketId);
      });
    }
    // Note that we're passing 0 for the port of the socket.
    // That's because we want to start a new udp socket on a random port,
    // then send the message to the server's port.
    MyFunction.log("client ready to send");
    // UDP.createSocket(address, 0, function(socket, udp) {
    //   udp.send(socket.socketId, buffer, address, port, function(info) {
    //     callback(info);
    //     udp.close(socket.socketId);
    //   });
    // });
  }
  
  window.UDP.Client = Client;
  