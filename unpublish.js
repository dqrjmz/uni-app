const fs = require('fs')
const path = require('path')
const shellExec = require('shell-exec')

// 同步读取 packages 目录
const pkgs = fs.readdirSync(path.resolve(__dirname, 'packages'))

// 获取进程参数; 例如： [node, unpublish.js, 1.0 ]
const version = process.argv[2] // 1.0
if (!version) {
  throw new Error('必须传入 version')
}

(async function() {
  for (let i = 0; i < pkgs.length; i++) {
    console.log(`npm unpublish @dcloudio/${pkgs[i]}@${version}`);
    // 移除注册的包
    await shellExec(`npm unpublish @dcloudio/${pkgs[i]}@${version}`)
  }
})();
