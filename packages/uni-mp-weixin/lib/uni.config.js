const fs = require('fs')
const path = require('path')

// 组件目录名称
const COMPONENTS_DIR_NAME = 'wxcomponents'

module.exports = {
  options: {
    // css 变量
    cssVars: {
      '--status-bar-height': '25px',
      '--window-top': '0px',
      '--window-bottom': '0px'
    },
    // 文件拓展名
    extnames: {
      style: '.wxss',
      template: '.wxml',
      filter: '.wxs'
    },
    // 过滤标签
    filterTag: 'wxs',
    // 项目的配置文件
    project: 'project.config.json',
    subPackages: true,
    darkmode: true
  },
  copyWebpackOptions (platformOptions, vueOptions) {
    const copyOptions = [
      'theme.json',
      'sitemap.json',
      'ext.json',
      'custom-tab-bar'
    ]
    const workers = platformOptions.workers
    workers && copyOptions.push(workers)

    // 组件目录的绝对路径
    const wxcomponentsDir = path.resolve(process.env.UNI_INPUT_DIR, COMPONENTS_DIR_NAME)
    // 是否存在这个文件目录
    if (fs.existsSync(wxcomponentsDir)) {
      copyOptions.push({
        from: wxcomponentsDir,
        to: COMPONENTS_DIR_NAME,
        ignore: ['**/*.vue', '**/*.css'] // v3 会自动转换生成vue,css文件，需要过滤
      })
    }
    return copyOptions
  }
}
