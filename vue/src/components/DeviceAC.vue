<template>
<div class="divDevice" @click="drawerClick(device)">
    <div class="divFavorite" @click.stop="favoriteClick(device)"><i class="icon-favoritesfilling" v-bind:class="{iconC:device.isFavorite}"></i></div>
    <div class="divIcon"><i v-bind:class="device.icon"></i></div>
    <div class="divInfo">
        <span class="spanDeviceName">{{device.name}}</span>
        <span class="spanDeviceSummary">{{device.summary}}</span>
    </div>
    <div class="divControl">
        <div class="btnAC btnAC1" @click.stop="minusClick(device)"><i class="icon-move1"></i></div>
        <div class="btnAC btnAC2" @click.stop="switchClick(device)"><i class="icon-ls_9_on" v-bind:class="{iconC:device.isOn}"></i></div>
        <div class="btnAC btnAC3" @click.stop="addClick(device)"><i class="icon-add1"></i></div>
    </div>
    <el-drawer :visible.sync="drawer" :direction="direction" :append-to-body="true" custom-class="drawerAC" :size="heightDrawer+'px'">
        <div class="divDrawerACTitle">
            <span class="spanDrawerAC1">温控器</span>
            <span class="spanDrawerAC2">当前温度{{device.value}}℃</span>
        </div>
        <div class="divDrawerAC">
            <div class="divDrawerACScreen">
                <span class="spanDrawerAC3">{{device.mode}}</span>
                <div class="divDrawerACTemperature">
                    <div class="divDrawerACTemperature1" @click.stop="minusClick(device)"><i class="icon-move1"></i></div>
                    <div class="divDrawerACTemperature2">{{device.value}}</div>
                    <div class="divDrawerACTemperature3" @click.stop="addClick(device)"><i class="icon-add1"></i></div>
                </div>
                <span class="spanDrawerAC4">℃</span>
            </div>
            <div class="divDrawerACMode">
                <div class="divDrawerACModeC">
                    <el-popover placement="top" width="50" trigger="click" v-model="visibleFan" popper-class="popoverAC" :disabled="!device.isOn">
                        <div>
                            <span class="spanTitle">请选择风速</span>
                            <ul>
                                <li @click.stop="fanClick(device,'0')"><i class="icon-abc"></i><span>自动</span></li>
                                <li @click.stop="fanClick(device,'1')"><i class="icon-propeller"></i><span>低速</span></li>
                                <li @click.stop="fanClick(device,'2')"><i class="icon-screw"></i><span>中速</span></li>
                                <li @click.stop="fanClick(device,'3')"><i class="icon-screw2"></i><span>高速</span></li>
                            </ul>
                        </div>
                        <el-button slot="reference" class="btnDeviceAcFan">
                            <i :class="(device.fan==0)?'icon-abc':((device.fan==1)?'icon-propeller':((device.fan==2)?'icon-screw':'icon-screw2'))"></i>
                        </el-button>
                    </el-popover>
                </div>
                <div @click.stop="modeClick(device,'制热')"><i class="icon-sun" v-bind:class="{iconC:device.mode=='制热'}"></i></div>
                <div @click.stop="modeClick(device,'制冷')"><i class="icon-kongdiao" v-bind:class="{iconC:device.mode=='制冷'}"></i></div>
                <div @click.stop="modeClick(device,'送风')"><i class="icon-fan" v-bind:class="{iconC:device.mode=='送风'}"></i></div>
                <div class="divDrawerACModeC">
                    <el-popover placement="top" width="50" trigger="click" v-model="visibleLock" popper-class="popoverAC" :disabled="!device.isOn">
                        <div>
                            <span class="spanTitle">请选择</span>
                            <ul>
                                <li @click.stop="lockClick(device,'0')"><i class="icon-unlock"></i><span>解锁</span></li>
                                <li @click.stop="lockClick(device,'1')"><i class="icon-lock1"></i><span>锁定按键</span></li>
                                <li @click.stop="lockClick(device,'2')"><i class="icon-data"></i><span>锁定数据</span></li>
                            </ul>
                        </div>
                        <el-button slot="reference" class="btnDeviceAcFan">
                            <i :class="(device.lock==0)?'icon-unlock':((device.lock==1)?'icon-lock1':'icon-data')"></i>
                        </el-button>
                    </el-popover>
                </div>
            </div>
            <div class="btnDrawerACSwitch" @click.stop="switchClick(device)"><i class="icon-ls_9_on" v-bind:class="{iconC:device.isOn}"></i></div>
        </div>
    </el-drawer>
</div>
</template>

<script>
import BaseByteSerializer from '../js/BaseByteSerializer'

export default {
	data () {
		return {
            drawer: false,
            direction: 'btt',
            heightDrawer:window.innerHeight-95,
            visibleFan: false,
            visibleLock: false,
        }
	},
	props: ['device'],
	methods: {
		favoriteClick(device){
			device.isFavorite=!device.isFavorite;
        },
		switchClick(device){
			device.isOn=!device.isOn;
            BaseByteSerializer.sendAction(this.device);
        },
		addClick(device){
            if(device.value<36 && device.isOn){
			    device.value=device.value+1;
                device.summary=device.mode + ' ' + device.value + '℃';
                BaseByteSerializer.sendAction(this.device);
            }
        },
		minusClick(device){
			if(device.value>17 && device.isOn){
			    device.value=device.value-1;
                device.summary=device.mode + ' ' + device.value + '℃';
                BaseByteSerializer.sendAction(this.device);
            }
        },
        drawerClick(device){
            this.drawer=true;
        },
		modeClick(device,mode){
            if(device.isOn){
                device.mode=mode;
                device.summary=device.mode + ' ' + device.value + '℃';
                BaseByteSerializer.sendAction(this.device);
            }
        },
		fanClick(device,fan){
            device.fan=fan;
            this.visibleFan=false;
            BaseByteSerializer.sendAction(this.device);
        },
		lockClick(device,lock){
            device.lock=lock;
            this.visibleLock=false;
            BaseByteSerializer.sendAction(this.device);
        }
	}
}
</script>