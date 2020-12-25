<template>
  <div class="main">
      <div class="divMessage" :style="'height:' + heightMessage + 'px'">
        <div v-for="messageItem in golbal.messages" :key="messageItem.id" class="divMessageItem" @click="messageClick(messageItem)">
          <v-touch v-on:pressup="messagePress(messageItem)" style="touch-action: pan-y!important;">
            <div class="divTitle">
                <i class="icon-mail1"></i><span>{{messageItem.title}}</span>
            </div>
            <div class="divDate">{{messageItem.date}}</div>
            <div class="divContent">{{messageItem.content}}</div>
            <div class="btnDelete" v-if="messageItem.showDelete" @click="deleteClick(messageItem)"><i class="icon-delete1"></i></div>
          </v-touch>
        </div>
      </div>
      <el-backtop target=".divMessage" style="bottom:80px;right:10px;"></el-backtop>
  </div>
</template>

<script>
import Vue from 'vue'
import VueTouch from 'vue-touch'
Vue.use(VueTouch, {name: 'v-touch'})

export default {
  data () {
	return {
      heightMessage:window.innerHeight-102,
	}
  },
  props: ['golbal'],
  methods: {
    /** 长按消息 */
    messagePress(messageItem){
      for(var i=0; i<this.golbal.messages.length; i++){
        this.golbal.messages[i].showDelete=false;
      }
      messageItem.showDelete=true;
    },

    /** 点击消息 */
    messageClick(messageItem){
      if(messageItem.showDelete){
        messageItem.showDelete=false;
      }
    },

    /** 删除消息 */
    deleteClick(messageItem){
      var c_arr=[];
      for(var i=0; i<this.golbal.messages.length; i++){
        if(this.golbal.messages[i].id!=messageItem.id)c_arr.push(this.golbal.messages[i]);
      }
      this.golbal.messages=c_arr;
    },
  },
  mounted(){
    this.golbal.showButtonFloor=false;
  }
}
</script>