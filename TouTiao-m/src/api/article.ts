/*
 * 文章请求模块
 */
import request from '@/utils/request'

/*
 * 查询文章列表
 */
export const queryArticleListAPI = (params: any) => {
  return request({
    method: 'GET',
    url: '/v1_0/articles',
    params
  })
}

/*
 * 查询文章详情
 */
export const queryArticleDetailAPI = (article_id: string) => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${article_id}`
  })
}

/*
 * 收藏文章
 */
export const addCollectionArticleAPI = (target: string) => {
  return request({
    method: 'POST',
    url: `/v1_0/article/collections`,
    data: {
      target
    }
  })
}

/*
 * 取消收藏文章
 */
export const deleteCollectionArticleAPI = (target: string) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}

/*
 * 对文章点赞
 */
export const addLikeArticleAPI = (target: string) => {
  return request({
    method: 'POST',
    url: `/v1_0/article/likings`,
    data: {
      target
    }
  })
}

/*
 * 取消对文章点赞
 */
export const deleteLikeArticleAPI = (target: string) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${target}`
  })
}
