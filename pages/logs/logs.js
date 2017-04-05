//logs.js
// var util = require('../../utils/util.js')
// Page({
//   data: {
//     logs: []
//   },
//   onLoad: function () {
//     console.log(__wxRoute)
//     this.setData({
//       logs: (wx.getStorageSync('logs') || []).map(function (log) {
//         return util.formatTime(new Date(log))
//       })
//     })
//   }
// })
var $ = require("../../MinQuery/index").load("logs");
var userName = $.setData({ "userName": "JasonDRZ" });
$((_$) => {

  $.$on("user-login", function (e) {
    console.log(e)
  });
  
  $.$watch("user", function (n, o, p) {
    console.info(`Got userName value changes.New: ${n},Old: ${o}`, p);
  }, true)
  // console.log(_$(".name,#elements"));
  var _page = $("page");
  var $coustom = $("$coustomOne");
  var canvas = $("#myCanvas");
  var _window = $("window").get(0);
  var canvasData = //$.canvas("customCanvas")

    canvas.canvas(function () {
      this.setFillStyle('red')
      this.fillRect(10, 10, 150, 75)
    });
  // setInterval(function(){
  canvas.on("touchmove", function (e) {
    console.log(e);
    $(this).canvas(function () {
      this.setFillStyle('red')
      this.fillRect(e.touches[0].x, e.touches[0].y, 150, 75)
    })
  });
  // },13);
var __vedio = $("#myVideo").on("pause",function(e){
  console.log("Pause:",e);
  wx.chooseAddress({
  success: function (res) {
    console.log(res.userName)
    console.log(res.postalCode)
    console.log(res.provinceName)
    console.log(res.cityName)
    console.log(res.countyName)
    console.log(res.detailInfo)
    console.log(res.nationalCode)
    console.log(res.telNumber)
  }
})
}).on("tap",function(e){
  console.log("vedio tap:",e)
}).vedio()


  $.ajax('https://minapp.ieyuan.com/jwhudong/api.php?op=content&module=comm&catid=67&page=1&state=0', (res, state) => {
    console.log(res, state);
    console.info($('app'));
  }).success((res, state) => {
    console.log(res);
  }).fail((res, state) => {
    console.log(res);
  })
  var ctx = canvas.canvas(true);
  // ctx.setFillStyle('red')
  // ctx.fillRect(10, 10, 150, 75)
  // ctx.draw()


  var secondSelector = $(".secondClassSelector");
  secondSelector.config("name", "JasonDRZ");
  secondSelector.config("gander", "男");
  secondSelector.config("height", "168cm");
  secondSelector.on("tap", function (e) {
    __vedio.send(userName.get());
    console.info(e.data('mClass'));
    userName.set("JasonDRZ&CSQ");
    console.log($(this).config().name("JSONAFDFS"));
    console.log($(this).config().name());
    $(this).toggleClass("active", "disable").delay(2000).cssAnimation("box-shadow: 0 0 10px #000;transform: scale(1.1);", 300).delay(3000).cssAnimation("border: 1px solid #444;background: #1f2a3d;", 800, ".17, .86, .73, .14").delay(4800).cssAnimation({
      "margin-top": "20px",
      "margin-bottom": "40px"
    }, 300)
  }).on("touchstart", function (e) {
    // console.log(e)
  })
  _page.bind("custom", "ready to go", function (e) {
    console.info("Page ready event has a custom handler!", e);
    $.navigateTo("../test-1/test-1")
  })
  _page.on("ready", "ready to go", function (e) {
    console.info("Page ready event has a custom handler!", e)




    $coustom.animation(function () {
      console.log(this)
      this.scale(2, 2).rotate(45)
    }, 3000, "ease").delay(3000).animation(function () {
      this.translate(30).rotate(0, -45)
    }, 5000, "linner", "0% 50%")




  }).registerEvent("ready", function () {
    console.log("第一个page ready注册事件！", $.app("globalData"))
  }).registerEvent("ready", function () {
    console.log("第二个page ready注册事件！", $.pages())
  })
  _page.on("load", { name: "pageLoader2" }, function (op) {
    console.info("Page load event has a custom handler!", op);
  })
  // console.log(_page[0]);
  // console.info($.pageInheritEventKVPair);
  // console.info($.eventManager)
})