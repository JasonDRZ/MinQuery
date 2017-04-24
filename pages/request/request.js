//index.js
let $ = wx.MinQuery('request');

let items = $.setData('items', []);

const _page = $('page'), _add_comment = $("#add_comment"), _edit_first = $('#edit_first');

// 主函数必须运行，但元素的事件绑定及数据操作并不依赖于主函数执行。
$(function () {

  // Then.js的详细使用方法，请参考API文档：https://github.com/teambition/then.js/blob/master/README.md
  // 通过是用$.$when的each方法并行请求3组数据
  $.$when.each([1, 2, 3], function (cont, args) {
    // 使用complete保证then链的调用
    $.get('/posts/' + args).complete(function (res) {
      cont(null, res.data);
    })
  })
  // 异步成功返回调用的方法
  .then(function (cont, res) {
    items.set(res);
  })
  // 无论出错与否，总是会执行的方法，如果出现错误，result的结果数据将被忽略。
  .fin(function (cont, error, result) {
    console.log(error, result);
    cont();
  })
  // 最后的错误处理方法，所有的请求错误都将通过此方法或后续fail方法进行处理
  .fail(function (cont, error) {
    console.error(error);
  });



  // 页面初始化完成后，页面数据依然有效
  _page.on("load", function () {
    console.log(items.get());
  });

  // 简单数据提交
  _add_comment.on("tap", {
    title: 'foo',
    body: 'bar',
    userId: 1
  }, function (e) {
    $.showLoading("Submiting..");
    $.post('posts', e.$data).success(function (res) {
      $.hideLoading();
      items.append(res.data);
    })
  })

  _edit_first.on('tap', {
    id: 1,
    title: 'Edit - foo',
    body: 'Edit - bar',
    userId: 1
  }, function (e) {
    $.ajax({ url: '/posts/1', method: 'put', data: e.$data }).success(function (res) {
      console.log(res)
      items.set('[0]', res.data);
    })
  });

  $('#delete_comment').on("tap", function () {
    $.ajax('http://jsonplaceholder.typicode.com/posts/1', {
      method: 'DELETE'
    }).success(function (res) {
      items.remove(0);
    });
  })


});



