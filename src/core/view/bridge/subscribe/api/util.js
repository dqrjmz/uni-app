function findVmById (id, vm) {
  // 组件实例的id 与传入的id 相同
  if (id === vm._$id) {
    // 是要找的组件实例
    return vm
  }
  // 组件实例的子元素
  const childVms = vm.$children
  // 子组件的数量
  const len = childVms.length
  for (let i = 0; i < len; i++) {
    // 向下找，到子组件下找（递归查找
    const childVm = findVmById(id, childVms[i])
    // 找到就返回
    if (childVm) {
      return childVm
    }
  }
}
/**
 * 找元素
 * @param {*} component
 * @param {*} pageVm
 */
export function findElm (component, pageVm) {
  if (!pageVm) {
    // 页面没有准备好
    return console.error('page is not ready')
  }
  // 没有组件
  if (!component) {
    return pageVm.$el
  }
  // app-plus平台
  if (__PLATFORM__ === 'app-plus') {
    // 组件名
    if (typeof component === 'string') {
      // 通过找组件实例
      const componentVm = findVmById(component, pageVm)
      // 没有，提示页面不存在
      if (!componentVm) {
        throw new Error(`Not Found：Page[${pageVm.$page.id}][${component}]`)
      }
      // 获取组件的元素
      return componentVm.$el
    }
  }
  return component.$el
}
