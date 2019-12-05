const EPS = 1e-4
const BASE_DEVICE_WIDTH = 750
let isIOS = false
let deviceWidth = 0
let deviceDPR = 0

function checkDeviceWidth () {
  const {
    platform,
    pixelRatio,
    windowWidth
  } = __GLOBAL__.getSystemInfoSync() // uni=>__GLOBAL__ runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth
  deviceDPR = pixelRatio
  isIOS = platform === 'ios'
}

export function upx2px (number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth()
  }

  // 数据类型转换
  number = Number(number)
  if (number === 0) {
    return 0
  }
  // 转换后的尺寸 （新设备尺寸/基础设备尺寸 === result/number (缩放比例)
  let result = (number / BASE_DEVICE_WIDTH) * (newDeviceWidth || deviceWidth)
  // 不能为负值
  if (result < 0) {
    result = -result
  }
  // 
  result = Math.floor(result + EPS)
  // 750设备宽
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1
    } else {
      return 0.5
    }
  }
  return number < 0 ? -result : result
}
