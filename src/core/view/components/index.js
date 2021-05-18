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
  components.keys().forEach(fileName => {
    const componentModule = components(fileName)
    const componentConfig = componentModule.default || componentModule

    componentConfig.mixins = componentConfig.mixins ? [].concat(baseMixin, componentConfig.mixins) : [baseMixin]

    // 每个组件添加动画mixins
    componentConfig.mixins.push(animation)

    componentConfig.name = 'VUni' + componentConfig.name

    componentConfig.isReserved = true

    // 全局注册组件
    Vue.component(componentConfig.name, componentConfig)
  })
})
