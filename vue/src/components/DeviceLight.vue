<template>
<div class="divDevice" @click="switchClick(device)">
    <div class="divFavorite" @click.stop="favoriteClick(device)"><i class="icon-favoritesfilling" v-bind:class="{iconC:device.isFavorite}"></i></div>
    <div class="divIcon"><i v-bind:class="[device.icon,{'iconC':device.isOn}]"></i></div>
    <div class="divInfo">
        <span class="spanDeviceName">{{device.name}}</span>
        <span class="spanDeviceSummary">{{device.summary}}</span>
    </div>
    <div class="divControl">
        <div class="btnSwitch"><i class="icon-ls_9_on" v-bind:class="{iconC:device.isOn}"></i></div>
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
		switchClick(device){
            device.isOn=!device.isOn;
            BaseByteSerializer.sendAction(device);
        }
	}
}
</script>