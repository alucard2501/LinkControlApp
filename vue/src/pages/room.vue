<template>
  <div class="main">
    <div class="divRoomTop">
      <ul>
        <li v-for="room in golbal.floorCur.rooms" v-bind:key="room.id" v-bind:class="{liRoomTopC:room.active}" @click="roomClick(room)">{{room.name}}</li>
      </ul>
    </div>
    <div class="divRoom" :style="'height:'+heightRoom+'px'">
      <template v-for="device in golbal.roomCur.devices">
        <DeviceLight v-if="device.type=='light'" v-bind:key="device.id" v-bind:device="device" ></DeviceLight>
        <DeviceCurtain v-if="device.type=='curtain'" v-bind:key="device.id" v-bind:device="device" ></DeviceCurtain>
        <DeviceDimmer v-if="device.type=='dimmer'" v-bind:key="device.id" v-bind:device="device" ></DeviceDimmer>
        <DeviceAC v-if="device.type=='ac'" v-bind:key="device.id" v-bind:device="device"></DeviceAC>
      </template>
    </div>
  </div>
</template>

<script>
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
      heightRoom:window.innerHeight-184,
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
	},
  mounted(){
    this.golbal.showButtonFloor=true;
    this.golbal.menuCur='room';
  }
}
</script>
