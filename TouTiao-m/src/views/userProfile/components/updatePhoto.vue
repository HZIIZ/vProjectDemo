<template>
  <div class="update-photo">
    <img ref="imgRef" class="img" :src="img" />
    <div class="toolbar">
      <div class="cancel-btn" @click="onCancel">取消</div>
      <div class="confirm-btn" @click="onConfirm">确定</div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, ref } from 'vue'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhotoAPI } from '@/api/user'
import { showSuccessToast, showFailToast, showLoadingToast } from 'vant'

interface DataProps {}
export default {
  name: 'UpdatePhoto',
  props: {
    img: {
      type: String || Object,
      required: true
    }
  },
  emits: ['close', 'updatePhoto'],
  setup(props: any, { emit }) {
    const data: DataProps = reactive({})
    const imgRef = ref<any>(null)
    const cropper = ref<any>(null)

    onBeforeMount(() => {})
    onMounted(() => {
      cropper.value = new Cropper(imgRef.value, {
        viewMode: 1,
        dragMode: 'move',
        aspectRatio: 1,
        autoCropArea: 1,
        cropBoxMovable: false,
        cropBoxResizable: false,
        background: false,
        movable: true,
        crop(event) {
          console.log('cropper event.detail: ', event.detail)
        }
      })
      console.log('cropper: ', cropper.value)
    })
    const refData = toRefs(data)

    const onCancel = () => {
      emit('close')
    }

    const onConfirm = () => {
      // console.log('cropper.value.getData() : ', cropper.value.getData())
      cropper.value.getCroppedCanvas().toBlob(async (blob: any) => {
        console.log('getCroppedCanvas : ', blob)
        updatePhoto(blob)
      })
    }

    const updatePhoto = async (blob: any) => {
      showLoadingToast({
        message: '保存中...',
        forbidClick: true
      })

      try {
        // // error !!!
        // const { data } = await updateUserPhotoAPI({
        //   photo: blob,
        // })

        const formData = new FormData()
        formData.append('photo', blob)
        const { data } = await updateUserPhotoAPI(formData)
        console.log('updateUserPhotoAPI: ', data)

        emit('close')
        emit('updatePhoto', data.data.photo)

        showSuccessToast('保存成功！')
      } catch (error) {
        console.log('updateUserPhotoAPI error : ', error)
        showFailToast('修改头像失败！')
      }
    }

    return {
      ...refData,
      onCancel,
      onConfirm,
      imgRef
    }
  }
}
</script>
<style scoped lang="less">
.update-photo {
  width: 100%;
  height: 100%;
  background-color: black;

  .img {
    display: block;
    max-width: 100%;
  }
  .toolbar {
    width: 100%;

    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .cancel-btn,
    .confirm-btn {
      width: 110px;
      height: 90px;
      display: flex;
      justify-content: center;
      align-items: center;

      font-size: 34px;
      color: #fff;
    }
  }
}
</style>
