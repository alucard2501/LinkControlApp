<template>
  <div class="main">
    <div class="divUserTop">
      <div class="divUserFace"><img src="static/images/face_man.jpg"></div>
      <div class="divUserInfo">
        <span class="spanUserInfo1">LinkScene</span>
        <span class="spanUserInfo2">用户</span>
      </div>
    </div>
    <div class="divUserContent">
      <span class="title">管理设置</span>
      <div class="content">
        <ul>
          <li @click="scanQRCode()"><i class="icon-scanning"></i><span>扫一扫获取配置</span><div class="divIcon"><i class="icon-arrow1_right"></i></div></li>
          <li @click="drawerBlockClick()"><i class="icon-office"></i><span>楼栋管理</span><div class="divIcon"><i class="icon-arrow1_right"></i></div></li>
          <li @click="drawerThemeClick()"><i class="icon-pic"></i><span>主题样式</span><div class="divIcon"><i class="icon-arrow1_right"></i></div></li>
          <li @click="drawerTestClick()"><i class="icon-wrench"></i><span>调试</span><div class="divIcon"><i class="icon-arrow1_right"></i></div></li>
        </ul>
      </div>
    </div>
    <el-drawer title="请选择楼栋" :visible.sync="drawerBlock" direction="btt" :append-to-body="true" custom-class="drawerBlock" :size="heightDrawerBlock+'px'">
      <ul>
        <li v-for="block in golbal.myProject.blocks" v-bind:key="block.id" @click="blockClick(block)">
          <i class="icon-office"></i><span>{{block.name}}</span>
          <div class="checked" v-if="block.active"><i class="icon-yuanxingxuanzhongfill"></i></div>
        </li>
      </ul>
    </el-drawer>
    <el-drawer title="请选择主题样式" :visible.sync="drawerTheme" direction="rtl" :append-to-body="true" custom-class="drawerTheme" :size="widthDrawerTheme+'px'">
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
    </el-drawer>
    <el-drawer title="用户调试" :visible.sync="drawerTest" direction="rtl" :append-to-body="true" custom-class="drawerTest" :size="widthDrawerTest+'px'">
      <el-tabs v-model="tabsTest" type="card" class="divTabs">
        <el-tab-pane label="参数设置" name="tab1">
          <el-form ref="form" :model="formTest" label-width="80px" class="formTest">
            <el-form-item label="服 务 器">
              <el-input v-model="formTest.server"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="submitTest">绑定</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="调试日志" name="tab2">
          <!-- <div class="divSend">
            <input type="text" />
            <div>发送</div>
          </div> -->
          <el-button @click="clearLog">清空</el-button>
          <div class="divSendMessage" :style="'height:'+heightSendMessage+'px;overflow-y:auto'">
            <ul class="ulLog">
                <li v-for="log in logs" v-bind:key="log">{{log}}</li>
            </ul>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script>
