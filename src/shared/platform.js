export function plusReady (callback) {
  if (typeof callback !== 'function') {
    return
  }
  if (window.plus) {
    return callback()
  }
  // 给文档添加plusready事件
  document.addEventListener('plusready', callback)
}
