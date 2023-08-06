/**
 * 频道请求模块
 */

import request from '@/utils/request'

/**
 * 查询所有频道
 */
export const queryAllChannelsAPI = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}

/**
 * 添加用户频道
 */
export const addUserChannelAPI = (channel: any) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: { channels: [channel] }
  })
}

/**
 * 删除指定用户频道
 */
export const deleteUserChannelAPI = (channelId: string) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channelId}`
  })
}
