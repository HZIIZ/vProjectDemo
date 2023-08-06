<template>
  <van-cell class="comment-item">
    <template v-slot:icon>
      <van-image class="avatar" round fit="cover" :src="comment.aut_photo" />
    </template>

    <template v-slot:title>
      <div class="title-wrap">
        <div class="user-name">{{ comment.aut_name }}</div>
        <van-button
          class="like-btn"
          :class="{
            liked: comment.is_liking
          }"
          :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
          @click="onCommentLike"
          :loading="commentLoading"
        >
          {{ comment.like_count > 0 ? comment.like_count : '赞' }}
        </van-button>
      </div>
    </template>

    <template v-slot:label>
      <div>
        <p class="comment-content">{{ comment.content }}</p>
        <div class="bottom-info">
          <span class="comment-pubdate">{{ relativeTime(comment.pubdate) }}</span>
          <van-button class="reply-btn" round @click="onReplyClick"
            >回复 {{ comment.reply_count }}</van-button
          >
        </div>
      </div>
    </template>
  </van-cell>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, ref } from 'vue'
import { relativeTimeAPI } from '@/utils/dayjs'
import { addCommentLike, deleteCommentLike } from '@/api/comment'

interface DataProps {}

export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  emits: ['onReplyClick'],
  setup(props: any, { emit }) {
    const data: DataProps = reactive({})
    onBeforeMount(() => {})
    onMounted(() => {})
    const refData = toRefs(data)
    const commentLoading = ref(false)

    const relativeTime = (date: string) => {
      return relativeTimeAPI(date)
    }

    const onCommentLike = async () => {
      commentLoading.value = true
      try {
        const commentObj = props.comment
        if (props.comment.is_liking) {
          const res = await deleteCommentLike(props.comment.com_id)
          console.log('deleteCommentLike: ', res)
          commentObj.like_count--
        } else {
          const res = await addCommentLike(props.comment.com_id)
          console.log('addCommentLike: ', res)
          commentObj.like_count++
        }
        commentObj.is_liking = !commentObj.is_liking
      } catch (err) {
        console.log('error:', err)
      }
      commentLoading.value = false
    }

    const onReplyClick = () => {
      emit('onReplyClick', props.comment)
    }

    return {
      ...refData,
      relativeTime,
      commentLoading,
      onCommentLike,
      onReplyClick
    }
  }
}
</script>
<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    min-width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
  }

  .liked {
    color: #e5645f;
  }
}
</style>
