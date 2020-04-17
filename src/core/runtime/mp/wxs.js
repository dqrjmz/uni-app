/**
 * wxs getRegExp
 */
export function getRegExp () {
  var args = Array.prototype.slice.call(arguments)
  args.unshift(RegExp)
  return new (Function.prototype.bind.apply(RegExp, args))()
}

/**
 * wxs getDate
 */
export function getDate () {
  // 将函数参数转换为数组
  var args = Array.prototype.slice.call(arguments)
  // 给函数头部添加一个元素
  args.unshift(Date)
  // 返回Date构造函数的实例化
  return new (Function.prototype.bind.apply(Date, args))()
}
