<template>
  <!-- <van-icon name="good-job-o" color="#777" /> -->
  <van-button
    :icon="attitude === 1 ? 'good-job' : 'good-job-o'"
    :class="{
      liked: attitude === 1
    }"
    @click="onLike"
    :loading="loading"
  />
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, ref } from 'vue'
import { showSuccessToast, showFailToast } from 'vant'
import { addLikeArticleAPI, deleteLikeArticleAPI } from '@/api/article'
interface DataProps {}
export default {
  name: 'LikeArticle',
  props: {
    attitude: {
      type: Number,
      required: true
    },
    articleId: {
      type: String,
      required: true
    }
  },
  setup(props: any, { emit }) {
    const data: DataProps = reactive({})
    onBeforeMount(() => {})
    onMounted(() => {})
    const refData = toRefs(data)
    const loading = ref(false)

    const onLike = async () => {
      loading.value = true
      try {
        if (props.attitude === 1) {
          const res = await deleteLikeArticleAPI(props.articleId)
          console.log('deleteLikeArticleAPI: ', res)
        } else {
          const res = await addLikeArticleAPI(props.articleId)
          console.log('addLikeArticleAPI: ', res)
        }

        showSuccessToast(props.attitude === 1 ? '取消点赞' : '点赞成功')
        emit('update:attitude', props.attitude === 1 ? -1 : 1)
      } catch (error) {
        console.log('error: ', error)
        showFailToast('点赞失败')
      }

      loading.value = false
    }

    return {
      ...refData,
      onLike,
      loading
    }
  }
}
</script>
<style scoped lang="less">
.liked {
  :deep(.van-icon) {
    color: #e5645f;
  }
}
</style>
