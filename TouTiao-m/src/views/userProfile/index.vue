<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar title="个人信息" class="page-nav-bar" left-arrow @click-left="onLeftClick" />

    <!-- 个人信息 -->
    <van-cell title="头像" is-link @click="inputRef.click()">
      <template #value>
        <van-image class="avatar" round fit="cover" :src="user.photo" />
      </template>
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isUpdateNameShow = true" />
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"
    />
    <van-cell title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow = true" />

    <!-- 修改昵称弹框 -->
    <van-popup v-model:show="isUpdateNameShow" position="bottom" style="height: 80%">
      <UpdateName
        v-if="isUpdateNameShow"
        v-model:name="user.name"
        @close="isUpdateNameShow = false"
      />
    </van-popup>

    <!-- 修改性别弹框 -->
    <van-popup v-model:show="isUpdateGenderShow" position="bottom">
      <UpdateGender
        v-if="isUpdateGenderShow"
        v-model:gender="user.gender"
        @close="isUpdateGenderShow = false"
      />
    </van-popup>

    <!-- 修改生日弹框 -->
    <van-popup v-model:show="isUpdateBirthdayShow" position="bottom">
      <UpdateBirthday
        v-if="isUpdateBirthdayShow"
        v-model:birthday="user.birthday"
        @close="isUpdateBirthdayShow = false"
      />
    </van-popup>

    <!-- 头像 input file -->
    <input type="file" hidden ref="inputRef" @change="onFileChange" />

    <!-- 修改头像弹框 -->
    <van-popup v-model:show="isUpdatePhotoShow" position="bottom" style="height: 100%">
      <UpdatePhoto
        v-if="isUpdatePhotoShow"
        :img="imgBlob"
        @close="isUpdatePhotoShow = false"
        @updatePhoto="updatePhotoUrl"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUserProfileAPI } from '@/api/user.ts'
import { showFailToast } from 'vant'
import UpdateName from './components/updateName.vue'
import UpdateGender from './components/updateGender.vue'
import UpdateBirthday from './components/updateBirthday.vue'
import UpdatePhoto from './components/updatePhoto.vue'

interface DataProps {
  user: Object
}

export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  props: {},
  setup() {
    const state: DataProps = reactive({ user: {} })
    const isUpdateNameShow = ref(false)
    const isUpdateGenderShow = ref(false)
    const isUpdateBirthdayShow = ref(false)
    const inputRef = ref<any>(null)
    const isUpdatePhotoShow = ref(false)
    const imgBlob = ref<any>(null)

    onBeforeMount(() => {})
    onMounted(() => {
      getUserInfo()
    })

    const router = useRouter()
    const onLeftClick = () => {
      router.back()
    }

    const getUserInfo = async () => {
      try {
        const { data } = await getUserProfileAPI()
        console.log('getUserProfileAPI : ', data)
        state.user = data.data
      } catch (error) {
        console.log('getUserProfileAPI error : ', error)
        showFailToast('获取个人信息失败！')
      }
    }

    const onFileChange = () => {
      console.log('onFileChange')
      const file = inputRef.value.files[0]
      const data = window.URL.createObjectURL(file)
      console.log('onFileChange file url: ', data)
      imgBlob.value = data
      isUpdatePhotoShow.value = true

      // 清空file-input的value，否则如果选择同一个文件不会触发change事件
      inputRef.value.value = ''
    }

    const updatePhotoUrl = (url) => {
      state.user.photo = url
    }

    return {
      ...toRefs(state),
      onLeftClick,
      isUpdateNameShow,
      isUpdateGenderShow,
      isUpdateBirthdayShow,
      inputRef,
      onFileChange,
      isUpdatePhotoShow,
      imgBlob,
      updatePhotoUrl
    }
  }
}
</script>
<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }

  :deep(.van-popup--bottom) {
    background-color: #f5f7f9;
  }
}
</style>
