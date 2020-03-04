import Vue from 'vue'

import baseMixin from 'uni-mixins/base'
import animation from 'uni-mixins/animation'

const requireComponents = [
  // baseComponents webpack api
  require.context('./', true, /index\.vue$/),
  require.context('../../../platforms/' + __PLATFORM__ + '/view/components', true, /index\.vue$/)
]

// 所有组件[{path: Component}]
requireComponents.forEach((components, index) => {
  // 组件的options key
  components.keys().forEach(fileName => {
    // 获取组件模块
    const componentModule = components(fileName)

    // cjsm 或者 esm
    const componentConfig = componentModule.default || componentModule

    // 组件的混合属性
    componentConfig.mixins = componentConfig.mixins ? [].concat(baseMixin, componentConfig.mixins) : [baseMixin]

    // 每个组件添加动画mixins
    componentConfig.mixins.push(animation)

    componentConfig.name = 'VUni' + componentConfig.name

    componentConfig.isReserved = true

    // 全局注册组件
    Vue.component(componentConfig.name, componentConfig)
  })
})
