import {
  isFn
} from 'uni-shared'

import {
  PAGE_LIFECYCLE
} from '../constants'

export function parsePageMethods (mpComponentOptions, vueComponentOptions) {
  const methods = Object.create(null)
  // 获取小程序组件的选项键集合
  Object.keys(mpComponentOptions).forEach(key => {
    // 获取键的值
    const value = mpComponentOptions[key]
    // 是函数 && 生命周期中没有这个方法
    if (isFn(value) && PAGE_LIFECYCLE.indexOf(key) === -1) {
      methods[key] = value
    }
  })
  // 将小程序的用户自定义方法添加到vue组件的用户自定义方法
  vueComponentOptions.methods = methods
}
