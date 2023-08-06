<template>
  <!-- 频道编辑组件 -->
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <template v-slot:title>
        <div class="title-text">我的频道</div>
      </template>
      <van-button
        class="edit-btn"
        type="danger"
        size="mini"
        round
        plain
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>

    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannelList"
        :key="channel.id + index"
        @click="onMyChannelClick(channel, index)"
      >
        <template v-slot:text>
          <span class="text" :class="{ active: index === active }">{{ channel.name }}</span>
        </template>
        <template v-slot:icon>
          <van-icon name="clear" v-show="isEdit && !fiexdChannels.includes(channel.id)"></van-icon>
        </template>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <template v-slot:title>
        <div class="title-text">频道推荐</div>
      </template>
    </van-cell>

    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="channel.id + index"
        :text="channel.name"
        icon="plus"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, computed } from 'vue'
import { showToast } from 'vant'
import { queryAllChannelsAPI, addUserChannelAPI, deleteUserChannelAPI } from '@/api/channel'
import { useStore } from 'vuex'
import { setItem } from '@/utils/storage'

interface DataProps {
  allChannels: any[]
  myChannelList: any[]
  fiexdChannels: number[]
  isEdit: boolean
}
export default {
  name: 'channelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  emits: ['updateActive'],
  setup(props: any, ctx: any) {
    const state: DataProps = reactive({
      allChannels: [],
      myChannelList: Object.assign(props.myChannels || []),
      fiexdChannels: [0], // 不允许删除的频道
      isEdit: false
    })
    onBeforeMount(() => {})
    onMounted(() => {
      queryAllChannels()
    })

    const queryAllChannels = async () => {
      try {
        const { data } = await queryAllChannelsAPI()
        state.allChannels = data?.data?.channels || []
        console.log('queryAllChannelsAPI: ', data)
      } catch (error) {
        console.log('queryAllChannelsAPI error: ', error)
        showToast('查询所有频道失败:' + error?.message)
      }
    }

    const recommendChannels = computed(() => {
      // 处理方法1：
      // const channels: any[] = []
      // state.allChannels.forEach((channel: any) => {
      //   const data = state.myChannelList.find((myChannel: any) => {
      //     return channel.id === myChannel.id
      //   })
      //   if (!data) {
      //     channels.push(channel)
      //   }
      // })
      // return channels

      // 处理方法2 (更简洁)
      return state.allChannels.filter((channel: any) => {
        return !state.myChannelList.find((myChannel: any) => myChannel.id === channel.id)
      })
    })

    const store = useStore()
    const user = computed(() => store.state.user)
    // 添加频道
    const onAddChannel = async (channel: any) => {
      state.myChannelList.push(channel)

      if (user.value) {
        // 如果登录，调接口保存
        try {
          const { data } = await addUserChannelAPI({
            id: channel.id,
            seq: state.myChannelList.length
          })
          console.log('addUserChannelAPI: ', data)
        } catch (error) {
          console.log('addUserChannelAPI error : ', error)
          showToast('添加频道失败:' + error?.message)
        }
      } else {
        // 如果未登录，保存本地
        setItem('TOUTIAO_CHANNELS', state.myChannelList)
      }
    }

    const onMyChannelClick = (channel: any, index: number) => {
      if (state.isEdit) {
        // 删除频道
        if (state.fiexdChannels.includes(channel.id)) {
          return
        }
        state.myChannelList.splice(index, 1)
        if (index <= props.active) {
          ctx.emit('updateActive', props.active - 1)
        }
        console.log('onMyChannelClick: ', index)
        deleteChannel(channel)
      } else {
        // 切换频道

        ctx.emit('updateActive', index, false)
      }
    }

    const deleteChannel = async (channel: any) => {
      if (user.value) {
        // 已登录，调接口保存

        try {
          const { data } = await deleteUserChannelAPI(channel.id)
          console.log('deleteUserChannelAPI: ', data)
        } catch (error) {
          console.log('deleteUserChannelAPI error : ', error)
          showToast('删除频道失败:' + error?.message)
        }
      } else {
        // 未登录，保存本地
        setItem('TOUTIAO_CHANNELS', state.myChannelList)
      }
    }

    const refData = toRefs(state)
    return {
      ...refData,
      recommendChannels,
      onAddChannel,
      onMyChannelClick
    }
  }
}
</script>
<style scoped lang="less">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    // background-color: #f4f5f6;

    .van-grid-item__content {
      background-color: #f4f5f6;
      white-space: nowrap;

      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }

      .active {
        color: red;
      }
    }
  }

  /deep/ .my-grid {
    .van-icon {
      // position: absolute;
      // right: -12px;
      // top: -12px;
      font-size: 30px;
      color: #999;
      // z-index: 2;
    }

    .van-badge__wrapper {
      position: absolute;
      right: -6px;
      top: -6px;
      z-index: 2;
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;

        .van-grid-item__icon {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
