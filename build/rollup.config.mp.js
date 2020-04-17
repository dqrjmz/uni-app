const path = require('path')
const alias = require('rollup-plugin-alias')
const replace = require('rollup-plugin-replace')

const PLATFORMS = {
  'mp-weixin': {
    prefix: 'wx',
    title: '微信小程序'
  },
  'mp-qq': {
    prefix: 'wx',
    title: 'QQ小程序'
  },
  'mp-alipay': {
    prefix: 'my',
    title: '支付宝小程序'
  },
  'mp-baidu': {
    prefix: 'swan',
    title: '百度小程序'
  },
  'mp-toutiao': {
    prefix: 'tt',
    title: '头条小程序'
  },
  'app-plus': {
    prefix: 'wx',
    title: 'app-plus'
  }
}

// 获取平台类型
const platform = PLATFORMS[process.env.UNI_PLATFORM]

// 构建入口文件
let input = 'src/core/runtime/index.js'

/**
 * 构建输出文件
 * 模块类型未es module
 */
const output = {
  file: `packages/uni-${process.env.UNI_PLATFORM}/dist/index.js`,
  format: 'es'
}

/**
 * 小程序平台的设置
 * 入口与输出路径的文件
 */
if (process.env.UNI_MP) {
  input = 'src/core/runtime/mp/index.js'
  output.file = `packages/uni-${process.env.UNI_PLATFORM}/dist/mp.js`
}

module.exports = {
  input,
  output,
  plugins: [
    /**
     * 设置文件路径别名，简化书写
     */
    alias({
      'uni-shared': path.resolve(__dirname, '../src/shared/util.js'),
      'uni-platform': path.resolve(__dirname, '../src/platforms/' + process.env.UNI_PLATFORM),
      'uni-wrapper': path.resolve(__dirname, '../src/core/runtime/wrapper'),
      'uni-helpers': path.resolve(__dirname, '../src/core/helpers')
    }),
    replace({
      __GLOBAL__: platform.prefix, // 小程序前缀
      __PLATFORM_TITLE__: platform.title, // 小程序名称
      __PLATFORM_PREFIX__: JSON.stringify(platform.prefix),
      __PLATFORM__: JSON.stringify(process.env.UNI_PLATFORM)
    })
  ],
  external: ['vue']
}
