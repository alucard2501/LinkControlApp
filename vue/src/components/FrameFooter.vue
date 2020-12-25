<template>
<div class="footer">
	<ul>
		<li>
			<!-- <a [routerlink]="/favorite" [class.disabled]="disabled ? true : null">
				<i class="icon-favoritesfilling"></i>
				<span>习惯</span>
			</a> -->
			<router-link to="/favorite" v-bind:class="{routerC:(golbal.menuCur=='favorite')}" active-class = "routerC" tag="div" :event="hasFavorite() ? 'click' : ''">
				<i class="icon-favoritesfilling" :style="hasFavorite()?('color:' + ((golbal.menuCur=='favorite')?'#f08519':'#ffffff')):'color:#505050'"></i>
				<span :style="hasFavorite()?('color:' + ((golbal.menuCur=='favorite')?'#f08519':'#ffffff')):'color:#505050'">习惯</span>
			</router-link>
		</li>
		<li>
			<router-link to="/room" active-class = "routerC" tag="div">
				<i class="icon-home3"></i>
				<span>区域</span>
			</router-link>
		</li>
		<li>
			<router-link to="/user" active-class = "routerC" tag="div">
				<i class="icon-accountfilling"></i>
				<span>我的</span>
			</router-link>
		</li>
	</ul>
</div>
</template>

<script>
export default {
	data () {
		return {
			clickable:this.hasFavorite() 
		}
	},
	props: ['golbal'],
	methods:{
		click:function(){
			alert("hello");
		},
		hasFavorite:function(){
			//for(var i=0;i<this.golbal.roomCur.devices.length;i++){
			console.log("hasfavorite");
			if(this.golbal!=null && this.golbal.floorCur!=null && this.golbal.floorCur.rooms!=null){
				for(var j=0;j<this.golbal.floorCur.rooms.length;j++){
					var rooms=this.golbal.floorCur.rooms[j];
					for(var i=0;i<rooms.devices.length;i++){
						if(rooms.devices[i].isFavorite){
							return true;
						}
					}
				}
				
			}
			return false;
		}
	},
	// mounted(){
	// 	this.clickable=this.hasFavorite();
	// }
}
</script>