//index.js
let $ = wx.MinQuery('elements');



let _swiper = $("#swiper_id");
// <!--组件配置-->
_swiper.config({
  indicatorDots: true,
  autoplay: true,
  current: 0,
  interval: 1000,
  duration: 1000
})
// 设置当前元素的数据
.data([
  'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
  'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
  'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
]);


// 主函数必须运行，但元素的事件绑定及数据操作并不依赖于主函数执行。
$(function () {
  $("page").on('load',function(){
    console.log(_swiper);
  })
  // <!--组件事件-->
  _swiper.on('change', function (e) {
    console.log(e);
  }).on('touchstart', function (e) {
    $(this).config('autoplay', false);
  }).on('touchend', function (e) {
    $(this).config().autoplay(true);
  });

});

