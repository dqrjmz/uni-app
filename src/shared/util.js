const _toString = Object.prototype.toString
const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * 数值小于10添加0，大于9.原值返回
 * @param {*} value
 */
const _completeValue = value => {
  return value > 9 ? value : ('0' + value)
}

// 是否是函数
export function isFn (fn) {
  return typeof fn === 'function'
}

// 是否是字符串
export function isStr (str) {
  return typeof str === 'string'
}

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

// 是否有自己属性
export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

export function noop () { }

// 获取数据的类型
export function toRawType (val) {
  return _toString.call(val).slice(8, -1)
}

/**
 * Create a cached version of a pure function.
 * 使用闭包，缓存数据
 */
export function cached (fn) {
  // 创建一个没有原型链的对象
  const cache = Object.create(null)
  return function cachedFn (str) {
    // 获取当前属性的值
    const hit = cache[str]
    // 值存在返回，不存在，进行添加
    return hit || (cache[str] = fn(str))
  }
}

/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g
export const camelize = cached((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

/**
 * Capitalize a string.
 */
export const capitalize = cached((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

export function setProperties (item, props, propsData) {
  props.forEach(function (name) {
    if (hasOwn(propsData, name)) {
      item[name] = propsData[name]
    }
  })
}

export function getLen (str = '') {
  /* eslint-disable no-control-regex */
  // 16进制从 x00 - xff
  return ('' + str).replace(/[^\x00-\xff]/g, '**').length
}

/**
 * 格式化日期时间
 * @param {Date} date 日期对象
 * @param {string} mode 模式
 */
export function formatDateTime ({
  date = new Date(),
  mode = 'date'
}) {
  // 时间 10:10:10
  if (mode === 'time') {
    // 获取日期小时  获取日期分钟
    return _completeValue(date.getHours()) + ':' + _completeValue(date.getMinutes())
  } else {
    // 日期
    // 获取年份  获取月份  获取日期
    return date.getFullYear() + '-' + _completeValue(date.getMonth() + 1) + '-' + _completeValue(date.getDate())
  }
}

/**
 * 更新元素的样式
 * @param {*} element dom对象
 * @param {*} styles 样式配置对象
 */
export function updateElementStyle (element, styles) {
  // 遍历样式配置对象
  for (const attrName in styles) {
    // 给dom对象添加样式
    element.style[attrName] = styles[attrName]
  }
}

/**
 * 生成唯一码
 */
export function guid () {
  // 对4294967296 乘以 （0 1） 向下取整 然后转为16进制
  return Math.floor(4294967296 * (1 + Math.random())).toString(16).slice(1)
}

/**
 * 防抖
 * @param {*} fn
 * @param {*} delay
 */
export function debounce (fn, delay) {
  let timeout

  const newFn = function () {
    clearTimeout(timeout)
    // 包装
    const timerFn = () => fn.apply(this, arguments)
    // 开启延迟调用
    timeout = setTimeout(timerFn, delay)
  }
  newFn.cancel = function () {
    clearTimeout(timeout)
  }
  return newFn
}

export function throttle (fn, wait) {
  let last = 0
  let timeout
  let waitCallback
  const newFn = function (...arg) {
    const now = Date.now()
    clearTimeout(timeout)
    waitCallback = () => {
      waitCallback = null
      last = now
      fn.apply(this, arg)
    }
    if (now - last < wait) {
      timeout = setTimeout(waitCallback, wait - (now - last))
      return
    }
    waitCallback()
  }
  newFn.cancel = function () {
    clearTimeout(timeout)
    waitCallback = null
  }
  newFn.flush = function () {
    clearTimeout(timeout)
    waitCallback && waitCallback()
  }
  return newFn
}

/**
 * 将大写改为小写
 * @param {*} string
 */
export function kebabCase (string) {
  return string.replace(/[A-Z]/g, str => '-' + str.toLowerCase())
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
export function looseEqual (a, b) {
  if (a === b) return true
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  if (isObjectA && isObjectB) {
    try {
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every((e, i) => {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        return keysA.length === keysB.length && keysA.every(key => {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

export function deepClone (vnodes, createElement) {
  function cloneVNode (vnode) {
    var clonedChildren = vnode.children && vnode.children.map(cloneVNode)
    var cloned = createElement(vnode.tag, vnode.data, clonedChildren)
    cloned.text = vnode.text
    cloned.isComment = vnode.isComment
    cloned.componentOptions = vnode.componentOptions
    cloned.elm = vnode.elm
    cloned.context = vnode.context
    cloned.ns = vnode.ns
    cloned.isStatic = vnode.isStatic
    cloned.key = vnode.key
    return cloned
  }

  return vnodes.map(cloneVNode)
}

export * from './uni-id-mixin'
