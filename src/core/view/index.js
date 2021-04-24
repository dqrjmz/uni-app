import {
  wrapper
} from 'uni-helpers/api'

// 导入基础api
import * as baseApi from './api'

// import * as platformApi from 'uni-platform/view/api'

// 创建一个没有原型的空 对象
const uni = Object.create(null)

/* eslint-disable no-undef */
// 给uni 添加版本属性
uni.version = __VERSION__

// 遍历基本api,包裹之后赋值给uni对象的对应key
Object.keys(baseApi).forEach(name => {
  uni[name] = wrapper(name, baseApi[name])
})

// Object.keys(platformApi).forEach(name => {
//   uni[name] = wrapper(name, api[name])
// })

export default uni
