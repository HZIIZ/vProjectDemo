<template>
  <div class="search-container">
    <!-- 搜索模块 -->
    <form class="search-form" action="/">
      <van-search
        v-model="keyword"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="onFocus"
        background="#3296fa"
      />
    </form>

    <!-- 搜索结果 -->
    <SearchResult v-if="isResultShow" :keyword="keyword" />

    <!-- 联想建议 -->
    <SearchSuggestion v-else-if="keyword" :keyword="keyword" @search="onSearch" />

    <!-- 搜索历史记录 -->
    <SearchHistory
      :list="historyList"
      v-else
      @delete="(value, type) => onDeleteHistory(value, type)"
      @search="onSearch"
    />
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import SearchHistory from './components/searchHistory.vue'
import SearchSuggestion from './components/searchSuggestion.vue'
import SearchResult from './components/searchResult.vue'
import { setItem, getItem } from '@/utils/storage'

interface DataProps {
  historyList: string[]
}
export default {
  name: 'SearchIndex',
  props: {},
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  setup() {
    const state: DataProps = reactive({
      historyList: getItem('SEARCH_HISTORY') || []
    })
    onBeforeMount(() => {})
    onMounted(() => {})
    // 历史记录
    const isResultShow = ref(false)
    const keyword = ref('')
    const onSearch = (value: any) => {
      console.log('onSearch: ', value)
      keyword.value = value

      // 添加历史记录
      if (value) {
        const index = state.historyList.indexOf(value)
        if (index >= 0) {
          state.historyList.splice(index, 1)
        }
        state.historyList.unshift(value)
      }
      console.log('historyList: ', state.historyList)
      isResultShow.value = true
    }

    const onFocus = () => {
      isResultShow.value = false
    }

    const router = useRouter()
    const onCancel = () => {
      console.log('onCancel')
      router.back()
    }

    // 删除历史记录
    const onDeleteHistory = (value: string, type: string) => {
      console.log('onDeleteHistory: ', value, type)
      if (type === 'all') {
        state.historyList = []
        return
      }

      if (value) {
        const index = state.historyList.indexOf(value)
        if (index >= 0) {
          state.historyList.splice(index, 1)
        }
      }
    }

    // 历史记录本地持久化
    watch(state.historyList, (newValue) => {
      console.log('watch state.historyList: ', state.historyList)
      setItem('SEARCH_HISTORY', newValue)
    })

    const refData = toRefs(state)
    return {
      ...refData,
      onSearch,
      onCancel,
      onFocus,
      keyword,
      isResultShow,
      onDeleteHistory
    }
  }
}
</script>
<style scoped lang="less">
.search-container {
  padding-top: 108px;

  :deep(.van-search) {
    .van-search__action {
      color: #fff;
    }
  }

  :deep(.search-form) {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 2;
  }
}
</style>
