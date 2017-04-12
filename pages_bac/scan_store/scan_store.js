// pages/scan_store/scan_store.js
var app = getApp();
var pageConfig = {};
// console.log(app);
var $ = wx.MinQuery.load("scan_store");
// var m = require("../..//index");
// console.log(m);
// console.log(m.inArray)
// var $ = app.minquery;
// console.log($)
$(function () {
  $.setData({
    switcher: {
      header: { comment: "", history: "active" }
    },
    monkeys: [{
      id: "0",
      propertys: {
        name: "JasonD",
        gender: "male"
      }
    }, {
      id: "1",
      propertys: {
        name: "JasonDR",
        gender: "female"
      }
    }, {
      id: "2",
      propertys: {
        name: "JasonDZ",
        gender: "male"
      }
    }],
    storageTest: wx.getStorageSync('monkey')
  });

  // 根数据选择器
  // $("@switcher").key("header").key("comment").value("active").end();
  // $("@switcher").find("id=12");
  // $("@switcher").find(function (e, i) { return e.id == '0'}).key("event").value([1,3,3]);


  $("page").on("load", function (options) {
    console.log(__wxRoute)
    console.log("onLoad 事件加载完成");
    // $("$tab_header").data([{'id': "123",'property': { 'monkey': "Jason" } }, { '2': { 'monkey': "Juny" } }], true);
    console.log($.getData("monkeys"));
    wx.setStorageSync('monkey', "我嗯是的沙发上的酸辣粉见识到了房间撒的发生了")
  }).on("ready", function () {
    console.log(this);
  }).on("show", function () {
    wx.showToast({
      title: "显示",
      icon: 'success',
      duration: 2000
    });
  }).on("hide", function () {
    wx.showToast({
      title: "隐藏",
      icon: 'success',
      duration: 2000
    });
  })
    .bind("tapSwitcher", function (e) {
      console.log(e.target.id)
    }).bind("formSubmit", function (e) {
      console.log(e)
    }).bind("formReset", function (e) {
      console.log(e)
    }).bind("gotolog", function () {
      wx.navigateTo({
        url: '../logs/logs'
      })
    });


  $(".monkey").on("tap", function (e) {
    this.children().all().css("color", "#000");
    this.children().current().css("color", "red");
    console.log(e.attr("id"))
  });
  $(".o_list").on("tap", function (e) {
    console.log("Scope Taped")
    this.children().current().css("color", "red");
    this.children().current().toggleClass("borderText");
    this.children().filter("16").addClass("borderText");
  });
  $(".tab_header").on("tap", function (e) {
    console.log(this.children().current().hasClass("active"))
    this.children().all().removeClass("active");
    this.children().current().addClass("active");
  })//.children(()=>{
    //return ["history", "comment"];
  // }).filter(0).addClass("active").end()
  //   .on("longtap", function (e) {
  //     console.log(e);
  //   });
  $(".tab_header_box").catch("tap", function (e) {
    console.log(this);
    console.log(e)
    console.log($("window"))
  })
})




