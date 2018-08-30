<template>
  <div class="counter-warp">
    内容
    <button v-on:click="getWineList"> 获取列表 </button>
  </div>
</template>

<script>
// Use Vuex
import store from './store'
import {API} from '../../../static/api'

export default {
  computed: {
    count () {
      return store.state.count
    }
  },
  methods: {
    getWineList () {
      wx.request({
        url: API.baseUrl + '/wine/wineInfo',
        method: 'GET',
        headers: {},
        success: function (res) {
          console.log('酒企的列表', res)
        },
        fail: function (res) {
          console.log('获取列表失败', res)
        }
      })
    },
    increment () {
      store.commit('increment')
    },
    decrement () {
      store.commit('decrement')
    }
  },
  beforeMount () {
    wx.request({
      url: API.baseUrl + '/wine/wineInfo',
      method: 'GET',
      headers: {},
      success: function (res) {
        console.log('酒企的列表', res)
      },
      fail: function (res) {
        console.log('获取列表失败', res)
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
</style>
