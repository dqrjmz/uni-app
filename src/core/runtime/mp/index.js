import Vue from 'vue'

import {
  parsePage
} from './parser/page-parser'

import {
  parseComponent
} from './parser/component-parser'

import {
  handleRelations
} from './polyfill/relations'

import polyfill from './polyfill/index'

// 全局添加路由属性
global.__wxRoute = ''
// 全局添加组建属性
global.__wxComponents = Object.create(null)
// 全局添加配置属性
global.__wxVueOptions = Object.create(null)

export function Page (options) {
  // 解析页面的配置对像
  const pageOptions = parsePage(options)
  // 页面的mixins数组添加补丁
  pageOptions.mixins.unshift(polyfill)

  // 将路由属性添加到
  pageOptions.mpOptions.path = global.__wxRoute
  global.__wxComponents[global.__wxRoute] = pageOptions
}

function initRelationsHandler (vueComponentOptions) {
  // linked 需要在当前组件 attached 之后再执行
  if (!vueComponentOptions.onServiceAttached) {
    vueComponentOptions.onServiceAttached = []
  }
  vueComponentOptions.onServiceAttached.push(function onServiceAttached () {
    handleRelations(this, 'linked')
  })
}

/**
 * 自定义组件
 * @param {*} options 组件配置信息
 */
export function Component (options) {
  // 解析组件配置参数
  const componentOptions = parseComponent(options)
  // 给组件混入补丁程序
  componentOptions.mixins.unshift(polyfill)
  // 给组件添加路由属性
  componentOptions.mpOptions.path = global.__wxRoute
  //
  initRelationsHandler(componentOptions)
  global.__wxComponents[global.__wxRoute] = componentOptions
}

export function Behavior (options) {
  return options
}

// 导出Vue中的nextTick方法
export const nextTick = Vue.nextTick

export default uni.__$wx__
