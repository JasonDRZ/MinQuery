# MinQuery

MinQuery是一款针对WeChat-Min-App的一套轻量级代码工具库。旨在简化小程序开发管理流程，降低开发门槛，提高开发效率。

## API文档
[中文API文档](href "https://github.com/JasonDRZ/MinQuery/blob/master/MinQuery-API.md")

## 主要特性
1. 针对已有的小程序原生API进行简单二次封装，支持更多对原生API的简洁调用方式及链式调用方式。
2. 托管小程序页面JS处理主函数逻辑，提高代码可读性及可维护性。
3. 规范小程序页面数据字段类型，提高页面逻辑管理效率。
4. 统一元素事件处理入口，让事件管理就像jQuery一样简单。
5. 引入全局事件及跨页面事件管理机制，让跨页面间的模块调用变得简单。
6. 引入第三方Teambition的then.js库作为promise处理替代，提高同、异步操作效率。

## 快速入门
#### 安装
你可以通过GitHub直接下载Zip包进行解压。

~~后续可以通过npm进行安装~~（将在后续发布到NPM中供依赖安装使用）;

```js
//$ npm install minquery
```

#### 引用MinQuery
你只需要在根目录下的`app.js`目录下引用一次MinQuery库，后续页面的开发即可直接调用wx.MinQuery进行调用。

```js
<!--引用MinQuery库-->
let MinQuery = require("../path/MinQuery");
```
#### 载入App对象
```js
<!--通过'app'标识挂载App()实例方法-->
let $ = MinQuery.load("app");

//# 运行App实例
$(()=>{
    <!--bind some events or data-->
})
```

#### App事件绑定，数据绑定

```js
$(()=>{
    let _app = $('app');
    <!--原生事件监听-->
    _app.on('launch',function(){});
    <!--自定义事件绑定-->
    _app.bind('customHandler',function(data){});
    _app.data("userInfo","JasonD");
})
```

#### 载入Page对象
```js
<!--通过传入当前页面名称，来获取Page()实例方法-->
let $ = MinQuery.load("pageName");
//# 运行Page实例
$(()=>{
    <!--bind some element events or data-->
})
```
> 请注意：每个页面处理JS调用MinQuery时必须使用`load`方法注册当前页面或App，请确保传入的`pageName`名称与当前页面的名称相同，及`pageName`的唯一性，以便后续开发进行跨页面调用操作使用。

#### Page事件绑定,及元素事件绑定，数据绑定

```js
$(()=>{
    <!--页面数据-->
    let _title = $.setData('title','Hello Word!');
    let _page = $('page');
    <!--原生事件监听-->
    _page.on('load',function(){});
    <!--自定义事件绑定-->
    _page.bind('customHandler',function(data){});
    <!--元素事件-->
    $('#ele').on('tap',function(){
        $(this).addClass('active')
            .data('url','https://github.com/JasonDRZ/MinQuery');
    }).on('touchstart',function(){});
    
})

```

### 代码规范
1. MinQuery内置方法或参数基本以`$`符号开头，请避免在开发中自定义以`$`符号开始的绑定参数或函数，以免混淆。
2. 不推荐使用原生Page方法实例上的`setData`进行数据修改，这可能会导致框架管理的数据发生变化，从而导致异常错误。
3. 推荐使用框架内置的Then.js作为`Promise`替代方法进行使用，简单、高效。

# 解决的问题
#### 1. 剥离小程序数据管理为一个独立模块。
小程序原生数据管理是将数据集中挂载到`data`对象下面，一旦数据量增大，将导致数据管理变得异常麻烦。于是我将`setData`接口进行了独立式扩展封装，使得设置、获取和操作数据变得更加简单高效。并且新封装的`setData`接口会对设置数据进行一次新旧数据对比，只有当数据确实存在差异时才会进行视图数据更新，降低了无效的数据更新引发的视图假更新带来的额外开销。

官方数据管理方式
```js
//page-index.js
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //#view元素事件处理函数
  bindViewTap: function() {
    console.log('#view clicked');
    this.setData({
        'userInfo.name': 'JasonD'
    })
  },
  //页面事件
  onLoad: function () {
    console.log('onLoad');
    console.log(this.data.motto);// => 'Hello World'
  },
  onShow: function () {
    console.log('onShow')
  }
  ...
})
```
使用MinQuery之后
```js
//page-index.js
let $ = MinQuery.load("page-index");

let _page = $('page');
let _motto = $.setData('motto','Hello World');
let _userInfo = $.setData('userInfo',{});

//也可以进行统一设置
//  let _dataPre = $.setData({
//    motto: 'Hello World',
//    userInfo: {}
//  });

<!--运行Page实例方法-->
$(()=>{
    //给id值为view的元素绑定tap事件
    $("#view").on("top",function(e){
        console.log('#view clicked');
        _userInfo.set('name','JasonD');
    })
    
    //页面事件绑定
    _page.on('load',function(){
        console.log('onLoad');
        console.log(_motto.get());// => 'Hello World'
    }).on('show',function(){
        console.log('onLoad');
    });
})
```
#### 2. 托管小程序运行方法
MinQuery托管了小程序的App处理对象以及Page处理对象，使开发者在开发过程中具有更好的开发扩展性，便于模块化管理。

