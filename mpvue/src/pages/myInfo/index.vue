<template>
  <div class='my-content'>
    <div class='myInfo'>
      <p class='showImg'><img :src='myInfo.avatarUrl ' alt=''></p>
      <span class='nickName'>{{myInfo.nickName}}</span>
      <div class='company-info'>
        <p> <span>公司名称：</span> 国久大数据有限公司</p>
        <p> <span>职位：</span>  前端开发工程师</p>
        <p> <span>系统权限：</span> 超级管理员 </p>
      </div>
    </div>
    <div class='to-login'>
      还未登录,<a href='../login/main'>点击</a>领盒饭
    </div>
  </div>
</template>

<script>
import {API} from '../../../static/api'

export default {
  components: {
  },

  data () {
    return {
      logs: [],
      avatarUrl: '',
      nickName: '',
      myInfo: {
        avatarUrl: '',
        nickName: ''
      }
    }
  },

  created () {

  },
  beforeMount () {
    console.log(API.openid)
    const T = this
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        if (res) {
          T.myInfo = res.data
        }
        console.log('显示我的信息', T.myInfo, res)
      }
    })
  }
}
</script>

<style scoped lang='scss'>
  .my-content{
    background-color: #fafafa ;
    width: 100%;
    height: 100%;
    .to-login{
      background-color: #fff;
      font-size: 30rpx;
      height: 60rpx;
      margin-top: 200rpx;
      line-height: 60rpx;
      text-align: center;
      a{
        display: inline-block;
        color: #100A86;
        text-decoration: underline;
      }
    }
  }
.log-list {
  display: flex;
  flex-direction: column;
  padding: 40rpx;
}
.myInfo{
  width: 100%;
  height: 240rpx;
  padding: 20rpx 32rpx;
  background-color: #febd00;
  position: relative;
  .showImg{
    width: 130rpx;
    height: 130rpx;
    border-radius: 65rpx;
    overflow: hidden;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .nickName{
    display: block;
    margin-top: 20rpx;
    width: 130rpx;
    height: 20px;
    font-size: 30rpx;
    text-align: center;
    line-height: 20px;
    color: #fff;
  }
  .company-info{
    position: absolute;
    width: 65%;
    height: 100%;
    right: 0px;
    top: 20rpx;
    p{
      width: 100%;
      height: 68rpx;
      color: #fff;
      line-height: 68rpx;
      font-size: 30rpx;
      span{
        display: inline-block;
        width: 150rpx;
        text-align: right;
      }
    }
  }
}
.log-item {
  margin: 10rpx;
}
</style>
