<template>
  <!-- :to="`/article/${article.art_id}`" -->
  <van-cell
    class="article-item"
    :to="{
      name: 'article',
      params: {
        articleId: article.art_id
      }
    }"
  >
    <template v-slot:title>
      <!-- vant 内置样式 'van-multi-ellipsis--l2' 最多显示两行 -->
      <div class="title van-multi-ellipsis--l2">{{ article.title }}</div>
    </template>
    <template v-slot:label>
      <div class="cover-wrap" v-if="article.cover.type === 3">
        <div class="cover-item" v-for="(img, index) in article.cover.images" :key="index">
          <van-image class="cover-item-img" fit="cover" :src="img" />
        </div>
      </div>
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ relativeTime(article.pubdate) }}</span>
      </div>
    </template>
    <template v-slot:default v-if="article.cover.type === 1">
      <van-image class="right-cover" :src="article.cover.images[0]" fit="cover" />
    </template>
  </van-cell>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import { relativeTimeAPI } from '@/utils/dayjs.ts'

interface DataProps {}
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  setup() {
    const data: DataProps = reactive({})
    onBeforeMount(() => {})
    onMounted(() => {})
    const refData = toRefs(data)
    // 处理相对时间
    const relativeTime = (date?: string) => {
      if (!date) return ''
      return relativeTimeAPI(date)
    }
    return {
      ...refData,
      relativeTime
    }
  }
}
</script>
<style scoped lang="less">
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }

  /deep/ .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }

  .right-cover {
    width: 232px;
    height: 146px;
  }

  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }

  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }

      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
