//index.js
let $ = wx.MinQuery('dataset');

let author = $.setData('author', "JasonDRZ");//与使用当个兑现字段的方法相同 $.setData({'author':"JasonDRZ"});
let info = $.setData({
  'gander': 'Male',
  'work': 'WEB Front-End'
})
let items = $.setData('items', [1, 2, 3, 4]);

let _multi_level = $.setData('multis', { info: { hobbies: ['Football', 'PingPang', 'Basketball'] } });
let _multi_level_2 = $.setData('multis_2', [{ info_1: { hobbies: ['Football', 'PingPang', 'Basketball'] } }, { info_2: { hobbies: ['Football', 'PingPang', 'Basketball'] } }]);

// 数据监听，全路径精确监听，只有当修改数据的键完全等于监听字段时，才会触发
$.watch('items',function(newV,oldV,path){
  console.log(newV,oldV,path);
})

// 模糊数据监听，只要存在类似字段被修改，则触发。
$.watch('hobbies',function(newV,oldV,path){
  console.log(newV,oldV,path);
  console.log($.getData(path));
},true)

// 主函数必须运行，但元素的事件绑定及数据操作并不依赖于主函数执行。
$(function () {
  console.info('复杂执行逻辑请一定使用此主运行方法来执行Page对象的自定义事件、数据绑定操作，确保自定义事件和数据的正确注入');

  // 单个数据设置字段进行更新
  $("#change_author").on('tap', function (e) {
    author.set('I am JasonD');
    console.log(e);
  })

  // 获取数据接口，支持dot分隔符查询形式，如：$.getData('info.user.name');$.getData('info.user.hobbies[0]');
  $("#get_author").on("tap", function () {
    $(this).text("我的爱好:");
    $.setData('author_hobby', _multi_level.get('info.hobbies[2]'));

    // 通过以下两种方式去设置和获取相应的数据
    // $.setData('multis_2[0].info_1.hobbies[0]',"Movies");
    _multi_level_2.set('[0].info_1.hobbies[0]', "Movies");

    // console.log($.getData('multis_2[0].info_1.hobbies[0]'));
    console.log(_multi_level_2.get('[0].info_1.hobbies[0]'));
  })

  // 多个设置字段进行数据更新
  $("#change_info").on('tap', function () {
    console.log(info.get('gander'));

    info.gander.set("I'm still a man!");
    info.set('gander', "No Woman");
    info.work.set('Working on WEB Front-End!');
  });

  $("#delete_info").on('tap', function () {
    // 默认设置为null
    author.clear();
    // 自定义清除值为空
    info.clear('');
  })

  // 向上添加
  $("#prepend").on('tap', function () {
    // 支持数组形式批量添加，请设置第二个参数为true
    console.info(items.prepend("prepend"));
  });

  // 向下添加
  $('#append').on('tap', function () {
    // 支持数组形式批量添加，请设置第二个参数为true
    console.log(items.append('append'));
    $('page').trigger('customEvent');
  });

  // 向上添加
  $("#prepend").on('tap', function () {
    // 支持数组形式批量添加，请设置第二个参数为true
    console.info(items.prepend("prepend"));
  });

  // 向下添加
  $('#append').on('tap', function () {
    // 支持数组形式批量添加，请设置第二个参数为true
    console.log(items.append('append'));
  })

  // 插入
  // 插入的index从0开始
  let b_t = 1, a_t = 1;
  $('#before').on('tap', function () {
    // 通过给before设置第三个参数为true，标示传入的数组是继承到源数据中的，而非插入数组作为一个数据。
    console.info(items.before(1, ['insert before!' + (b_t++), 'insert before!' + (b_t++)], true));
  });

  $('#after').on('tap', function () {
    // 未设置滴三个参数，则是插入一个数组元素，而非继承到源数据上
    console.info(items.after(1, ['insert after' + (a_t++), 'insert after' + (a_t++)]));
  });
  
  $("#delete").on("tap", function () {
    // 删除某个项
    items.remove(1);
  });

});





