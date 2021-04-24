/**
 * 给页面设置元数据
 * @param {*} param0 页面样式， 根节点字体大小
 */
export function setPageMeta ({
  pageStyle,
  rootFontSize
}) {
  // 获取 标签名为 uni-page-body的元素 || 获取文档的body元素
  const pageElm = document.querySelector('uni-page-body') || document.body
  // 给元素设置style属性
  pageElm.setAttribute('style', pageStyle)
  // 根元素的字体大小 && 文档的样式字体大小 与值 之不等
  if (rootFontSize && document.documentElement.style.fontSize !== rootFontSize) {
    // 赋值给样式字体
    document.documentElement.style.fontSize = rootFontSize
  }
}
