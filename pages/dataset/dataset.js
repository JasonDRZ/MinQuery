//index.js
let $ = wx.MinQuery.load('dataset');

let author = $.setData('author',"JasonDRZ");//与使用当个兑现字段的方法相同 $.setData({'author':"JasonDRZ"});
let info = $.setData({
  'gander': 'Male',
  'work': 'WEB Front-End'
})
let items = $.setData('items',[1,2,3,4]);

let _multi_level = $.setData('multis',{info: {hobbies: ['Football','PingPang','Basketball']}});

console.log($.getData('multis.info.hobbies[0]'));
// 单个数据设置字段进行更新
  $("#change_author").on('tap',function(){
    author.set('I am JasonD');
    console.log($.getData('multis.info.hobbies[0]'));
  })
  // 获取数据接口，支持dot分隔符查询形式，如：$.getData('info.user.name');$.getData('info.user.hobbies[0]');
  $("#get_author").on("tap",function(){
    $.setData('get_author',$.getData('author'));
  })
  // 多个设置字段进行数据更新
  $("#change_info").on('tap',function(){
    info.gander.set("I'm still a man!");
    info.work.set('Working on WEB Front-End!');
  });
  $("#delete_info").on('tap',function(){
    // 默认设置为null
    author.clear();
    // 自定义清除值为空
    info.clear('');
  })

// 主函数必须运行，但元素的事件绑定及数据操作并不依赖于主函数执行。
$(function(){
  
  // 向上添加
  $("#prepend").on('tap',function(){
    items.prepend("prepend");
  });
  // 向下添加
  $('#append').on('tap',function(){
    items.append('append');
  })
 

});

 // 插入
  // 插入的index从0开始
  let b_t = 1,a_t = 1;
  $('#before').on('tap',function(){
    items.before(1,'insert before!' + (b_t ++));
  });
  $('#after').on('tap',function(){
    items.after(1,'insert after' + (a_t++));
  });
  $("#delete").on("tap",function(){
    items.remove(1);
  });