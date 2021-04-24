let id = 0
const callbacks = {}

// 装饰者模式
function warp (fn) {
  return function (options = {}) {
    // 回调函数id
    const callbackId = String(id++)
    // 缓存回调函数
    callbacks[callbackId] = {
      success: options.success,
      fail: options.fail,
      complete: options.complete
    }
    //  浅拷贝 options
    const data = Object.assign({}, options)
    // TODO 下版重构 nvue h5 callback
    // delete data.success
    // delete data.fail
    // delete data.complete
    // 调用包装函数
    const res = fn.bind(this)(data, callbackId)
    if (res) {
      invoke(callbackId, res)
    }
  }
}

function invoke (callbackId, res) {
  const callback = callbacks[callbackId] || {}
  delete callbacks[callbackId]
  const errMsg = res.errMsg || ''
  if (new RegExp('\\:\\s*fail').test(errMsg)) {
    callback.fail && callback.fail(res)
  } else {
    callback.success && callback.success(res)
  }
  callback.complete && callback.complete(res)
}

export const callback = {
  warp,
  invoke
}
