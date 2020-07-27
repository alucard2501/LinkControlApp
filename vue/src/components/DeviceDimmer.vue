<template>
<div class="divDevice">
    <div class="divFavorite" @click="favoriteClick(device)"><i class="icon-favoritesfilling" v-bind:class="{iconC:device.isFavorite}"></i></div>
    <div class="divIcon"><i v-bind:class="[device.icon,{'iconC':device.value>0}]"></i></div>
	<div class="divInfo">
		<span class="spanDeviceName">{{device.name}}</span>
		<span class="spanDeviceSummary">{{device.value}}%</span>
    </div>
    <div class="divControl">
        <el-slider v-model="device.value" :show-tooltip="false" @change="dimmerChange"></el-slider>
    </div>
</div>
</template>

<script>
import BaseByteSerializer from '../js/BaseByteSerializer'

export default {
	props: ['device'],
	methods: {
		favoriteClick(device){
			device.isFavorite=!device.isFavorite;
		},
		dimmerChange(){
			BaseByteSerializer.sendAction(this.device);
		}
	},
	mounted:function(){
		this.dimmerValue=this.device.value;
	}
}
</script>