//app.js
// var loadPlugin = require("../../plugins/loader").load;
var $ = require("MinQuery/index").load("app");
// $.app(function(){
//   this.on("launch",function(){

//   });
$(()=>{
  var app = $("app");
  var globalData = $.setData('globalData');
  app.on('launch',function(){
    console.info("App has onLaunched!!!!!!!!!!!!!!!")
  }).bind('userLogin',function(){
    $.showLoading('登录中。。。。');
    $.hideLoading(3000);
  })
  $.$on('getUserInfo',function(cb){
    var userInfo = globalData.get('userInfo');
    if(!!userInfo){
      typeof cb == "function" && $.$call(cb,userInfo);
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              globalData.set('userInfo',res.userInfo);
              typeof cb == "function" && $.$call(cb,res.userInfo);
            }
          })
        }
      })
    }
  })

  console.log($.getData('globalData'),app)
})


// })


// App({
//   minquery: $,
//   // loadPlugin: loadPlugin,
//   onLaunch: function () {
//     console.info("App has onLaunched!!!!!!!!!!!!!!!")
//     //调用API从本地缓存中获取数据
//     var logs = wx.getStorageSync('logs') || []
//     logs.unshift(Date.now())
//     wx.setStorageSync('logs', logs)
//   },
//   getUserInfo:function(cb){
//     var that = this
//     if(this.globalData.userInfo){
//       typeof cb == "function" && cb(this.globalData.userInfo)
//     }else{
//       //调用登录接口
//       wx.login({
//         success: function () {
//           wx.getUserInfo({
//             success: function (res) {
//               that._userInfo = res.userInfo;
//               that.globalData.userInfo = res.userInfo
//               console.log(res.userInfo)
//               typeof cb == "function" && cb(that.globalData.userInfo)
//             }
//           })
//         }
//       })
//     }
//   },
//   globalData:{
//     userInfo:null
//   }
// })

var tabbar = {
  "tabBar": {
    "list": [{
      "pagePath": "pages/scan_store/scan_store",
      "text": "首页",
      "iconPath": "images/Grid.png",
      "selectedIconPath": "images/Grid.png"
    },{
      "pagePath": "pages/index/index",
      "text": "进店",
      "iconPath": "images/Camera.png",
      "selectedIconPath": "images/Camera.png"
    },{
      "pagePath": "pages/index/index",
      "text": "我的",
      "iconPath": "images/User.png",
      "selectedIconPath": "images/User.png"
    }]
  }
}