<template>
  <div class="main">
    <v-touch @swipeleft="onSwipeLeft" @swiperight="onSwipeRight" tag="div" style="touch-action: pan-y!important;">
    <div class="divRoomTop">
      <ul>
        <li v-for="room in golbal.floorCur.rooms" v-bind:key="room.id" v-bind:class="{liRoomTopC:room.active}" @click="roomClick(room)">{{room.name}}</li>
      </ul>
    </div>
    <div class="divRoomTop2">
      <ul>
        <li v-bind:class="{liRoomTopC:golbal.typeCur=='all'}" @click="typeClick('all')"><i class="icon-all"></i></li>
        <li v-bind:class="{liRoomTopC:golbal.typeCur=='light'}" @click="typeClick('light')"><i class="icon-ls_1_light"></i></li>
        <li v-bind:class="{liRoomTopC:golbal.typeCur=='dimmer'}" @click="typeClick('dimmer')"><i class="icon-ls_4_dimmer"></i></li>
        <li v-bind:class="{liRoomTopC:golbal.typeCur=='curtain'}" @click="typeClick('curtain')"><i class="icon-ls_23_curtain"></i></li>
        <li v-bind:class="{liRoomTopC:golbal.typeCur=='ac'}" @click="typeClick('ac')"><i class="icon-ls_7_ac"></i></li>
      </ul>
    </div>
    <div class="divRoom" :style="'height:'+heightRoom+'px'">
      <div class="divView">
        <div :class="'btnList'+ (!isGallery?' btnViewC':'')" @click="isGallery=false"><i class="icon-viewlist"></i></div>
        <div :class="'btnGallery'+ (isGallery?' btnViewC':'')" @click="isGallery=true"><i class="icon-viewgallery"></i></div>
      </div>
      <div :class="'divRoomContent'+ (isGallery?' divRoomGallery':' divRoomList')">
        <template v-for="device in golbal.roomCur.devices">
          <DeviceLight v-if="device.type=='light' && (device.type == golbal.typeCur || golbal.typeCur=='all')" v-bind:key="device.id" v-bind:device="device" ></DeviceLight>
          <DeviceCurtain v-if="device.type=='curtain' && (device.type == golbal.typeCur || golbal.typeCur=='all')" v-bind:key="device.id" v-bind:device="device" ></DeviceCurtain>
          <DeviceDimmer v-if="device.type=='dimmer' && (device.type == golbal.typeCur || golbal.typeCur=='all')" v-bind:key="device.id" v-bind:device="device" ></DeviceDimmer>
          <DeviceAC v-if="device.type=='ac' && (device.type == golbal.typeCur || golbal.typeCur=='all')" v-bind:key="device.id" v-bind:device="device"></DeviceAC>
        </template>
      </div>
    </div>
    </v-touch>
  </div>
</template>

<script>
import Vue from 'vue'
import VueTouch from 'vue-touch'
Vue.use(VueTouch, {name: 'v-touch'})

import DeviceLight from '../components/DeviceLight';
import DeviceCurtain from '../components/DeviceCurtain';
import DeviceDimmer from '../components/DeviceDimmer';
import DeviceAC from '../components/DeviceAC';

export default {
  components: {
    DeviceLight,
    DeviceCurtain,
    DeviceDimmer,
    DeviceAC
  },

	data () {
		return {
      heightRoom:window.innerHeight-195,
      isGallery:true,
    }
	},
  props: ['golbal'],
	methods: {
		roomClick(room){
			for(var i=0;i<this.golbal.floorCur.rooms.length;i++){
				var r=this.golbal.floorCur.rooms[i];
				r.active=false;
			}
      room.active=true;
      this.golbal.roomCur=room;
    },

		typeClick(type){
      this.golbal.typeCur=type;
    },
    
    /** 左滑动 */
    onSwipeLeft: function () {  
      var j=0;
      for(var i=0;i<this.golbal.floorCur.rooms.length;i++){
        var r=this.golbal.floorCur.rooms[i];
        if(r==this.golbal.roomCur){
          j=i;
          break;
        }
      }
      if(j<this.golbal.floorCur.rooms.length-1)j=j+1;
      this.roomClick(this.golbal.floorCur.rooms[j]);
    },
 
    /** 右滑动 */
    onSwipeRight: function () {
      var j=0;
      for(var i=0;i<this.golbal.floorCur.rooms.length;i++){
        var r=this.golbal.floorCur.rooms[i];
        if(r==this.golbal.roomCur){
          j=i;
          break;
        }
      }
      if(j>0)j=j-1;
      this.roomClick(this.golbal.floorCur.rooms[j]);
    },
	},
  mounted(){
    this.golbal.showButtonFloor=true;
    this.golbal.menuCur='room';
  }
}
</script>
