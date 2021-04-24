const isWeixin = window.wx &&
  window.wx.miniProgram &&
  /micromessenger/i.test(navigator.userAgent) &&
  /miniProgram/i.test(navigator.userAgent) // 根据用户代理判断是微信

export function initWebviewApi (readyCallback) {
  if (!isWeixin) {
    return
  }
  if (window.WeixinJSBridge && window.WeixinJSBridge.invoke) {
    setTimeout(readyCallback, 0)
  } else {
    // 文档监听 WeixinJSBridgeReady 事件
    document.addEventListener('WeixinJSBridgeReady', readyCallback)
  }

  return window.wx.miniProgram
}
