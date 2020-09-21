// 系统异步加载  系统异步错误
const components = ['SystemAsyncLoading', 'SystemAsyncError']
/**
 * 是否是页面
 * @param {*} vm 组件
 */
export function isPage (vm) {
  // 组件有父组件 并且 父组件的名称为PageBody
  if (vm.$parent && vm.$parent.$options.name === 'PageBody') {
    // 组件的名称在components数组中
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

/**
 * 序列化dataSet = {}
 * @param {*} dataset
 */
export function normalizeDataset (dataset = {}) {
  // ios8.x,9.x Object.assign({},dataset) 始终返回 {}
  // http://ask.dcloud.net.cn/question/70246
  // 对对象进行深拷贝
  const result = JSON.parse(JSON.stringify(dataset))
  // h5平台
  if (__PLATFORM__ === 'h5') {
    // 获取对象的键数组
    const keys = Object.keys(result)
    // 获取对象的长度
    const len = keys.length
    if (len) {
      // remove data-v-
      // 遍历键数组
      for (let i = 0; i < len; i++) {
        // 获取键
        const key = keys[i]
        // 键的字符长度
        const len = key.length
        // 获取第一个字串=== 'v' 并且长度为9 或者 10
        if (key.substr(0, 1) === 'v' && (len === 9 || len === 10)) {
          // 删除这个属性
          delete result[key]
          break
        }
      }
    }
  }
  // 返回修改过的对象
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

export function findExistsPageIndex (url) {
  const pages = getCurrentPages()
  let len = pages.length
  while (len--) {
    const page = pages[len]
    if (page.$page && page.$page.fullPath === url) {
      return len
    }
  }
  return -1
}