#### 3. 统一事件处理入口
原生小程序给元素绑定不同事件时，需要设置不同名称的调用函数来作为元素的事件处理方法。少量的元素事件管理起来还得心应手，但是一旦元素事件多了，这样的管理方法就比较吃力了。并且，单个的事件处理函数与数据关联性并不明确，导致很多时候管理处理方法与数据之间的关联变得非常费力。

原生事件绑定及数据绑定，事件与数据缺乏关联性

```html
<view catchtap="catchEvent">
    <!--data-m-class选择器-->
    <view 
        class="log-item {{someClass_1}}" 
        style=" {{someStyle_1}}" 
        bindtap="bindEventFirst">绑定事件处理class及style</view>
        
    <!--id选择器-->
    <view
        animation="{{someAnimation}}" 
        style="{{someStyle_2}}"
        bindtap="bindEventSecond">绑定事件处理animation及style</view>
</view>

```

使用MinQuery之后，只需根据事件类型，分调用`$catch`或`$bind`事件处理器即可，不用再命名其他函数名称。

```html
<view catchtap="$catch">
    <!--data-m-class选择器-->
    <view 
        class="log-item {{$cs.c_class.$class}}" 
        style=" {{$cs.c_class.$style}}" 
        data-m-class="c_class" 
        bindtap="$bind">mClass事件绑定，控制后续class的增删，js定义style</view>
        
    <!--id选择器-->
    <view 
        id="c_id" 
        animation="{{$id.c_id.$animation}}" 
        style="{{$id.c_id.$cssAnimation}}"
        bindtap="$bind">id事件绑定，控制原生animation动画，控制css animation 动画</view>
</view>

```

#### 4. 封装优化原生接口，支持链式调用
原生的 `wx` 对象方法几乎清一色的使用对象形式进行参数传递，并且不支持链式调用方法，使得几乎每次调用方法都需要传入一个对象，甚是麻烦。

原生调用

```js
//request官方Demo
wx.request({
  url: 'test.php', //仅为示例，并非真实的接口地址
  data: {
     x: '' ,
     y: ''
  },
  header: {
      'content-type': 'application/json'
  },
  success: function(res) {
    console.log(res.data)
  }
})
```
MinQuery调用

```js
//简单get请求方法
$.get('test.php',{
     x: '' ,
     y: ''
  }).success(function(res){
    console.log(res.data)
  });
//或使用ajax方法出入官方Demo形式的object等
```
MinQuery封装方法调用规范及注意事项，请参考【MinQuery小程序二次封装API使用指南】

#### 5. 新增跨页面事件注册、触发、销毁等方法
原生小程序的开发，解决全局事件分发的方法是在`App`实例对象上注册处理方法，然后其他页面通过`getApp`接口获取实例调用该方法。这样的处理形式存在一定的局限性。

这里只演示使用MinQuery注册全局事件的方法：

注册全局事件

```js
<!--你可以在任何一个页面（包括app.js文件）注册此事件处理方法-->
$.$on('globalEvent',function(cb){
    var userInfo = globalData.get('userInfo');
    if(!!userInfo){
        //使用$.$call 或 $.$apply方法将绑定当前框架作用域到回调函数中。
        $.isFunction(cb) && $.$call(cb,userInfo);
    }else{
        //调用登录接口
        $.login().success(function () {
          $.getUserInfo().success(
            function (res) {
                globalData.set('userInfo',res.userInfo);
                $.isFunction(cb) && $.$call(cb,res.userInfo);
            })
        });
    }
})
```
全局事件触发

```js
$.$trigger('globalEvent',function(info){
    // 通过dataAccess方法获取到globalData，的hook函数
    let globals = this.dataAccess('globalData');
    console.log(globals.get());
    console.info("I have success getUserInfo!!!",i)
})
```

## 开发应用说明

#### data- 自定义属性占用字段表
MinQuery中的`data`自定义属性，主要用于辅助和扩展MinQuery进行元素事件触发时对元素进行校验等工作，请不要在生产时占用该属性列表中的属性，这可能会导致MinQuery的处理出错。

