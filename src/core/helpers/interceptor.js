import {
  isFn,
  isPlainObject
} from 'uni-shared'

const HOOKS = [
  'invoke',
  'success',
  'fail',
  'complete',
  'returnValue'
]

const globalInterceptors = {}
const scopedInterceptors = {}

function mergeHook (parentVal, childVal) {
  const res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal : [childVal]
    : parentVal
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  const res = []
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i])
    }
  }
  return res
}

function removeHook (hooks, hook) {
  const index = hooks.indexOf(hook)
  if (index !== -1) {
    hooks.splice(index, 1)
  }
}

function mergeInterceptorHook (interceptor, option) {
  Object.keys(option).forEach(hook => {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook])
    }
  })
}

function removeInterceptorHook (interceptor, option) {
  if (!interceptor || !option) {
    return
  }
  Object.keys(option).forEach(hook => {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook])
    }
  })
}

export function addInterceptor (method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option)
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method)
  }
}

export function removeInterceptor (method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option)
    } else {
      delete scopedInterceptors[method]
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method)
  }
}

function wrapperHook (hook) {
  return function (data) {
    return hook(data) || data
  }
}

function isPromise (obj) {
  // 存在 函数或者对象 有then函数
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

function queue (hooks, data) {
  let promise = false
  for (let i = 0; i < hooks.length; i++) {
    const hook = hooks[i]
    if (promise) {
      promise = Promise.then(wrapperHook(hook))
    } else {
      const res = hook(data)
      if (isPromise(res)) {
        promise = Promise.resolve(res)
      }
      if (res === false) {
        return {
          then () {}
        }
      }
    }
  }
  return promise || {
    then (callback) {
      return callback(data)
    }
  }
}

function wrapperOptions (interceptor, options = {}) {
  ['success', 'fail', 'complete'].forEach(name => {
    if (Array.isArray(interceptor[name])) {
      const oldCallback = options[name]
      options[name] = function callbackInterceptor (res) {
        queue(interceptor[name], res).then((res) => {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res
        })
      }
    }
  })
  return options
}

/**
 * 包裹返回值
 * @param {*} method 方法
 * @param {*} returnValue 返回值 
 */
export function wrapperReturnValue (method, returnValue) {
  const returnValueHooks = []
  // 全局拦截器的返回值是数组
  if (Array.isArray(globalInterceptors.returnValue)) {
    // 添加到返回值的hook中
    returnValueHooks.push(...globalInterceptors.returnValue)
  }
  // 作用域下的拦截器
  const interceptor = scopedInterceptors[method]
  // 存在 && 返回值为数组
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push(...interceptor.returnValue)
  }
  returnValueHooks.forEach(hook => {
    returnValue = hook(returnValue) || returnValue
  })
  return returnValue
}

function getApiInterceptorHooks (method) {
  const interceptor = Object.create(null)
  Object.keys(globalInterceptors).forEach(hook => {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice()
    }
  })
  const scopedInterceptor = scopedInterceptors[method]
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(hook => {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook])
      }
    })
  }
  return interceptor
}

export function invokeApi (method, api, options, ...params) {
  const interceptor = getApiInterceptorHooks(method)
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      const res = queue(interceptor.invoke, options)
      return res.then((options) => {
        return api(wrapperOptions(interceptor, options), ...params)
      })
    } else {
      return api(wrapperOptions(interceptor, options), ...params)
    }
  }
  return api(options, ...params)
}

export const promiseInterceptor = {
  returnValue (res) {
    if (!isPromise(res)) {
      return res
    }
    return res.then(res => {
      return res[1]
    }).catch(res => {
      return res[0]
    })
  }
}
