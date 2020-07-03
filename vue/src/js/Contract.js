export default {
    HEAD:[0xAA,0xAA],
    FUNCTION_CODE:{
        READ:0x00
        ,WRITE:0x40
        ,FEEDBACK:0x80
        ,STATUS_BACK:0xC0
        ,QUERY_STATUS:0x01
        ,CONTROL:0x02
    },
    DEVICE_TYPE_ENUM:{
        DEVICE_TYPE_MAIN_ALL:0x00,
        DEVICE_TYPE_MAIN:0x0101,
        DEVICE_TYPE_GATEWAY:0x0102,
        DEVICE_TYPE_BUS_SCREEN:0x0103,
        DEVICE_TYPE_LOGIC:0x0104,
        DEVICE_TYPE_AI_GENIC:0x0105,
        DEVICE_TYPE_INFRARED:0x0201,
        /**
         * 灯控面板
         */
        DEVICE_TYPE_LIGHT:0x0301,
        DEVICE_TYPE_DIMMER:0x0302,
        DEVICE_TYPE_CURTAIN:0x0303,
        DEVICE_TYPE_SCENE:0x0304,
        /**
         * 开关+情景组合面板
         */
        DEVICE_TYPE_LIGHT_SCENE:0x0305,
        /**
         * 开关+情景组合面板
         */
        DEVICE_TYPE_AC:0x0401

    }
    
    // Public Enum DEVICE_TYPE_ENUM




    //     ''' <summary>
    //     ''' 开关+情景组合面板
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_LIGHT_SCENE = &H305
    //     ''' <summary>
    //     ''' 调光+情景组合面板
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_DIMMER_SCENE = &H306
    //     ''' <summary>
    //     ''' 窗帘+情景组合面板
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_CURTAIN_SCENE = &H307
    //     ''' <summary>
    //     ''' 开关+调光+情景组合面板
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_LIGHT_DIMMER_SCENE = &H308
    //     ''' <summary>
    //     ''' 开关+窗帘+情景组合面板
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_LIGHT_CURTAIN_SCENE = &H309
    //     ''' <summary>
    //     ''' 调光+窗帘+情景组合面板
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_DIMMER_CURTAIN_SCENE = &H30A
    //     ''' <summary>
    //     ''' RGB调光面板
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_RGB = &H30B
    //     ''' <summary>
    //     ''' 自定义协议
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_CUSTOM_PANEL = &H30C
    //     ''' <summary>
    //     ''' 人体感应面板
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_BODY_INDUCTION = &H30D
    //     ''' <summary>
    //     ''' 干接点检测面板
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_DRY_CONTACT = &H30E
    //     ''' <summary>
    //     ''' 门铃
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_DOOR_BELL = &H30F
    //     ''' <summary>
    //     ''' 取电开关
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_GET_ELECTRIC = &H310

    //     ''' <summary>
    //     ''' 温控器
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_AC = &H401

    //     ''' <summary>
    //     ''' 模块--继电器
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_RELAY = &H501

    //     ''' <summary>
    //     ''' 模块--可控硅调光
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_SI_DIMMER = &H502

    //     ''' <summary>
    //     ''' 模块--0~10V调光
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_0_10_DIMMER = &H503

    //     ''' <summary>
    //     ''' 模块--IO检测
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_IO_CHECKER = &H504

    //     ''' <summary>
    //     ''' 模块--DALI调光
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_DALI_DIMMER = &H505

    //     ''' <summary>
    //     ''' 模块--DMX512调光
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_DMX512_DIMMER = &H506
    //     ''' <summary>
    //     ''' 传感器--面板
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_SENSOR_PANEL = &H601
    //     ''' <summary>
    //     ''' 传感器--智能门磁
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_SMART_LOCK = &H602
    //     ''' <summary>
    //     ''' 传感器--人体感应
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_SENSOR_BODY_CHECK = &H603
    //     ''' <summary>
    //     ''' 智能插座
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_SMART_SOCKET = &H310701
    //     ''' <summary>
    //     ''' 背景音乐
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_MUSIC = &H800
    //     ''' <summary>
    //     ''' 密码锁
    //     ''' </summary>
    //     ''' <remarks></remarks>
    //     DEVICE_TYPE_PASSWORD_LOCK = &H900
    // End Enum
}