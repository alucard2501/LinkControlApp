import Contract from './Contract';
import MyFunction from './MyFunction'
//import globalVariable from '../vbs/GlobalVariable'
export default {
    //接收数据
    receiveData:function(data){
        //globalVariable.app.onLog("==>" + this.ip +":"+this.port + " " + globalVariable.bytes2hex(data));
        console.log("<==" + " " + MyFunction.bytes2hex(data));
        MyFunction.log("<==" + " " + MyFunction.bytes2hex(data));
        if(data.length!=data[2]) return;
        var deviceType=(data[5]<<8) + data[6];
        for(var i=0;i<MyFunction.devicesAll.length;i++){
            var device=MyFunction.devicesAll[i].device;

            if(data[3]==device.areacode && data[4]==device.addr){   //当前设备
                if(device.type=="light" ){           //灯光
                    if(data[7]!=0x87 && data[7]!=0xC7 && data[7]!=0xC6){
                        if(deviceType == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_LIGHT ){
                        
                            if(data[7]==0x81 || data[7]==0xC1){  //主动查询
                                /*
                                AA AA 0D 01 01 03 01 81 04 00 0F 00 9A
                                                        通道数, 1-255
                                                        状态 1,默认为 0
                                                            状态2：Bit0-7 对应 L1-L8，0 表示关闭，1 表示开启；
                                                                状态3：Bit0-7 对应 L9-L16，0 表示关闭，1 表示开启；
                                */
                                var temp=(data[11]<<8)+data[10];
                                device.isOn=((temp & Math.pow(2,(device.channel-1)))>0);
                            }else{ //手动操作
                                /*
                                AA AA 0E 01 01 03 01 C2 01 64 01 01 01 30
                                AA AA 0E 01 01 03 01 C2 01 00 01 02 01 CD
                                                        通道号,0x11-0x18 表示第 1-8 路开关
                                                        通道状态,0-关闭，100-开启
                                */
                                if(device.channel==data[8]){
                                    device.isOn=(data[9]==0x64);
                                }
                            }
                        
                    }else if(deviceType == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_LIGHT_SCENE ){
                        if(data[7]==0x81 || data[7]==0xC1){  //主动查询
                            /*
                            AA AA 0D 01 01 03 01 81 04 00 0F 00 9A
                                                    通道数, 1-255
                                                    状态 1,默认为 0
                                                        状态2：Bit0-7 对应 L1-L8，0 表示关闭，1 表示开启；
                                                            状态3：Bit0-7 对应 L9-L16，0 表示关闭，1 表示开启；
                            */
                            var temp=(data[11]<<8)+data[10];
                            device.isOn=((temp & Math.pow(2,(device.channel-1)))>0);
                        }else{ //手动操作
                            /*
                            AA AA 0E 01 01 03 01 C2 01 64 01 01 01 30
                            AA AA 0E 01 01 03 01 C2 01 00 01 02 01 CD
                                                    通道号,0x11-0x18 表示第 1-8 路开关
                                                    通道状态,0-关闭，100-开启
                            */
                            if(device.channel==data[8]){
                                device.isOn=(data[9]==0x64);
                            }
                        }
                    }
                    }
                    
                        
                }else if(device.type=="scene" ){      //场景
                    if(deviceType == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_SCENE ){
                        if(data[7]!=0x82 && data[7]!=0xC2 && data[7]!=0xC6){
                            if(data[7]==0x81 || data[7]==0xC1 ){  //主动查询
                                /*
                                AA AA 0D 01 01 03 04 81 06 01 00 00 91
                                                        通道数, 1-255
                                                           状态 1,Bit0-7 对应 S1-S8，0 表示关闭，1 表示开启；
                                                              状态2：默认为 0
                                                                 状态3：默认为 0
                                */
                                device.isOn=((data[9] & Math.pow(2,(device.channel-1)))>0);
                            }else{ //手动操作
                                /*
                                AA AA 0E 01 01 03 01 C2 01 00 01 02 01 CD
                                                        通道号,0x11-0x18 表示第 1-8 路开关
                                                           通道状态,0-关闭，100-开启
                                */
                                if(device.channel==data[8]){
                                    device.isOn=(data[9]==0x64);
                                }
                            }
                        }
                    }else if(deviceType == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_LIGHT_SCENE || deviceType == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_CURTAIN_SCENE || deviceType == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_DIMMER_SCENE){
                        if(data[7]!=0x82 && data[7]!=0xC2 && data[7]!=0xC6){
                            if(data[7]==0x81 || data[7]==0xC1 ){  //主动查询
                                /*
                                AA AA 0D 01 01 03 04 81 06 01 00 00 91
                                                        通道数, 1-255
                                                           状态 1,Bit0-7 对应 S1-S8，0 表示关闭，1 表示开启；
                                                              状态2：默认为 0
                                                                 状态3：默认为 0
                                */
                                device.isOn=((data[9] & Math.pow(2,(device.channel-1)))>0);
                            }else{ //手动操作
                                /*
                                AA AA 0E 01 01 03 01 C2 01 00 01 02 01 CD
                                                        通道号,0x11-0x18 表示第 1-8 路开关
                                                           通道状态,0-关闭，100-开启
                                */
                                if(device.channel==data[8]){
                                    device.isOn=(data[9]==0x64);
                                }
                            }
                        }
                    }
                    
                }else if(device.type=="dimmer"){    //调光
                    if(data[7]!=0x87 && data[7]!=0xC7 && data[7]!=0xC6){
                        if(deviceType == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_DIMMER ){
                            if(data[7]==0x81 || data[7]==0xC1){  //主动查询
                                /*
                                AA AA 0D 01 01 03 02 81 02 00 64 64 52
                                                        通道数, 1-255
                                                           状态 1,默认为 0
                                                              状态2：第 1 路调光状态，0-关闭，1~100-开启亮度等级
                                                                 状态3：第 2 路调光状态，0-关闭，1~100-开启亮度等级
                                */
                                if(device.channel==1){
                                    device.value=data[10];
                                }else{
                                    device.value=data[11];
                                }
                            }else{ //手动操作
                                /*
                                AA AA 0E 01 01 03 02 C2 01 00 01 02 01 CE
                                                        通道号,0x01-0x02 表示第 1-2 路调光
                                                           通道状态,0-关闭，100-开启
                                */
                                if(device.channel==data[8]){
                                    device.value=data[9];
                                }
                            }
                        }else if(deviceType == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_DIMMER_SCENE){
                            if(data[7]==0x81 || data[7]==0xC1){  //主动查询
                                /*
                                AA AA 0D 01 01 03 02 81 02 00 64 64 52
                                                        通道数, 1-255
                                                           状态 1,默认为 0
                                                              状态2：第 1 路调光状态，0-关闭，1~100-开启亮度等级
                                                                 状态3：第 2 路调光状态，0-关闭，1~100-开启亮度等级
                                */
                                if(device.channel==1){
                                    device.value=data[10];
                                }else{
                                    device.value=data[11];
                                }
                            }else{ //手动操作
                                /*
                                AA AA 0E 01 01 03 02 C2 01 00 01 02 01 CE
                                                        通道号,0x01-0x02 表示第 1-2 路调光
                                                           通道状态,0-关闭，100-开启
                                */
                                if(device.channel==data[8]){
                                    device.value=data[9];
                                }
                            }
                        }
                    }
                    
                }else if(device.type=="curtain"){  //窗帘
                    if(data[7]!=0x87 && data[7]!=0xC7 && data[7]!=0xC6){
                        if(deviceType == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_CURTAIN ){
                            if(data[7]==0x81 || data[7]==0xC1){  //主动查询
                            /*
                                AA AA 0D 01 01 03 03 81 02 00 64 64 53
                                                        通道数, 1-255
                                                        状态1：默认为 0
                                                            状态2：第 1 路窗帘状态，0-关闭，1~100-开启行程，101-停止
                                                                状态3：第 2 路窗帘状态，0-关闭，1~100-开启行程，101-停止
                                */
                                if(device.channel==1){
                                    device.value=data[10];
                                }else{
                                    device.value=data[11];
                                }
                            }else{ //手动操作
                                /*
                                AA AA 0E 01 01 03 03 C2 01 00 01 02 01 CF
                                                        通道号,0x01-0x02 表示第 1-2 路窗帘
                                                        通道状态,0-关闭，100-开启，101-停止
                                */
                                if(device.channel==data[8]){
                                    device.value=data[9];
                                }
                            }
                        }else if(deviceType == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_CURTAIN_SCENE){
                            if(data[7]==0x81 || data[7]==0xC1){  //主动查询
                                /*
                                    AA AA 0D 01 01 03 03 81 02 00 64 64 53
                                                            通道数, 1-255
                                                            状态1：默认为 0
                                                                状态2：第 1 路窗帘状态，0-关闭，1~100-开启行程，101-停止
                                                                    状态3：第 2 路窗帘状态，0-关闭，1~100-开启行程，101-停止
                                    */
                                    if(device.channel==1){
                                        device.value=data[10];
                                    }else{
                                        device.value=data[11];
                                    }
                            }else{ //手动操作
                                    /*
                                    AA AA 0E 01 01 03 03 C2 01 00 01 02 01 CF
                                                            通道号,0x01-0x02 表示第 1-2 路窗帘
                                                            通道状态,0-关闭，100-开启，101-停止
                                    */
                                    if(device.channel==data[8]){
                                        device.value=data[9];
                                    }
                            }
                        }
                    }
                    
                }else if(device.type=="ac" && deviceType == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_AC){            //空调
                    /*
                    AA AA 10 01 01 04 01 81 81 19 80 1C 80 19 19 70
                                            空调标志: Bit0-2：0-恒温，2-制冷，2-制热，3-送风; Bit3-4：0-自动，1-低速，2-中速，3-高速;
                                                        Bit5-6：0-解锁，1-锁定按键，2-锁定数据; Bit7：0-关机，1-开机
                                                空调设定温度
                    */
                    device.value=data[9];
                    var temp=data[8];
                    device.isOn=((temp>>7)==1);
                    device.lock=((temp>>5)&3);
                    device.fan=((temp>>3)&3);
                    switch(temp&3){
                        case 1:
                            device.mode="制冷";
                            break;
                        case 2:
                            device.mode="制热";
                            break;
                        case 3:
                            device.mode="送风";
                            break;
                        default:
                            device.mode="恒温";
                            break;
                    }
                    device.summary=device.mode + ' ' + device.value + '℃';
                }else if(device.type=="heating" && deviceType == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_AC){       //地暖
                    /*
                    AA AA 10 01 01 04 01 81 81 19 80 1C 80 19 19 70
                                                  地暖标志: Bit0-4：预留; Bit5-6：0-解锁，1-锁定按键，2-锁定数据; Bit7：0-关机，1-开机
                                                    地暖设定温度
                    */
                    device.value=data[11];
                    var temp=data[10];
                    device.isOn=((temp>>7)==1);
                    device.lock=((temp>>5)&3);

                }else if(device.type=="fan" && deviceType == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_AC){           //新风
                    /*
                    AA AA 10 01 01 04 01 81 81 19 80 1C 80 19 19 70
                                                        新风标志: Bit0-2：预留; Bit3-4：0-自动，1-低速，2-中速，3-高速
                                                                 Bit5-6：0-解锁，1-锁定按键，2-锁定数据; Bit7：0-关机，1-开机
                                                            新风设定温度
                    */
                    device.value=data[13];

                    var temp=data[12];
                    device.isOn=((temp>>7)==1);
                    device.lock=((temp>>5)&3);
                    device.fan=((temp>>3)&3);
                    
                }
            }
        }

        MyFunction.getTypeStatus();
    }
}
// Public Shared Sub receiveData(data As Byte(), ip As String)
//         If data.Length < 3 Then Throw New Exception("获取数据长度小于3")
//         '判断消息头 2字节
//         If data(0) <> Contract.HEAD(0) OrElse data(1) <> Contract.HEAD(1) Then Throw New Exception("消息头错误")
//         '获取消息长度 1字节
//         Dim length As Integer = data(2)
//         '校验数据完整性
//         If data.Length < length Then Throw New Exception("数据长度与数据长度标记不一至")
//         '获取设备类型 2字节
//         Dim devicetype As Contract.DEVICE_TYPE_ENUM = Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_MAIN_ALL
//         devicetype = (CInt(data(3)) << 8) + data(4)

//         '获取设备地址
//         Dim area_addr As Byte = data(5)
//         Dim addr As Byte = data(6)
//         '获取功能码，判断最后两位是是否反馈类型 & 0x80>1
//         Dim func_code As Byte = data(7)
//         '获取数据体，传给各子类Deserializer
//         Dim body As Byte()
//         ReDim body(length - 10)
//         For i = 0 To body.Length - 1
//             body(i) = data(i + 8)
//         Next
//         '获取校验码
//         Dim validata_code As Byte = data(length - 1)

//         '进行校验，不匹配的抛错

//         '根据设备类型取得对应的处理类
//         Dim mb As MessageBody = New MessageBody
//         mb.AreaAddr = area_addr
//         mb.Length = length
//         mb.Data = body
//         mb.DeviceAddr = addr
//         mb.FunctionCode = func_code
//         mb.DeviceType = devicetype
//         Dim deserializer As BaseByteDeserializer = Listener.getDeserializerByMsg(devicetype)
//         deserializer.handlerReceive(mb)
//     End Sub