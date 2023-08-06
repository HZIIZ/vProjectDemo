<template>
  <div class="article-list">
    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="refreshLoading"
      success-text="刷新成功"
      success-duration="1500"
      @refresh="onRefresh"
    >
      <!-- 列表 -->
      <van-list
        v-model:loading="loading"
        v-model:error="error"
        error-text="请求失败，点击重新加载"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- <van-cell v-for="article in list" :key="article.art_id" :title="article.title" /> -->
        <ArticleItem v-for="article in list" :key="article.art_id" :article="article" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { queryArticleListAPI } from '@/api/article.ts'
import ArticleItem from '@/components/articleItem/index.vue'

export default defineComponent({
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: { type: Object, required: true }
  },
  setup(props: any) {
    const loading = ref(false)
    const finished = ref(false)
    const error = ref(false)
    const refreshLoading = ref(false)
    const list = ref([])
    const request_timestamp = ref()

    const onLoad = async () => {
      console.log('onLoad')
      // 异步更新数据

      try {
        // if (Math.random() > 0.5) {
        //   // 强制模拟失败场景
        //   window.dosmoething()
        //   console.log('强制失败')
        // }

        const { data } = await queryArticleListAPI({
          channel_id: props.channel.id,
          timestamp: request_timestamp.value || Date.now()
        })
        console.log('queryArticleListAPI: ', data)
        const { pre_timestamp, results } = data.data

        if (refreshLoading.value) {
          list.value = results || []
        } else {
          results?.length && list.value.push(...results)
        }

        // 加载状态结束
        if (loading.value) {
          loading.value = false
        }

        // 下拉刷新状态
        if (refreshLoading.value) {
          refreshLoading.value = false
        }

        if (results?.length) {
          // 还有数据，更新时间戳
          request_timestamp.value = pre_timestamp
        } else {
          // 没有数据，就 展示没有更多数据了
          finished.value = true
        }
      } catch (errMsg) {
        console.log('queryArticleListAPI error: ', errMsg)
        // 加载状态结束
        loading.value = false
        finished.value = false
        // 提示错误
        error.value = true

        refreshLoading.value = false
      }
    }

    const onRefresh = async () => {
      console.log('onRefresh')
      request_timestamp.value = null
      await onLoad()
    }

    console.log('ArticleList: ', props)
    return {
      loading,
      error,
      finished,
      onLoad,
      refreshLoading,
      onRefresh,
      list
    }
  }
})
</script>

<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
