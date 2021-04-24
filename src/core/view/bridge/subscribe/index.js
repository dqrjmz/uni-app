import subscribeApis from 'uni-api-subscribe'

import {
  pageScrollTo
} from './scroll'
import {
  loadFontFace
} from './font'

import initPlatformSubscribe from 'uni-platform/view/bridge/subscribe'

export default function initSubscribe (subscribe) {
  // 遍历定于事件
  Object.keys(subscribeApis).forEach(name => {
    subscribe(name, subscribeApis[name])
  })

  // 订阅页面滚动到底部
  subscribe('pageScrollTo', pageScrollTo)
  subscribe('loadFontFace', loadFontFace)

  initPlatformSubscribe(subscribe)
}
