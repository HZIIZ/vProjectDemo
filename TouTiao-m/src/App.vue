<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import { Button } from 'vant'
</script>

<template>
  <header>
    <div class="wrapper">
      <i class="iconfont icon-gengduo">123456</i>
      <i class="iconfont icon-dianzan2"></i>
      <van-button type="primary">vant-按钮</van-button>
      <div class="box"></div>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
.box {
  background-color: rebeccapurple;
  width: 200px;
  height: 200px;
}
</style>
