<template>
  <div id="page">
    <FrameHeader v-bind:golbal="golbal"></FrameHeader>
    <router-view v-bind:golbal="golbal" v-bind:logList="logList"/>
    <FrameFooter v-bind:golbal="golbal"></FrameFooter>

    <el-dialog title="关于" :visible.sync="golbal.drawerAbout" custom-class="drawerAbout" style="margin-top:-15vh">
      <div class="divAboutLogo" @touchend="aboutLogoClick()">
        <img src="static/images/about_logo.png"  />
      </div>
      <div class="divAboutAppname">
        <span style="color:#bdbdbd;">智慧云联</span>
      </div>
      <hr class="hrAbout">
      <div class="divAboutVersion">
        <span style="color:#bdbdbd;">{{version}}</span>
      </div>
    </el-dialog>
    <el-dialog title="网关列表" :visible.sync="golbal.drawerGateway" custom-class="drawerGateway" style="margin-top:-15vh">
      <ul>
        <li>
          <div class="divGateway1">名称</div>
          <div class="divGateway2">MAC</div>
          <div class="divGateway3">在线</div>
        </li>
        <li v-for="bus in golbal.myProject.buses" v-bind:key="bus.id">
          <div class="divGateway1">{{bus.name}}</div>
          <div class="divGateway2">{{bus.mac}}</div>
          <div class="divGateway3"><i :class="bus.isOnline?'icon-checkmark':''"></i></div>
        </li>
      </ul>
    </el-dialog>
    <el-dialog title="请选择楼栋" :visible.sync="golbal.drawerBlock" custom-class="drawerBlock" style="margin-top:-15vh">
      <ul>
        <li v-for="block in golbal.myProject.blocks" v-bind:key="block.id" @click="blockClick(block)">
          <i class="icon-office"></i><span>{{block.name}}</span>
          <div class="checked" v-if="block.active"><i class="icon-yuanxingxuanzhongfill"></i></div>
        </li>
      </ul>
    </el-dialog>
    <el-dialog title="请选择主题样式" :visible.sync="golbal.drawerTheme" custom-class="drawerTheme" style="margin-top:-15vh">
      <div class="divUserTheme">
        <div :class="'divUserThemeItem'+(golbal.themeCur==1?'':' divUserThemeItemC')" @click="themeClick(1)">
          <div class="divUserThemeIcon"><i class="icon-checkmark"></i></div>
          <div class="divUserThemeBoard"></div>
          <img src="static/images/theme1.jpg">
        </div>
        <div :class="'divUserThemeItem'+(golbal.themeCur==2?'':' divUserThemeItemC')" @click="themeClick(2)">
          <div class="divUserThemeIcon"><i class="icon-checkmark"></i></div>
          <div class="divUserThemeBoard"></div>
          <img src="static/images/theme2.jpg">
        </div>
      </div>
    </el-dialog>
    <el-dialog title="日志" :visible.sync="golbal.drawerTest" custom-class="drawerTest" style="margin-top:-15vh">
      <el-button @click="clearLog">清空</el-button>
      <div class="divSendMessage" :style="'width:100%;height:'+heightSendMessage+'px;overflow-y:auto'">
        <ul class="ulLog">
          <li v-for="log in logList.logs" v-bind:key="log">{{log}}</li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import FrameHeader from './components/FrameHeader';
import FrameFooter from './components/FrameFooter';
import MyFunction from './js/MyFunction'
import { createSocket, sendWSPush ,sendWSData, createRemoteSocket,onResume} from './js/WebSocket'
import BaseByteDeserializer from './js/BaseByteDeserializer'

