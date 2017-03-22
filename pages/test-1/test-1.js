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
var $ = wx.MinQuery.load("test-1",true);

// 与设置一个userName的data值
$.setData({ "userName": "test page one !" });
$((_$) => {
  // 暂存查询实例
  var _page = $("page");
  
  var canvas = $("#myCanvas");
  // 使用canvas封装接口时，让你不需要调用小程序canvas创建上下文的接口，传入匿名函数时可以不书写ctx.draw()方法，框架将自动补全
  canvas.canvas(function(){
    this.setFillStyle('red')
    this.fillRect(10, 10, 150, 75)
  })
  // 你也可以直接暂存canvas实例，通过传入一个布尔类型
  var ctx = canvas.canvas(true);
  // 暂存的ctx对象你可以在当前域的任何地方进行调用，不过必须在绘制的最后使用ctx.draw()方法
    // ctx.setFillStyle('red')
    // ctx.fillRect(10, 10, 150, 75)
    // ctx.draw()
  // 创建自定义封装对象：如果传入一个非框架内默认识别的查询器名称，框架将直接使用这个名称在data根对象上创建MQ实例，让你可以对这个对象使用近乎所有的实例方法
  var _custom = $("customOne");
  _custom.on("updata",{name: "_custom",gender: 1},function(e) {
    // body...
    
  })

  // data-m-class选择器元素事件绑定
  $(".cone").on("tap", function (e) {
    console.log(e);
    _custom.stop();
    // _page.trigger("custom", "trigger data")
    ctx.setFillStyle('red')
    ctx.fillRect(18, 18, 150, 75)
    ctx.draw()
  })


  // var secondSelector = ;
  $(".ctwo").attr("name", "JasonDRZ");
  $(".ctwo").bind("tap", function (e) {
    $.setData({ "userName": "This is a test page one!" });

    $(this).toggleClass("active", "disable").delay(2000).cssAnimation("box-shadow: 0 0 10px #000;transform: scale(1.1);", 300).delay(3000).cssAnimation("border: 1px solid #444;background: #1f2a3d;", 800, ".17, .86, .73, .14").delay(4800).cssAnimation({
      "margin-top": "20px",
      "margin-bottom": "40px"
    }, 300)
    $(_page).data("name", "JasonDRZ&CSQ");
    $.$trigger("user-login","trigger form test-1");
    $.$off("user-login",['!logs'])
    return this.$selectorName;
  }).on("touchstart", function (e) {
    // console.log(e)
  })//.css("transition: all 3000ms cubic-bezier(.17, .86, .73, .14)");
  _page.on("ready", "ready to go", function (e) {
    console.info("Page ready event has a custom handler!", e)
  })
  _page.bind("custom", "ready to go", function (e) {
    console.info("Page ready event has a custom handler!", e)
  })
  _page.on("ready", "ready to go", function (e) {
    console.info("Page ready event has a custom handler!", e)
    _custom.animation(function () {
      console.log(this)
      this.translate(100, 100).rotate(45)
    }, 3000, "ease").delay(3000).animation(function () {
      this.translate(30).rotate(0, -45)
    }, 5000, "linner")
  })
  _page.on("load", { name: "pageLoader" }, function (op) {
    console.info("Page load event has a custom handler!", op);
  }).on("unload",function(){
    console.info("我退出啦！！")
  })
})
// $(".name,#elements").trigger("load",true,function(res){
//   console.info(res)
// });