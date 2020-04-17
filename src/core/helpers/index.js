const components = ['SystemAsyncLoading', 'SystemAsyncError']
export function isPage (vm) {
  if (vm.$parent && vm.$parent.$options.name === 'PageBody') {
    if (components.indexOf(vm.$options.name) !== -1) {
      return false
    }
    return true
  }
  return false
}

/**
 * 是否存在当前的钩子函数
 * @param {object} vueOptions 组件的配置对象
 * @param {string} hook 钩子函数
 */
export function hasLifecycleHook (vueOptions = {}, hook) {
  // 此钩子函数是否存在任务列表 长度不能为0
  return Array.isArray(vueOptions[hook]) && vueOptions[hook].length
}

export function normalizeDataset (dataset = {}) {
  // ios8.x,9.x Object.assign({},dataset) 始终返回 {}
  // http://ask.dcloud.net.cn/question/70246
  const result = JSON.parse(JSON.stringify(dataset))
  if (__PLATFORM__ === 'h5') {
    const keys = Object.keys(result)
    const len = keys.length
    if (len) {
      // remove data-v-
      for (let i = 0; i < len; i++) {
        const key = keys[i]
        const len = key.length
        if (key.substr(0, 1) === 'v' && (len === 9 || len === 10)) {
          delete result[key]
          break
        }
      }
    }
  }
  return result
}

/**
 * 将upx 转换到px
 * @param {} str 
 */
export function upx2px (str) {
  str = str + ''
  // 字符串中找到upx
  if (str.indexOf('upx') !== -1) { // upx转换
    // 转换为整型，只转换从开始位置找到的数值
    return uni.upx2px(parseInt(str) || 0)
  }
  // 没有带着upx后缀，将字符串直接进行转换
  return parseInt(str) || 0
}
