<template>
<div class="divDevice">
    <div class="divFavorite" @click="favoriteClick(device)"><i class="icon-favoritesfilling" v-bind:class="{iconC:device.isFavorite}"></i></div>
    <div class="divIcon"><i v-bind:class="[device.icon,{'iconC':device.isOn}]"></i></div>
    <div class="divInfo">
        <span class="spanDeviceName">{{device.name}}</span>
        <span class="spanDeviceSummary">{{device.value==0?'关闭':(device.value==100?'开启':'停止')}}</span>
    </div>
    <div class="divControl">
        <div :class="'btnCurtain btnCurtain1'+ (device.value==0?' iconC':'')" @click="curtainClick(device,0)"><i class="icon-arrow-right"></i><i class="icon-arrow-left"></i></div>
        <div :class="'btnCurtain btnCurtain2'+ (device.value==101?' iconC':'')" @click="curtainClick(device,101)"><i class="icon-pause2"></i></div>
        <div :class="'btnCurtain btnCurtain3'+ (device.value==100?' iconC':'')" @click="curtainClick(device,100)"><i class="icon-arrow-left"></i><i class="icon-arrow-right"></i></div>
    </div>
</div>
</template>

<script>
import BaseByteSerializer from '../js/BaseByteSerializer'
import MyFunction from '../js/MyFunction'

export default {
	data () {
		return {
        }
	},
	props: ['device'],
	methods: {
		favoriteClick(device){
			device.isFavorite=!device.isFavorite;
            //if(!device.isFavorite)device.hits=0;
        },

		curtainClick(device,value){
            device.value=value;
            MyFunction.getTypeStatus();
            /*
            if(device.hits<10){
                device.hits=device.hits+1;
                if(device.hits==10)device.isFavorite=true;
            }
            */
            BaseByteSerializer.sendAction(this.device);
        }
	}
}
</script>