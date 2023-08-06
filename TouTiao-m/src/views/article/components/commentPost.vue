<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button class="post-btn" @click="onPost" :disabled="!message?.length">发布</van-button>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, ref } from 'vue'
import { addComment } from '@/api/comment'
import { showFailToast, showSuccessToast, showLoadingToast } from 'vant'

interface DataProps {}
export default {
  name: 'CommentPost',
  props: {
    targetId: {
      type: String,
      required: true
    },
    articleId: {
      type: String,
      required: true
    }
  },
  emits: ['postSuccess'],
  setup(props: any, { emit }) {
    const data: DataProps = reactive({})
    onBeforeMount(() => {})
    onMounted(() => {})
    const refData = toRefs(data)
    const message = ref('')

    const onPost = async () => {
      if (!message.value?.length) {
        return
      }

      showLoadingToast({
        message: '加载中...',
        forbidClick: true
      })

      try {
        const { data } = await addComment({
          target: props.targetId || '', // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: message.value, // 评论内容
          art_id: props.articleId || '' // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })
        console.log('addComment : ', data)

        showSuccessToast('发布成功')

        message.value = ''
        // data.data.new_obj
        emit('postSuccess', data.data)
      } catch (err) {
        console.log('error: ', err)
        showFailToast('发布失败')
      }
    }
    return {
      ...refData,
      message,
      onPost
    }
  }
}
</script>
<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