export default {
  name: 'App',
  components: {
    FrameHeader,
    FrameFooter
  },

  data () {
    return {
      golbal:{
        //HOST:"http://192.168.0.119:3002",
        HOST:"https://app.lk-control.com",
        accessToken:"",
        refreshToken:"",
        menuCur:'',
        showDebug:false,
        isGallery:true,
        type:[
          {id:1,name:'all',icon:'icon-all',isOn:false},
          {id:2,name:'light',icon:'icon-ls_1_light',isOn:false},
          {id:3,name:'curtain',icon:'icon-ls_23_curtain',isOn:false},
          {id:4,name:'ac',icon:'icon-ls_7_ac',isOn:false},
          {id:5,name:'scene',icon:'icon-ls_26_go_off_work',isOn:false},
        ],
        typeCur:'all',
        showButtonFloor:false,
        blockCur:{},
        floorCur:{},
        roomCur:{},
        myProject:{
          id:'b0b502b7-c000-4000-a000-0547116af000',
          name:'万科水晶城',
          active:true,
          blocks:[{
            id:'b0b502b7-c001-4000-a000-0547116af000',
            name:'1座',
            floors:[{
              id:'b0b502b7-c001-4001-a000-0547116af000',
              name:'楼层一',
              active:true,
              isOn:false,
              rooms:[
                {
                id:'b0b502b7-c001-4001-a001-0547116af000',
                name:'主卧',
                busId:"7e0378ca-c813-4056-a001-485e2970c001",
                active:true,
                isOn:false,
                devices:[
                  {id:'b0b502b7-c001-4001-a001-0547116af001',type:"light",areacode:1,addr:1,channel:1,name:"吊灯",summary:"关闭",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af002',type:"light",areacode:1,addr:1,channel:2,name:"壁灯",summary:"开启",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:true},
                  {id:'b0b502b7-c001-4001-a001-0547116af003',type:"curtain",areacode:1,addr:1,channel:3,name:"窗帘",summary:"50%",icon:"icon-ls_23_curtain",isFavorite:false,hits:0,value:10},
                  {id:'b0b502b7-c001-4001-a001-0547116af004',type:"dimmer",areacode:1,addr:1,channel:2,name:"床头灯",summary:"40%",icon:"icon-ls_4_dimmer",isFavorite:false,hits:0,value:40},
                  {id:'b0b502b7-c001-4001-a001-0547116af005',type:"ac",name:"空调",summary:"制冷 26℃",icon:"icon-ls_7_ac",isFavorite:true,hits:0,isOn:false,value:26,mode:'制冷',fan:3,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af006',type:"scene",areacode:1,addr:1,channel:1,name:"场景",summary:"关闭",icon:"icon-ls_26_go_off_work",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af007',type:"heating",name:"地暖",summary:"26℃",icon:"icon-ls_19_heater",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:0,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af008',type:"fan",name:"新风",summary:"26℃",icon:"icon-ls_22_new_trend",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:3,lock:0},
                ],
                },
                {
                id:'b0b502b7-c001-4001-a001-0547116af001',
                name:'主卧1',
                busId:"7e0378ca-c813-4056-a001-485e2970c001",
                active:true,
                isOn:false,
                devices:[
                  {id:'b0b502b7-c001-4001-a001-0547116af001',type:"light",areacode:1,addr:1,channel:1,name:"吊灯",summary:"关闭",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af002',type:"light",areacode:1,addr:1,channel:2,name:"壁灯",summary:"开启",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:true},
                  {id:'b0b502b7-c001-4001-a001-0547116af003',type:"curtain",areacode:1,addr:1,channel:3,name:"窗帘",summary:"50%",icon:"icon-ls_23_curtain",isFavorite:false,hits:0,value:10},
                  {id:'b0b502b7-c001-4001-a001-0547116af004',type:"dimmer",areacode:1,addr:1,channel:2,name:"床头灯",summary:"40%",icon:"icon-ls_4_dimmer",isFavorite:false,hits:0,value:40},
                  {id:'b0b502b7-c001-4001-a001-0547116af005',type:"ac",name:"空调",summary:"制冷 26℃",icon:"icon-ls_7_ac",isFavorite:true,hits:0,isOn:false,value:26,mode:'制冷',fan:3,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af006',type:"scene",areacode:1,addr:1,channel:1,name:"场景",summary:"关闭",icon:"icon-ls_26_go_off_work",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af007',type:"heating",name:"地暖",summary:"26℃",icon:"icon-ls_19_heater",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:0,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af008',type:"fan",name:"新风",summary:"26℃",icon:"icon-ls_22_new_trend",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:3,lock:0},
                ],
                },
                {
                id:'b0b502b7-c001-4001-a001-0547116af002',
                name:'主卧123456',
                busId:"7e0378ca-c813-4056-a001-485e2970c001",
                active:true,
                isOn:false,
                devices:[
                  {id:'b0b502b7-c001-4001-a001-0547116af001',type:"light",areacode:1,addr:1,channel:1,name:"吊灯",summary:"关闭",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af002',type:"light",areacode:1,addr:1,channel:2,name:"壁灯",summary:"开启",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:true},
                  {id:'b0b502b7-c001-4001-a001-0547116af003',type:"curtain",areacode:1,addr:1,channel:3,name:"窗帘",summary:"50%",icon:"icon-ls_23_curtain",isFavorite:false,hits:0,value:10},
                  {id:'b0b502b7-c001-4001-a001-0547116af004',type:"dimmer",areacode:1,addr:1,channel:2,name:"床头灯",summary:"40%",icon:"icon-ls_4_dimmer",isFavorite:false,hits:0,value:40},
                  {id:'b0b502b7-c001-4001-a001-0547116af005',type:"ac",name:"空调",summary:"制冷 26℃",icon:"icon-ls_7_ac",isFavorite:true,hits:0,isOn:false,value:26,mode:'制冷',fan:3,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af006',type:"scene",areacode:1,addr:1,channel:1,name:"场景",summary:"关闭",icon:"icon-ls_26_go_off_work",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af007',type:"heating",name:"地暖",summary:"26℃",icon:"icon-ls_19_heater",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:0,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af008',type:"fan",name:"新风",summary:"26℃",icon:"icon-ls_22_new_trend",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:3,lock:0},
                ],
                },
                {
                id:'b0b502b7-c001-4001-a001-0547116af003',
                name:'主卧',
                busId:"7e0378ca-c813-4056-a001-485e2970c001",
                active:true,
                isOn:false,
                devices:[
                  {id:'b0b502b7-c001-4001-a001-0547116af001',type:"light",areacode:1,addr:1,channel:1,name:"吊灯",summary:"关闭",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af002',type:"light",areacode:1,addr:1,channel:2,name:"壁灯",summary:"开启",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:true},
                  {id:'b0b502b7-c001-4001-a001-0547116af003',type:"curtain",areacode:1,addr:1,channel:3,name:"窗帘",summary:"50%",icon:"icon-ls_23_curtain",isFavorite:false,hits:0,value:10},
                  {id:'b0b502b7-c001-4001-a001-0547116af004',type:"dimmer",areacode:1,addr:1,channel:2,name:"床头灯",summary:"40%",icon:"icon-ls_4_dimmer",isFavorite:false,hits:0,value:40},
                  {id:'b0b502b7-c001-4001-a001-0547116af005',type:"ac",name:"空调",summary:"制冷 26℃",icon:"icon-ls_7_ac",isFavorite:true,hits:0,isOn:false,value:26,mode:'制冷',fan:3,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af006',type:"scene",areacode:1,addr:1,channel:1,name:"场景",summary:"关闭",icon:"icon-ls_26_go_off_work",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af007',type:"heating",name:"地暖",summary:"26℃",icon:"icon-ls_19_heater",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:0,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af008',type:"fan",name:"新风",summary:"26℃",icon:"icon-ls_22_new_trend",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:3,lock:0},
                ],
                },
                {
                id:'b0b502b7-c001-4001-a001-0547116af004',
                name:'主卧',
                busId:"7e0378ca-c813-4056-a001-485e2970c001",
                active:true,
                isOn:false,
                devices:[
                  {id:'b0b502b7-c001-4001-a001-0547116af001',type:"light",areacode:1,addr:1,channel:1,name:"吊灯",summary:"关闭",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af002',type:"light",areacode:1,addr:1,channel:2,name:"壁灯",summary:"开启",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:true},
                  {id:'b0b502b7-c001-4001-a001-0547116af003',type:"curtain",areacode:1,addr:1,channel:3,name:"窗帘",summary:"50%",icon:"icon-ls_23_curtain",isFavorite:false,hits:0,value:10},
                  {id:'b0b502b7-c001-4001-a001-0547116af004',type:"dimmer",areacode:1,addr:1,channel:2,name:"床头灯",summary:"40%",icon:"icon-ls_4_dimmer",isFavorite:false,hits:0,value:40},
                  {id:'b0b502b7-c001-4001-a001-0547116af005',type:"ac",name:"空调",summary:"制冷 26℃",icon:"icon-ls_7_ac",isFavorite:true,hits:0,isOn:false,value:26,mode:'制冷',fan:3,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af006',type:"scene",areacode:1,addr:1,channel:1,name:"场景",summary:"关闭",icon:"icon-ls_26_go_off_work",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af007',type:"heating",name:"地暖",summary:"26℃",icon:"icon-ls_19_heater",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:0,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af008',type:"fan",name:"新风",summary:"26℃",icon:"icon-ls_22_new_trend",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:3,lock:0},
                ],
                },
                {
                id:'b0b502b7-c001-4001-a001-0547116af005',
                name:'主卧',
                busId:"7e0378ca-c813-4056-a001-485e2970c001",
                active:true,
                isOn:false,
                devices:[
                  {id:'b0b502b7-c001-4001-a001-0547116af001',type:"light",areacode:1,addr:1,channel:1,name:"吊灯",summary:"关闭",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af002',type:"light",areacode:1,addr:1,channel:2,name:"壁灯",summary:"开启",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:true},
                  {id:'b0b502b7-c001-4001-a001-0547116af003',type:"curtain",areacode:1,addr:1,channel:3,name:"窗帘",summary:"50%",icon:"icon-ls_23_curtain",isFavorite:false,hits:0,value:10},
                  {id:'b0b502b7-c001-4001-a001-0547116af004',type:"dimmer",areacode:1,addr:1,channel:2,name:"床头灯",summary:"40%",icon:"icon-ls_4_dimmer",isFavorite:false,hits:0,value:40},
                  {id:'b0b502b7-c001-4001-a001-0547116af005',type:"ac",name:"空调",summary:"制冷 26℃",icon:"icon-ls_7_ac",isFavorite:true,hits:0,isOn:false,value:26,mode:'制冷',fan:3,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af006',type:"scene",areacode:1,addr:1,channel:1,name:"场景",summary:"关闭",icon:"icon-ls_26_go_off_work",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af007',type:"heating",name:"地暖",summary:"26℃",icon:"icon-ls_19_heater",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:0,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af008',type:"fan",name:"新风",summary:"26℃",icon:"icon-ls_22_new_trend",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:3,lock:0},
                ],
                },
                {
                id:'b0b502b7-c001-4001-a001-0547116af006',
                name:'主卧',
                busId:"7e0378ca-c813-4056-a001-485e2970c001",
                active:true,
                isOn:false,
                devices:[
                  {id:'b0b502b7-c001-4001-a001-0547116af001',type:"light",areacode:1,addr:1,channel:1,name:"吊灯",summary:"关闭",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af002',type:"light",areacode:1,addr:1,channel:2,name:"壁灯",summary:"开启",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:true},
                  {id:'b0b502b7-c001-4001-a001-0547116af003',type:"curtain",areacode:1,addr:1,channel:3,name:"窗帘",summary:"50%",icon:"icon-ls_23_curtain",isFavorite:false,hits:0,value:10},
                  {id:'b0b502b7-c001-4001-a001-0547116af004',type:"dimmer",areacode:1,addr:1,channel:2,name:"床头灯",summary:"40%",icon:"icon-ls_4_dimmer",isFavorite:false,hits:0,value:40},
                  {id:'b0b502b7-c001-4001-a001-0547116af005',type:"ac",name:"空调",summary:"制冷 26℃",icon:"icon-ls_7_ac",isFavorite:true,hits:0,isOn:false,value:26,mode:'制冷',fan:3,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af006',type:"scene",areacode:1,addr:1,channel:1,name:"场景",summary:"关闭",icon:"icon-ls_26_go_off_work",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af007',type:"heating",name:"地暖",summary:"26℃",icon:"icon-ls_19_heater",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:0,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af008',type:"fan",name:"新风",summary:"26℃",icon:"icon-ls_22_new_trend",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:3,lock:0},
                ],
                },
                {
                id:'b0b502b7-c001-4001-a001-0547116af007',
                name:'主卧',
                busId:"7e0378ca-c813-4056-a001-485e2970c001",
                active:true,
                isOn:false,
                devices:[
                  {id:'b0b502b7-c001-4001-a001-0547116af001',type:"light",areacode:1,addr:1,channel:1,name:"吊灯",summary:"关闭",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af002',type:"light",areacode:1,addr:1,channel:2,name:"壁灯",summary:"开启",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:true},
                  {id:'b0b502b7-c001-4001-a001-0547116af003',type:"curtain",areacode:1,addr:1,channel:3,name:"窗帘",summary:"50%",icon:"icon-ls_23_curtain",isFavorite:false,hits:0,value:10},
                  {id:'b0b502b7-c001-4001-a001-0547116af004',type:"dimmer",areacode:1,addr:1,channel:2,name:"床头灯",summary:"40%",icon:"icon-ls_4_dimmer",isFavorite:false,hits:0,value:40},
                  {id:'b0b502b7-c001-4001-a001-0547116af005',type:"ac",name:"空调",summary:"制冷 26℃",icon:"icon-ls_7_ac",isFavorite:true,hits:0,isOn:false,value:26,mode:'制冷',fan:3,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af006',type:"scene",areacode:1,addr:1,channel:1,name:"场景",summary:"关闭",icon:"icon-ls_26_go_off_work",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af007',type:"heating",name:"地暖",summary:"26℃",icon:"icon-ls_19_heater",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:0,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af008',type:"fan",name:"新风",summary:"26℃",icon:"icon-ls_22_new_trend",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:3,lock:0},
                ],
                },
                {
                id:'b0b502b7-c001-4001-a001-0547116af008',
                name:'主卧',
                busId:"7e0378ca-c813-4056-a001-485e2970c001",
                active:true,
                isOn:false,
                devices:[
                  {id:'b0b502b7-c001-4001-a001-0547116af001',type:"light",areacode:1,addr:1,channel:1,name:"吊灯",summary:"关闭",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af002',type:"light",areacode:1,addr:1,channel:2,name:"壁灯",summary:"开启",icon:"icon-ls_1_light",isFavorite:false,hits:0,isOn:true},
                  {id:'b0b502b7-c001-4001-a001-0547116af003',type:"curtain",areacode:1,addr:1,channel:3,name:"窗帘",summary:"50%",icon:"icon-ls_23_curtain",isFavorite:false,hits:0,value:10},
                  {id:'b0b502b7-c001-4001-a001-0547116af004',type:"dimmer",areacode:1,addr:1,channel:2,name:"床头灯",summary:"40%",icon:"icon-ls_4_dimmer",isFavorite:false,hits:0,value:40},
                  {id:'b0b502b7-c001-4001-a001-0547116af005',type:"ac",name:"空调",summary:"制冷 26℃",icon:"icon-ls_7_ac",isFavorite:true,hits:0,isOn:false,value:26,mode:'制冷',fan:3,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af006',type:"scene",areacode:1,addr:1,channel:1,name:"场景",summary:"关闭",icon:"icon-ls_26_go_off_work",isFavorite:false,hits:0,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af007',type:"heating",name:"地暖",summary:"26℃",icon:"icon-ls_19_heater",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:0,lock:0},
                  {id:'b0b502b7-c001-4001-a001-0547116af008',type:"fan",name:"新风",summary:"26℃",icon:"icon-ls_22_new_trend",isFavorite:true,hits:0,isOn:false,value:26,mode:'',fan:3,lock:0},
                ],
                },
              ]
            }]
          }],
          buses:[{
            name: "测试总线1",
            id: "7e0378ca-c813-4056-a001-485e2970c001",
            ip: "192.168.0.119",
            port: "8000",
            ws_url: "ws://192.168.0.119:8001",
            mac: "11 22 33 44 55 66",
            isOnline: false
          }]
        },
        testServer:'ws://192.168.0.119:8001',  //用户调试-参数设置-服务器
        messages:[
          {id:1,title:'系统通知',date:'2020-07-01 07:22:14',content:'停服维护已经结束，停服期间给您带来的不便，我们深表歉意。',showDelete:false},
          {id:2,title:'版本更新公告',date:'2020-06-25 17:43:53',content:'我们预计于北京时间：2020-06-26 02:00 - 04:00进行为期两个小时的停服更新维护。',showDelete:false},
          {id:3,title:'升级提醒',date:'2020-06-01 15:14:32',content:'为了使用户获得更好的体验，我们刚刚完成了一次热更，请重新启动程序以使更新生效。',showDelete:false},
          {id:4,title:'系统通知',date:'2020-05-28 12:53:43',content:'停服维护已经结束，停服期间给您带来的不便，我们深表歉意。',showDelete:false},
        ],
        themeCur:1,
        drawerAbout:false,
        drawerGateway:false,
        drawerTest:false,
        drawerBlock:false,
        drawerTheme:false,
        drawerTest:false,
      },
      logList:{
        logs:[]
      },
      heightSendMessage:window.innerHeight-180,
      widthDrawerTest:window.innerWidth,
      aboutLogoClickCount:0,
      version:"v1.0.58",
      udp_client:null,
    }
  },

  methods: {
    async getData(){
        
    },
    /**打开app时，临时登录 */
    loginTemp(){
      //产生随机设备码
      var id=MyFunction.uuid();
      var url=this.golbal.HOST + "/api?action=APP_LOGIN_TEMP&uuid=" + id;
      axios.post(url).then(function(response){
        try{
          
          MyFunction.golbal.accessToken=response.data.accessToken;
          MyFunction.golbal.refreshToken=response.data.refreshToken;
          MyFunction.log("登录成功：token=" +MyFunction.golbal.accessToken);
          console.log("myfunction accessToken=" + MyFunction.golbal.accessToken);
          console.log("myfunction refreshToken=" + MyFunction.golbal.refreshToken);
          //alert("获取成功")
        }catch(e){
          //that.onLog(e);
          //alert("获取失败")
        }
            
      }).catch(function (error) { // 请求失败处理
        console.log(error);
        //that.onLog(error);
        //alert("获取失败")
      });
    },
    readConfig(){
      if(MyFunction.myProject==null){

      
        var obj=null;
        var storage = window.localStorage;
        console.log("storage:" + storage);
        var obj = storage.getItem("myProject");
        console.log("myProject:" + obj);
        if(obj!=null){
          this.golbal.myProject = JSON.parse(storage.getItem("myProject"));
          this.golbal.themeCur=(storage.getItem("themeCur")==null)?1:parseInt(storage.getItem("themeCur"));
          this.golbal.isGallery=(storage.getItem("isGallery")==null)?true:(parseInt(storage.getItem("isGallery"))==1?true:false);
          document.getElementById("style").attributes[2].value="static/css/style" + this.golbal.themeCur + ".css";
        }
        createRemoteSocket();
        //选定默认楼栋
        for(var i=0;i<this.golbal.myProject.blocks.length;i++){
          var block=this.golbal.myProject.blocks[i];
          block.active=false;
          for(var j=0;j<block.floors.length;j++){
            var floor=block.floors[j];
            floor.active=false;
            for(var k=0;k<floor.rooms.length;k++){
              var room=floor.rooms[k];
              room.active=false;
              //if(r.active)this.golbal.roomCur=r;
            }
          }
          //if(r.active)this.golbal.blockCur=r;
        }
        this.golbal.blockCur = this.golbal.myProject.blocks[0];
        this.golbal.blockCur.active=true;
        
        
        //选定默认楼层
        
        this.golbal.floorCur = this.golbal.blockCur.floors[0];
        this.golbal.floorCur.active=true;
        
          
        //选定默认房间
        
        this.golbal.roomCur = this.golbal.floorCur.rooms[0];
        this.golbal.roomCur.active=true;
        

        //初始化全部设备数组
        var devicesAll=[];
        for(var i=0;i<this.golbal.myProject.blocks.length;i++){
          for(var j=0;j<this.golbal.myProject.blocks[i].floors.length;j++){
            for(var k=0;k<this.golbal.myProject.blocks[i].floors[j].rooms.length;k++){
              for(var z=0;z<this.golbal.myProject.blocks[i].floors[j].rooms[k].devices.length;z++){
                devicesAll.push({device:this.golbal.myProject.blocks[i].floors[j].rooms[k].devices[z],busId:this.golbal.myProject.blocks[i].floors[j].rooms[k].busId});
              }
            }
          }
        };
        
        MyFunction.devicesAll=devicesAll;
        //console.log(this.golbal);
        MyFunction.MyProject=this.golbal.myProject;
        //createSocket(BaseByteDeserializer.receiveData);
        MyFunction.golbal=this.golbal;
        
        //更换默认房间，加载设置开启情况
        MyFunction.getTypeStatus();
      }
    },
    /**狂点关于图标 */
    aboutLogoClick(){
      if(this.aboutLogoClickCount==0){
        setTimeout(function(){
          this.aboutLogoClickCount=0;
        });
      }
      this.aboutLogoClickCount+=1;
      if(this.aboutLogoClickCount==10){
        this.golbal.showDebug=true;
      }
      //测试udp
      // var data=[];
      //   data.push(0xff);
      //   data.push(0x01);
      //   data.push(0x01);
      //   data.push(0x02);
      //   this.udp_client.send(data,function(){
      //     console.log("sended");
      //   })
      // var info={
      //   data:MyFunction.hexStringToBytes("FF 24 01 00 00 C0 A8 00 0C 9C A5 25 AF 84 1D C8 0B 01 00 55 53 52 2D 4B 37 00 00 00 00 00 00 00 00 00 00 36")
      // }
      // this.onUDPMessage(info);
    },

    /** 点击楼栋 */
    blockClick(block){
      //清空全部楼栋在选属性，当前楼栋选定
      for(var i=0;i<this.golbal.myProject.blocks.length;i++){
				var r=this.golbal.myProject.blocks[i];
				r.active=false;
			}
      block.active=true;
      this.golbal.blockCur=block;

      //选定默认楼层-第一层
      this.golbal.floorCur = this.golbal.blockCur.floors[0];
      for(var i=0;i<this.golbal.blockCur.floors.length;i++){
				var r=this.golbal.blockCur.floors[i];
				if(i==0){
          r.active=true;
        }else{
          r.active=false;
        }
			}

      //选定默认房间-第一个房间
      this.golbal.roomCur = this.golbal.floorCur.rooms[0];
      for(var i=0;i<this.golbal.floorCur.rooms.length;i++){
        var r=this.golbal.floorCur.rooms[i];
         if(i==0){
          r.active=true;
        }else{
          r.active=false;
        }
      }
      MyFunction.getTypeStatus();

      this.drawerBlock=false;
    },

    /** 点击主题样式 */
    themeClick(tips){
      //更换主题
      if(this.golbal.themeCur!=tips){
        document.getElementById("style").attributes[2].value="static/css/style" + tips + ".css";
      }

      this.golbal.themeCur=tips;
      MyFunction.saveSetting();
    },

    /** 清空日志 */
    clearLog(){
      //MyFunction.log("测试")
      this.logList.logs=[];
    },

    init(){
      this.readConfig();

      this.udp_client=new UDP.Client("255.255.255.255",1901,this.onUDPMessage);
      var that=this;
      setTimeout(function(){
        
        var data=[];
        data.push(0xff);
        data.push(0x01);
        data.push(0x01);
        data.push(0x02);
        that.udp_client.send(data,function(){
          console.log("sended");
        })
      },2000);
      // chrome.sockets.udp.onReceiveError.addListener((data) => {
      //   console.log('received error');
      //   console.log(data);
      // });

      // chrome.sockets.udp.onReceive.addListener((data) => {
      //   console.log('received');
      //   console.log(data);
      // });
      //udp_client.onReceive();
    },
    onUDPMessage:function(info){
      console.log(info);
        var buf = new Uint8Array(info.data);
        console.log(buf);
        console.log("<== broadcast" + " " + MyFunction.bytes2hex(buf));
        if(buf[0]!=0xff)return;
        if(buf[1]!=buf.length)return;
        if(buf.length<36)return;
          //ff 24 01 00 00 c0 a8 00 06 9c a5 25 af 84 1d c8 0b 01 00 55 53 52 2d 4b 37 00 00 00 00 00 00 00 00 00 00 3b
        var mac_buf=[];
        var ip_buf=[];
        for(var i=5;i<=8;i++){
          ip_buf.push(buf[i]);
        }
        for(var i=9;i<=14;i++){
          mac_buf.push(buf[i]);
        }
        var mac=MyFunction.bytes2hex(mac_buf);
        var ip=ip_buf[0] + "." + ip_buf[1] + "." + ip_buf[2] + "." + ip_buf[3];
        MyFunction.log("mac:" + mac +",ip:" + ip);
        MyFunction.log("关注网关数:" + this.golbal.myProject.buses.length);
        for(var i=0;i<this.golbal.myProject.buses.length;i++){
          var bus=this.golbal.myProject.buses[i];
          MyFunction.log("bus mac:" + bus.mac +",bus ip:" + ip + ",比较后:" + (bus.mac.trim()==mac.toUpperCase().trim()));
          if(bus.mac.trim()==mac.toUpperCase().trim()){
            bus.ip=ip;
            bus.source_url=bus.ws_url;
            bus.ws_url="ws://" + ip +":6432/";
            MyFunction.log("更新网关" + bus.mac +"的ip:" + ip);
          }
            
        }

        for(var i=0;i<this.golbal.myProject.buses.length;i++){
          var bus=this.golbal.myProject.buses[i];
          console.log(bus.mac);
          createSocket(BaseByteDeserializer.receiveData,bus.ws_url);
        }
    }

  },
  mounted: function () {
    //广播搜索设备
    console.log("mounted")
    this.readConfig();

    this.loginTemp();

      MyFunction.root=this;

      var that=this;
      window.document.addEventListener("resume",function(){
        MyFunction.log("resume");
        onResume();
        createRemoteSocket();
        for(var i=0;i<that.golbal.myProject.buses.length;i++){
          var bus=that.golbal.myProject.buses[i];
          console.log(bus.mac);
          createSocket(BaseByteDeserializer.receiveData,bus.ws_url);
        }
      });

    setTimeout(this.init,3000);
  },
  beforeMount(){
    
    console.log("before mount");
    //console.log(this.golbal.myProject);
    

    
  }
}


</script>