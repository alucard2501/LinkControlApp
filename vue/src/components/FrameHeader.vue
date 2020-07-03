<template>
  <div class="header">
    <div class="divHeaderLeft">
      <div class="btnHeader"><i class="icon-mail1"></i></div>
    </div>
    <div class="divHeaderMain">
        <img class="imgHeaderLogo" src="../assets/images/logo.png">
    </div>
    <div class="divHeaderRight">
      <el-popover placement="bottom" width="100" trigger="click" v-model="visibleFloor" popper-class="popoverFloor" v-if="golbal.showButtonFloor">
        <div>
          <span class="spanTitle">请选择楼层</span>
          <ul>
            <li v-for="floor in golbal.blockCur.floors" v-bind:key="floor.id" @click="floorClick(floor)">
              <i class="icon-office"></i><span>{{floor.name}}</span>
              <div class="checked" v-if="floor.active"><i class="icon-yuanxingxuanzhongfill"></i></div>
            </li>
          </ul>
        </div>
        <el-button slot="reference" class="btnHeaderFloor">
          <span>{{golbal.floorCur.name}}</span>
          <i class="icon-caret-down"></i>
        </el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
	data () {
		return {
      visibleFloor: false,
    }
	},
	props: ['golbal'],
	methods: {
		floorClick(floor){
      //清空全部楼层在选属性，当前楼层选定
      for(var i=0;i<this.golbal.blockCur.floors.length;i++){
				var r=this.golbal.blockCur.floors[i];
				r.active=false;
			}
      floor.active=true;
      this.golbal.floorCur=floor;
      this.visibleFloor=false;

      //选定默认房间
      this.golbal.roomCur = this.golbal.floorCur.rooms[0];
      for(var i=0;i<this.golbal.floorCur.rooms.length;i++){
        var r=this.golbal.floorCur.rooms[i];
        if(r.active){
          this.golbal.roomCur=r;
        }
      }
    },
  }
}
</script>