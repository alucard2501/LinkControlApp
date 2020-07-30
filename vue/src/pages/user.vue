<template>
  <div class="main">
    <div class="divUserTop">
      <div class="divUserFace"><img src="../assets/images/face_man.jpg"></div>
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
          <li @click="drawerTestClick()"><i class="icon-wrench"></i><span>调试</span><div class="divIcon"><i class="icon-arrow1_right"></i></div></li>
        </ul>
      </div>
    </div>
    <el-drawer title="请选择楼栋" :visible.sync="drawerBlock" :direction="directionBlock" :append-to-body="true" custom-class="drawerBlock" :size="heightDrawerBlock+'px'">
      <ul>
        <li v-for="block in golbal.myProject.blocks" v-bind:key="block.id" @click="blockClick(block)">
          <i class="icon-office"></i><span>{{block.name}}</span>
          <div class="checked" v-if="block.active"><i class="icon-yuanxingxuanzhongfill"></i></div>
        </li>
      </ul>
    </el-drawer>
    <el-drawer title="用户调试" :visible.sync="drawerTest" :direction="directionTest" :append-to-body="true" custom-class="drawerTest" :size="widthDrawerTest+'px'">
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
          <div class="divSend">
            <input type="text" />
            <div>发送</div>
          </div>
          <div class="divSendMessage" :style="'height:'+heightSendMessage+'px'"></div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script>
import axios from 'axios'

export default {
	data () {
		return {
      drawerBlock: false,
      directionBlock: 'btt',
      heightDrawerBlock:window.innerHeight-159,
      drawerTest: false,
      directionTest: 'rtl',
      widthDrawerTest:window.innerWidth,
      tabsTest: 'tab1',
      formTest: {
        server: '',
      },
      heightSendMessage:window.innerHeight-180,
    }
	},
  props: ['golbal'],
  methods: {
    //打开楼栋界面
    drawerBlockClick(){
      this.drawerBlock=true;
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
        }
      }

      this.drawerBlock=false;
    },

    //获取配置
		async getData(){
			var response = await axios.post('http://home.ivor-electric.com:3002/api?action=GET_PROJECT_APP&project_id=3929486');
      var storage = window.localStorage;
      storage.setItem("myProject", JSON.stringify(response.data.project));

      //初始化数据
      this.golbal.myProject = response.data.project;
      this.golbal.blockCur = this.golbal.myProject.blocks[0];

      this.golbal.floorCur = this.golbal.blockCur[0];
      for(var i=0;i<this.golbal.blockCur.floors.length;i++){
        var r=this.golbal.blockCur.floors[i];
        if(r.active){
          this.golbal.floorCur=r;
        }
      }
    },

    async scanQRCode(){
      var b=true;
      await this.getData();
      console.log("start qrcode");
      return ;
      // if(cordova==null)b=false;
      // else if(cordova.plugins==null)b=false;
      // else if(cordova.plugins.barcodeScanner==null)b=false;
      // if(!b){
      //   await this.getData();
      // }
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
          axios.post(url).then(function(response){
            console.log(response.data.project);
            var storage = window.localStorage;
            storage.setItem("myProject", JSON.stringify(response.data.project));

            //初始化数据
            that.golbal.myProject = response.data.project;
            that.golbal.blockCur = that.golbal.myProject.blocks[0];

            that.golbal.floorCur = that.golbal.blockCur[0];
            for(var i=0;i<that.golbal.blockCur.floors.length;i++){
              var r=that.golbal.blockCur.floors[i];
              if(r.active){
                that.golbal.floorCur=r;
              }
            }
          }).catch(function (error) { // 请求失败处理
              console.log(error);
          });
        },
        function (error) {
          alert(error)
        }
      );
    },
    //提交绑定
    submitTest() {
      this.golbal.testServer=this.formTest.server;
    }
	},
  mounted(){
    this.golbal.showButtonFloor=false;
    this.golbal.menuCur='user';
    this.formTest.server=this.golbal.testServer;
  }
}
</script>