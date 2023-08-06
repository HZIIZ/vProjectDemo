<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(item, index) in suggestions"
      :key="index"
      icon="search"
      @click="onClickToSearch(item)"
    >
      <template v-slot:title>
        <div v-html="highlightKeywords(item)"></div>
      </template>
    </van-cell>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, watch } from 'vue'
import { showToast } from 'vant'
import { querySuggestionAPI } from '@/api/search'
import { debounce } from 'lodash'

interface DataProps {
  suggestions: string[]
}
export default {
  name: 'SearchSuggestion',
  props: {
    keyword: {
      type: String,
      required: true
    }
  },
  emits: ['search'],
  setup(props: any, { emit }) {
    const state: DataProps = reactive({ suggestions: [] })

    // debounce 防抖动
    const querySuggestion = debounce(async (keyword: string) => {
      try {
        const { data } = await querySuggestionAPI(keyword)

        const suggestions = data?.data?.options || []
        state.suggestions = suggestions.filter((item: any) => {
          return typeof item === 'string' && item.length
        })

        console.log('querySuggestionAPI: ', data)
      } catch (error) {
        console.log('querySuggestionAPI error: ', error)
        showToast('查询失败:' + error?.message)
      }
    }, 1000)

    watch(
      () => props.keyword,
      (newValue: any, oldValue: any) => {
        console.log('watch props.keyword : ', newValue, oldValue, props.keyword)
        if (!newValue) {
          return
        }
        querySuggestion(newValue)
      },
      {
        immediate: true
      }
    )

    const highlightKeywords = (text: string) => {
      const reg = new RegExp(props.keyword, 'gi')
      const highlightText = `<span class="text-active">${props.keyword}</span>`

      const newText = text.replace(reg, highlightText)
      console.log('highlightKeywords: ', newText)
      return newText
    }

    const onClickToSearch = (text: string) => {
      emit('search', text)
    }

    onBeforeMount(() => {})
    onMounted(() => {})
    const refData = toRefs(state)
    return {
      ...refData,
      highlightKeywords,
      onClickToSearch
    }
  }
}
</script>
<style scoped lang="less">
.search-suggestion {
  :deep(.van-cell) {
    span.text-active {
      color: #3296fa;
    }
  }
}
</style>
