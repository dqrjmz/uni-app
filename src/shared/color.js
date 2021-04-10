/**
 * hex 颜色改 rgba
 * 字符串是不可变数据（不会被操作方法修改原始的字符串
 * @param {*} hex
 */
export function hexToRgba (hex) {
  let r
  let g
  let b
  // hex 位#FFBBDD #FFF #fbd
  // hex的双字母可以变为单字母使用
  hex = hex.replace('#', '')
  if (hex.length === 6) {
    r = hex.substring(0, 2)
    g = hex.substring(2, 4)
    b = hex.substring(4, 6)
  } else if (hex.length === 3) {
    r = hex.substring(0, 1)
    g = hex.substring(1, 2)
    b = hex.substring(2, 3)
  } else {
    return false
  }
  // 长度为3的时候会出现单个字符
  if (r.length === 1) {
    // 重复
    r += r
  }
  // 长度为1
  if (g.length === 1) {
    g += g
  }
  if (b.length === 1) {
    b += b
  }
  // 将16进制数转换为10进制数
  r = parseInt(r, 16)
  g = parseInt(g, 16)
  b = parseInt(b, 16)
  // 转变为rgb
  return {
    r,
    g,
    b
  }
}
