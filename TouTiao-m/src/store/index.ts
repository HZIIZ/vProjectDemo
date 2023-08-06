import { createStore } from 'vuex'
import { getItem, setItem } from '@/utils/storage'

const TOKEN_KEY = 'TOUTIAO_USER'

export default createStore({
  // 存储所有全局数据
  state: {
    // 一个对象，存储当前登录用户的信息（Token 等数据）
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY) || '{}')
    user: getItem(TOKEN_KEY)
  },
  getters: {},
  // 定义对state的各种操作
  mutations: {
    setUser(state: any, data: any) {
      state.user = data

      // 防止数据丢失，需要做本地持久化
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
