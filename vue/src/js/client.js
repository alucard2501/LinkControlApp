// Constructor. The address and port should point to a UDP server.
//import UDP from './UDP'
import MyFunction from './MyFunction'
var Client = function(address, port) {
    this.address = address;
    this.port = port || 0; // Port zero will auto-assign
    this.udp=null;
    this.socket=null;
    var that=this;
    UDP.createSocket(this.address, 0, function(socket, udp) {
      that.udp=udp;
      that.socket=socket;
      MyFunction.log("connected");
      MyFunction.log(that.udp);
      MyFunction.log(that.socket);
      
    });
  }
  
  // Send a message to the server. The callback is called once
  // the message is sent.
  Client.prototype.send = function(data, callback) {
    // var address = this.address,
    //     port    = this.port,
    var buffer  = UDP.Buffer.fromBytes(data);
    console.log("buffer");
    console.log(buffer);
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
  