// 使用白名单过滤（前期有一批自定义组件使用了 uni-）
import tags from 'uni-helpers/tags'

import {
  hasLifecycleHook
} from 'uni-helpers/index'

export default function initVue(Vue) {
  // 异常捕获
  // Vue全局性的异常捕获
  Vue.config.errorHandler = function (err) {
    // getApp是否函数，调用得到app实例
    const app = typeof getApp === 'function' && getApp()
    // 有生命周期钩子函数onError
    if (app && hasLifecycleHook(app.$options, 'onError')) {
      // 调用onError钩子函数
      app.__call_hook('onError', err)
    } else {
      // 打印错误日志
      console.error(err)
    }
  }

  // 装饰器
  const oldIsReservedTag = Vue.config.isReservedTag
  // 被保留的标签
  Vue.config.isReservedTag = function (tag) {
    // 使用的标签是否是保留标签
    return tags.indexOf(tag) !== -1 || oldIsReservedTag(tag)
  }

  // 被忽略元素
  Vue.config.ignoredElements = tags
  // 获取Vue配置标签命名空间
  const oldGetTagNamespace = Vue.config.getTagNamespace
  // uniapp与html冲突标签
  const conflictTags = ['switch', 'image', 'text', 'view']

  // 获取标签的名称空间
  Vue.config.getTagNamespace = function (tag) {
    // ~ -1 为 0, 冲突标签返回false,没有名称空间
    if (~conflictTags.indexOf(tag)) { // svg 部分标签名称与 uni 标签冲突
      return false
    }
    // 老的获取标签命名空间的方法
    return oldGetTagNamespace(tag) || false
  }
}
