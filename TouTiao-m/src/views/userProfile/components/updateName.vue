<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="onClose"
      @click-right="onConfirm"
    />

    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="15"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, ref } from 'vue'
import { updateUserProfileAPI } from '@/api/user'
import { showSuccessToast, showFailToast, showLoadingToast } from 'vant'

interface DataProps {}

export default {
  name: 'UpdateName',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'update:name'],
  setup(props: any, { emit }) {
    const data: DataProps = reactive({})
    const message = ref(props.name || '')

    onBeforeMount(() => {})
    onMounted(() => {})

    const onClose = () => {
      console.log('onClose')
      emit('close')
    }

    const onConfirm = async () => {
      console.log('onConfirm')
      if (!message.value) {
        showFailToast('请输入昵称！')
        return
      }

      showLoadingToast({
        message: '保存中...',
        forbidClick: true
      })

      try {
        const { data } = await updateUserProfileAPI({ name: message.value })
        console.log('updateUserProfileAPI : ', data)
        emit('update:name', message.value)
        onClose()
        showSuccessToast('修改成功！')
      } catch (error) {
        console.log('updateUserProfileAPI error: ', error)
        showFailToast('修改昵称失败！')
      }
    }

    const refData = toRefs(data)
    return {
      ...refData,
      onClose,
      onConfirm,
      message
    }
  }
}
</script>
<style scoped lang="less">
.update-name {
  background-color: #f5f7f9;
  .field-wrap {
    padding: 20px;
  }
}
</style>
