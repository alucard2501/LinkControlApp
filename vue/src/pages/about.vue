<template>
    <div class="main">
        <div style="margin-top:100px" class="divAboutLogo" @click="aboutLogoClick()">
            <img src="static/images/about_logo.png"  />
        </div>
        <div class="divAboutAppname">
            <span style="color:#bdbdbd;">智慧云联</span>
        </div>
        <hr class="hrAbout">
        <div class="divAboutVersion">
            <span style="color:#bdbdbd;">{{version}}</span>
            <!-- (Build {{version.replaceAll(".","")}}) -->
        </div>
    </div>
</template>

<script>
import MyFunction from '../js/MyFunction'
export default {
	data () {
		return {
      
      version:"v1.0.51",
      aboutLogoClickCount:0,
      //log:"",
    }
	},
  props: ['golbal'],
  methods: {


    /**狂点关于图标 */
    aboutLogoClick(){
      if(this.aboutLogoClickCount==0){
        setTimeout(function(){
          this.aboutLogoClickCount=0;
        });
      }
      this.aboutLogoClickCount+=1;
      if(this.aboutLogoClickCount==10){
        this.golbal.showDebug=true;
      }
      
    }

	},

}
</script>

<style scoped>
.divAboutLogo,.divAboutAppname,.divAboutVersion{
  width:50%;
  text-align: center;
  margin-left: 25%;
  color:#bdbdbd;
}
.divAboutLogo img{
  width:128px;
}
.divAboutAppname{
  font-size: 2em;
}
.divAboutVersion{
  font-size: 1.5em;
}
.hrAbout{
  width: 96%;
}
.ulLog li{
  list-style: none;
  font-size: 9px;
}
</style>