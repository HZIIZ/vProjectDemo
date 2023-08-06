<template>
  <!-- <van-icon
    :name="isCollected ? 'star' : 'star-o'"
    :color="isCollected ? '#ffa500' : '#777'"
    @click="onCollection"
  /> -->
  <van-button
    :icon="isCollected ? 'star' : 'star-o'"
    :class="{
      collection: isCollected
    }"
    @click="onCollection"
    :loading="loading"
  />
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, ref } from 'vue'
import { showSuccessToast, showFailToast } from 'vant'
import { addCollectionArticleAPI, deleteCollectionArticleAPI } from '@/api/article.ts'

interface DataProps {}
export default {
  name: 'CollectArticle',
  props: {
    isCollected: {
      type: Boolean,
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

    const onCollection = async () => {
      loading.value = true
      try {
        if (props.isCollected) {
          const res = await deleteCollectionArticleAPI(props.articleId)
          console.log('deleteCollectionArticleAPI: ', res)
        } else {
          const res = await addCollectionArticleAPI(props.articleId)
          console.log('addCollectionArticleAPI: ', res)
        }

        showSuccessToast(props.isCollected ? '取消收藏' : '收藏成功')
        emit('update:isCollected', !props.isCollected)
      } catch (error) {
        console.log('error: ', error)
        showFailToast('收藏失败')
      }

      loading.value = false
    }

    return {
      ...refData,
      onCollection,
      loading
    }
  }
}
</script>
<style scoped lang="less">
.collection {
  :deep(.van-icon) {
    color: #ffa500;
  }
}
</style>
