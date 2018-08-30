<template>
  <div class='container' >
    <button open-type='getUserInfo' lang='zh_CN'>授权用户信息</button>
    <button open-type='openSetting'>打开授权设置页</button>
    <button open-type='getPhoneNumber' bindgetphonenumber='getPhoneNumber'> 获取电话号码</button>
  </div>
</template>

<script>
  import { API } from '../../../static/api'
  // import { ajax } from '@/utils/ajax'
  export default {
    data () {
      return {
        motto: 'Hello World',
        userInfo: {},
        shops: []
      }
    },

    components: {

    },

    methods: {
      bindViewTap () {
        const url = '../myInfo/main'
        wx.navigateTo({ url })
      },

      getPhoneNumber: function (e) {
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)
        if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '未授权',
            success: function (res) { }
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '同意授权',
            success: function (res) { }
          })
        }
      },
      getUserInfo () {
        var that = this
        wx.login({
          success: (res) => {
            console.log('登陆成功', res)
            wx.getUserInfo({
              success: (res) => {
                this.userInfo = res.userInfo
                console.log('用户信息', this.userInfo)
                if (this.userInfo) {
                  wx.setStorage({
                    key: 'userInfo',
                    data: this.userInfo,
                    success: function () {
                      console.log('储存成功')
                    }
                  })
                }
              },
              fail: function (res) {
                console.log('获取用户信息失败', res)
              }
            })
            wx.getStorage({
              key: 'openID',
              success: function (res) {
                API.openid = res.data
                wx.request({
                  url: API.baseUrl + '/wine/shops',
                  method: 'GET',
                  header: {
                    openid: API.openid
                  },
                  success: function (res) {
                    console.log('茅台列表', res)
                    that.shops = res.data
                  }
                })
              },
              fail: () => {
                wx.request({
                  url: API.baseUrl + '/wechat/login',
                  method: 'POST',
                  data: {
                    code: res.code
                  },
                  success: function (res) {
                    console.log('OPENID？', res)
                    API.openid = res.data.openID
                    wx.setStorage({
                      key: 'openID',
                      data: res.data.openID,
                      success: function () {
                        console.log('openID 存储成功')
                      }
                    })
                  },
                  fail: function (res) {
                    console.log('失败的OPENID？', res)
                  }
                })
              }
            })
          },
          fail: function (res) {
            console.log('shibai', res)
          }
        })
      },
      clickHandle (msg, ev) {
        console.log('clickHandle:', msg, ev)
      }
    },

    created () {
      // console.log(ajax)
      // 调用应用实例的方法获取全局数据
      this.getUserInfo()
    }
}
</script>

<style scoped >
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
