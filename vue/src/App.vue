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
                  {id:'b0b502b7-c001-4001-a001-0547116af001',type:"light",areacode:1,addr:1,channel:1,name:"吊灯",summary:"关闭",icon:"icon-lights",isFavorite:false,isOn:false},
                  {id:'b0b502b7-c001-4001-a001-0547116af002',type:"light",areacode:1,addr:1,channel:2,name:"壁灯",summary:"开启",icon:"icon-lights",isFavorite:false,isOn:true},
                  {id:'b0b502b7-c001-4001-a001-0547116af003',type:"curtain",areacode:1,addr:1,channel:3,name:"窗帘",summary:"50%",icon:"icon-chuanglian-",isFavorite:false,value:10},
                  {id:'b0b502b7-c001-4001-a001-0547116af004',type:"dimmer",areacode:1,addr:1,channel:2,name:"床头灯",summary:"40%",icon:"icon-deng",isFavorite:false,value:40},
                  {id:'b0b502b7-c001-4001-a001-0547116af005',type:"ac",name:"空调",summary:"制冷 26℃",icon:"icon-air-conditioner",isFavorite:true,isOn:false,value:26,mode:'制冷',fan:3,lock:0},
                ],
              }]
            }]
          }]
        },
        testServer:'ws://192.168.0.119:8001'  //用户调试-参数设置-服务器
      },
    }
  },

  methods: {
      async getData(){
        
      }
  },

  beforeMount(){
    var storage = window.localStorage;
    var obj = storage.getItem("myProject");
    if(obj!=null){
      this.golbal.myProject = JSON.parse(storage.getItem("myProject"));
    }

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
    createSocket(BaseByteDeserializer.receiveData);
  }
}


</script>