import axios from 'axios';
//import { config } from 'vue/types/umd';
import MyFunction from '../js/MyFunction'
import { createSocket, sendWSPush ,sendWSData} from '../js/WebSocket'
import BaseByteDeserializer from '../js/BaseByteDeserializer'
export default {
	data () {
		return {
      drawerBlock: false,
      heightDrawerBlock:window.innerHeight-159,
      drawerTheme: false,
      drawerTest: false,
      widthDrawerTest:window.innerWidth,
      widthDrawerTheme:window.innerWidth,
      tabsTest: 'tab1',
      formTest: {
        server: '',
      },
      heightSendMessage:window.innerHeight-180,
      //log:"",
    }
	},
  props: ['golbal','logs'],
  methods: {
    //打开楼栋界面
    drawerBlockClick(){
      this.drawerBlock=true;
    },

    //打开主题样式
    drawerThemeClick(){
      this.drawerTheme=true;
    },

    //点击主题样式
    themeClick(tips){
      //更换主题
      if(this.golbal.themeCur!=tips){
        document.getElementById("style").attributes[2].value="static/css/style" + tips + ".css";
      }

      this.golbal.themeCur=tips;
    },

    //打开调试界面
    drawerTestClick(){
      this.drawerTest=true;
    },

    //点击楼栋
    blockClick(block){
      //清空全部楼栋在选属性，当前楼栋选定
      for(var i=0;i<this.golbal.myProject.blocks.length;i++){
				var r=this.golbal.myProject.blocks[i];
				r.active=false;
			}
      block.active=true;
      this.golbal.blockCur=block;

      //选定默认楼层
      this.golbal.floorCur = this.golbal.blockCur.floors[0];
      for(var i=0;i<this.golbal.blockCur.floors.length;i++){
				var r=this.golbal.blockCur.floors[i];
				if(r.active){
          this.golbal.floorCur=r;
        }
			}

      //选定默认房间
      this.golbal.roomCur = this.golbal.floorCur.rooms[0];
      for(var i=0;i<this.golbal.floorCur.rooms.length;i++){
        var r=this.golbal.floorCur.rooms[i];
        if(r.active){
          this.golbal.roomCur=r;
          MyFunction.getTypeStatus();
        }
      }

      this.drawerBlock=false;
    },

    //获取配置
		getData(url){
      var that=this;
			axios.post(url).then(function(response){
            try{
              console.log(response.data.project);
              var storage = window.localStorage;
              storage.setItem("myProject", JSON.stringify(response.data.project));

              //初始化数据
              that.golbal.myProject = response.data.project;
              // that.golbal.blockCur = that.golbal.myProject.blocks[0];

              // that.golbal.floorCur = that.golbal.blockCur[0];
              // for(var i=0;i<that.golbal.blockCur.floors.length;i++){
              //   var r=that.golbal.blockCur.floors[i];
              //   if(r.active){
              //     that.golbal.floorCur=r;
              //   }
              // }
              //选定默认楼栋
              for(var i=0;i<that.golbal.myProject.blocks.length;i++){
                var block=that.golbal.myProject.blocks[i];
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
              that.golbal.blockCur = that.golbal.myProject.blocks[0];
              that.golbal.blockCur.active=true;
              
              
              //选定默认楼层
              
              that.golbal.floorCur = that.golbal.blockCur.floors[0];
              that.golbal.floorCur.active=true;
              
                
              //选定默认房间
              
              that.golbal.roomCur = that.golbal.floorCur.rooms[0];
              that.golbal.roomCur.active=true;

              //初始化全部设备数组
              var devicesAll=[];
              for(var i=0;i<that.golbal.myProject.blocks.length;i++){
                for(var j=0;j<that.golbal.myProject.blocks[i].floors.length;j++){
                  for(var k=0;k<that.golbal.myProject.blocks[i].floors[j].rooms.length;k++){
                    for(var z=0;z<that.golbal.myProject.blocks[i].floors[j].rooms[k].devices.length;z++){
                      devicesAll.push({device:that.golbal.myProject.blocks[i].floors[j].rooms[k].devices[z],busId:that.golbal.myProject.blocks[i].floors[j].rooms[k].busId});
                    }
                  }
                }
              };
              
              MyFunction.devicesAll=devicesAll;
              //console.log(this.golbal);
              MyFunction.MyProject=that.golbal.myProject;
              //createSocket(BaseByteDeserializer.receiveData);
              MyFunction.golbal=that.golbal;
              
              //更换默认房间，加载设置开启情况
              MyFunction.getTypeStatus();
              for(var i=0;i<that.golbal.myProject.buses.length;i++){
                var bus=that.golbal.myProject.buses[i];
                createSocket(BaseByteDeserializer.receiveData,bus.ws_url);
              }

              //that.onLog(JSON.stringify(response.data.procdject));
              alert("获取成功")
            }catch(e){
              that.onLog(e);
              alert("获取失败")
            }
            
          }).catch(function (error) { // 请求失败处理
              console.log(error);
              that.onLog(error);
              alert("获取失败")
          });
    },
    scanQRCode(){
      // var b=true;
      // this.getData('https://app.haodawu.cn/api?action=GET_PROJECT_APP&project_id=3929490');
      // console.log("start qrcode");
      // return ;
      var that=this;
      cordova.plugins.barcodeScanner.scan(
        function (result) {
          // alert("We got a barcode\n" +
          //   "Result: " + result.text + "\n" +
          //   "Format: " + result.format + "\n" +
          //   "Cancelled: " + result.cancelled)
          var url=result.text.replace("linkcontrol","http");
          //var response = await axios.post('http://home.ivor-electric.com:3002/api?action=GET_PROJECT_DATA&project_id=3929486');
          
          //globalVariable.log("url:" + url);
          console.log(url);
          that.getData(url);
        },
        function (error) {
          alert(error)
        }
      );
    },
    //提交绑定
    submitTest() {
      this.golbal.testServer=this.formTest.server;
    },
    clearLog(){
      //MyFunction.log("测试")
      this.logs=[];
    },
    // onLog(text){
    //   this.log=text+ "\n" + this.log;
    // }
	},
  mounted(){
    this.golbal.showButtonFloor=false;
    this.golbal.menuCur='user';
    this.formTest.server=this.golbal.testServer;
  }
}
</script>