自定义属性 | 必填 | 用途 | 实现否
---|---|---
data-m-class | 否 | `.className`样式选择器查询对象 | 已实现

```html
<view data-m-class="m-class" bindtap="$bind">'m-class'将可用于选择器进行事件标识</view>
```
```js
<!--当item元素被点击时，事件处理方法将发生流转-->
$(".m-class").on("tap",function(e){
    <!--这里是'm-class'元素被点击后的处理内容-->
})
```

#### 元素事件处理器
使用元素事件处理器，让你很轻松的管理单个或多个元素的事件处理方法，不用在Page实例对象上创建一长串的单个处理函数了。事件处理器将进行统一管理，让你能更加直观的管理对应元素事件处理方法，更有助于后期维护。

方法名 | 处理对象 | 实现否
---|---
`$bind` | 元素的bind绑定事件处理器 | 已实现
`$catch` | 元素的catch捕捉事件处理器 | 已实现

这两个事件处理器通过你可以绑定到元素对应类型的事件处理方法中。如：

```html
<view class="item" data-m-class="catchClassSelector" catchtap="$catch">
    捕捉事件
    <view class="item" data-m-class="bindClassSelector" bindtap="$bind">绑定事件</view>
</view>
```
使用事件统一处理器让你不需要关心事件处理函数名称是否与`wxml`页面中调用的函数名相同，仅仅需要按照两种不同类型事件进行分类调用即可。
```js
$(".catchClassSelector").on("tap",function(e){
    <!--do something here-->
});
$(".bindClassSelector").catch("tap",function(e){
    <!--do something here-->
})
```

#### 选择器列表
> 这里的选择器是能够使用$()进行直接查询的选择器

选择器 | 处理对象 | 调用方法 | 实现否
---|---
#elem-id | 用于生成数据或绑定触发事件到对应的id元素上 | $("#elem-id") | 已实现
.elem-data-m-class | 用于生成数据或绑定触发事件到对应的data-m-class元素上 | `$(".m-class") `| 已实现
window | 存储所有系统信息、处理系统底层事件绑定，如getNetworkType| `$("window")` | 待完善
page | 获取当前Page的框架镜像实例对象，并对其操作| `$('page')` | 已实现
app | 用于获取并操作App对象上的事件或数据| `$('app')` | 已实现

##### window对象功能
通过`$("window")`查询得到的window对象，并非正真的`window`对象，而是小程序设备信息及事件的封装。

返回的数据对象主要为`systemInfo`，不过做了部分调整：

```js
var res = $("window"),sys = wx.getSystemInfoSync();
<!--字段对照-->
    <!--变化-->
    res.DPI        ==   sys.pixelRatio;//true
    res.width      ==   sys.windowWidth;//true
    res.height     ==   sys.windowHeight;//true
    <!--未变-->
    res.language   ==   sys.language;//true
    res.versino    ==   sys.version;//true
    res.platform   ==   sys.platform;//true
    res.model      ==   sys.model;//true
    res.system     ==   sys.system;//true
    <!--方法镜像-->
    res.callup(phoneNumber)     ==   wx.makePhoneCall();
    res.scan(callback)     ==   wx.scanCode();
```
>后续将增加`$("window").on()`绑定监听设备事件方法。

#### 9. 元素事件处理机制
每个元素的所有事件均可以通过`$bind`、`$catch`两个MinQuery预制的两个类型的事件处理方法进行统一处理，但是每一个不同的事件都是需要在对应的元素上绑定对应类型的事件，这样MQ才能正确的管理每个事件对应的事件处理回调方法。

在JS方面，对元素绑定事件可以使用`on()`实例方法（或是`bind()`实例方法）和`catch()`实例方法,对元素进行事件处理回调函数的绑定操作。这样，对应的事件触发会执行当前被绑定的方法。

JS中对元素绑定的事件必须存在同类型的元素事件绑定方法，这样的才能生效。如：给元素`#elem`绑定`tap`事件，则必须在对应的元素上使用`bindtap="$bind"`或`catchtap="$catch"`给对应的事件触发器传入统一事件处理方法。否则JS中绑定的事件将不会被元素出发。

每个绑定的事件处理函数在元素触发的时候都会有`event`对象的参数传入匿名函数，类似小程序原生的事件对象，只不过这里做了一些简易的封装处理。

>注意：`bind()`对元素的事件绑定的处理机制与`on()`相同，但在处理page选择器对象的方式上与`on()`的行为是不同的，这个后面会讲到。
