<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <template #title>
        <van-button class="search-btn" type="primary" size="small" round icon="search" to="/search">
          搜索
        </van-button>
      </template>
    </van-nav-bar>

    <!-- 标签列表 -->
    <van-tabs class="channel-tab" v-model:active="active" animated swipeable>
      <van-tab :title="item.name" v-for="(item, index) in channels" :key="index + item.id">
        <ArticleList :channel="item" />
      </van-tab>

      <template #nav-right>
        <div class="channel-btn" @click="isChannelEditShow = true">
          <i class="iconfont icon-gengduo"></i>
        </div>
        <div class="placeholder"></div>
      </template>
    </van-tabs>

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model:show="isChannelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <ChannelEdit :myChannels="channels" :active="active" @updateActive="onUpdateActive" />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getUserChannelsAPI } from '@/api/user.ts'
import ArticleList from './components/articleList.vue'
import ChannelEdit from './components/channelEdit.vue'
import { showToast } from 'vant'
import { useStore } from 'vuex'
import { getItem } from '@/utils/storage'
// import { useRouter } from 'vue-router'

interface ChannelItem {
  id: string
  name: string
}

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },

  setup(props: any, ctx: any) {
    console.log('HomeIndex: ', props, ctx)
    const active = ref(0)
    const channels = ref<ChannelItem[]>([])
    const isChannelEditShow = ref(false)

    const store = useStore()
    const user = computed(() => store.state.user)

    onMounted(() => {
      queryMyChannels()
    })

    const onUpdateActive = (index: number, isShow: boolean = true) => {
      console.log('onUpdateActive:', index, isShow)
      active.value = index
      isChannelEditShow.value = isShow
    }

    const queryMyChannels = async () => {
      try {
        let channelList = []
        if (user.value) {
          const { data } = await getUserChannelsAPI()
          console.log('login getUserChannelsAPI: ', data)
          channelList = data?.data?.channels || []
        } else {
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels?.length) {
            channelList = localChannels
          } else {
            const { data } = await getUserChannelsAPI()
            console.log('not login getUserChannelsAPI: ', data)
            channelList = data?.data?.channels || []
          }
        }

        channels.value = channelList
      } catch (error) {
        console.log('getUserChannelsAPI: ', error)
        showToast('查询频道列表失败:' + error?.message)
      }
    }

    // const router = useRouter()
    // const goSearch = () => {
    //   router.push('/search')
    // }

    return {
      active,
      channels,
      isChannelEditShow,
      onUpdateActive
      // goSearch
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 172px;
  padding-bottom: 100px;

  .page-nav-bar {
    :deep(.van-nav-bar__title) {
      max-width: unset;

      .search-btn {
        width: 555px;
        height: 64px;
        background-color: #5babfb;
        border: none;
        font-size: 28px;
        font-weight: 400;

        .van-button__icon {
          font-size: 40px;
        }
      }
    }
  }

  /deep/ .channel-tab {
    // :deep(.van-tab) {
    //   border-right: 1px solid #edeff3;
    // }

    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      left: 0;
      right: 0;
      top: 88px;
      z-index: 1;

      .van-tabs__nav--line.van-tabs__nav--complete {
        padding: 0;
      }
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777;
    }

    .van-tab--active {
      color: #333;
    }

    .van-tabs__nav--line {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px;
      height: 6px;
      background-color: #3296fa;
    }

    .channel-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: 0.902;

      i.iconfont {
        font-size: 33px;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        width: 2px;
        height: 100%;
        background: url('@/assets/gradient-gray-line.png');
        background-size: contain;
      }
    }

    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
  }
}
</style>
