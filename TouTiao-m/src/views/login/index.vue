<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录/注册">
      <template #left>
        <van-icon name="cross" @click="onGoBack" />
      </template>
    </van-nav-bar>
    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        name="vmobile"
        v-model="user.mobile"
        placeholder="请输入手机号"
        type="number"
        maxlength="11"
        :rules="userFormRules.mobile"
      >
        <!-- 使用van-field 插槽 配置左侧图标 -->
        <template #left-icon>
          <i class="iconfont icon-shouji"></i>
        </template>
      </van-field>
      <van-field
        v-model="user.code"
        name="vcode"
        placeholder="请输入验证码"
        type="number"
        maxlength="6"
        :rules="userFormRules.code"
      >
        <!-- 使用van-field 插槽 配置左侧图标 -->
        <template #left-icon>
          <i class="iconfont icon-yanzhengma"></i>
        </template>
        <!-- 使用van-field 插槽 配置右侧按钮 -->
        <template #button>
          <!-- 倒计时组件 -->
          <van-count-down
            :time="1000 * 60"
            format="ss s后重发"
            v-if="isCountDownShow"
            @finish="onCountDownFinish"
          />
          <!-- 表单中除了提交按钮外，其他功能按钮注意将 native-type="button"，否则会触发表单提交 -->
          <van-button
            v-else
            class="send-sms-btn"
            native-type="button"
            round
            size="small"
            type="default"
            @click="onSmsSubmit"
            >获取验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="primary" native-type="submit"> 登录 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import { LoginAPI, SendSmsAPI } from '@/api/user'
import { showLoadingToast, showSuccessToast, showFailToast, FormInstance } from 'vant'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginIndex',
  setup(props: any) {
    console.log('LoginIndex: ', props)
    const store = useStore()
    console.log(store)

    const loginForm = ref<FormInstance>()
    const user = reactive({
      mobile: '13911111111',
      code: '246810'
    })
    const userFormRules = reactive({
      mobile: [
        { required: true, message: '手机号不能为空' },
        { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
      ],
      code: [
        { required: true, message: '验证码不能为空' },
        { pattern: /^\d{6}$/, message: '验证码格式错误' }
      ]
    })
    // 是否展示倒计时
    const isCountDownShow = ref(false)

    async function onSmsSubmit() {
      console.log('onSmsSubmit')
      // 校验手机号码
      try {
        await loginForm?.value?.validate('vmobile')
        console.log('校验通过')
      } catch (error) {
        console.log('校验失败：', error)
        return
      }

      isCountDownShow.value = true

      showLoadingToast({
        message: '发送中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 默认2000自动消失，为0则不会消失
      })

      try {
        const res = await SendSmsAPI(user.mobile)
        console.log('发送成功：', res)
        showSuccessToast('发送成功')
      } catch (error) {
        isCountDownShow.value = false
        if (error.response.status === 404 || error.response.status === 429) {
          showFailToast(
            '发送失败：' + (error.response.data?.message || '手机号不正确、接口访问次数受限')
          )
        } else {
          showFailToast('发送失败：未知错误，请稍后重试')
        }
      }
    }

    function onCountDownFinish() {
      isCountDownShow.value = false
    }

    async function onSubmit(values: any) {
      console.log('onSubmit: ', values)

      showLoadingToast({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 默认2000自动消失，为0则不会消失
      })

      console.log(user.mobile, user.code)
      try {
        const res = await LoginAPI({ ...user })
        console.log('登录成功：', res)
        store.commit('setUser', res?.data?.data || {})
        showSuccessToast('登录成功')
        // 登录成功返回上一页，但这种处理不严谨
        onGoBack()
      } catch (error) {
        console.log('登录失败：', error)
        if (error.response.status === 400) {
          showFailToast(
            '登录失败：' +
              (error.response.data?.message || '参数缺失、手机号格式不正确、验证码失效')
          )
        } else {
          showFailToast('登录失败：未知错误，请稍后重试')
        }
      }
    }

    const router = useRouter()
    function onGoBack() {
      // router.go(-1)
      router.back()
    }

    return {
      loginForm,
      user,
      userFormRules,
      onSmsSubmit,
      onSubmit,
      isCountDownShow,
      onCountDownFinish,
      onGoBack
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .iconfont {
    font-size: 37px;
  }

  .send-sms-btn {
    width: 152px;
    height: 46px;
    background-color: #ededed;
    font-size: 22px;
    line-height: 46px;
    color: #666;
  }

  .login-btn-wrap {
    margin: 53px 33px;

    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
