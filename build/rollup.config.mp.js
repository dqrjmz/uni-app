const path = require('path')
const alias = require('@rollup/plugin-alias')
const replace = require('@rollup/plugin-replace')

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
  'mp-kuaishou': {
    prefix: 'ks',
    title: '快手小程序'
  },
  'quickapp-webview': {
    prefix: 'qa',
    title: '快应用(Webview)版'
  },
  'app-plus': {
    prefix: 'wx',
    title: 'app-plus'
  }
}

// 获取平台类型，根据设置的环境变量，获取平台对象信息
const platform = PLATFORMS[process.env.UNI_PLATFORM]

// 构建入口文件
let input = 'src/core/runtime/index.js'

/**
 * 构建输出文件，输出到对应的平台文件夹下的dist文件夹下
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
     * 设置文件路径别名，简化导入模块时的书写
     */
    alias({
      entries: [{
        find: 'uni-shared/query',
        replacement: path.resolve(__dirname, '../src/shared/query.js')
      }, {
        find: 'uni-shared',
        replacement: path.resolve(__dirname, '../src/shared/util.js')
      }, {
        find: 'uni-platform',
        replacement: path.resolve(__dirname, '../src/platforms/' + process.env.UNI_PLATFORM)
      }, {
        find: 'uni-wrapper',
        replacement: path.resolve(__dirname, '../src/core/runtime/wrapper')
      }, {
        find: 'uni-helpers',
        replacement: path.resolve(__dirname, '../src/core/helpers')
      }]
    }),
    // 替换全局变量
    replace({
      __GLOBAL__: platform.prefix, // 小程序前缀
      __PLATFORM_TITLE__: platform.title, // 小程序名称
      __PLATFORM_PREFIX__: JSON.stringify(platform.prefix), // 序列化前缀
      __PLATFORM__: JSON.stringify(process.env.UNI_PLATFORM) // 序列换平台信息
    })
  ],
  external: ['vue']
}
