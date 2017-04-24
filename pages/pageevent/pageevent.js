//index.js
let $ = wx.MinQuery('pageevent');

let author = $.setData('author', "");//与使用当个兑现字段的方法相同 $.setData({'author':"JasonDRZ"});
let info = $.setData({
  'gander': '',
  'work': ''
})

const _page = $('page');

// 主函数必须运行，但元素的事件绑定及数据操作并不依赖于主函数执行。
$(function () {
  console.info('复杂执行逻辑请一定使用此主运行方法来执行Page对象的自定义事件、数据绑定操作，确保自定义事件和数据的正确注入');
  
  // 在Page实例对象上绑定自定义处理方法
  _page.bind('changeAuther', function () {
    author.set('I am JasonD');
  })
  // 原生Page页面事件监听
  .on("ready",function(){
    author.set('JasonDRZ');
  }).on('load',function(e){
    console.log(e)
    info.gander.set('Male');
    info.work.set("WEB Front-End");
  });
  

});



