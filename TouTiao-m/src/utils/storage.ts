/*
 * 封装本地存储操作模块
 */

/*
 * 存储数据
 */
export const setItem = (key: string, value: any) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

/*
 * 获取数据
 */
export const getItem = (key: string) => {
  const value = window.localStorage.getItem(key)
  if (typeof value !== 'string') {
    return value
  }

  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}

/*
 * 删除数据
 */
export const removeItem = (key: string) => {
  window.localStorage.removeItem(key)
}
