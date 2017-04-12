//index.js
let $ = wx.MinQuery.load('index');

$(function(){
  $('.navigater').on('tap',function(e){
    let _url = e.data('url');
    $.navigateTo(_url);
  })
})







//获取应用实例
// var app = getApp();
// const ctx = wx.createCanvasContext('myCanvas');
// Page({
//   data: {
//     banner: {
//       imgUrls: [
//         'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
//         'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
//         'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
//       ],
//       current: 0,
//       indicatorDots: true,
//       autoplay: false,
//       interval: 5000,
//       duration: 1000
//     },
//     classify: {
//       imgUrls: [1,2,3],
//       indicatorDots: true,
//       autoplay: false,
//       interval: 5000,
//       duration: 1000
//     }
//   },
//   onCanvasMove(e){
//     console.log(e);
//       ctx.setFillStyle('red');
//       ctx.fillRect(e.touches[0].x, e.touches[0].y, 150, 75);
//       ctx.draw();
//   },
//   onReady(){
      
//       ctx.setFillStyle('red')
//       ctx.fillRect(10, 10, 150, 75)
//       ctx.draw()
//     console.log(__wxRoute)
//   },
//   onChange(e){
//     console.log(e);
//   },
//   pushSwiper(){
//     this.data.banner.imgUrls.push(this.data.banner.imgUrls[0]);
//     this.setData({
//       'banner.imgUrls': this.data.banner.imgUrls
//     })

//   },
//   location(){
//     this.setData({
//       'banner.current': 2
//     })
//   },
//   onLoad: function () {
//     console.log(__wxRoute)
//     var that = this
//     //调用应用实例的方法获取全局数据
//     // app.getUserInfo(function (userInfo) {
//     //   //更新数据
//     //   that.setData({
//     //     userInfo: userInfo
//     //   })
//     // })
//   }
// })
