import Vue from 'vue'

import initSubscribe from './subscribe'

// 事件句柄
const Emitter = new Vue()

// 将方法的this 绑定为 Emitter 对象
export const on = Emitter.$on.bind(Emitter)
export const off = Emitter.$off.bind(Emitter)
export const once = Emitter.$once.bind(Emitter)
export const emit = Emitter.$emit.bind(Emitter)

/**
 * 订阅事件
 * @param {*} event 事件名
 * @param {*} callback 事件回调
 */
export function subscribe (event, callback) {
  return on('service.' + event, callback)
}

/**
 * 取消订阅
 * @param {*} event 事件名
 * @param {*} callback 事件回调
 */
export function unsubscribe (event, callback) {
  return off('service.' + event, callback)
}

/**
 * 触发事件
 * @param {*} event
 * @param {*} args
 * @param {*} pageId
 */
export function subscribeHandler (event, args, pageId) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[subscribeHandler][${Date.now()}]:${event}, ${JSON.stringify(args)}, ${pageId}`)
  }
  emit('service.' + event, args, pageId)
}

export {
  publishHandler
}
  from 'uni-platform/view/bridge'

initSubscribe(subscribe)
