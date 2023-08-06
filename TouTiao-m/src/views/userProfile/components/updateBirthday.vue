<template>
  <div class="update-birthday">
    <van-date-picker
      v-model="currentDate"
      title="选择生日"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onConfirm"
      @cancel="onCancel"
      @change="onChange"
    />
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, ref } from 'vue'
import { getCurrentDateAPI } from '@/utils/dayjs'
import { showFailToast, showSuccessToast, showLoadingToast } from 'vant'
import { updateUserProfileAPI } from '@/api/user'

interface DataProps {}
export default {
  name: 'UpdateBirthday',
  props: {
    birthday: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'update:birthday'],
  setup(props: any, { emit }) {
    const data: DataProps = reactive({})

    const defaultDay = getCurrentDateAPI()
    let list = (props.birthday || defaultDay)?.split('-')
    console.log('list: ', list)
    const currentDate = ref(list)

    const onConfirm = async ({ selectedValues }) => {
      console.log('onConfirm selectedValues: ', selectedValues)
      const birthday = selectedValues?.join('-')
      if (!birthday) {
        showFailToast('请选择生日！')
        return
      }

      showLoadingToast({
        message: '保存中...',
        forbidClick: true
      })

      try {
        const { data } = await updateUserProfileAPI({ birthday })
        console.log('updateUserProfileAPI : ', data)
        emit('update:birthday', birthday)
        emit('close')
        showSuccessToast('修改成功！')
      } catch (error) {
        console.log('updateUserProfileAPI error: ', error)
        showFailToast('修改生日失败！')
      }
    }

    const onCancel = ({ selectedValues }) => {
      console.log('onCancel selectedValues : ', selectedValues)
      emit('close')
    }

    const onChange = ({ selectedValues }) => {
      console.log('onChange selectedValues: ', selectedValues)
    }

    onBeforeMount(() => {})
    onMounted(() => {})
    const refData = toRefs(data)
    return {
      ...refData,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate,
      onConfirm,
      onCancel,
      onChange
    }
  }
}
</script>
<style scoped lang="less"></style>
