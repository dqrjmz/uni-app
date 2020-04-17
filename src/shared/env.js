export let supportsPassive = false
try {
  const opts = {}
  // 给opts对象设置访问器属性 passive
  Object.defineProperty(opts, 'passive', ({
    get () {
      /* istanbul ignore next */
      supportsPassive = true
    }
  })) // https://github.com/facebook/flow/issues/285
  // 给window绑定text-passive事件，
  /**
   * {
   *  capture: true,
   *  once: true
   *  passive: true 监听器永远不会调用preventDefault()，阻止默认事件；
   * }
   */
  window.addEventListener('test-passive', null, opts)
} catch (e) {}
