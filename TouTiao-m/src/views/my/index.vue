<template>
  <div class="my-container">
    <div class="header user-info" v-if="user">
      <div class="base-info">
        <div class="left">
          <van-image class="avater" round fit="cover" :src="userInfo.photo" />
          <span class="nickname">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" round to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <div class="data-states">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <div class="header not-login" v-else>
      <div class="login-btn" @click="onPushLogin">
        <img class="mobile-img" src="@/assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <van-grid class="grid-nav" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <template #icon>
          <i class="iconfont icon-shoucang"></i>
        </template>
        <template #text>
          <span class="text">收藏</span>
        </template>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <template #icon>
          <i class="iconfont icon-lishi"></i>
        </template>
        <template #text>
          <span class="text">历史</span>
        </template>
      </van-grid-item>
    </van-grid>
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link />
    <van-cell v-if="user" title="退出登录" class="logout-cell" clickable @click="onLogout" />
  </div>
</template>

<script lang="ts">
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { showConfirmDialog, showFailToast } from 'vant'
import { getUserInfoAPI } from '@/api/user'

interface UserInfoItem {
  userInfo: {
    art_count?: number
    fans_count?: number
    follow_count?: number
    id?: string
    intro?: string
    like_count?: number
    name?: string
    photo?: string
  }
}

export default {
  name: 'MyIndex',
  setup(props: any, ctx: any) {
    console.log('MyIndex: ', props, ctx)
    const store = useStore()
    const user = computed(() => store.state.user)
    const userData = reactive<UserInfoItem>({
      userInfo: {}
    })

    const router = useRouter()
    function onPushLogin() {
      router.push('/login')
    }

    function onLogout() {
      showConfirmDialog({
        title: '退出登录？',
        message: '是否确定退出登录'
      })
        .then(() => {
          // on confirm
          console.log('on confirm')
          // 清除用户信息
          store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
          console.log('on cancel')
        })
    }

    async function getUserInfo() {
      try {
        const res = await getUserInfoAPI()
        console.log('getUserInfo: ', res)
        userData.userInfo = res.data.data
      } catch (error) {
        console.log('getUserInfo: ', error)
        showFailToast('获取用户信息失败')
      }
    }

    onMounted(() => {
      if (user.value) {
        getUserInfo()
      }
    })

    return {
      onPushLogin,
      onLogout,
      user,
      ...toRefs(userData)
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url('@/assets/banner.png');
    background-size: cover;
  }

  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }

      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .user-info {
    .base-info {
      box-sizing: border-box;
      height: 231px;
      padding: 76px 32px 23px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        align-items: center;
        .avater {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
        }

        .nickname {
          padding-left: 23px;
          font-size: 30px;
          color: #fff;
        }
      }
    }

    .data-states {
      height: 130px;
      display: flex;

      .data-item {
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        color: #fff;
        .count {
          font-size: 36px;
          margin-bottom: 5px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav {
    margin-bottom: 9px;
    .grid-item {
      height: 141px;

      i.iconfont {
        font-size: 45px;
      }
      .icon-shoucang {
        color: #eb5253;
      }
      .icon-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }

  .logout-cell {
    margin-top: 9px;
    text-align: center;
    color: #d86262;
  }
}
</style>
