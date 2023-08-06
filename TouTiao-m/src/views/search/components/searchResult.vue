<template>
  <div class="search-result">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      v-model:error="error"
      error-text="加载失败，请点击重试"
    >
      <van-cell v-for="item in list" :key="item.art_id" :title="item.title" />
    </van-list>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, ref } from 'vue'
import { querySearchResultAPI } from '@/api/search'
import { showToast } from 'vant'

interface DataProps {}

interface ArticleDataItem {
  title: string
  art_id: string
}

export default {
  name: 'SearchResult',
  props: {
    keyword: {
      type: String,
      required: true
    }
  },
  setup(props: any) {
    const data: DataProps = reactive({})
    const loading = ref(false)
    const finished = ref(false)
    const error = ref(false)
    const list: ArticleDataItem[] = reactive([])
    const curPage = ref(1)
    const perPage = ref(10)

    const onLoad = async () => {
      console.log('onLoad')
      try {
        // if (Math.random() > 0.5) {
        //   // 强制模拟失败场景
        //   window.dosmoething()
        //   console.log('强制失败')
        // }

        const { data } = await querySearchResultAPI({
          q: props.keyword,
          per_page: perPage.value,
          page: curPage.value
        })
        console.log('querySearchResultAPI: ', data)
        const { total_count, results } = data.data

        // 结束加载中状态
        loading.value = false

        if (results?.length) {
          list.push(...results)
          if (list.length >= total_count) {
            finished.value = true
          } else {
            curPage.value += 1
          }
        }
      } catch (err) {
        console.log('querySearchResultAPI error: ', err)
        showToast('查询失败:' + err?.message)

        error.value = true
        loading.value = false
      }
    }

    onBeforeMount(() => {})
    onMounted(() => {})
    const refData = toRefs(data)
    return {
      ...refData,
      loading,
      finished,
      error,
      onLoad,
      list
    }
  }
}
</script>
<style scoped lang="less"></style>
