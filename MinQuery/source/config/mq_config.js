/**
 * Created by JasonD on 17/5/18.
 */
const $_config = {
	//当前框架版本配置
	version: '1.2.1',
	//服务器类型配置
	serverSetting: 'ajaxServer,socketServer,uploadServer,downloadServer,imageServer,imageLocal,audioServer,videoServer'.split(','),
	//页面事件配置
	pageEvents: "onLoad,onReady,onShow,onHide,onUnload,onPullDownRefresh,onReachBottom,onShareAppMessage".split(","),
	//app事件配置
	appEvents: "onLaunch,onShow,onError,onHide".split(","),
	//元素占用字段解释
	// MinQuery固有Data和Page事件属性标识
	inherentStaticKeys: {
		"$id": ["$id", "To store element,which selected by id!"],
		"$cs": ["$cs", "To store element,which selected by data-min-class!"],
		"$window": ["$window", "To store system information."],
		"$data": ["$data", "To store custom isolate data!"],
		"$servers": ["$servers", "To store global server configuration!"],
		// 固有事件处理函数标识
		"$bind": ["$bind", "A unified bind[event] handler."],
		"$catch": ["$catch", "A unified catch[event] handler."],
		// 元素固有操作属性标识
		"$class": ["$class", "To manage the element class string! Access method: $id/$cs.elementID/mClass.$class"],
		"$hoverClass": ["$hoverClass", "To manage the element hover-class string! Access method: $id/$cs.elementID/mClass.$hoverClass"],
		"$attr": ["$attr", "To manage the element multiple attributes value! Access method: $id/$cs.elementID/mClass.$attr.disabled;"],
		"$cf": ["$cf", "To manage the Min App View Plugin's configuration! Access method: $id/$cs.elementID/mClass.$attr.disabled;"],
		"$style": ["$style", "To manage the element style string! Access method: $id/$cs.elementID/mClass.$style;"],
		"$cssAnimation": ["$cssAnimation", "To manage the element css animation string! Access method: $id/$cs.elementID/mClass.$cssAnimation;"],
		"$data": ["$data", "To manage the element multiple custom data object! Access method: $id/$cs.elementID/mClass.$data.imageSrc;"],
		"$children": ["$children", "To mark children elements,which are wrapped by this element! Not recommend to access!"],
		"$list": ["$list", "To manage list elements. Access method: $id/$cs.elementID/mClass.$list[listTag].$class;"],
		"$animation": ["$animation", "To manage the element animation object!Access method: $id/$cs.elementID/mClass.$animation;"],
		"$text": ["$text", "To manage the element text string! Access method: $id/$cs.elementID/mClass.$text"],
		"$events": ["$events", "To manage the element events bank route! Not recommend to access!"],
		"$selectorType": "To cache the element selector type!",
		"$selectorName": "To cache the element selector name!"
	},
	//选择器配置
	selectorsBank: {
		// 挂载到data对象上的固有属性选择器
		// [selector,hasEvent,eventsString[Separated by commas!]]
		"#": ["$id", true, "all"],
		".": ["$cs", true, "all"],
		"*": ["$all", true, "all"],
		"window": ["$window", false],
		"data": ["$data", true, "change"],
		// 获取当前页面实例对象
		"page": ["$page", true, "load,ready,show,hide,unload,pulldownrefresh,reachbottom,shareappmessage"],
		// 获取App初始化数据
		"app": ["$app", true, "launch,show,error,hide"]
	},
	// 元素固有操作属性初始化
	getElementInitialData() {
		// 使用函数进行对象返回，防止页面之间的对象污染
		return {
			"$selectorType": "",
			"$selectorName": "",
			"$class": "",
			"$hoverClass": "",
			"$attr": {},
			"$cf": {},
			"$style": "",
			"$list": {},
			"$data": {},
			"$children": [],
			"$cssAnimation": "",
			"$animation": undefined,
			"$events": {
				// "bind": {
				//     "tap": ["$id.element", "bind.tap"]
				// },
				// "catch": {
				//     "tap": ["$id.element", "catch.tap"]
				// }
			}
		}
	}
};

module.exports = $_config;