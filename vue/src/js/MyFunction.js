export default {
    //全局变量
    devicesAll:null,
    MyProject:null,
    golbal:null,
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
        this.golbal.type[1].isOn=false;
        this.golbal.type[2].isOn=false;
        this.golbal.type[3].isOn=false;
        this.golbal.type[4].isOn=false;
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
                case 'scene':
                if(r.isOn)this.golbal.type[4].isOn=true;
                break;
            }
        }
    }
}
