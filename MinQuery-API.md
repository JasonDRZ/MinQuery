# 小程序MinQuery框架开发接口文档

谁说小程序就不能支持使用jQuery的方法了呢？

MinQuery则由此而生，它是一款针对WeChat-Min-App的类jQuery开发管理库，它允许开发者使用类似jQuery的代码书写方式和数据管理模式进行代码逻辑的书写，并且有序、高校的管理你的小程序数据结构。让你在项目开发中能够更加轻松的进行页面数据的操作，元素事件的监听绑，元素样式、动画等属性等等操作。

> 先睹为快




**MinQuery —— 旨在简化小程序开发管理流程，降低开发门槛，提高开发效率。**

[github地址](https://github.com/JasonDRZ/MinQuery/)

[使用简介](https://github.com/JasonDRZ/MinQuery/blob/master/README.md)

## 安装使用
#### 安装
你可以通过GitHub直接下载Zip包进行解压。

项目根目录分别存在两个MinQuery文件，分别是源码版和发布版

源码版：Size 132kb
```text
 MinQuery.1.0.2.js
```

发布版：Size 44kb
```text
 MinQuery.1.0.2.min.js
```
发布版代码经过了代码压缩工具压缩及Babel 处理，文件体积变得更加适合开发使用。如果仅为开发，建议使用发布版代码。如需做个性修改，请使用源码版。

请自行根据应用场景进行选择。

~~后续可以通过npm进行安装~~（将在后续发布到NPM中供依赖安装使用）;

```js
//$ npm install minquery
```

#### 引用MinQuery
你只需要在根目录下的`app.js`目录下引用一次MinQuery库，后续页面的开发即可直接调用wx.MinQuery进行调用。

```js
<!--引用MinQuery库-->
let MinQuery = require("../path/MinQuery");
//此方法只需在app.js文件中引用一次，后续页面中可以使用一下方式进行访问。
MinQuery === wx.MinQuery //=>true
```

## Debug模式

MinQuery拥有一套较为健全的Error机制，用于在开发过程中捕获使用MinQuery开发时出现的各种Error问题，并方便开发进行Bug的修改等工作。**建议开发时开启，此模式！**

> 你只需要在app.js文件中开启后，即可全局开启调试模式。

app.js

```js
let MinQuery = require("../path/MinQuery");

//也可以适应wx.MinQuery.debug()方法，两方法等价。
MinQuery.debug(true,function ErrorHandler(){
    <!--此方法用于自定义错误处理方法-->
    <!--框架默认以error形式打印到控制台-->
});

```


**开发完成后请关掉debug模式，以免降低程序的运行效率。**

## MinQuery页面注册

**wx.MinQuery模块必须要传入一个当前页面的标识`pageName`才能正确注册并加载页面方法，并且要确保每一个`pageName`的唯一性。以便后续开发使用`$.page(pageName)` 接口，进行跨页面调用操作使用。注册完当前页面之后，所返回的才是MinQuery主框架方法集。**

> 使用方法

```js
/**
* pageName: [String] 'app' 或是不同的 'pageName'
* recoveryMode: [Boolean] 标示是否开启页面还原模式，默认为false
*/
let $ = wx.MinQuery(pageName,recoveryMode);
```
**关于`recoveryMode`，存在这个参数的主要原因是因为MinQuery框架会缓存几乎每一个页面的数据，这可能对某些页面需要打开时就是一个新状态的需求不符。故框架使用此参数标识是否对此页面开启数据恢复初始化的模式。请尽可能的少的对页面设置此参数，因为可能会造成额外的一部分性能开销。**

这里使用 `$` 来标示返回后的主框架名称。并且，每个页面注册后返回的 `$` 存在数据上的唯一性。

> 载入App对象

```js
<!--官方调用方法-->
App({
    onLaunch(){},
    globalData: {},
    ...
})

<!--MinQuery方法-->
<!--通过'app'标识挂载App()实例方法-->
let $ = MinQuery("app");

//# 运行App实例，此方法的调用为非必须的，但为保证在复杂结构中进行有效数据注入，请规范使用，并手动运行此方法
$(()=>{
    <!--bind some events or data-->
})
```

> 载入Page对象

```js
<!--官方调用方法-->
Page({
    data: {},
    onLoad(){},
    ...
})

<!--MinQuery方法-->
<!--通过传入当前页面名称，来获取Page()实例方法-->
let $ = wx.MinQuery("pageName");
//# 运行Page实例，此方法的调用为非必须的，但为保证在复杂结构中进行有效数据注入，请规范使用，并手动运行此方法
$(()=>{
    <!--bind some element events or data-->
})
```

## $.$servers() 服务器地址设置
服务器地址的设置的主要目的是为了简化异步请求url输入长度，和其他资源请求的url链接长度，让你在开发过程中部用每次的网络的请求都是用全链接进行请求设置。
当然，你也可以在实际接口请求中写入完整的地址，对应方法将自动判断是否需要进行补全。
主要设置方法如下：

> 服务器地址配置

你可以在任何页面处理逻辑中进行服务器地址的设置和更改，但我们建议在`app.js`文件中进行统一设置。

主要服务器地址类型

服务器类型字段 | 使用场景描述
---|---
`ajaxServer` | 设置公共的ajax请求服务器地址，在使用框架中ajax方法时，可自动补全服务器地址。
`socketServer` | 设置Socket服务器地址，在使用框架中$.conectSocket()方法时，可自动补全服务器地址。
`uploadServer` | 设置upLoadFile服务器地址
`downloadServer` | 设置downloadFile服务器地址
`imageServer` | 设置图片服务器地址
`imageLocal` | 设置图片服务器地址
`audioServer` | 设置音频服务器地址
`videoServer` | 设置视频服务器地址

app.js

```js
<!--单个服务器地址设置-->
$.$servers('ajaxServer','https://jsonplaceholder.typicode.com/');
<!--多个服务器地址统一设置-->
$.$servers({
    'ajaxServer': 'https://www.api.com/ajax'//设置公共的ajax请求服务器地址
    'socketServer': 'https://www.api.com/socket' //设置Socket服务器地址
    'uploadServer': 'https://www.api.com/upload' //设置upLoadFile服务器地址
    'downloadServer': 'https://www.api.com/download' //设置downloadFile服务器地址
    'imageServer': 'https://www.api.com/image' //设置图片服务器地址
    'audioServer': 'https://www.api.com/audio' //设置音频服务器地址
    'videoServer': 'https://www.api.com/video' //设置视频服务器地址
})
```
如果你在设置过程中不知道该设置那些服务器累心字段，你可以直接运行 `$.$servers()` 方法，打印出它的返回值。返回值里面会列出哪些服务器字段已经设置了，哪些字段还没有设置。


```js
console.log($.$servers());//打印服务器所有类型
```

> 获取服务器地址

你可以在任何页面逻辑中直接获取已经设置的服务器类型的地址设置

page-xxx.js

```js
console.log($.$servers('ajaxServer'));///'https://jsonplaceholder.typicode.com/'
```

> 实际生产使用方法


```js
<!--设置ajax请求补全服务器地址-->
$.$servers('ajaxServer','https://jsonplaceholder.typicode.com/');

<!--如果输入的是全链接形式，将不会进行再次补全操作-->
$.get('https://jsonplaceholder.typicode.com/post/1');

<!--实际上你可以简化成这样-->
$.get('post/1');//地址将会被地洞补全上设置的服务器地址：https://jsonplaceholder.typicode.com/post/1

<!--在某些场景下，你可以在地址前面添加'!'来使框架忽略对当前地址的解析补全-->
$.get('!https://www.api.com/post/1');//系统将忽略此地址的解析补全，并直接输出: https://www.api.com/post/1
$.get('!/post/1');//输出地址：/post/1
```



## MinQuery 选择器与数据访问

MinQuery提供了类jQuery的选择器方法，允许开发者像使用jQuery一样选择元素或事件对象。

选择器与数据之间使用规范化管理，每一个使用选择创建的元素，都将以选择器名称为标识在`Page()`实例对象上的`data`字段上挂载对应类型的标准数据。

如：ID选择器挂载的数据类型则为`$id`类型；

> 选择器列表：

选择器规则 | 调用方法 | 处理对象 | 视图访问示例
---|---
`#elem-id` | `$("#elem_id")` | 用于生成数据或绑定触发事件到对应的id元素上 | `{{$id.elem_id.style}}`
`.elem-data-m-class` | `$(".m_class")` | 用于生成数据或绑定触发事件到对应的data-m-class元素上 | `{{$cs.m_class.style}}`
`window` | `$("window")` | 获取系统信息 | `{{$window.width}}`
`page` | `$('page')` | 获取当前`Page()`方法的实例对象，并对其进行操作 | 无
`app` | `$('app')` | 获取`App()`实例对象 | 无
`Anything Else` | `$('customs')` | 传入任何其他非内置选择器，都将在当前`Page()`实例对象上的`data`字段上挂载当前定义标示的框架标准数据形式。 | `{{customs.style}}`


### App选择器与Page选择器；
次选择器你会在`app.js`用到，做为对当前 `App()` 实例对象的调用。

> 示例

app.js

```js
...

//# 运行App实例
$(()=>{
    $.setData('globalData',{user: "JasonD"});
    $('app').on("launch",function(){
        <!--onLaunch处理方法-->
    }).on('userLogin',function(data){
        <!--自定义方法-->
        <!--这样将当前js页的MinQuery上下文赋给执行函数-->
        $.$call(data.call,"传给数据回调的数据");
        
        return "返回处理完的数据";
    })
})

<!--等同于使用原生的App方法进行事件绑定-->
App({
    onLaunch(){},
    ...
})

```
你可能还会在其他页面的JS文件中进行调用

page-xxx.js
```js
...

//# 运行Page实例
$(()=>{
    <!--选择Page实例对象-->
    $('page').on('load',function(){ 
        <!--当当前页面onLoad事件触发后执行的-->
        <!--你可以在页面中触发App对象上的事件方法-->
        $('app').trigger("userLogin",{call:function(res){
            console.log(res)//"传给数据回调的数据"
            <!--这里通过this访问的将是app.js页面的MinQuery对象。-->
            console.info(this.getData('globalData')) //{user: "JasonD"}
        }},function(data){
            console.info("Trigger end call");
            console.log(data)//"返回处理完的数据"
        })
    }).bind('customHandler',function(e){
        console.log(e)
    });
})
```
在UI界面可以可以直接调用 使用 `bind` 方法给 `$('page')`选择器绑定的方法 `customHandler`


```html
<view bindtap='customHandler'>直接使用自定义事件</view>
```
并且，在`$('page')`选择器上绑定的自定义事件支持进行触发调用。

> 注意：原生页面事件不允许被重新触发调用！

```js
$('#ele_id').on("tap",function(){ 
    $("page").trigger('customHandler', '传入的Data数据将以event事件参数字段传入！')
})
```

### window选择器
`window`选择器暂时只能获取设备信息，不能做其他过多的操作。
返回的数据对象主要为`systemInfo`，不过做了部分调整：

```js
var res = $("window").info(),sys = wx.getSystemInfoSync();
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
```

存在三个针对`window`选择器的方法

1. `$("window").width()`用于获取width字段

2. `$("window").height()`用于获取height字段

3. `$("window").info([paramKey])` 用于获取指定的字段，如`DPI`、`language`；不传值则直接返回全部参数。

你也可以在UI层调用到window对象下的数据

```html
<view style="width: {{$window.width}}px;">当前语言：{{$window.language}}</view>
```


### ID选择器
ID选择器用于选择绑定了`id`的元素，并对元素进行事件和对应数据、样式、动画等操作。

在框架中原则上认为ID是当前页面的唯一标示，请注意不要对多个元素使用同一个id标识值。

> 示例

```html
<view id="ele_id" bindtap="$bind">{{$id.ele_id.$data.myData}}</view>
```

```js
//选择并暂存元素对象
let ele_id = $("#ele_id");
//设置当前元素的数据
ele_id.data('myData',"my data value");
//元素事件绑定
ele_id.on("tap",function(){})
```

### data-m-class选择器
`data-m-class` 选择器用于选择绑定了`data-m-class`的元素，表现形式与`id`选择器相同。

>示例

```html
<view data-m-class="ele_m_class" bindtap="$bind">{{$cs.ele_m_class.$data.myData}}</view>
```

```js
//选择并暂存元素对象
let ele_m_class = $(".ele_m_class");
//设置当前元素的数据
ele_m_class.data('myData',"my data value");
//元素事件绑定
ele_m_class.on("tap",function(){})
``` 

### 页面元素数据分类
几乎所有的选择器数据都是挂载到`Page()`实例对象上的`data`对象的，为了方便进行数据管理，我们为每一个选择器对象创建了独立的标准数据结构，用于对不同元素进行统一的数据管理。

标准数据结构对元素的各个属性和数据进行了分类管理，方便开发时进行快速数据区分。

如：

    `$class`字段仅用于管理元素的动态样式；
    `$data`用于管理与当前元素相关的数据结构；
    `$animation`用于管理元素的动画对象；

> 元素标准访问数据结构


```js
const standardElementDataStructure = {
    "$class": [String, "To manage the element class string! Access method: $id|$cs.elementID|mClass.$class"],
    
    "$hoverClass": [String, "To manage the element hover-class string! Access method: $id|$cs.elementID|mClass.$hoverClass"],
    
    "$attr": [Object, "To manage the element multiple attributes value! Access method: $id|$cs.elementID|mClass.$attr.disabled;"],
    
    "$cf": [Object, "To manage the Min App View Plugin's configuration! Access method: $id|$cs.elementID|mClass.$attr.disabled;"],
    
    "$style": [String, "To manage the element style string! Access method: $id|$cs.elementID|mClass.$style;"],
    
    "$cssAnimation": [Object, "To manage the element css animation string! Access method: $id|$cs.elementID|mClass.$cssAnimation;"],
    
    "$data": [Object, "To manage the element multiple custom data object! Access method: $id|$cs.elementID|mClass.$data.imageSrc;"],
    
    "$animation": [Object, "To manage the element animation object!Access method: $id|$cs.elementID|mClass.$animation;"],
    
    "$events": [Object, "To manage the element events bank route! Not recommend to access!"],
    
    "$selectorType": "To cache the element selector type!",
    "$selectorName": "To cache the element selector name!"
}
```


> `data`对象实例

```js
...
data:{
    <!--使用$('#ele_id')选择的元素将挂载到 $id 对象上-->
    $id: {
        ele_id: standardElementDataStructure,
        ...
    },
    <!--使用$('.ele_m_class')选择的元素将挂载到 $cs 对象上-->
    $cs: {
        ele_m_class: standardElementDataStructure,
        ...
    },
    <!--使用$('window')选择器查询的systemInfo数据结构，与wx.getSystemInfo()获取的数据结构保持一致-->
    $window: {
        windowInfo
    },
    <!--你可以在UI界面中直接使用服务器设置加路径的方式，设置图片或视频等的路径，避免长篇的路径书写方式-->
    $servers: {
        ajaxServer: '',
        imageSerer: '',
        ...
    },
    <!--使用$('customSelector')选择器创建的自定义标准对象-->
    customSelector: standardElementDataStructure,
    <!--使用$.setData()方法设置的数据-->
    setData_key: '与数据设置的类型保持一致'
},
...
```

## 视图数据呈现分类

基于页面数据的分类管理形式，我们对视图各个元素和组件的数据也参照分类型数据管理方式进行管理，方便项目的后期的数据逻辑性维护工作的开展。

> 元素


```html
<!--动态样式管理-->
<view id='view_id' class="static-class {{$id.view_id.$class}}"></view>
<!--动态Hover样式管理-->
<view id='view_id' hover-class="static-class {{$id.view_id.$hoverClass}}"></view>
<!--动态style管理-->
<view id='view_id' style="{{$id.view_id.$style}}"></view>
<!--animation对象数据管理-->
<view id='view_id' animation="{{$id.view_id.$animation}}"></view>
<!--css的animation数据管理-->
<view id='view_id' style="{{$id.view_id.$cssAnimation}}"></view>
<!--管理当前元素的文本内容-->
<view id='view_id'>{{$id.view_id.$text ? $id.view_id.$text : "给个默认的文本，你也可以在JS中进行预设"}}</view>
<script>
    ...
    $("#view_id").text('预设的文本！');
    ...
</script>
<!--组件管理-->
<swiper id='swiper_id' indicator-dots="{{$id.swiper_id.$cf.indicatorDots}}" autoplay="{{$id.swiper_id.$cf.autoplay}}" current="{{$id.swiper_id.$cf.current}}" interval="{{$id.swiper_id.$cf.interval}}" duration="{{$id.swiper_id.$cf.duration}}" bindchange="$bind" bindtouchstart="$bind" bindtouchend="$bind">
    <block wx:for="{{$id.swiper_id.$data.banner}}">
        <swiper-item width="$window.width" height="150" class="banner_item" style="background-image: url({{item.image}});">
        </swiper-item>
    </block>
</swiper>
<script>
    ...
    let _swiper = $("#swiper_id");
    <!--组件配置-->
    _swiper.config({
        indicatorDots: true,
        autoplay: true,
        current: 0,
        interval: 1000,
        duration: 1000
    })
    <!--组件事件-->
    _swiper.on('change',function(e){
        console.log(e);
    }).on('touchstart',function(e){
        $(this).config('autoplay', false);
    }).on('touchend',function(e){
        $(this).config().autoplay(true);
    });
    ...
</script>


```

> 组件


```html
<swiper id="swiper_id" indicator-dots="{{$id.swiper_id.$cf.indicatorDots}}" autoplay="{{autoplay}}" interval="{{interval}}" duration="{{duration}}">
  <block wx:for="{{imgUrls}}">
    <swiper-item>
      <image src="{{item}}" class="slide-image" width="355" height="150"/>
    </swiper-item>
  </block>
</swiper>
```


## MinQuery 核心

MinQuery的核心接口是在开发过程中密切使用的接口，这里做了重点阐述。

### $(function(){})

`$(function(){})` 是 `Page()` 方法调用主函数，每个页面JS中都必须运行一次此方法，用于启用 小程序原生的 `Page()` 方法。

但是不同的是，使用`$(function(){})` 方法调用 `Page()` 显得更加的灵活。你并不需要将页面的处理逻辑完全放入`$(function(){})`方法中进行执行，你甚至可以在当前的页面JS中的任意位置书写你的页面处理逻辑代码。

对于轻量级的页面处理逻辑，你甚至都不需要运行`$(function(){})`方法，框架会自动检测是否手动调用过此方法，如果没有调用，框架会自行执行一次`$(function(){})`方法。

> 示例


```js
<!--MinQuery方法-->
<!--通过传入当前页面名称，来获取Page()实例方法-->
let $ = wx.MinQuery("pageName");
//# 运行Page实例，如果你没有调用此方法，框架将会自动帮你执行一次。
$(()=>{
    <!--复杂页面处理逻辑时，为保证数据的正确注入，推荐使用此主方法来运行绑定逻辑-->
});
```

> 请注意，有两种情况下不能让框架进行自动调用`$(function(){})`：
1. 页面JS文件存在复杂处理逻辑时，需手动调用`$(function(){})`方法。否则将造成数据丢失或事件方法注入失败等问题。
2. 在`app.json`中的 `tabBar-list` 下配置的页面需进行手动执行，否则小程序会报运行时错误。

>为保证数据的正确注入，推荐在所有页面处理逻辑中手动运行`$(function(){})`方法来完成Page事件和数据的绑定注入。



### $.setData();
首先是页面数据操作管理接口 `$.setData()`，它有着小程序原生Page实例对象上调用的`this.setData()`全部的功能点，但也有原生接口没有的功能。

`$.setData()`与原生方法主要的不同之处在于会自动进行脏数据检测，并且比对设置前后的数据是否一致，如果不一致才会通知视图进行数据更新，从而避免了无效更新带来的性能损耗。

并且你可以在页面未加载的情况下使用`$.setData()`方法来预设置页面数据，当页面初始化完成后，预设的数据将自动同步到小程序的`Page()`实例中的`data`对象上，保证了数据的统一性和先行性。

接下来就来展示一下，新的$.setData()的强大之处。


```js
<!--接口接收四个参数->
$.setData(key_value_Map | dataKey ,[dataValue] ,[keepObjetFormat] ,[forceAccess] );
```
> 参数传递

`dataKey[String]`

参数 | 描述
---|---
`dataKey` | 获取已经设置过的的数据键的快捷操作方法，如：get(),set()等

`dataKey[String],dataValue[not Undefined]`

设置单个数据将返回当前数据的操作接口方法，如：get(),set()等

参数 | 描述
---|---
`dataKey` | 单个设置数据的键字符串
`dataValue` | 对应键的值，不能为`undefined`,可以为`null`

`dataKey[String],dataValue[not Undefined],keepObjetFormat[Boolean]`

参数 | 描述
---|---
`dataKey` | 单个设置数据的键字符串
`dataValue` | 对应键的值，不能为`undefined`,可以为`null`
`keepObjetFormat` | 【可选】如果是单个的对象设置方式，将可以使用这个参数，使范围对象保持字典对应形式

`key_value_Map[PlainObject]`
 
设置字典数据将返回对象形式对应的操作接口方法

参数 | 描述
---|---
`key_value_Map` | 设置多个数据字段的字典数据形式，与原生setData接口具有一致性

`dataKey[String],dataValue[not Undefined],keepObjetFormat[Boolean],forceAccess[Boolean]`

`key_value_Map[PlainObject],keepObjetFormat[Boolean],forceAccess[Boolean]`

参数 | 描述
---|---
`forceAccess` | 此参数用于强制访问框架定义数据。不推荐使用！

> 示例

非数组操作类

```js
<!--支持传入两个键、值字符串的方式设置数据-->
let author = $.setData('author',"JasonDRZ");    
//等同于 let author = $.setData({'author':"JasonDRZ"});

<!--支持对象多字段设置方法-->
let info = $.setData({
  'gander': 'Male',
  'work': 'WEB Front-End'
});

<!--后续你可以使用返回的方法进行快捷访问和设置数据 -->
//get(key) ;
//set(key,value);

console.log(author.get())//"JasonDRZ"
author.set('New Author@');

console.log(info.get('gander'))//'Male'
console.log(info.gander.get())//'Male'

<!--请注意：info.gander中的gander变量来自于链式key的最后一个字符串-->
//如你设置：
var _t = $.setData('a.b.c',"JasonDRZ");
//你将可以使用：
_t.c.get()//访问'a.b.c'的值
_t.c.set('new value')//设置'a.b.c'的值；
//或使用
_t.get('c')//访问'a.b.c'的值
_t.get('a.b.c')//或是全路径获取
_t.set('c','new value')//设置'a.b.c'的值；
_t.set('a.b.c','new value')//或是使用全路径设置'a.b.c'的值

```
数组操作类


```js
let hobbies = $.setData('hobbies',['Football','PingPang','Basketball']);

<!--修改数组中某个index的数据-->
hobbies.set(1,"Movies");//将'PingPang'修改为'Movies'

<!--针对数组，$.setData() 返回了一些便捷操作接口-->

//数组操作接口：
//  prepend(data | dataArr , [isBatch]);
//  append(data | dataArr , [isBatch]);
//  before(index,data | dataArr , [isBatch]);
//  after(index,data | dataArr , [isBatch]);
//  remove([key.chain],index);

//在数组最前面插入一个数据，并返回插入元素的索引值
let index = hobbies.prepend('Prepend Hobby');//index === 0;

//在数组最后面插入多个数据，并返回插入后的最后一个元素的索引值
index = hobbies.append(['Prepend Hobby One','Prepend Hobby Two'],true);//index === 5

//在数组某个元素之前插入一个数据
index = hobbies.before(1,'A Before Hobby'); //index === 1;

//在数组某个元素之前插入多个个数据
index = hobbies.before(1,['A Before Hobby', 'Another Before Hobby'],true); //index === 2;

//在数组某个元素之后插入一个数据
index = hobbies.after(1,'An After Hobby'); //index === 2;

<!--每个数组操作方法均支持批量插入操作，需要设置最后一个参数为true，并且传入的数据格式为数组形式-->

//删除某个元素，接收要删除的index值
hobbies.remove(1);
<!--如果当前数据中的某个字段的数据也为数组，也可以使用remove进行删除操作-->
hobbise.remove('An.array.data',2);

```

长键值设置数据

```js
let _multi_level = $.setData('multis.info',[{'name':"JasonD","hobbies":['Football','PingPang','Basketball'],{'name':"Tom","hobbies":['Football','PingPang','Basketball']}]);

<!--更新值-->
$.setData('multis.info[0].hobbies[1]',"Movies");

_multi_level.set('[0].hobbies[1]','Movies');

```

### $.getData()
此接口一般与$.setData()配合使用，它只能用来根据键字符串来获取对应数据。

```js
<!--接口接收四个参数->
$.getData(dataKey);
```
>参数传递

`dataKey[String]`

参数 | 描述
---|---
`dataKey` | 通过全键字符串，获取已经设置过的的数据。等同于使用对应的`setData`返回的get()方法

> 示例

```js
let _c_0 = $.getData('a.b[2].c[0]');
let _c = $.getData('a.b[2].c');
```


### $.watch()
此方法用于监听框架上的数据变化

```js
<!--接口接收四个参数->
$.watch(watchDataKey,watchHandler,[fuzzyQuery]);
```
> 参数传递

`watchDataKey[String],watchHandler[Function],fuzzyQuery[Boolean]`

参数 | 描述
---|---
`watchDataKey` | 通过全键字符串或模糊键字符串，准确或模糊监听某个数据的变化。
`watchHandler(newValue,oldValue,fullPath)` | 数据变化处理方法，接收三个参数: newValue(变化的新的额数据)，oldValue(变化之前的数据)，fullPath(捕获到的目标数据全路径)；
`fuzzyQuery` | 【可选】是否进行模糊匹配监听；

## Ajax数据请求
MinQuery基于`wx.request()`方法封装了`$.ajax()`、`$.get()`、`$.post()`简单数据请求方法，用于简化传参方法，方便快速开发调用。

### $.ajax(url | [,config], [fn])

> 参数传递

`url[String], config[PlainObject], fn[Function]`

使用单`url`请求，则默认发起`GET`请求

参数 | 描述
---|---
`url` | 发起请求的地址
`config` | 【可选】发起请求的参数配置信息；
`fn` | 【可选】请求成功后的处理方法；

`config[PlainObject], fn[Function]`

`config`配置方式与原生`wx.request()`的配置方式相同

参数 | 描述
---|---
`config` | 发起请求的参数配置信息
`fn` | 【可选】请求成功后的处理方法；

### $.get(url, [data], [fn])
发起一个`GET`请求，请求数据默认尝试进行`JSON.parse()`转换。

`url[String], data[not Undefined], fn[Function]`

参数 | 描述
---|---
`url` | 发起`GET`请求的地址
`data` | 【可选】发起`GET`请求的附带数据参数；
`fn` | 【可选】请求成功后的处理方法；

### $.post(url, [data], [fn])
发起一个`POST`请求，请求数据默认尝试进行`JSON.parse()`转换。

`url[String], data[not Undefined], fn[Function]`

参数 | 描述
---|---
`url` | 发起`POST`请求的地址
`data` | 【可选】发起`POST`请求的附带数据参数；
`fn` | 【可选】请求成功后的处理方法；

### $.ajax()、$.get()、$.post()均支持链式方法调用

> 注意：数据请求方法使用链式方法绑定时，使用`success`链将覆盖传入的传入的`fn`处理方法。由于考虑到初学者对于Then.js的使用不熟悉，因此现阶段所有WX提供的接口并没有直接使用then链进行处理，如果需要使用，请参考后面的使用案例。


```js
$.get('test.php', {op:'content',module:'comm'},function(){
    //链式绑定的success方法将覆盖此方法，这里的方法将不被执行。
  })
  <!--链式绑定-->
  .success((res) => {
    console.log(res);
  }).fail((err) => {
    console.error(err);
  }).complete(function(re){
    console.info(re);
  });
```

> 如果需要进行长then链处理，请结合使用框架工具方法`$.$when()`进行链式调用处理，当然你也可以使用原生ES6的Promise方法进行处理。使用方法如下。

```js
$.$when($.ajax('test.php', {op:'content',module:'comm'}))
  <!--then链调用-->
  .then((cont,res) => {
    console.log(res);
    cont(null,res);
  })
  <!--then链调用-->
  .then((cont,res) => {
    console.error(res);
    cont(null,res)
  })
  <!--始终会被执行的处理方法-->
  .fin(function(cont,err,res){
    err ? console.log(err) : console.log(res);
    cont();
  })
  <!--处理所有抛出的错误-->
  .fail(function(err){
    console.error(err);
  });

<!--原生Promise使用参考-->
let sendAjax = new Promise(function(resolve, reject) {
  resolve('ok');
  $.ajax('test.php', {op:'content',module:'comm'})
  .success(res=>{resolve(res)})
  .fail(err=>{reject(err)});
});
sendAjax
  .then(function(res) { console.log(res) })
  .catch(function(error) { console.log(error)});
```

> 关于`$.$when()`方法的使用请参考工具方法集中对它的介绍

### 元素事件绑定

`$all`获取当前元素所有绑定事件。

```js
$('#view-id').on('$all',function(e){
    <!--id='view-id'的元素绑定的任何事件触发，均会触发当前事件-->
})
```


## $ 工具方法集

用过jQuery的同学一定对jQuery的工具方法不陌生。诸如：$.trim()、$.slice()、$.isString()、$.type、$.makeArray()等等，MinQuery基本上也有这些接口的哟。