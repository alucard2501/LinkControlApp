<template>
  <div class="main">
    <v-touch @swipeleft="onSwipe(1)" @swiperight="onSwipe(2)" tag="div" style="touch-action: pan-y!important;">
    <div class="divRoomTop">
      <ul :style="'width:' + ul_width + 'px'" ref="ul_room">
        <template v-for="room in golbal.floorCur.rooms">
          <li v-if="hasFavorite(room)"  v-bind:key="room.id" :class="room.active?'liRoomTopC':(room.isOn?'liRoomTopBlue':'')" @click="roomClick(room)">{{room.name}}</li>
        </template>
        
      </ul>
    </div>
    <div class="divRoomTop2">
      <ul>
        <li v-bind:class="{liRoomTopC:golbal.typeCur=='all'}" @click="typeClick('all')"><i class="icon-all"></i></li>
        <li v-if="hasType('light')" :class="golbal.typeCur=='light'?'liRoomTopC':(golbal.type[1].isOn?'liRoomTopBlue':'')" @click="typeClick('light')"><i class="icon-ls_1_light"></i></li>
        <li v-if="hasType('curtain')" :class="golbal.typeCur=='curtain'?'liRoomTopC':(golbal.type[2].isOn?'liRoomTopBlue':'')" @click="typeClick('curtain')"><i class="icon-ls_23_curtain"></i></li>
        <li v-if="hasType('ac')" :class="golbal.typeCur=='ac'?'liRoomTopC':(golbal.type[3].isOn?'liRoomTopBlue':'')" @click="typeClick('ac')"><i class="icon-air-conditioner"></i></li>
        <li v-if="hasType('scene')" :class="golbal.typeCur=='scene'?'liRoomTopC':(golbal.type[4].isOn?'liRoomTopBlue':'')" @click="typeClick('scene')"><i class="icon-ls_26_go_off_work"></i></li>
      </ul>
    </div>
    <div class="divRoom" :style="'height:'+heightRoom+'px'">
      <div class="divView">
        <div :class="'btnList'+ (!golbal.isGallery?' btnViewC':'')" @click="golbal.isGallery=false"><i class="icon-viewlist"></i></div>
        <div :class="'btnGallery'+ (golbal.isGallery?' btnViewC':'')" @click="golbal.isGallery=true"><i class="icon-viewgallery"></i></div>
      </div>
      <div :class="'divRoomContent'+ (golbal.isGallery?' divRoomGallery':' divRoomList')" :style="'height:'+(heightRoom-14)+'px'">
        <template v-for="device in golbal.roomCur.devices">
          <DeviceLight v-if="(device.type=='light' && (device.type == golbal.typeCur || golbal.typeCur=='all'))&&device.isFavorite" v-bind:key="device.id" v-bind:device="device" ></DeviceLight>
          <DeviceCurtain v-if="(device.type=='curtain' && (device.type == golbal.typeCur || golbal.typeCur=='all'))&&device.isFavorite" v-bind:key="device.id" v-bind:device="device" ></DeviceCurtain>
          <DeviceDimmer v-if="(device.type=='dimmer' && (device.type == golbal.typeCur || golbal.typeCur=='all' || golbal.typeCur=='light'))&&device.isFavorite" v-bind:key="device.id" v-bind:device="device" v-bind:touchAction="touchAction" ></DeviceDimmer>
          <DeviceAC v-if="(device.type=='ac' && (device.type == golbal.typeCur || golbal.typeCur=='all'))&&device.isFavorite" v-bind:key="device.id" v-bind:device="device"></DeviceAC>
          <DeviceScene v-if="device.type=='scene' && (device.type == golbal.typeCur || golbal.typeCur=='all')&&device.isFavorite" v-bind:key="device.id" v-bind:device="device" ></DeviceScene>
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

import MyFunction from '../js/MyFunction'
import DeviceLight from '../components/DeviceLight';
import DeviceCurtain from '../components/DeviceCurtain';
import DeviceDimmer from '../components/DeviceDimmer';
import DeviceAC from '../components/DeviceAC';
import DeviceScene from '../components/DeviceScene';
import DeviceHeating from '../components/DeviceHeating';
import DeviceFan from '../components/DeviceFan';

export default {
  components: {
    DeviceLight,
    DeviceCurtain,
    DeviceDimmer,
    DeviceAC,
    DeviceScene,
    DeviceHeating,
    DeviceFan,
  },

	data () {
		return {
      heightRoom:window.innerHeight-195,
      touchAction:{isDown:false},
      ul_width:200,
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

      MyFunction.sendQueryDeviceStatus();
      MyFunction.getTypeStatus();
    },

		typeClick(type){
      this.golbal.typeCur=type;
    },
    hasType(type){
      if(type=='all')return true;
      if(this.golbal.roomCur==null)return false;
      if(this.golbal.roomCur.devices==null)return false;
      for(var i=0;i<this.golbal.roomCur.devices.length;i++){
        var device=this.golbal.roomCur.devices[i];
        if(device.type == type && device.isFavorite){
          return true;
        }
      }
      return false;
    },
    hasFavorite(room){
      if(room==null)return false;
      for(var i=0;i<room.devices.length;i++){
        var device=room.devices[i];
        if(device.isFavorite){
          return true;
        }
      }
      return false;
    },
    /** dict=1 左滑动 
     *  dict=2 右滑动 */
    onSwipe:function(dict){
      var that=this;
      
      setTimeout(function(){
        console.log("on Swipe" + that.touchAction.isDown);
        if(!that.touchAction.isDown){
          if(dict==1){
            that.onSwipeLeft();
          }else if(dict==2){
            that.onSwipeRight();
          }
        }
        that.touchAction.isDown=false;
      },200);
      
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
      while(!this.hasFavorite(this.golbal.floorCur.rooms[j]) && (j<this.golbal.floorCur.rooms.length)){
        j+=1;
      }
      if(this.hasFavorite(this.golbal.floorCur.rooms[j])){
        this.roomClick(this.golbal.floorCur.rooms[j]);
      }
      
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
      while(!this.hasFavorite(this.golbal.floorCur.rooms[j]) && (j>0)){
        j-=1;
      }
      if(this.hasFavorite(this.golbal.floorCur.rooms[j])){
        this.roomClick(this.golbal.floorCur.rooms[j]);
      }
    },
	},
  mounted(){
    this.golbal.showButtonFloor=true;
    this.golbal.menuCur='favorite';

    MyFunction.sendQueryDeviceStatus();

    var ul=this.$refs.ul_room;
    var w=0;
    for(var i=0;i<ul.children.length;i++){
      w+=ul.children[i].clientWidth+2;
    }
    this.ul_width=w;


    for(var i=0;i<this.golbal.floorCur.rooms.length;i++){
			var r=this.golbal.floorCur.rooms[i];
			r.active=false;
    }
    for(var i=0;i<this.golbal.floorCur.rooms.length;i++){
      var r=this.golbal.floorCur.rooms[i];
      if(this.hasFavorite(r)){
        r.active=true;
        this.golbal.roomCur=r;
        MyFunction.sendQueryDeviceStatus();
        MyFunction.getTypeStatus();
        return;
      }
		}
      
  }
}
</script>
