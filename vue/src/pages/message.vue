<template>
  <div class="main">
      <div class="divMessage" :style="'height:' + heightMessage + 'px'">
        <div v-for="messageItem in golbal.messages" :key="messageItem.id" class="divMessageItem">
            <div class="divTitle">
                <i class="icon-mail1"></i><span>{{messageItem.title}}</span>
            </div>
            <div class="divDate">{{messageItem.date}}</div>
            <div class="divContent">{{messageItem.content}}</div>
        </div>
      </div>
      <el-backtop target=".divMessage" style="bottom:80px;right:10px;"></el-backtop>
  </div>
</template>

<script>
export default {
  data () {
	return {
      heightMessage:window.innerHeight-102,
	}
  },
  props: ['golbal'],
  methods: {
    
  },
  mounted(){
    this.golbal.showButtonFloor=false;
  }
}
</script>