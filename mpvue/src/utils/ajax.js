export function ajax (params) {
  var openid = ''
  console.log(params)
  if (!params.headers) {
    params.headers = {}
  }
  wx.getStorage({
    key: 'openID',
    success: function (res) {
      openid = res.data
    }
  })
  if (params.needOpenId) {
    params.headers = Object.assign({}, {openid: openid}, params.headers)
  }
  return wx.request({
    url: params.url,
    data: params.data,
    headers: params.headers,
    success: params.success,
    faile: params.faile,
    complete: params.complete
  })
}
export function other (a) {
  console.log(a)
}
export default {
  ajax,
  other
}
