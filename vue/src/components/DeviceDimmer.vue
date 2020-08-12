<template>
<div class="divDevice">
    <div class="divFavorite" @click="favoriteClick(device)"><i class="icon-favoritesfilling" v-bind:class="{iconC:device.isFavorite}"></i></div>
    <div class="divIcon"><i v-bind:class="[device.icon,{'iconC':device.value>0}]"></i></div>
	<div class="divInfo">
		<span class="spanDeviceName">{{device.name}}</span>
		<span class="spanDeviceSummary">{{device.value}}%</span>
    </div>
    <div class="divControl">
        <div class="divDimmer1"><el-slider v-model="device.value" :show-tooltip="false" @change="dimmerChange"></el-slider></div>
    </div>
</div>
</template>

<script>
import BaseByteSerializer from '../js/BaseByteSerializer'
import MyFunction from '../js/MyFunction'

export default {
	props: ['device'],
	methods: {
		favoriteClick(device){
			device.isFavorite=!device.isFavorite;
            //if(!device.isFavorite)device.hits=0;
		},
		dimmerChange(){
			/*
			if(this.device.hits<10){
                this.device.hits=this.device.hits+1;
                if(this.device.hits==10)this.device.isFavorite=true;
			}
			*/
            MyFunction.getTypeStatus();
			BaseByteSerializer.sendAction(this.device);
		}
	},
	mounted:function(){
		this.dimmerValue=this.device.value;
	}
}
</script>