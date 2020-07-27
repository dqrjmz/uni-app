import {
  cached,
  camelize
} from 'uni-shared'

// 装饰者模式，保存对象
// 小程序中的全局变量
const MPPage = Page
const MPComponent = Component

// 自定义正则
const customizeRE = /:/g

const customize = cached((str) => {
  // 将 : 转换为 -
  return camelize(str.replace(customizeRE, '-'))
})

function initTriggerEvent (mpInstance) {
  if (__PLATFORM__ === 'mp-weixin' || __PLATFORM__ === 'app-plus') {
    // nextTick不能使用,直接返回
    if (!wx.canIUse('nextTick')) {
      return
    }
  }
  const oldTriggerEvent = mpInstance.triggerEvent
  mpInstance.triggerEvent = function (event, ...args) {
    return oldTriggerEvent.apply(mpInstance, [customize(event), ...args])
  }
}

/**
 * 初始化钩子函数
 * @param {*} name 
 * @param {*} options 
 */
function initHook (name, options) {
  const oldHook = options[name]
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this)
    }
  } else {
    options[name] = function (...args) {
      initTriggerEvent(this)
      return oldHook.apply(this, args)
    }
  }
}

/**
 * options 页面中的参数
 * 修改对象
 */
Page = function (options = {}) {
  // 生命周期已经初始化好了
  initHook('onLoad', options)
  return MPPage(options)
}

/**
 * 组件的创建
 */
Component = function (options = {}) {
  // 调用创建完成钩子函数
  initHook('created', options)
  return MPComponent(options)
}
