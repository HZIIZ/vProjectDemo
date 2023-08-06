import dayjs from 'dayjs'
// 加载中文语言包
import 'dayjs/locale/zh-cn'

// 配置处理相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

// 更改全局的语言配置：默认是英文-en，改为中文
dayjs.locale('zh-cn')

export const relativeTimeAPI = (dateString: string) => {
  return dayjs().to(dayjs(dateString))
}

export const getCurrentDateAPI = (format: string = 'YYYY-MM-DD') => {
  const date = new Date()
  return dayjs(date).format(format)
}
