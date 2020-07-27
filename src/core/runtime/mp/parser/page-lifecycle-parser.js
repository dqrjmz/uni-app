import {
  PAGE_LIFECYCLE
} from '../constants'

export function parsePageLifecycle (mpComponentOptions, vueComponentOptions) {
  // 小程序组件的配置选项
  Object.keys(mpComponentOptions).forEach(key => {
    // 生命周期中存在这个方法
    if (PAGE_LIFECYCLE.indexOf(key) !== -1) {
      // 定义到vue组件上，小程序组件的生命周期
      vueComponentOptions[key] = mpComponentOptions[key]
    }
  })
}
