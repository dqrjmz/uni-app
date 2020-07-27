/**
 * 给元素添加监听
 * @param {*} element 
 * @param {*} type 
 * @param {*} callback 
 * @param {*} capture 
 */
const addListenerToElement = function (element, type, callback, capture) {
  // 暂时忽略 capture
  // 
  element.addEventListener(type, $event => {
    // 回调时函数
    if (typeof callback === 'function') {
      // 调用函数返回false,调用阻止默认事件，和事件冒泡
      if (callback($event) === false) {
        $event.preventDefault()
        $event.stopPropagation()
      }
    }
  }, {
    passive: false
  })
}

export default {
  beforeDestroy () {
    // 卸载事件监听，movsemove
    document.removeEventListener('mousemove', this.__mouseMoveEventListener)
    document.removeEventListener('mouseup', this.__mouseUpEventListener)
  },
  methods: {
    /**
     * 手势追踪
     * @param {*} element 元素
     * @param {*} method 方法
     * @param {*} useCancel 
     */
    touchtrack: function (element, method, useCancel) {
      const self = this
      let x0 = 0
      let y0 = 0
      let x1 = 0
      let y1 = 0
      const fn = function ($event, state, x, y) {
        // 元素
        if (self[method]({
          // 事件目标
          target: $event.target,
          // 当前事件目标
          currentTarget: $event.currentTarget,
          // 阻止默认事件
          preventDefault: $event.preventDefault.bind($event),
          // 阻止冒泡
          stopPropagation: $event.stopPropagation.bind($event),
          // 事件触摸点
          touches: $event.touches,
          // 触摸点更改
          changedTouches: $event.changedTouches,
          // 
          detail: {
            state,
            x0: x,
            y0: y,
            dx: x - x0,
            dy: y - y0,
            ddx: x - x1,
            ddy: y - y1,
            timeStamp: $event.timeStamp
          }
        }) === false) {
          return false
        }
      }

      let $eventOld = null
      let hasTouchStart
      let hasMouseDown
      // 给元素添加触摸开始事件
      addListenerToElement(element, 'touchstart', function ($event) {
        hasTouchStart = true
        // 触摸点数量===1 && $eventOld 不存在
        if ($event.touches.length === 1 && !$eventOld) {
          // 将事件赋值给 $eventOld 
          $eventOld = $event
          // 获取触摸点的坐标
          x0 = x1 = $event.touches[0].pageX
          y0 = y1 = $event.touches[0].pageY
          // 
          return fn($event, 'start', x0, y0)
        }
      })
      // 鼠标按下
      addListenerToElement(element, 'mousedown', function ($event) {
        hasMouseDown = true
        if (!hasTouchStart && !$eventOld) {
          // TODO touches changedTouches
          $eventOld = $event
          x0 = x1 = $event.pageX
          y0 = y1 = $event.pageY
          return fn($event, 'start', x0, y0)
        }
      })
      // 手势移动
      addListenerToElement(element, 'touchmove', function ($event) {
        // 只有一个手势 存在 $eventOld
        if ($event.touches.length === 1 && $eventOld) {
          // 
          const res = fn($event, 'move', $event.touches[0].pageX, $event.touches[0].pageY)
          // 获取触摸点的坐标
          x1 = $event.touches[0].pageX
          y1 = $event.touches[0].pageY
          return res
        }
      })
      // 鼠标移动事件监听
      const mouseMoveEventListener = this.__mouseMoveEventListener = function ($event) {
        // 没有开始触摸事件 && 有鼠标按下 && 
        if (!hasTouchStart && hasMouseDown && $eventOld) {
          // TODO target currentTarget touches changedTouches
          const res = fn($event, 'move', $event.pageX, $event.pageY)
          // 获取事件对象的坐标点
          x1 = $event.pageX
          y1 = $event.pageY
          return res
        }
      }
      // 注册鼠标移动事件
      document.addEventListener('mousemove', mouseMoveEventListener)
      // 添加touchend事件
      addListenerToElement(element, 'touchend', function ($event) {
        // 没有触摸点 && 
        if ($event.touches.length === 0 && $eventOld) {
          // 清理变量
          hasTouchStart = false
          $eventOld = null
          return fn($event, 'end', $event.changedTouches[0].pageX, $event.changedTouches[0].pageY)
        }
      })
      // 鼠标抬起事件监听
      const mouseUpEventListener = this.__mouseUpEventListener = function ($event) {
        // 鼠标按下为false
        hasMouseDown = false
        // 没有触摸开始 && 
        if (!hasTouchStart && $eventOld) {
          // TODO target currentTarget touches changedTouches
          $eventOld = null
          return fn($event, 'end', $event.pageX, $event.pageY)
        }
      }
      // 注册 mouseup 事件
      document.addEventListener('mouseup', mouseUpEventListener)
      // 添加touchcancel事件监听
      addListenerToElement(element, 'touchcancel', function ($event) {
        if ($eventOld) {
          hasTouchStart = false
          const $eventTemp = $eventOld
          $eventOld = null
          return fn($event, useCancel ? 'cancel' : 'end', $eventTemp.touches[0].pageX, $eventTemp.touches[0].pageY)
        }
      })
    }
  }
}
