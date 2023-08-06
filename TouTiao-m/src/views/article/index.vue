<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="资讯标题" @click-left="onLeftClick">
    </van-nav-bar>
    <!-- 主体部分 -->
    <div class="main-wrap">
      <!-- 加载中 loading -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" text-color="#c9c9c9" vertical>加载中...</van-loading>
      </div>
      <!-- 文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <template v-slot:icon>
            <van-image class="avatar" round fit="cover" :src="article.aut_photo" />
          </template>
          <template v-slot:title>
            <div class="user-name">{{ article.aut_name }}</div>
          </template>
          <template v-slot:label>
            <div class="publish-date">{{ calculatePublishDate(article.pubdate) }}</div>
          </template>
          <template v-slot:right-icon>
            <!-- 
              :isFollowed="article.is_followed"
              @updateIsFollow="article.is_followed = $event"
              改写为 v-model
             -->
            <FollowUser
              class="follow-btn"
              :userId="article.aut_id"
              v-model:isFollowed="article.is_followed"
            />
            <!-- <van-button
              v-if="article.is_followed"
              class="follow-btn"
              round
              size="small"
              @click="onFollow"
              :loading="followLoading"
              >已关注</van-button
            >
            <van-button
              v-else
              class="follow-btn"
              type="primary"
              color="#3296fa"
              round
              size="small"
              icon="plus"
              @click="onFollow"
              :loading="followLoading"
              >关注</van-button
            > -->
          </template>
        </van-cell>
        <!-- 文章内容 -->
        <div
          ref="contentDivRef"
          class="article-content markdown-body"
          v-html="article.content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 评论列表 -->
        <CommentList
          :sourceId="article.art_id"
          @onCommentLoadSuccess="onCommentLoadSuccess"
          :list="commentList"
          @onReplyClick="onReplyClick"
        />

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" round size="small" @click="isPostShow = true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :badge="totalCount" color="#777" />
          <!-- <van-icon name="star-o" color="#777" /> -->
          <CollectArticle v-model:isCollected="article.is_collected" :articleId="article.art_id" />
          <!-- <van-icon name="good-job-o" color="#777" /> -->
          <LikeArticle v-model:attitude="article.attitude" :articleId="article.art_id" />
          <van-icon name="share" color="#777" />
        </div>

        <!-- 发布评论 -->
        <van-popup v-model:show="isPostShow" position="bottom">
          <CommentPost
            :targetId="article.art_id"
            :articleId="article.art_id"
            @postSuccess="onPostSuccess"
          />
        </van-popup>
      </div>
      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errorStatus === 404">
        <van-icon name="failure"></van-icon>
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- 加载失败：其他未知原因（网络错误或服务异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="queryArticleDetail">点击重试</van-button>
      </div>
    </div>

    <!-- 评论回复 -->
    <van-popup v-model:show="isReplyShow" position="bottom" style="height: 80%">
      <CommentReply v-if="isReplyShow" :comment="currentComment" @close="isReplyShow = false" />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, ref, nextTick, provide } from 'vue'
import { queryArticleDetailAPI } from '@/api/article'
import { relativeTimeAPI } from '@/utils/dayjs'
import { showImagePreview } from 'vant'
import { useRouter } from 'vue-router'
import FollowUser from '@/components/followUser/index.vue'
import CollectArticle from '@/components/collectArticle/index.vue'
import LikeArticle from '@/components/likeArticle/index.vue'
import CommentList from './components/commentList.vue'
import CommentPost from './components/commentPost.vue'
import CommentReply from './components/commentReply.vue'

