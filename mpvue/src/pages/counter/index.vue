<template>
  <div class="counter-warp">
    <div class="alert alert-info" role="alert">
      酒业企业列表展示
    </div>
    <ul class="list-group">
      <li class="list-group-item" v-for="(data, index) in companyList":key="data._id" >{{index}} : {{data.name}} -- {{data.companyId}} </li>
    </ul>
    <button v-on:click="getWineList" class="btn btn-primary"> 刷新列表 </button>
  </div>
</template>

<script>
// Use Vuex
import store from './store';
import {API} from '../../../static/api';

export default {
  data () {
    return {
      companyList: []
    }
  },
  computed: {
    count () {
      return store.state.count;
    }
  },
  methods: {
    getWineList () {
      console.log('APIAPIAPI', API);
      var inThis = this
      wx.request({
        url: API.baseUrl + '/wine/wineInfo',
        method: 'GET',
        headers: {},
        success: function (res) {
          inThis.companyList = res.data;
          console.log('酒企的列表', inThis.companyList, res);
        },
        fail: function (res) {
          console.log('获取列表失败', res);
        }
      })
    },
    increment () {
      store.commit('increment');
    },
    decrement () {
      store.commit('decrement');
    }
  },
  beforeMount () {
    var inThis = this;
    wx.request({
      url: API.baseUrl + '/wine/wineInfo',
      method: 'GET',
      headers: {},
      success: function (res) {
        inThis.companyList = res.data;
        console.log('酒企的列表', inThis.companyList);
      },
      fail: function (res) {
        console.log('获取列表失败', res);
      }
    })
  }
}
</script>

<style>
.counter-warp {
  text-align: center;
  margin-top: 100px;
}
.home {
  display: inline-block;
  margin: 100px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
  .btn-primary{
    width: calc(100% - 4rpx);
    position: fixed;
    bottom: 0rpx;
    left:0rpx;
  }
</style>
