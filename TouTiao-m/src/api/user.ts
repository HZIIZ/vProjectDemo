/*
 * 用户相关请求模块
 */
import request from '@/utils/request'
// import store from '@/store/index'

export const LoginAPI = (params: any) => {
  return request({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/v1_0/authorizations',
    data: params
  })
}

/*
 * 发送短信验证码
 */
export const SendSmsAPI = (mobile: string) => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}

/*
 * 获取用户自己信息
 */
export const getUserInfoAPI = () => {
  return request({
    method: 'GET',
    url: `/v1_0/user`
    // headers: {
    //   Authorization: `Bearer ${store.state?.user?.token || ''}`
    // }
  })
}

/*
 * 获取用户频道列表
 */
export const getUserChannelsAPI = () => {
  return request({
    method: 'GET',
    url: `/v1_0/user/channels`
  })
}

/*
 * 关注用户
 */
export const addFollowingsAPI = (target: string) => {
  return request({
    method: 'POST',
    url: `/v1_0/user/followings`,
    data: {
      target
    }
  })
}

/*
 * 取消关注用户
 */
export const deleteFollowingsAPI = (target: string) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${target}`
  })
}

/*
 * 获取用户个人资料
 */
export const getUserProfileAPI = () => {
  return request({
    method: 'GET',
    url: `/v1_0/user/profile`
  })
}

/*
 * 编辑用户个人资料
 */
export const updateUserProfileAPI = (data: any) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}

/*
 * 编辑用户照片资料（头像、身份证照片）
 */
export const updateUserPhotoAPI = (data: any) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data
  })
}
