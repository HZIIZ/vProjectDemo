<template>
  <div class="container">
    <van-nav-bar :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'">
      <template v-slot:left>
        <van-icon name="cross" @click="$emit('close')" />
      </template>
    </van-nav-bar>

    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <CommentItem :comment="comment" />

      <van-cell title="全部回复" />
      <!-- 回复列表 -->
      <CommentList :isComment="true" :sourceId="comment.com_id" :list="replyList" />
    </div>

    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button class="post-btn" round size="small" @click="isShow = true">写评论</van-button>
    </div>
  </div>
  <van-popup v-model:show="isShow" position="bottom">
    <CommentPost :articleId="articleId" :targetId="comment.com_id" @postSuccess="onPostSuccess" />
  </van-popup>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, ref, inject } from 'vue'
import CommentItem from './commentItem.vue'
import CommentList from './commentList.vue'
import CommentPost from './commentPost.vue'

interface DataProps {}

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  setup(props: any) {
    const data: DataProps = reactive({})
    onBeforeMount(() => {})
    onMounted(() => {})
    const refData = toRefs(data)
    const replyList = ref<any[]>([])
    const isShow = ref(false)

    const articleId = inject('articleId', '')

    const onPostSuccess = (data: any) => {
      console.log('onPostSuccess: ', data)

      const comment = props.comment
      comment.reply_count++

      isShow.value = false

      replyList.value.unshift(data.new_obj)
    }

    return {
      ...refData,
      replyList,
      isShow,
      articleId,
      onPostSuccess
    }
  }
}
</script>
<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  position: relative;
}

.scroll-wrap {
  position: absolute;
  top: 92px;
  bottom: 88px;
  left: 0;
  right: 0;
  overflow-y: auto;
}
.post-wrap {
  height: 88px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>
