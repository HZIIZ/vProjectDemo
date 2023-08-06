<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      :columns="columns"
      v-model="selectedValues"
      @confirm="onConfirm"
      @cancel="onCancel"
      @change="onChange"
    />
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, ref } from 'vue'
import { showToast, showFailToast, showSuccessToast, showLoadingToast } from 'vant'
import { updateUserProfileAPI } from '@/api/user'

interface DataProps {}
export default {
  name: 'UpdateGender',
  props: {
    gender: {
      type: Number,
      required: true
    }
  },
  emits: ['close', 'update:gender'],
  setup(props: any, { emit }) {
    const data: DataProps = reactive({})

    const selectedValues = ref([props.gender ?? 0])

    const columns = [
      { text: '男', value: 0 },
      { text: '女', value: 1 }
    ]
    const onConfirm = async ({ selectedValues }) => {
      if (!selectedValues?.length) {
        showFailToast('请选择性别！')
        return
      }

      showLoadingToast({
        message: '保存中...',
        forbidClick: true
      })

      try {
        const gender = selectedValues[0]
        const { data } = await updateUserProfileAPI({ gender })
        console.log('updateUserProfileAPI : ', data)
        emit('update:gender', gender)
        emit('close')
        showSuccessToast('修改成功！')
      } catch (error) {
        console.log('updateUserProfileAPI error: ', error)
        showFailToast('修改性别失败！')
      }
    }
    const onChange = ({ selectedValues }) => {
      showToast(`当前值: ${selectedValues.join(',')}`)
    }
    const onCancel = () => {
      emit('close')
    }

    onBeforeMount(() => {})
    onMounted(() => {})
    const refData = toRefs(data)
    return {
      ...refData,
      columns,
      onChange,
      onCancel,
      onConfirm,
      selectedValues
    }
  }
}
</script>
<style scoped lang="less"></style>
