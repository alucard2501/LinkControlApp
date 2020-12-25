import Contract from './Contract';
import MyFunction from './MyFunction'
import BaseByteDeserializer from './BaseByteDeserializer';
import { createSocket, sendWSPush ,sendWSData} from './WebSocket'
export default {
    udp_client:null,
    ip:"",
    port:0,
    resetNetworkInfo:function(ip,port){
        this.ip=ip;
        this.port=port;
        //globalVariable.app.onLog("切换到" + ip +":"+port);
        MyFunction.log("切换到" + ip +":"+port);
        this.udp_client=new UDP.Client(ip,port);
    },
    /**
     * 根据配置产生控制消息
     * @param {*} body 数据体(byte[])
     * @param {*} areacode 区域码（int)
     * @param {*} addr 地址码(byte)
     * @param {*} devicetype 设备类型(int)
     * @param {*} action (读写类型)
     */
    buildCommand:function(body,areacode,addr,devicetype,action){
        var length=9;
        if(body!=null){
            length+=body.length;
        }
        var buff=[];
        //消息头
        buff.push(Contract.HEAD[0]);
        buff.push(Contract.HEAD[1]);
        //数据长度
        buff.push(length);
        //区域码
        buff.push((areacode==null)?0:parseInt(areacode));
        //设备地址
        buff.push((addr==null)?0:parseInt(addr));
        //设备类型
        buff.push(devicetype>>8);
        buff.push(devicetype & 0xff);
        //功能码
        buff.push(action);
        //数据体
        if(body!=null){
            for(var i=0;i<body.length;i++){
                buff.push(body[i]);
            }
        }
        //校验和 1 byte 所有数据加起来的和
        var sum=0;
        for(var i=3;i<buff.length;i++){
            sum+=buff[i];
        }
        buff.push(sum & 0xff);
        return buff;
    },
    /**
     * 
     * @param {*} body 
     * @param {*} device 
     */
    sendAction:function(device){
        var bus=MyFunction.getVOBus(device.id);
        if(bus==null){
            MyFunction.log("bus is null");
            return;
        }
        var deviceType=this.getDeviceType(device);
        var body=[];
        var funcode=0;
        if(deviceType==Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_LIGHT_SCENE || 
                deviceType==Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_DIMMER_SCENE || 
                deviceType==Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_CURTAIN_SCENE || 
                deviceType==Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_LIGHT_DIMMER_SCENE || 
                deviceType==Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_LIGHT_CURTAIN_SCENE || 
                deviceType==Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_DIMMER_CURTAIN_SCENE ){
            //发送组合类型消息
            switch(device.type){
                case "light":
                    funcode=Contract.FUNCTION_CODE.WRITE + Contract.FUNCTION_CODE.CONTROL;
                    /*
                    AA AA 0B 01 01 03 01 42 01 00 49
                                            通道号
                                               通道状态：0-关闭 100-开启
                    */
                    var action=0;
                    if(device.isOn)action=100;
    
                    body.push(device.channel);      //通道号
                    body.push(action);              //通道状态
                    break;
    
                case "dimmer":
                    funcode=Contract.FUNCTION_CODE.WRITE + Contract.FUNCTION_CODE.CONTROL;
                    /*
                    AA AA 0B 01 01 03 03 42 01 00 4B
                                            通道号：0x01-0x02 表示第 1-2 路调光
                                                通道状态：0-关闭，100-开启
                    */
                    body.push(device.channel);      //通道号
                    body.push(device.value);    	//通道状态
                    break;

                case "curtain":
                    funcode=Contract.FUNCTION_CODE.WRITE + Contract.FUNCTION_CODE.CONTROL;
                    /*
                    AA AA 0B 01 01 03 02 42 01 00 4A
                                            通道号：0x01-0x02 表示第 1-2 路窗帘
                                               通道状态：0-关闭，100-开启，101-停止
                    */
                    body.push(device.channel);      //通道号
                    body.push(device.value);    	//通道状态
                    break;

                case "scene":
                    funcode=Contract.FUNCTION_CODE.WRITE + 7;
                    /*
                    AA AA 0B 01 01 03 01 42 01 00 49
                                            通道号
                                               通道状态：0-关闭 100-开启
                    */
                    var action=0;
                    if(device.isOn)action=100;
    
                    body.push(device.channel);      //通道号
                    body.push(action);              //通道状态
                    break;
            }
        }else{
            switch(device.type){
                case "light":
                    deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_LIGHT;
                    funcode=Contract.FUNCTION_CODE.WRITE + Contract.FUNCTION_CODE.CONTROL;
                    /*
                    AA AA 0B 01 01 03 01 42 01 00 49
                                            通道号
                                               通道状态：0-关闭 100-开启
                    */
                    var action=0;
                    if(device.isOn)action=100;
    
                    body.push(device.channel);      //通道号
                    body.push(action);              //通道状态
                    break;
    
                case "dimmer":
                    deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_DIMMER;
                    funcode=Contract.FUNCTION_CODE.WRITE + Contract.FUNCTION_CODE.CONTROL;
                    /*
                    AA AA 0B 01 01 03 03 42 01 00 4B
                                            通道号：0x01-0x02 表示第 1-2 路调光
                                                通道状态：0-关闭，100-开启
                    */
                    body.push(device.channel);      //通道号
                    body.push(device.value);    	//通道状态
                    break;
    
                case "curtain":
                    deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_CURTAIN;
                    funcode=Contract.FUNCTION_CODE.WRITE + Contract.FUNCTION_CODE.CONTROL;
                    /*
                    AA AA 0B 01 01 03 02 42 01 00 4A
                                            通道号：0x01-0x02 表示第 1-2 路窗帘
                                               通道状态：0-关闭，100-开启，101-停止
                    */
                    body.push(device.channel);      //通道号
                    body.push(device.value);    	//通道状态
                    break;
    
                case "ac":
                    deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_AC;
                    funcode=Contract.FUNCTION_CODE.WRITE + Contract.FUNCTION_CODE.CONTROL;
                    /*
                    AA AA 10 01 01 04 01 42 81 19 80 1C 80 19 00 18
                                            空调标志：Bit0-2：0-恒温 1-制冷 2-制热 3-送风 Bit3-4：0-自动 1-低速 2-中速 3-高速 Bit5-6：0-解锁 1-锁定按键 2-锁定数据 Bit7：0-关机 1-开机
                                                     device.isOn 开关, device.value 温度, device.mode 模式, device.fan 风速, device.lock 锁定状态
                                               空调设定温度
                    */
                    var temp=0x00;
                    if(device.isOn){    //开机
                        temp=temp+(1<<7);
                    }
                    temp=temp+(device.lock<<5); //锁定状态
                    temp=temp+(device.fan<<3);  //风速
                    if(device.mode=="制冷"){
                        temp=temp+1;
                    }else if(device.mode=="制热"){
                        temp=temp+2;
                    }else if(device.mode=="送风"){
                        temp=temp+3;
                    }
    
                    body.push(temp);      			    //空调标志
                    body.push(device.value);    	    //空调设定温度
                    body.push(0x80);                    //地暖标志
                    body.push(0x1c);                    //地暖设定温度
                    body.push(0x80);                    //新风标志
                    body.push(0x19);                    //新风设定温度
                    body.push(0x00);                    //实测温度默认 0
                    break;
    
                case "scene":
                    deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_SCENE;
                    funcode=Contract.FUNCTION_CODE.WRITE + 7;
                    /*
                    AA AA 0B 01 01 03 01 42 01 00 49
                                            通道号
                                               通道状态：0-关闭 100-开启
                    */
                    var action=0;
                    if(device.isOn)action=100;
    
                    body.push(device.channel);      //通道号
                    body.push(action);              //通道状态
                    break;
    
                case "heating":
                    deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_AC;
                    funcode=Contract.FUNCTION_CODE.WRITE + Contract.FUNCTION_CODE.CONTROL;
                    /*
                    AA AA 10 01 01 04 01 42 81 19 80 1C 80 19 00 18
                                                  地暖标志：Bit0-4：预留 Bit5-6：0-解锁 1-锁定按键 2-锁定数据 Bit7：0-关机 1-开机
                                                         device.isOn 开关, device.value 温度, device.lock 锁定状态
                                                     地暖设定温度
                    */
                    var temp=0x00;
                    if(device.isOn){    //开机
                        temp=temp+(1<<7);
                    }
                    temp=temp+(device.lock<<5); //锁定状态
        
                    body.push(0x80);      			    //空调标志
                    body.push(0x19);    	            //空调设定温度
                    body.push(temp);                    //地暖标志
                    body.push(device.value);            //地暖设定温度
                    body.push(0x80);                    //新风标志
                    body.push(0x19);                    //新风设定温度
                    body.push(0x00);                    //实测温度默认 0
                    break;
    
                case "fan":
                    deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_AC;
                    funcode=Contract.FUNCTION_CODE.WRITE + Contract.FUNCTION_CODE.CONTROL;
                    /*
                    AA AA 10 01 01 04 01 42 81 19 80 1C 80 19 00 18
                                                        新风标志：Bit0-2：预留 Bit3-4：0-自动 1-低速 2-中速 3-高速 Bit5-6：0-解锁 1-锁定按键 2-锁定数据 Bit7：0-关机 1-开机
                                                        device.isOn 开关, device.value 温度, device.fan 风速, device.lock 锁定状态
                                                           新风设定温度
                    */
                    var temp=0x00;
                    if(device.isOn){    //开机
                        temp=temp+(1<<7);
                    }
                    temp=temp+(device.lock<<5); //锁定状态
                    temp=temp+(device.fan<<3);  //风速
                    
                    body.push(0x80);      			    //空调标志
                    body.push(0x1c);    	            //空调设定温度
                    body.push(0x80);                    //地暖标志
                    body.push(0x1c);                    //地暖设定温度
                    body.push(temp);                    //新风标志
                    body.push(device.value);            //新风设定温度
                    body.push(0x00);                    //实测温度默认 0
                    break; 
            }
        }
        

        var data=this.buildCommand(body,device.areacode,device.addr,deviceType,funcode);
        //globalVariable.app.onLog("==>" + this.ip +":"+this.port + " " + globalVariable.bytes2hex(data));
        MyFunction.log("==>" + " " + MyFunction.bytes2hex(data));
        var _s=createSocket(BaseByteDeserializer.receiveData,bus.ws_url);
        sendWSData(Buffer.from(data),_s,bus);
    },
    /**
     * 空调控制，对单个属性进行修改
     * @param {*} device 
     * @param {*} channel 1--电源 2--温度 3--模式 4--风速，5--锁键盘
     */
    sendACAction:function(device,channel){
        var bus=MyFunction.getVOBus(device.id);
        if(bus==null){
            MyFunction.log("bus is null");
            return;
        }
        var deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_MAIN_ALL;
        var body=[];
        var funcode=0;
        deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_AC;
        funcode=Contract.FUNCTION_CODE.WRITE + Contract.FUNCTION_CODE.CONTROL;

        body.push(0x01);      			    //控制某项参数
        body.push(0x02);                    //设备类型：1--三合一，2--空调，3--地暖，4--新风
        body.push(channel);    	            //控制的通道
        switch(channel){
            case 1:
                if(device.isOn){    
                    body.push(0x01);    //开机
                }else{
                    body.push(0x00);    //关机
                }
                break;
            case 2:
                body.push(device.value);    //温度
                break;
            case 3:                     //模式
                if(device.mode=="制冷"){
                    body.push(0x01);
                }else if(device.mode=="制热"){
                    body.push(0x02);
                }else if(device.mode=="送风"){
                    body.push(0x03);
                }
                break;
            case 4:                     //风速
                body.push(parseInt(device.fan));
                break;
            case 5:                     //锁键盘
                body.push(parseInt(device.lock));
                break;
                
        }

        var data=this.buildCommand(body,device.areacode,device.addr,deviceType,funcode);
        MyFunction.log("==>" + " " + MyFunction.bytes2hex(data));
        var _s=createSocket(BaseByteDeserializer.receiveData,bus.ws_url);
        sendWSData(Buffer.from(data),_s,bus);
    },
    /** 主动请求设备状态 */
    queryDeviceStatus:function(device){
        var bus=MyFunction.getVOBus(device.id);
        if(bus==null){
            MyFunction.log("bus is null");
            return;
        }
        var deviceType=this.getDeviceType(device);
        console.log(deviceType);
        var body=[];

        // switch(device.type){
        //     case "light":
        //         deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_LIGHT;
        //         break;
        //     case "dimmer":
        //         deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_DIMMER;
        //         break;
        //     case "curtain":
        //         deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_CURTAIN;
        //         break;
        //     case "ac":
        //         deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_AC;
        //         break;
        //     case "scene":
        //         deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_SCENE;
        //         break;
        //     case "heating":
        //         deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_AC;
        //         break;
        //     case "fan":
        //         deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_AC;
        //         break; 
        // }

        var data=this.buildCommand(body,device.areacode,device.addr,deviceType,Contract.FUNCTION_CODE.QUERY_STATUS);
        //globalVariable.app.onLog("==>" + this.ip +":"+this.port + " " + globalVariable.bytes2hex(data));
        MyFunction.log("==>" + " " + MyFunction.bytes2hex(data));
        var _s=createSocket(BaseByteDeserializer.receiveData,bus.ws_url);
        sendWSData(Buffer.from(data),_s,bus);
    },

    /** 根据deviceId获取设备的类型 Contract.DEVICE_TYPE_ENUM */
    getDeviceType:function(device){
        //判断是否组合类型
        var areacode=parseInt(device.areacode);
        var addr=parseInt(device.addr);
        var type=device.type;
        var types=[];
        types.push(type);
        var deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_MAIN_ALL;
        for(var i=0;i<MyFunction.golbal.roomCur.devices.length;i++){
            var c_device=MyFunction.golbal.roomCur.devices[i];
            if(parseInt(c_device.areacode)==areacode && parseInt(c_device.addr)==addr){
                if(types.indexOf(c_device.type)==-1){
                    types.push(c_device.type);
                }
            }
        }
        if(types.length==1){
            switch(device.type){
                case "light":
                    deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_LIGHT;
                    break;
                case "dimmer":
                    deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_DIMMER;
                    break;
                case "curtain":
                    deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_CURTAIN;
                    break;
                case "ac":
                    deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_AC;
                    break;
                case "scene":
                    deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_SCENE;
                    break;
                case "heating":
                    deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_AC;
                    break;
                case "fan":
                    deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_AC;
                    break; 
            }
        }else if(types.length==2){
            if(types.indexOf("scene")>-1 && types.indexOf("light")>-1){
                deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_LIGHT_SCENE;
            }else if(types.indexOf("scene")>-1 && types.indexOf("dimmer")>-1){
                deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_DIMMER_SCENE;
            }else if(types.indexOf("scene")>-1 && types.indexOf("curtain")>-1){
                deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_CURTAIN_SCENE;
            }
        }else if(types.length==3){
            if(types.indexOf("scene")>-1 && types.indexOf("light")>-1 && types.indexOf("dimmer")>-1){
                deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_LIGHT_DIMMER_SCENE;
            }else if(types.indexOf("scene")>-1 && types.indexOf("light")>-1 && types.indexOf("curtain")>-1){
                deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_LIGHT_CURTAIN_SCENE;
            }else if(types.indexOf("scene")>-1 && types.indexOf("dimmer")>-1 && types.indexOf("curtain")>-1){
                deviceType=Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_DIMMER_CURTAIN_SCENE;
            }
        }
        return deviceType;
    }
}
//Public Function buildCommand(body As Byte(), areacode As Byte, addr As Byte, devicetype As VODeviceBase.DeviceTypeEnum, action As Contract.FUNCTION_CODE) As Byte()
// Dim buffer_list = New List(Of Byte)
// '消息头 2 byte
// buffer_list.Add(Contract.HEAD(0))
// buffer_list.Add(Contract.HEAD(1))
// '数据长度 1 byte
// buffer_list.Add(&H0)
// '设备类型 2 byte
// buffer_list.Add(devicetype >> 8)
// buffer_list.Add(devicetype And &HFF)
// '区域地址 1 byte
// buffer_list.Add(areacode)
// '设备地址 1 byte 1~255
// buffer_list.Add(addr)
// '功能码 1 byte 0~255
// buffer_list.Add(action)
// '数据体 n byte
// Dim i As Integer
// If Not body Is Nothing Then
//     For i = 0 To body.Length - 1
//         buffer_list.Add(body(i))
//     Next
// End If

// '校验和 1 byte 所有数据加起来的和
// Dim sum As Integer = 0
// For i = 0 To buffer_list.Count - 1
//     sum += buffer_list(i)
// Next
// buffer_list.Add(sum And &HFF)
// Return list2byte(buffer_list)