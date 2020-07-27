<template>
<div class="divDevice">
    <div class="divFavorite" @click="favoriteClick(device)"><i class="icon-favoritesfilling" v-bind:class="{iconC:device.isFavorite}"></i></div>
    <div class="divIcon"><i v-bind:class="[device.icon,{'iconC':device.isOn}]"></i></div>
    <div class="divInfo">
        <span class="spanDeviceName">{{device.name}}</span>
        <span class="spanDeviceSummary">{{device.value==0?'关闭':(device.value==100?'开启':'停止')}}</span>
    </div>
    <div class="divControl">
        <div class="btnCurtain btnCurtain1" @click="curtainClick(device,0)"><i class="icon-arrow-right"></i><i class="icon-arrow-left"></i></div>
        <div class="btnCurtain btnCurtain2" @click="curtainClick(device,101)"><i class="icon-pause2"></i></div>
        <div class="btnCurtain btnCurtain3" @click="curtainClick(device,100)"><i class="icon-arrow-left"></i><i class="icon-arrow-right"></i></div>
    </div>
</div>
</template>

<script>
import BaseByteSerializer from '../js/BaseByteSerializer'

export default {
	data () {
		return {
        }
	},
	props: ['device'],
	methods: {
		favoriteClick(device){
			device.isFavorite=!device.isFavorite;
        },

		curtainClick(device,value){
            device.value=value;
            BaseByteSerializer.sendAction(this.device);
        }
	}
}
</script>