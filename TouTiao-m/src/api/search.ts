/**
 * 搜索模块
 */

import request from '@/utils/request'
/*
 * 获取联想建议
 */
export const querySuggestionAPI = (q: string) => {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}

/*
 * 获取搜索结果
 */
export const querySearchResultAPI = (params: any) => {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params
  })
}
