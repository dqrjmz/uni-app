const path = require('path')

const t = require('@babel/types')

/**
 * 生成js代码
 * @param {*} properties
 */
function generateJsCode (properties = '{}') {
  return `
wx.createComponent({
    generic:true,
    props: ${properties},
    render: function(){}
})
`
}

/**
 * 对象有自己的属性
 * @param {*} obj
 * @param {*} key
 */
function hasOwn (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

module.exports = {
  // 指令
  directive: 'wx:',
  // 创建作用域插槽
  createScopedSlots (slotName, props, state) {
    // 组件名称
    const componentName = 'scoped-slots-' + slotName
    if (!state.componentGenerics) {
      state.componentGenerics = Object.create(null)
    }

    //
    state.componentGenerics[componentName] = true

    return {
      type: componentName,
      attr: props || {},
      children: []
    }
  },
  resolveScopedSlots (slotName, {
    genCode,
    generate,
    ownerName,
    parentName,
    parentNode,
    resourcePath,
    paramExprNode,
    returnExprNodes,
    traverseExpr
  }, state) {
    if (!state.scopedSlots) {
      state.scopedSlots = {}
    }
    const baseName = `${ownerName}-${parentName}-${slotName}`
    let componentName = baseName
    if (!hasOwn(state.scopedSlots, baseName)) {
      state.scopedSlots[baseName] = 0
    }
    if (state.scopedSlots[baseName]) {
      componentName = baseName + state.scopedSlots[baseName]
    }
    state.scopedSlots[baseName]++
    parentNode.attr['generic:scoped-slots-' + slotName] = componentName
    if (!parentNode.attr.generic) {
      parentNode.attr.generic = {}
    }
    parentNode.attr.generic[slotName] = true

    // 生成 scopedSlots 文件，包括 json,js,wxml,还需要更新 owner 的 usingComponents
    if (!state.files) {
      state.files = {}
    }
    // 获取路径的扩展名
    const extname = path.extname(resourcePath)

    // TODO 需要存储 resourcePath 相关 json

    const templateFile = resourcePath.replace(ownerName + extname, componentName + extname)
    const templateContent = generate(traverseExpr(returnExprNodes, state), state)

    state.files[templateFile] = templateContent

    const jsFile = resourcePath.replace(ownerName + extname, componentName + '.js')

    const objectProperties = []

    if (t.isObjectPattern(paramExprNode)) {
      paramExprNode.properties.forEach(property => {
        const key = property.key
        const value = property.value
        const valueObjectProperties = [
          t.objectProperty(t.identifier('type'), t.nullLiteral())
        ]
        if (t.isIdentifier(value)) {
          if (value.name !== key.name) {
            state.errors.add(`解构插槽 Prop 时,不支持将${key.name}重命名为${value.name},重命名后会影响性能`)
          }
        } else if (t.isAssignmentPattern(value)) {
          valueObjectProperties.push(t.objectProperty(t.identifier('default'), value.right))
        }
        objectProperties.push(t.objectProperty(key, t.objectExpression(valueObjectProperties)))
      })
    } else {
      state.errors.add(`目前仅支持解构插槽 ${paramExprNode.name},如 v-slot="{ user }"`)
    }
    const jsContent = generateJsCode(genCode(t.objectExpression(objectProperties), true))
    state.files[jsFile] = jsContent

    if (!state.generic) {
      state.generic = []
    }
    // 存储，方便后续生成 json
    state.generic.push(componentName)

    return ''
  }
}
