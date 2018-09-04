<template>
 <div class='login-form'>
   <form>
     <h1>欢迎登陆</h1>
     <div class='form-group row'>
       <label for='staticEmail' class='col-sm-2 col-form-label'>UserName : </label>
       <div class='col-sm-10'>
         <input type='text'  class='form-control' id='staticEmail' placeholder='userName'
                maxlength='32' auto-focus  v-on:blur='userNameBlur' v-model='userName' >
       </div>
     </div>
     <div class='form-group row'>
       <label for='inputPassword' class='col-sm-2 col-form-label'>Password : </label>
       <div class='col-sm-10'>
         <input type='password' class='form-control' id='inputPassword' placeholder='password'
                maxlength='16' v-on:blur='passBlur' v-model='password'>
       </div>
     </div>
     <button form-type class='btn btn-info' v-on:click='submitSys'> 登陆 </button>
   </form>
 </div>
</template>

<script>
import {API} from '../../../static/api';

export default {
  data () {
    return {
      userName: '',
      password: '',
      userNamError: '123',
      phoneError: '123'
    }
  },
  components: {
  },
  methods: {
    bindViewTap () {
      const url = '../myInfo/main';
      wx.navigateTo({ url })
    },
    userNameBlur () {
      console.log(111111, this.userName);
    },
    passBlur () {
      console.log(222222222, this.password);
    },
    submitSys () {
      wx.request({
        url: API.baseUrl + '/auth/form',
        method: 'POST',
        header: {
          'deviceId': 'sdfgtredrt',
          'Authorization': 'Basic anVyOmp1cnNlY3JldA==',
          'Content-Type': 'application/json'
        },
        data: {
          username: this.userName,
          password: this.password
        },
        success: function (res) {
          console.log('成功了', res);
        },
        fail: function (res) {
          console.log('登陆失败，源有：', res);
        }
      })
    }
  },
  beforeMount () {
    // 调用应用实例的方法获取全局数据
    console.log('界面没有正常显示为何');
  }
}
</script>

<style scoped lang='scss'>
  .login-form{
    width: 100%;
    height: 100%;
    background-color: #fafafa;
    display: flex;
    align-items: center;
    form{
      width: 100%;
      height: 600rpx;
      background-color: white;
      /*border: 1rpx solid #ccc;*/
      h1{
        display:block;
        width:100%;
        font-size:60rpx;
        margin-bottom:60rpx;
        text-align:center;
      }
      .form-group{
        display: flex;
        width: 100%;
        label{
          display:inline-block;
          width:25%;
          line-height:80rpx;
          padding-right:20rpx;
          text-align:right;
          font-weight: 200;
        }
        div{
          display: inline-block;
          width: 75%;
          margin: 0rpx;
          padding: 0rpx;
          input{
            width:calc(100% - 25rpx);
          }
        }
      }
      button{
        width: 100%;
        border: none;
        -webkit-appearance: none;
      }
    }
  }
</style>
