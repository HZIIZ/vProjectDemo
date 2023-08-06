import axios from 'axios'
import store from '@/store/index'

// 新版API：http://toutiao.itheima.net/api.html

const request = axios.create({
  // baseURL: 'https://toutiao-app.itheima.net/'
  // baseURL: 'http://ttapi.research.itcast.cn/'
  baseURL: 'https://toutiao.itheima.net'
})

// 请求拦截器
request.interceptors.request.use(
  function (config: any) {
    console.log('request.interceptor.request config:', config)

    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error: any) {
    console.log('request.interceptor.request error:', error)
    return Promise.reject(error)
  }
)

// 相应拦截器

export default request
