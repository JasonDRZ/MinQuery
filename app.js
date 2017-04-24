//app.js
// var loadPlugin = require("../../plugins/loader").load;
// var $ = require("MinQuery.1.0.2.min").load("app");
require("MinQuery/index");
wx.MinQuery.debug(true,function(errors){
  console.log(errors);
});

let $ = wx.MinQuery("app");

$(()=>{
  // 设置ajax请求服务器
  $.$servers('ajaxServer','https://jsonplaceholder.typicode.com/');
  var app = $("app");
  var globalData = $.setData('globalData',{});
  var arrayData = $.setData("items",[['inner1']]);
  app.on('launch',function(e){
    // 这里的scene字段做了调整，新的scene字段是一个类型数组，第一个元素为进入场景类型编码，第二个字段是场景类型的官方描述。
    // 这样的方式方便开发过程中进行有效的验证和描述查看，不需要每次都查看开发文档进行一一对照。
    console.info("App has onLaunched!!!!!!!!!!!!!!!",e)
  })
  
  .bind('userLogin',function(cb){
    console.log(cb);
    $.$call(cb.call,"尼玛，传过来了！！")
    $.showLoading('登录中。。。。');
    $.hideLoading(3000);
  }).data("userInfo","用户信息！！！");
  
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
})

// ,
//     "pages/dataset/dataset",
//     "pages/pageevent/pageevent",
//     "pages/request/request",
//     "pages/form/form",
//     "pages/components/components",
//     "pages/simple_app/simple_app",
//     "pages/elements/elements"

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