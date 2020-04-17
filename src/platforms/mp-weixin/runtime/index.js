import {
  cached,
  camelize
} from 'uni-shared'

// 装饰者模式，保存对象
// 小程序中的全局变量
const MPPage = Page
const MPComponent = Component

const customizeRE = /:/g

const customize = cached((str) => {
  return camelize(str.replace(customizeRE, '-'))
})

function initTriggerEvent (mpInstance) {
  if (__PLATFORM__ === 'mp-weixin' || __PLATFORM__ === 'app-plus') {
    if (!wx.canIUse('nextTick')) {
      return
    }
  }
  const oldTriggerEvent = mpInstance.triggerEvent
  mpInstance.triggerEvent = function (event, ...args) {
    return oldTriggerEvent.apply(mpInstance, [customize(event), ...args])
  }
}

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
  initHook('onLoad', options)
  return MPPage(options)
}

Component = function (options = {}) {
  initHook('created', options)
  return MPComponent(options)
}
