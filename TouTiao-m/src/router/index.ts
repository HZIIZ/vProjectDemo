import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/',
      // name: 'layout',
      component: () => import('@/views/layout/index.vue'),
      children: [
        {
          path: '', // 默认子路由，只能有一个
          redirect: '/home'
        },
        {
          path: '/home', // 默认子路由，只能有一个
          name: 'home',
          component: () => import('@/views/home/index.vue')
        },
        {
          path: '/qa',
          name: 'qa',
          component: () => import('@/views/qa/index.vue')
        },
        {
          path: '/video',
          name: 'video',
          component: () => import('@/views/video/index.vue')
        },
        {
          path: '/my',
          name: 'my',
          component: () => import('@/views/my/index.vue')
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/search/index.vue')
    },
    {
      path: '/article/:articleId',
      name: 'article',
      component: () => import('@/views/article/index.vue'),
      props: true // 开启将路由参数 映射到 props里面
    },
    {
      path: '/user/profile',
      name: 'userProfile',
      component: () => import('@/views/userProfile/index.vue')
    }
  ]
})

export default router
