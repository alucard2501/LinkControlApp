<template>
<div class="footer">
	<ul>
		<li>
			<router-link to="/favorite" v-bind:class="{routerC:(golbal.menuCur=='favorite')}" active-class = "routerC" tag="div">
				<i class="icon-favoritesfilling"></i>
				<span>习惯</span>
			</router-link>
		</li>
		<li>
			<router-link to="/room" active-class = "routerC" tag="div">
				<i class="icon-home3"></i>
				<span>房间</span>
			</router-link>
		</li>
		<li>
			<router-link to="/user" active-class = "routerC" tag="div">
				<i class="icon-accountfilling"></i>
				<span>我</span>
			</router-link>
		</li>
	</ul>
</div>
</template>

<script>
export default {
	props: ['golbal']
}
</script>