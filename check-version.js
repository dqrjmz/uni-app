const fs = require('fs')
const path = require('path')

const request = require('request')

const registry = 'https://registry.npmjs.org/@dcloudio/'

// 获取packages目录下的所有目录
const pkgs = fs.readdirSync(path.resolve(__dirname, 'packages'))

// nodejs进程运行时，获取命令行的参数 node index.js a b
const tag = process.argv[2] || 'alpha'

pkgs.forEach(pkg => {
  request(registry + pkg, function(error, response, body) {
    if (error) {
      console.log(pkg, error)
    } else {
      const version = JSON.parse(body)['dist-tags'][tag]
      console.log(pkg + ':' + (' '.repeat(80 - (pkg + ':' + version).length)) + version)
    }
  })
})
