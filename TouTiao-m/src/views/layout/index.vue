<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <RouterView />
    <!-- tab 栏 -->
    <van-tabbar route class="layout-tabbar" v-model="active">
      <van-tabbar-item to="/home" replace>
        <template #icon>
          <i class="iconfont icon-shouye"></i>
        </template>
        <span class="text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item to="/qa" replace>
        <template #icon>
          <i class="iconfont icon-wenda"></i>
        </template>
        <span class="text">问答</span>
      </van-tabbar-item>
      <van-tabbar-item to="/video" replace>
        <template #icon>
          <i class="iconfont icon-shipin"></i>
        </template>
        <span class="text">视频</span>
      </van-tabbar-item>
      <van-tabbar-item to="/my" replace>
        <template #icon>
          <i class="iconfont icon-wode"></i>
        </template>
        <span class="text">{{ user ? '我的' : '未登录' }}</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'LayoutIndex',
  setup(props: any, ctx: any) {
    const active = ref(0)
    console.log('LayoutIndex: ', props, ctx)

    const store = useStore()
    const user = computed(() => store.state.user)

    return {
      active,
      user
    }
  }
}
</script>

<style scoped lang="less">
.layout-container {
  .layout-tabbar {
    i.iconfont {
      font-size: 40px;
    }

    span.text {
      font-size: 20px;
    }
  }
}
</style>
