import Contract from './Contract';
import MyFunction from './MyFunction'
//import globalVariable from '../vbs/GlobalVariable'
export default {
    //接收数据
    receiveData:function(data){
        //globalVariable.app.onLog("==>" + this.ip +":"+this.port + " " + globalVariable.bytes2hex(data));
        console.log("<==" + " " + MyFunction.bytes2hex(data));

        if(data.length!=data[2]) return;

        for(var i=0;i<MyFunction.devicesAll.length;i++){
            var device=MyFunction.devicesAll[i].device;

            if(data[3]==device.areacode && data[4]==device.addr){   //当前设备
                if(device.type=="light" && ((data[5]<<8) + data[6]) == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_LIGHT){           //灯光
                    /*
                    AA AA 0D 01 01 03 01 81 04 00 0F 00 9A
                                                  状态1：Bit0-7 对应 L1-L8，0 表示关闭，1 表示开启
                                                     状态2：Bit0-7 对应 L9-L16，0 表示关闭，1 表示开启；
                    */
                    var temp=(data[11]<<8)+data[10];
                    device.isOn=((temp & Math.pow(2,(device.channel-1)))>0);

                }else if(device.type=="dimmer" && ((data[5]<<8) + data[6]) == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_DIMMER){    //调光
                    /*
                    AA AA 0D 01 02 03 02 81 02 00 00 64 50
                                                  状态1：第1路调光状态，0-关闭，1~100-开启亮度等级
                                                     状态2：第2路调光状态，0-关闭，1~100-开启亮度等级
                    */
                    if(device.channel==1){
                        device.value=data[10];
                    }else{
                        device.value=data[11];
                    }

                }else if(device.type=="curtain" && ((data[5]<<8) + data[6]) == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_CURTAIN){  //窗帘
                    /*
                    AA AA 0D 01 03 03 03 81 02 00 00 64 52
                                                  状态1：第 1 路窗帘状态，0-关闭，1~100-开启行程，101-停止
                                                     状态2：第 2 路窗帘状态，0-关闭，1~100-开启行程，101-停止
                    */
                    if(device.channel==1){
                        device.value=data[10];
                    }else{
                        device.value=data[11];
                    }

                }else if(device.type=="ac" && ((data[5]<<8) + data[6]) == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_AC){  //空调
                    /*
                    AA AA 10 01 01 04 01 81 81 19 80 1C 80 19 19 70
                                            空调标志        实测温度
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
                }else if(device.type=="scene" && ((data[5]<<8) + data[6]) == Contract.DEVICE_TYPE_ENUM.DEVICE_TYPE_SCENE){           //场景
                    /*
                    AA AA 0D 01 01 03 01 81 04 00 0F 00 9A
                                                  状态1：Bit0-7 对应 L1-L8，0 表示关闭，1 表示开启
                                                     状态2：Bit0-7 对应 L9-L16，0 表示关闭，1 表示开启；
                    */
                    var temp=(data[11]<<8)+data[10];
                    device.isOn=((temp & Math.pow(2,(device.channel-1)))>0);

                }
            }

            
        }
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