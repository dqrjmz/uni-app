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

global['__wxRoute'] = ''
global['__wxComponents'] = Object.create(null)
global['__wxVueOptions'] = Object.create(null)

export function Page (options) {
  // 解析页面的配置对像
  const pageOptions = parsePage(options)
  // 给mixins添加腻子脚本
  // vue组件生命周期
  pageOptions.mixins.unshift(polyfill)
  pageOptions.mpOptions.path = global['__wxRoute']
  global['__wxComponents'][global['__wxRoute']] = pageOptions
}

function initRelationsHandler (vueComponentOptions) {
  // linked 需要在当前组件 attached 之后再执行
  if (!vueComponentOptions['onServiceAttached']) {
    vueComponentOptions['onServiceAttached'] = []
  }
  vueComponentOptions['onServiceAttached'].push(function onServiceAttached () {
    handleRelations(this, 'linked')
  })
}

export function Component (options) {
  const componentOptions = parseComponent(options)
  componentOptions.mixins.unshift(polyfill)
  componentOptions.mpOptions.path = global['__wxRoute']
  initRelationsHandler(componentOptions)
  global['__wxComponents'][global['__wxRoute']] = componentOptions
}

export function Behavior (options) {
  return options
}

export const nextTick = Vue.nextTick

export default uni.__$wx__
