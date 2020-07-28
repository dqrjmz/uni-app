/**
 * 解析路径
 * @param {*} path
 */
export function parsePath (path) {
  // 哈希和查询字符串
  let hash = ''
  let query = ''

  // 找到哈希前缀
  const hashIndex = path.indexOf('#')
  //
  if (hashIndex >= 0) {
    // 获取哈希
    hash = path.slice(hashIndex)
    // 获取除去哈希的部分
    path = path.slice(0, hashIndex)
  }

  // 获取查询字符串的前缀
  const queryIndex = path.indexOf('?')
  if (queryIndex >= 0) {
    // 获取查询字符串
    query = path.slice(queryIndex + 1)
    // 获取剩下的路径
    path = path.slice(0, queryIndex)
  }

  return {
    path,
    query,
    hash
  }
}
