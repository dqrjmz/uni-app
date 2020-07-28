// 编码预留的规则
const encodeReserveRE = /[!'()*]/g
// 编码预留的替换
const encodeReserveReplacer = c => '%' + c.charCodeAt(0).toString(16)
const commaRE = /%2C/g

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
// 给字符串进行编码
const encode = str => encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ',')

const decode = decodeURIComponent

// 解析查询字符串
export function parseQuery (query) {
  const res = {}

  // 去掉空格，以及开始位置的？ #  &
  query = query.trim().replace(/^(\?|#|&)/, '')

  if (!query) {
    return res
  }
  // 开始解析查询字符串
  query.split('&').forEach(param => {
    // 将每对键值对中的加号中去掉，然后根据等号将字符串分割为数组
    const parts = param.replace(/\+/g, ' ').split('=')
    // 解码，删除数组中第一个元素，并返回，那个就是key
    const key = decode(parts.shift())
    // 键值对数组
    const val = parts.length > 0
    // 使用 = 号将键值对进行连接
      ? decode(parts.join('='))
      : null

    // res 中没有的属性添加，
    if (res[key] === undefined) {
      res[key] = val
    } else if (Array.isArray(res[key])) {
      // 对应key的值为数组的，添加到数组
      res[key].push(val)
    } else {
      // key中已经有值的，重新复制
      res[key] = [res[key], val]
    }
  })

  return res
}

// 序列化查询字符串
export function stringifyQuery (obj, encodeStr = encode) {
  // 获取对象的key，进行遍历
  const res = obj ? Object.keys(obj).map(key => {
    const val = obj[key]
    // 对象的属性不存在返回
    if (val === undefined) {
      return ''
    }

    // 对象的属性为null, 将key返回
    if (val === null) {
      return encodeStr(key)
    }

    // 值为数组
    if (Array.isArray(val)) {
      const result = []
      // 遍历数组
      val.forEach(val2 => {
        // 元素为空的返回
        if (val2 === undefined) {
          return
        }
        // 元素为null的进行编码，添加到数组中
        if (val2 === null) {
          result.push(encodeStr(key))
        } else {
          result.push(encodeStr(key) + '=' + encodeStr(val2))
        }
      })
      // 将数组使用&符号进行连接
      return result.join('&')
    }
    // 编码key 和value
    return encodeStr(key) + '=' + encodeStr(val)
    // 过滤掉长度为0 的编译过的
  }).filter(x => x.length > 0).join('&') : null
  return res ? `?${res}` : ''
}

export function decodedQuery (query = {}) {
  const decodedQuery = {}
  Object.keys(query).forEach(name => {
    try {
      decodedQuery[name] = decode(query[name])
    } catch (e) {
      decodedQuery[name] = query[name]
    }
  })
  return decodedQuery
}
