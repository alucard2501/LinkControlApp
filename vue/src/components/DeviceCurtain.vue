<template>
<div class="divDevice">
    <div class="divFavorite" @touchend.stop="favoriteClick(device)"><i class="icon-favoritesfilling" v-bind:class="{iconC:device.isFavorite}"></i></div>
    <div class="divIcon" @touchend.stop="curtainClick(device)"><i v-bind:class="[device.icon,{'iconC':device.value==100}]"></i></div>
    <div class="divInfo">
        <span class="spanDeviceName">{{device.name}}</span>
        <span class="spanDeviceSummary">{{device.value==0?'关闭':(device.value==100?'开启':'停止')}}</span>
    </div>
    <div class="divControl">
        <div :class="'btnCurtain btnCurtain1'+ (device.value==0?' iconC':'')" @touchend.stop="curtainClick(device,0)"><i class="icon-arrow-right"></i><i class="icon-arrow-left"></i></div>
        <div :class="'btnCurtain btnCurtain2'+ (device.value==101?' iconC':'')" @touchend.stop="curtainClick(device,101)"><i class="icon-pause2"></i></div>
        <div :class="'btnCurtain btnCurtain3'+ (device.value==100?' iconC':'')" @touchend.stop="curtainClick(device,100)"><i class="icon-arrow-left"></i><i class="icon-arrow-right"></i></div>
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
            MyFunction.saveProject();
            //if(!device.isFavorite)device.hits=0;
        },

		curtainClick(device,value){
            if(value==null){
                if(this.device.value==100){
                    this.device.value=0;
                }else{
                    this.device.value=100;
                }
            }else{
                device.value=value;
            }
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