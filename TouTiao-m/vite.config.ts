import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import autoprefixer from 'autoprefixer'
import postCssPxToRem from 'postcss-pxtorem'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '192.168.31.204',
    port: 8888
  },
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [VantResolver()]
    })
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8']
        }),
        postCssPxToRem({
          // 自适应，px>rem转换
          // rootValue: 75,
          // // 75表示750设计稿，37.5表示375设计稿
          rootValue({ file }) {
            // // 如果是vant的样式，使用375设计稿
            // if (file.includes('/vant/')) {
            //   return 37.5
            // }
            // // 如果是其他的样式，使用750设计稿
            // return 75

            return file.indexOf('/vant/') !== -1 ? 37.5 : 75
          },
          propList: ['*'],
          // 需要转换的属性，这里选择全部都进行转换
          selectorBlackList: ['norem'],
          // 过滤掉norem-开头的class，不进行rem转换
          exclude: /github-markdown/
          // 排查 github-markdown 文件，不转换rem
        })
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
