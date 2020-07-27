import apis from '../../../lib/apis'
import {
  wrapper,
  wrapperUnimplemented
} from 'uni-helpers/api'
import {
  promisify
} from 'uni-helpers/promise'

import api from 'uni-service-api'

// 创建没有原型的空对象
export const uni = Object.create(null)

// api promise 化 name:api名称
apis.forEach(name => {
  // 是否存在
  if (api[name]) {
    uni[name] = promisify(name, wrapper(name, api[name]))
  } else {
    uni[name] = wrapperUnimplemented(name)
  }
})
