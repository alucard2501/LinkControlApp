import BaseByteSerializer from './BaseByteSerializer'

export default {
    //全局变量
    devicesAll:null,
    MyProject:null,
    golbal:null,
    root:null,

    /**字节转十六进制字符 */
    bytes2hex:function(bytes){
        var result="";
        for(var i=0;i<bytes.length;i++){
            result=result + Buffer.from([bytes[i]]).toString('hex')+ " ";
        }
        return result;
    },

    getVORoomByDeviceId(deviceId){
        var project=this.MyProject;
        if(project==null){
            console.log("project is null");
            return null;
        }
        for(var i=0;i<project.blocks.length;i++){
            var block=project.blocks[i];
            for(var j=0;j<block.floors.length;j++){
                var floor=block.floors[j];
                for(var k=0;k<floor.rooms.length;k++){
                    var room=floor.rooms[k];
                    for(var l=0;l<room.devices.length;l++){
                    var device=room.devices[l];
                        if(device.id==deviceId){
                            return room;
                        }
                    }
                }
            }
        }
    },

    getVOBus:function(deviceId){
        var project=this.MyProject;
        if(project==null){
            console.log("project is null");
            return null;
        }
        var room=this.getVORoomByDeviceId(deviceId);
        if(room==null)return null;
        var bus=null;
        for(var i=0;i<project.buses.length;i++){
            bus=project.buses[i];
            if(bus.id==room.busId){
                return bus;
            }
        }
        return null;
    },

    /** 加载设置开启情况 */
    getTypeStatus:function(){
        //设备类型
        for(var i=1;i<=4;i++){
            this.golbal.type[i].isOn=false;
        }
        for(var i=0;i<this.golbal.roomCur.devices.length;i++){
            var r=this.golbal.roomCur.devices[i];
            switch(r.type){
                case 'light':
                    if(r.isOn)this.golbal.type[1].isOn=true;
                    break;
                case 'dimmer':
                    if(r.value>0)this.golbal.type[1].isOn=true;
                    break;
                case 'curtain':
                    if(r.value==100)this.golbal.type[2].isOn=true;
                    break;
                case 'ac':
                    if(r.isOn)this.golbal.type[3].isOn=true;
                    break;
                case 'heating':
                    if(r.isOn)this.golbal.type[3].isOn=true;
                    break;
                case 'fan':
                    if(r.isOn)this.golbal.type[3].isOn=true;
                    break;
                case 'scene':
                    if(r.isOn)this.golbal.type[4].isOn=true;
                    break;
            }
        }

        //点亮楼层、房间
        for(var i=0;i<this.golbal.blockCur.floors.length;i++){
            this.golbal.blockCur.floors[i].isOn=false;
        }
        for(var i=0;i<this.golbal.blockCur.floors.length;i++){
            var c_floor = this.golbal.blockCur.floors[i];
            for(var j=0;j<c_floor.rooms.length;j++){
                var c_room = c_floor.rooms[j];
                c_room.isOn=false;
                for(var k=0;k<c_room.devices.length;k++){
                    var c_device = c_room.devices[k];
                    switch(c_device.type){
                        case 'dimmer':
                            if(c_device.value>0){
                                c_room.isOn=true;
                                c_floor.isOn=true;
                            }
                            break;
                        case 'curtain':
                            if(c_device.value==100){
                                c_room.isOn=true;
                                c_floor.isOn=true;
                            }
                            break;
                        default:
                            if(c_device.isOn){
                                c_room.isOn=true;
                                c_floor.isOn=true;
                            }
                            break;
                    }
                }
            }
        }
    },
    
    /** 当前房间的全部设置主动请求状态 */
    sendQueryDeviceStatus:function(){
        var sended=[];
        //{areacode:1,addr:1}
        for(var i=0;i<this.golbal.roomCur.devices.length;i++){
            var b=true;
            var c_device=this.golbal.roomCur.devices[i];
            for(var j=0;j<sended.length;j++){
                if(parseInt(c_device.areacode)==sended[j].areacode && parseInt(c_device.addr)==sended[j].addr){
                    b=false;
                }
            }
            if(b){
                setTimeout(this.sendQueryDeviceStatusOne,i*100,c_device);
                sended.push({areacode:parseInt(c_device.areacode),addr:parseInt(c_device.addr)});
            }
        }
    },
    sendQueryDeviceStatusOne(device){
        BaseByteSerializer.queryDeviceStatus(device);
    },
    log:function(message){
      //console.log(this.root);
      console.log(message);
      if(this.root!=null){
        var log_date=new Date();
        this.root.$data.logList.logs.unshift(log_date.getHours() + ":" + log_date.getMinutes()+":"+log_date.getSeconds() + " " +  message);
      }
    },
    bytes2hex:function(bytes){
        var result="";
        for(var i=0;i<bytes.length;i++){
            result=result + Buffer.from([bytes[i]]).toString('hex')+ " ";
        }
        return result;
    },
    bytes2hexNoSpace:function (bytes){
        var result="";
        for(var i=0;i<bytes.length;i++){
            result=result + Buffer.from([bytes[i]]).toString('hex')+ "";
        }
        return result;
    },
    hexStringToBytes:function (hexString) {
        if (hexString == null || hexString.length==0) {
            return null;
        }
        hexString = hexString.toUpperCase();
        var hexs=[];
        if(hexString.indexOf(" ")>=0){
            hexs=hexString.trim().split(" ");
        }else{
            //hexs=new String[hexString.length()/2];
            var len=hexString.length/2;
            for(var i=0;i<len;i++){
                hexs.push(0x00);
            }
            for(var i=0;i<hexs.length;i++){
                hexs[i]=hexString.substring(i*2, i*2+2);
            }
        }
        var length = hexs.length;
        var d=[];
        for (var i = 0; i < length; i++) {
            d.push(parseInt(hexs[i],16))
        }
        return Buffer.from(d);
    },
    /**用于生成uuid*/
    uuid:function(){
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },
    saveProject:function(){
        var storage = window.localStorage;
        storage.setItem("myProject", JSON.stringify(this.MyProject));
        console.log("saved");
    },
    saveSetting:function(){
        var storage = window.localStorage;
        storage.setItem("themeCur",this.golbal.themeCur);
        storage.setItem("isGallery",(this.golbal.isGallery)?1:0);
    }
}
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}