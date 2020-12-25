<template>
  <div class="main">
    <div class="divUserTop">
      <div class="divUserFace"><img src="static/images/face_man.jpg"></div>
      <div class="divUserInfo">
        <span class="spanUserInfo1">LinkScene</span>
        <span class="spanUserInfo2">用户</span>
      </div>
    </div>
    <div class="divUserContent">
      <span class="title">管理设置</span>
      <div class="content">
        <ul>
          <li @click="scanQRCode()"><i class="icon-scanning"></i><span>扫一扫获取配置</span><div class="divIcon"><i class="icon-arrow1_right"></i></div></li>
          <li @click="drawerBlockClick()"><i class="icon-office"></i><span>楼栋管理</span><div class="divIcon"><i class="icon-arrow1_right"></i></div></li>
          <li @click="drawerThemeClick()"><i class="icon-pic"></i><span>主题样式</span><div class="divIcon"><i class="icon-arrow1_right"></i></div></li>
          <li @click="drawerTestClick()"><i class="icon-wrench"></i><span>调试</span><div class="divIcon"><i class="icon-arrow1_right"></i></div></li>
          <li @click="drawerGatewayClick()"><i class="icon-duoyuyan"></i><span>网关</span><div class="divIcon"><i class="icon-arrow1_right"></i></div></li>
        </ul>
      </div>
    </div>
    
    
    
  </div>
</template>