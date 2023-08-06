<template>
  <van-button
    v-if="isFollowed"
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
  >
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, ref } from 'vue'
import { addFollowingsAPI, deleteFollowingsAPI } from '@/api/user'

interface DataProps {}

export default {
  name: 'FollowUser',
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    // value: {
    //   type: Boolean,
    //   required: true
    // },
    userId: {
      type: String,
      required: true
    }
  },

  setup(props: any, { emit }) {
    const data: DataProps = reactive({})
    const followLoading = ref(false)

    const onFollow = async () => {
      followLoading.value = true
      try {
        if (props.isFollowed) {
          // 已关注 =》 取消关注
          const res = await deleteFollowingsAPI(props.userId)
          console.log('onFollow deleteFollowingsAPI: ', res)
        } else {
          // 未关注 =》 关注
          const res = await addFollowingsAPI(props.userId)
          console.log('onFollow addFollowingsAPI: ', res)
        }

        // emit('updateIsFollow', !props.isFollowed)
        // emit('input', !props.value)
        emit('update:isFollowed', !props.isFollowed)
      } catch (error) {
        console.log('onFollow error:', error)
      }

      followLoading.value = false
    }

    onBeforeMount(() => {})
    onMounted(() => {})
    const refData = toRefs(data)
    return {
      ...refData,
      followLoading,
      onFollow
    }
  }
}
</script>
<style scoped lang="less"></style>