interface DataProps {
  article: Object
}
export default {
  name: 'ArticleIndex',
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  setup(props: any) {
    console.log('setup props.articleId : ', props.articleId)
    const state: DataProps = reactive({
      article: {}
    })
    const loading = ref(true)
    const errorStatus = ref(0)
    const contentDivRef = ref()
    let imageUrlList = ref<string[]>([])
    const totalCount = ref(0)
    const isPostShow = ref(false)
    const commentList = ref<any[]>([])
    const isReplyShow = ref(false)
    const currentComment = ref<any>({})

    provide('articleId', props.articleId)

    onBeforeMount(() => {})
    onMounted(() => {
      queryArticleDetail()
    })
    const queryArticleDetail = async () => {
      loading.value = true

      try {
        // if (Math.random() > 0.5) {
        //   // 强制模拟失败场景
        //   window.dosmoething()
        //   console.log('强制失败')
        // }

        const { data } = await queryArticleDetailAPI(props.articleId)
        console.log('queryArticleDetailAPI: ', data)
        state.article = data.data || {}

        nextTick(() => {
          setTimeout(() => {
            console.log('contentDivRef: ', contentDivRef.value)
            getAllDomImages()
          }, 0)
        })
      } catch (error: any) {
        console.log('queryArticleDetailAPI error : ', error)
        if (error?.response?.status === 404) {
          errorStatus.value = 404
        }
      }

      loading.value = false
    }
    const calculatePublishDate = (date: string) => {
      return relativeTimeAPI(date)
    }

    const getAllDomImages = () => {
      const imageElements = contentDivRef.value?.querySelectorAll('img')
      console.log('getAllDomImages: ', imageElements)

      if (imageElements?.length) {
        const tempImageUrls = [
          'http://toutiao.itheima.net/resources/images/8.jpg',
          'http://toutiao.itheima.net/resources/images/17.jpg',
          'http://toutiao.itheima.net/resources/images/77.jpg',
          'http://toutiao.itheima.net/resources/images/12.jpg',
          'http://toutiao.itheima.net/resources/images/20.jpg',
          'http://toutiao.itheima.net/resources/images/33.jpg',
          'http://toutiao.itheima.net/resources/images/23.jpg',
          'http://toutiao.itheima.net/resources/images/31.jpg'
        ]

        const imageUrls: string[] = []
        imageElements.forEach((element: any, index: number) => {
          if (index < tempImageUrls.length) {
            imageUrls.push(tempImageUrls[index])
            element.src = tempImageUrls[index]
          } else {
            imageUrls.push(element.src)
          }

          element.onclick = () => {
            showImageAtIndex(index)
          }
        })
        imageUrlList.value = imageUrls
        console.log('imageUrls: ', imageUrls)
      }
    }

    const showImageAtIndex = (index: number) => {
      showImagePreview({
        images: imageUrlList.value,
        startPosition: index,
        closeable: true
      })
    }

    const router = useRouter()
    const onLeftClick = () => {
      router.go(-1)
    }

    const onCommentLoadSuccess = (data: any) => {
      const { total_count: total } = data

      totalCount.value = total
    }

    const onPostSuccess = (data: any) => {
      const { new_obj } = data
      commentList.value.unshift(new_obj)
      console.log('onPostSuccess: ', new_obj)

      isPostShow.value = false
    }

    const onReplyClick = (comment: any) => {
      console.log('article index onReplyClick : ', comment)
      currentComment.value = comment
      isReplyShow.value = true
    }

    const refData = toRefs(state)
    return {
      ...refData,
      calculatePublishDate,
      queryArticleDetail,
      loading,
      errorStatus,
      contentDivRef,
      onLeftClick,
      imageUrlList,
      totalCount,
      onCommentLoadSuccess,
      isPostShow,
      onPostSuccess,
      commentList,
      isReplyShow,
      onReplyClick,
      currentComment
    }
  }
}
</script>
<style scoped lang="less">
@import './github-markdown.css';

.article-container {
  .main-wrap {
    position: fixed;
    top: 92px;
    bottom: 88px;
    left: 0;
    right: 0;
    overflow-y: scroll;
    background-color: #fff;
  }

  .article-detail {
    .article-title {
      padding: 50px 32px;
      margin: 0;
      font-size: 40px;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }

      :deep(.van-cell__label) {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }

      .publish-date {
        font-size: 17px;
        color: #b7b7b7;
      }

      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;

      :deep(p) {
        text-align: justify;

        img {
          width: 100%;
        }
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;

    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }

    .text {
      font-size: 30px;
      color: #666;
      margin: 33px 0 46px;
    }

    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    justify-content: space-around;
    align-items: center;

    height: 88px;
    background-color: #fff;
    box-sizing: border-box;
    border-top: 1px solid #d8d8d8;

    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }

    :deep(.van-icon) {
      font-size: 40px;

      .van-badge {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
