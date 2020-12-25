<template>
<div class="divDevice" >
    <div class="divFavorite" @click.stop="favoriteClick(device)"><i class="icon-favoritesfilling" v-bind:class="{iconC:device.isFavorite}"></i></div>
    <v-touch tag="div" class="divIcon" v-on:tap="switchClick(device)"><i v-bind:class="[device.icon,{'iconC':device.isOn}]"></i></v-touch>
    <v-touch tag="div" class="divInfo" v-on:tap="switchClick(device)">
        <span class="spanDeviceName">{{device.name}}</span>
        <span class="spanDeviceSummary">{{device.isOn?'开启':'关闭'}}</span>
    </v-touch>
    <v-touch tag="div" class="divControl" v-on:tap="switchClick(device)">
        <div class="btnSwitch"><i class="icon-ls_9_on" v-bind:class="{iconC:device.isOn}"></i></div>
    </v-touch>
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
            MyFunction.saveProject();
        },
		switchClick(device){
            device.isOn=!device.isOn;
            MyFunction.getTypeStatus();
            /*
            if(device.hits<10){
                device.hits=device.hits+1;
                if(device.hits==10)device.isFavorite=true;
            }
            */
            BaseByteSerializer.sendAction(device);
        }
	}
}
</script>