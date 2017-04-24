//index.js
let $ = wx.MinQuery('components');

let _swiper = $("#swiper_id");
// <!--组件配置-->
_swiper.config({
  indicatorDots: true,
  autoplay: true,
  current: 1,
  interval: 10000,
  duration: 1000
})
// 设置当前元素的数据，你也可以直接给data方法赋值一个banner数组，视图调用的时候就只需要调用$data字段就能渲染了
// <block wx:for="{{$id.swiper_id.$data}}"><slide-item></slide-item></block>
.data({banner: [
  'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
  'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
  'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
],current: 0});


// 主函数必须运行，但元素的事件绑定及数据操作并不依赖于主函数执行。
$(function () {
  // <!--Swiper组件-->
  _swiper.on('change', function (e) {
    _swiper.data('current', e.detail.current + 1);
  }).on('touchstart', function (e) {
    let _this = $(this);
    _this.config('autoplay', false);
    _this.attr({a: 12,d: 1231});
  }).on('touchend', function (e) {
    $(this).config('autoplay',true);
  });
  $("#slide_to_first").on('tap',function(){
    Thenjs
    _swiper.config('current', 0);
  })

});