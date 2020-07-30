<template>
  <div id="page">
    <FrameHeader v-bind:golbal="golbal"></FrameHeader>
    <router-view v-bind:golbal="golbal"/>
    <FrameFooter v-bind:golbal="golbal"></FrameFooter>
  </div>
</template>

<script>
import "./assets/css/icomoon.css";
import "./assets/css/style.css";
import FrameHeader from './components/FrameHeader';
import FrameFooter from './components/FrameFooter';
import MyFunction from './js/MyFunction'
import { createSocket, sendWSPush ,sendWSData} from './js/WebSocket'
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
        menuCur:'',
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
              rooms:[{
                id:'b0b502b7-c001-4001-a001-0547116af000',
                name:'主卧',
                busId:"7e0378ca-c813-4056-a001-485e2970c001",
                active:true,
                devices:[
                  {id:'b0b502b7-c001-4001-a001-0547116af001',type:"light",areacode:1,addr:1,channel:1,name:"吊灯",summary:"关闭",icon:"icon-ls_1_light",isFavorite:false,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af002',type:"light",areacode:1,addr:1,channel:2,name:"壁灯",summary:"开启",icon:"icon-ls_1_light",isFavorite:false,isOn:true},
                  {id:'b0b502b7-c001-4001-a001-0547116af003',type:"curtain",areacode:1,addr:1,channel:3,name:"窗帘",summary:"50%",icon:"icon-ls_23_curtain",isFavorite:false,value:10},
                  {id:'b0b502b7-c001-4001-a001-0547116af004',type:"dimmer",areacode:1,addr:1,channel:2,name:"床头灯",summary:"40%",icon:"icon-ls_4_dimmer",isFavorite:false,value:40},
                  {id:'b0b502b7-c001-4001-a001-0547116af005',type:"ac",name:"空调",summary:"制冷 26℃",icon:"icon-ls_7_ac",isFavorite:true,isOn:false,value:26,mode:'制冷',fan:3,lock:0},
                ],
              }]
            }]
          }]
        },
        testServer:'ws://192.168.0.119:8001',  //用户调试-参数设置-服务器
        messages:[
          {id:1,title:'系统通知',date:'2020-07-01 07:22:14',content:'停服维护已经结束，停服期间给您带来的不便，我们深表歉意。'},
          {id:2,title:'版本更新公告',date:'2020-06-25 17:43:53',content:'我们预计于北京时间：2020-06-26 02:00 - 04:00进行为期两个小时的停服更新维护。'},
          {id:3,title:'升级提醒',date:'2020-06-01 15:14:32',content:'为了使用户获得更好的体验，我们刚刚完成了一次热更，请重新启动程序以使更新生效。'},
          {id:4,title:'系统通知',date:'2020-05-28 12:53:43',content:'停服维护已经结束，停服期间给您带来的不便，我们深表歉意。'},
        ],
      },
    }
  },

  methods: {
    async getData(){
        
    },
  },

  beforeMount(){
    var storage = window.localStorage;
    var obj = storage.getItem("myProject");
    if(obj!=null){
      this.golbal.myProject = JSON.parse(storage.getItem("myProject"));
    }
    console.log(this.golbal.myProject);

    //选定默认楼栋
    this.golbal.blockCur = this.golbal.myProject.blocks[0];
    for(var i=0;i<this.golbal.myProject.blocks.length;i++){
			var r=this.golbal.myProject.blocks[i];
			if(r.active)this.golbal.blockCur=r;
    }
    
    //选定默认楼层
    this.golbal.floorCur = this.golbal.blockCur.floors[0];
    for(var i=0;i<this.golbal.blockCur.floors.length;i++){
				var r=this.golbal.blockCur.floors[i];
				if(r.active)this.golbal.floorCur=r;
    }
      
    //选定默认房间
    this.golbal.roomCur = this.golbal.floorCur.rooms[0];
    for(var i=0;i<this.golbal.floorCur.rooms.length;i++){
      var r=this.golbal.floorCur.rooms[i];
      if(r.active)this.golbal.roomCur=r;
    }

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
    
    MyFunction.golbal=devicesAll;
    console.log(this.golbal);
    MyFunction.MyProject=this.golbal.myProject;
    //createSocket(BaseByteDeserializer.receiveData);
  }
}


</script>