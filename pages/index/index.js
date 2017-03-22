//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    banner: {
      imgUrls: [
        'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
      ],
      indicatorDots: true,
      autoplay: false,
      interval: 5000,
      duration: 1000
    },
    classify: {
      imgUrls: [1,2,3],
      indicatorDots: true,
      autoplay: false,
      interval: 5000,
      duration: 1000
    }
  },
  onReady(){
    console.log(__wxRoute)
  },
  onLoad: function () {
    console.log(__wxRoute)
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
})
