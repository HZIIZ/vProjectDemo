import axios from 'axios'

const request = axios.create({
  baseURL: 'https://ttapi.research.itcast.cn/'
})

// 请求拦截器

// 相应拦截器

export default request
