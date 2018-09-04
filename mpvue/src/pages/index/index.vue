<template>
  <div class='index-container' >
    <button open-type='getUserInfo' class="btn btn-primary" lang='zh_CN'> 授权用户信息 </button>
    <!--<button open-type='openSetting'>打开授权设置页</button>-->
    <!--<button open-type='getPhoneNumber' bindgetphonenumber='getPhoneNumber'> 获取电话号码</button>-->

    <div class="wrap">
      <mpvue-echarts :echarts="echarts" :onInit="onInit" />
   </div>

  </div>

</template>

<script>
  import {API, DATA} from '../../../static/api';
  import * as echarts from 'echarts';
  import mpvueEcharts from 'mpvue-echarts';
  function initChart (canvas, width, height) {
    const legendData = [];
    const selectedData = [];
    for (const i of DATA.indx_data) {
      legendData.push(i.name);
      if (i.name !== '其他') {
        selectedData.push(i.name);
      }
    }
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(chart);
    var option = {
      backgroundColor: '#2c343c',
      title: {
        text: '酒业电商品牌销量分析',
        left: 'center',
        top: 3,
        textStyle: {
          color: '#ccc'
        }
      },
      color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae',
        '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570',
        '#c4ccd3', '#c231b6', '#c6e4f3'],
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 5,
        top: 20,
        bottom: 20,
        data: this.legendData,
        selected: this.selectedData,
        textStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },

      visualMap: {
        show: false,
        min: 80,
        max: 600
      },
      series: [
        {
          name: '累计销量（瓶）',
          type: 'pie',
          radius: '50%',
          center: ['35%', '50%'],
          legendHoverLink: true,
          data: DATA.indx_data,
          roseType: 'radius',
          label: {
            normal: {
              textStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 5,
              length2: 5
            }
          },
          itemStyle: {
            normal: {
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          emphasis: {
            color: '#f1928f'
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]
    };;
    chart.setOption(option);
    return chart;
  }

  export default {
    data () {
      return {
        motto: 'Hello World',
        userInfo: {},
        shops: [],
        echarts,
        onInit: initChart
      }
    },

    components: {
      mpvueEcharts
    },

    methods: {
      bindViewTap () {
        const url = '../myInfo/main';
        wx.navigateTo({ url });
      },

      getPhoneNumber: function (e) {
        console.log(e.detail.errMsg);
        console.log(e.detail.iv);
        console.log(e.detail.encryptedData);
        if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '未授权',
            success: function (res) { }
          });
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '同意授权',
            success: function (res) { }
          });
        }
      },
      getUserInfo () {
        var that = this;
        wx.login({
          success: (res) => {
            console.log('登陆成功', res);
            wx.getUserInfo({
              success: (res) => {
                this.userInfo = res.userInfo;
                console.log('用户信息', this.userInfo);
                if (this.userInfo) {
                  wx.setStorage({
                    key: 'userInfo',
                    data: this.userInfo,
                    success: function () {
                      console.log('储存成功');
                    }
                  })
                }
              },
              fail: function (res) {
                console.log('获取用户信息失败', res);
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
                    console.log('茅台列表', res);
                    that.shops = res.data;
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
                    console.log('OPENID？', res);
                    API.openid = res.data.openID;
                    wx.setStorage({
                      key: 'openID',
                      data: res.data.openID,
                      success: function () {
                        console.log('openID 存储成功');
                      }
                    })
                  },
                  fail: function (res) {
                    console.log('失败的OPENID？', res);
                  }
                })
              }
            })
          },
          fail: function (res) {
            console.log('shibai', res);
          }
        })
      },
      clickHandle (msg, ev) {
        console.log('clickHandle:', msg, ev);
      }
    },

    created () {
      // console.log(ajax)
      // 调用应用实例的方法获取全局数据
      this.getUserInfo();
    }
}
</script>

<style scoped lang="scss" >
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
  margin: auto;
  padding: 0rpx 0rpx;
  color: blue;
  border: 1px solid blue;
}
.wrap {
  width: 100%;
  height: 600rpx;
}
  .index-container{
    display: block;
    width: 100%;
    height: 100%;
    margin: 0rpx;
    padding: 0rpx;
    button{
      width: 100%;
      margin: 40rpx auto;
    }
  }
</style>
