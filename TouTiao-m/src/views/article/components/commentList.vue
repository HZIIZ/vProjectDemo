<template>
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="没有更多了"
    v-model:error="error"
    error-text="加载失败，请点击重试"
    @load="onLoad"
    :immediate-check="false"
  >
    <CommentItem
      v-for="item in list"
      :key="item.com_id"
      :comment="item"
      @onReplyClick="onReplyClick"
    />
  </van-list>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, ref } from 'vue'
import { getComments } from '@/api/comment'
import CommentItem from './commentItem.vue'

interface DataProps {}

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    sourceId: {
      type: String,
      required: true
    },
    isComment: {
      type: Boolean,
      required: false,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  emits: ['onCommentLoadSuccess', 'onReplyClick'],
  setup(props: any, { emit }) {
    const data: DataProps = reactive({})
    onBeforeMount(() => {})
    onMounted(() => {
      loading.value = true
      onLoad()
    })

    const refData = toRefs(data)

    // const list = ref<any>([])
    const loading = ref(false)
    const finished = ref(false)
    const error = ref(false)

    const limit = ref(10)
    const offset = ref('')

    const onLoad = async () => {
      try {
        const { data } = await getComments({
          type: props.isComment ? 'c' : 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: props.sourceId || '', // 源id，文章id或评论id
          offset: offset.value, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: limit.value // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        console.log('getComments: ', data)
        const { results, last_id } = data?.data || {}
        if (results?.length) {
          // list.value.push(...results)
          const commentList = props.list
          commentList.push(...results)
        }

        loading.value = false
        if (!results.length) {
          finished.value = true
        } else {
          offset.value = last_id
        }

        if (data.data) {
          emit('onCommentLoadSuccess', data.data)
        }
      } catch (err) {
        console.log('error: ', err)
        loading.value = false
        error.value = true
      }
    }

    const onReplyClick = (comment) => {
      emit('onReplyClick', comment)
    }

    return {
      ...refData,
      // list,
      loading,
      finished,
      error,
      onLoad,
      onReplyClick
    }
  }
}
</script>
<style scoped lang="less"></style>
