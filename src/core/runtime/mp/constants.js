export const SOURCE_KEY = '__data__'

// 小程序组件的生命周期钩子函数
export const COMPONENT_LIFECYCLE = {
  created: 'onServiceCreated',
  attached: 'onServiceAttached',
  ready: 'mounted',
  moved: 'moved',
  detached: 'destroyed'
}

export const COMPONENT_LIFECYCLE_KEYS = Object.keys(COMPONENT_LIFECYCLE)

// 小程序页面生命周期钩子函数
export const PAGE_LIFETIMES = {
  show: 'onPageShow',
  hide: 'onPageHide',
  resize: 'onPageResize'
}

export const PAGE_LIFETIMES_KEYS = Object.keys(PAGE_LIFETIMES)
// TODO 待整理，现在到处都是
export const PAGE_LIFECYCLE = [
  'onLoad',
  'onShow',
  'onReady',
  'onHide',
  'onUnload',
  'onPullDownRefresh',
  'onReachBottom',
  'onAddToFavorites',
  'onShareTimeline',
  'onShareAppMessage',
  'onPageScroll',
  'onResize',
  'onTabItemTap'
]
