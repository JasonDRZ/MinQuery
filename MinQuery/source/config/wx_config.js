/**
 * Created by JasonD on 17/5/18.
 */
let $tools = require('../utils/index');


const launchScene = {
	'1001': [1001, '发现栏小程序主入口'],
	'1005': [1005, '顶部搜索框的搜索结果页'],
	'1006': [1006, '发现栏小程序主入口搜索框的搜索结果页'],
	'1007': [1007, '单人聊天会话'],
	'1008': [1008, '群聊会话'],
	'1011': [1011, '扫描二维码'],
	'1014': [1014, '小程序模版消息'],
	'1020': [1020, '公众号 profile 页相关小程序列表'],
	'1022': [1022, '聊天顶部置顶小程序入口'],
	'1023': [1023, '安卓系统桌面图标'],
	'1024': [1024, '小程序 profile 页'],
	'1025': [1025, '扫描一维码'],
	'1028': [1028, '我的卡包'],
	'1029': [1029, '卡券详情页'],
	'1035': [1035, '公众号自定义菜单'],
	'1036': [1036, 'App 分享消息卡片'],
	'1042': [1042, '添加好友搜索框的搜索结果页'],
	'1043': [1043, '公众号模板消息'],
};

const methodsCalls = "fail,success,complete,cancel,delay,exec".split(",");

// 微信小程序原生接口支持，不支持组件接口
const methodsParams = [
//	接口可用性检测
{
	name: 'canIUse'
}, {
	//请求发起方法
	name: "request",
	param_def: [['url']],
	param_nor: [['data', 'object|string'], ['header', 'object', {
		'content-type': 'application/json'
	}], ['method'], ['dataType', 'string', 'json']],
	agent_call: function (wxMethod, options) {
		// 用于支持用户小写输入
		!!options && !!options.method && (options.method = options.method.toUpperCase());
		// 加入设置的apiUrl头
		options.url = $tools.autoMendServer(options.url, 'ajaxServer');
		wxMethod(options);
	}
}, {
	// 文件上传、下载
	// 方法名称
	name: 'uploadFile',
	// 必填参数，或者说支持快捷设置的参数，最后多一个config参数用于统一设置选填参数
	param_def: [['url'], ['filePath'], ['name']],
	// 选填参数
	param_nor: [['header', 'object'], ['formData', 'object']],
	agent_call: function (wxMethod, options) {
		// 加入设置的apiUrl头
		options.url = $tools.autoMendServer(options.url, 'uploadServer');
		wxMethod(options);
	}
}, {
	name: 'downloadFile',
	param_def: [['url']],
	param_nor: [['header', 'object']],
	agent_call: function (wxMethod, options) {
		// 加入设置的apiUrl头
		options.url = $tools.autoMendServer(options.url, 'downloadServer');
		wxMethod(options);
	}
}, {
	// webSocket
	name: 'connectSocket',
	param_def: [['url']],
	param_nor: [['data', 'object'], ['header', 'object'], ['method']],
	agent_call: function (wxMethod, options) {
		// 加入设置的apiUrl头
		options.url = $tools.autoMendServer(options.url, 'socketServer');
		wxMethod(options);
	}
}, {
	// 只有名称的则直接返回传入参数后的方法
	name: 'onSocketOpen'
}, {
	name: 'onSocketError'
}, {
	name: 'sendSocketMessage',
	// 多类型支持
	param_def: [['data', 'string|uint8array']],
	param_nor: []
}, {
	name: 'onSocketMessage'
}, {
	name: 'closeSocket'
}, {
	name: 'onSocketClose'
}, {
	// 图片
	name: 'chooseImage',
	param_def: [['count', 'number']],
	param_nor: [['sizeType', 'array'], ['sourceType', 'array']]
}, {
	name: 'previewImage',
	param_def: [['urls', 'array']],
	param_nor: [['current']]
}, {
	name: 'getImageInfo',
	param_def: [['src']],
	param_nor: []
}, {
	// 录音
	name: 'startRecord',
	param_def: [],
	param_nor: []
}, {
	name: 'stopRecord',
	param_def: [['delay', 'number']],
	agent_call: function (wxMethod, options) {
		setTimeout(function () {
			delete options.delay;
			wxMethod(options);
		}, options.delay ? options.delay : 0);
	}
}, {
	// 音频播放
	name: 'playVoice',
	param_def: [['filePath']],
	param_nor: []
}, {
	name: 'pauseVoice'
}, {
	name: 'stopVoice',
	param_def: [['delay', 'number']],
	agent_call: function (wxMethod, options) {
		setTimeout(function () {
			delete options.delay;
			wxMethod(options);
		}, options.delay ? options.delay : 0);
	}
}, {
	// 音乐播放控制
	name: 'getBackgroundAudioPlayerState',
	param_def: [],
	param_nor: []
}, {
	name: 'playBackgroundAudio',
	param_def: [['dataUrl']],
	param_nor: [['title'], ['coverImgUrl']]
}, {
	name: 'pauseBackgroundAudio'
}, {
	name: 'seekBackgroundAudio',
	param_def: [['position']],
	param_nor: []
}, {
	name: 'stopBackgroundAudio'
}, {
	name: 'onBackgroundAudioPlay'
}, {
	name: 'onBackgroundAudioPause'
}, {
	name: 'onBackgroundAudioStop'
}, {
	//创建音频上下文对象
	name: 'createAudioContext'
}, {
	// 选择视频
	name: 'chooseVideo',
	param_def: [],
	param_nor: [['sourceType', 'array'], ['maxDuration', 'number'], ['camera']]
}, {
	//创建视频上下文对象
	name: 'createVideoContext'
}, {
	// 文件
	name: 'saveFile',
	param_def: [['tempFilePath']],
	param_nor: []
}, {
	name: 'getSavedFileList',
	param_def: [],
	param_nor: []
}, {
	name: 'getSavedFileInfo',
	param_def: [['filePath']],
	param_nor: []
}, {
	name: 'removeSavedFile',
	param_def: [['filePath']],
	param_nor: []
}, {
	name: 'openDocument',
	param_def: [['filePath']],
	param_nor: []
}, {
	// 数据缓存
	name: 'setStorage',
	param_def: [['key'], ['data', 'string|object']],
	param_nor: []
}, {
	name: 'setStorageSync'
}, {
	name: 'getStorage',
	param_def: [['key']],
	param_nor: []
}, {
	name: 'getStorageSync'
}, {
	name: 'getStorageInfo',
	param_def: [],
	param_nor: []
}, {
	name: 'getStorageInfoSync'
}, {
	name: 'removeStorage',
	param_def: [['key']],
	param_nor: []
}, {
	name: 'removeStorageSync'
}, {
	name: 'clearStorage'
}, {
	name: 'clearStorageSync'
}, {
	// 位置信息
	name: 'getLocation',
	param_def: [['type']],
	param_nor: []
}, {
	name: 'chooseLocation',
	param_def: [],
	param_nor: []
}, {
	name: 'openLocation',
	param_def: [['latitude', 'number'], ['longitude', 'number']],
	param_nor: [['scale', 'number'], ['name'], ['address']]
}, {
	name: 'createMapContext'
	}, {
	// 设备信息
	name: 'getSystemInfo',
	param_def: [],
	param_nor: []
}, {
	name: 'getSystemInfoSync'
}, {
	name: 'getNetworkType',
	param_def: [],
	param_nor: []
}, {
	name: 'onNetworkStatusChange'
}, {
	name: 'onAccelerometerChange'
}, {
	name: 'startAccelerometer',
	param_def: [],
	param_nor: []
}, {
	name: 'stopAccelerometer',
	param_def: [],
	param_nor: []
}, {
	name: 'onCompassChange'
}, {
	name: 'startCompass',
	param_def: [],
	param_nor: []
}, {
	name: 'stopCompass',
	param_def: [['delay', 'number']],
	param_nor: [],
	agent_call: function (wxMethod, options) {
		setTimeout(function () {
			delete options.delay;
			wxMethod(options);
		}, options.delay ? options.delay : 0);
	}
}, {
	name: 'makePhoneCall',
	param_def: [['phoneNumber']],
	param_nor: []
}, {
	name: 'scanCode',
	param_def: [],
	param_nor: []
}, {
	name: 'setClipboardData',
	param_def: [['data']],
	param_nor: []
}, {
	name: 'getClipboardData',
	param_def: [],
	param_nor: []
}, {
	// 蓝牙设置
	name: 'openBluetoothAdapter',
	param_def: [],
	param_nor: []
}, {
	name: 'closeBluetoothAdapter',
	param_def: [],
	param_nor: []
}, {
	name: 'getBluetoothAdapterState',
	param_def: [],
	param_nor: []
}, {
	name: 'onBluetoothAdapterStateChange'
}, {
	name: 'startBluetoothDevicesDiscovery',
	param_def: [['services', 'array']],
	param_nor: []
}, {
	name: 'stopBluetoothDevicesDiscovery',
	param_def: [],
	param_nor: []
}, {
	name: 'getBluetoothDevices',
	param_def: [['services', 'array']],
	param_nor: []
}, {
	name: 'onBluetoothDeviceFound'
}, {
	name: 'createBLEConnection',
	param_def: [['deviceId']],
	param_nor: []
}, {
	name: 'closeBLEConnection',
	param_def: [['deviceId']],
	param_nor: []
}, {
	name: 'onBLEConnectionStateChanged'
}, {
	name: 'getBLEDeviceServices',
	param_def: [['deviceId']],
	param_nor: []
}, {
	name: 'getBLEDeviceCharacteristics',
	param_def: [['deviceId'], ['serviceId']],
	param_nor: []
}, {
	name: 'readBLECharacteristicValue',
	param_def: [['deviceId'], ['serviceId'], ['characteristicId']],
	param_nor: []
}, {
	name: 'writeBLECharacteristicValue',
	param_def: [['deviceId'], ['serviceId'], ['characteristicId'], ['value', 'uint8array']],
	param_nor: []
}, {
	name: 'notifyBLECharacteristicValueChanged',
	param_def: [['deviceId'], ['serviceId'], ['characteristicId'], ['state', 'boolean']],
	param_nor: []
}, {
	name: 'onBLECharacteristicValueChange'
}, {
	//iBeacon
	name: 'startBeaconDiscovery',
	param_def: [['uuids','string|object']],
	param_nor: []
}, {
	// 交互反馈
	name: 'showToast',
	param_def: [['title']],
	param_nor: [['icon'], ['image'], ['duration', 'number'], ['mask', 'boolean']]
}, {
	name: 'showLoading',
	param_def: [['title']],
	param_nor: [['mask', 'boolean']]
}, {
	name: 'hideToast',
	param_def: [['delay', 'number']],
	// 使用param_call时，传入的参数将全部传入到该回调中
	agent_call: function (wxMethod, options) {
		setTimeout(function () {
			delete options.delay;
			wxMethod(options);
		}, options.delay ? options.delay : 0);
	}
}, {
	name: 'hideLoading',
	param_def: [['delay', 'number']],
	// 使用param_call时，传入的参数将全部传入到该回调中
	agent_call: function (wxMethod, options) {
		setTimeout(function () {
			delete options.delay;
			wxMethod(options);
		}, options.delay ? options.delay : 0);
	}
}, {
	name: 'showModal',
	param_def: [['title'], ['content']],
	param_nor: [['showCancel', 'boolean'], ['cancelText'], ['cancelColor'], ['confirmText'], ['confirmColor']]
}, {
	name: 'showActionSheet',
	param_def: [['itemList', 'array']],
	param_nor: [['itemColor']]
}, {
	// 设置导航条
	name: 'setNavigationBarTitle',
	param_def: [['title']],
	param_nor: []
}, {
	name: 'showNavigationBarLoading'
}, {
	name: 'hideNavigationBarLoading'
}, {
	// 导航
	name: 'navigateTo',
	param_def: [['url']],
	param_nor: [],
	agent_call: function (wxMethod, options) {
		// 自动补全本地路径
		options.url = $tools.autoMendLocalPath(options.url);
		wxMethod(options);
	}
}, {
	name: 'redirectTo',
	param_def: [['url']],
	param_nor: [],
	agent_call: function (wxMethod, options) {
		// 自动补全本地路径
		options.url = $tools.autoMendLocalPath(options.url);
		wxMethod(options);
	}
}, {
	name: 'switchTab',
	param_def: [['url']],
	param_nor: [],
	agent_call: function (wxMethod, options) {
		// 自动补全本地路径
		options.url = $tools.autoMendLocalPath(options.url);
		wxMethod(options);
	}
}, {
	name: 'navigateBack'
}, {
	name: 'reLaunch',
	param_def: [['url']],
	param_nor: [],
	agent_call: function (wxMethod, options) {
		// 自动补全本地路径
		options.url = $tools.autoMendLocalPath(options.url);
		wxMethod(options);
	}
}, {
	// 下拉刷新
	name: 'stopPullDownRefresh'
}, {
	// 登录
	name: 'login',
	param_def: [],
	param_nor: []
}, {
	name: 'checkSession',
	param_def: [],
	param_nor: []
}, {
	// 获取用户信息
	name: 'getUserInfo',
	param_def: [['withCredentials', 'boolean']],
	param_nor: []
}, {
	// 微信支付
	name: 'requestPayment',
	param_def: [['timeStamp'], ['nonceStr'], ['package'], ['signType'], ['paySign']],
	param_nor: []
}, {
	// 收货地址
	name: 'chooseAddress',
	param_def: [],
	param_nor: []
}, {
	// 卡券
	name: 'addCard',
	param_def: [['cardList', 'array']],
	param_nor: []
}, {
	name: 'openCard',
	param_def: [['cardList', 'array']],
	param_nor: []
}, {
	// 设置
	name: 'openSetting',
	param_def: [],
	param_nor: []
}, {
	// Buffer操作
	name: 'base64ToArrayBuffer'
}, {
	name: 'arrayBufferToBase64'
},
//1.1.0 new API
{
	name: 'getExtConfig',
	param_def: [],
	param_nor: []
},
{
	name: 'getExtConfigSync'
},
	{
		name: 'showShareMenu',
		param_def: [],
		param_nor: []
	},
	{
		name: 'getExtConfig',
		param_def: [['withShareTicket','boolean']],
		param_nor: []
	},
	{
		name: 'hideShareMenu',
		param_def: [],
		param_nor: []
	},
	{
		name: 'updateShareMenu',
		param_def: [['withShareTicket','boolean']],
		param_nor: []
	},
	{
		name: 'getShareInfo',
		param_def: [['shareTicket']],
		param_nor: []
	},
//1.2.0 new API
{
	//iBeacon
	name: 'stopBeaconDiscovery',
	param_def: [],
	param_nor: []
}, {
	//iBeacon
	name: 'getBeacons',
	param_def: [],
	param_nor: []
}, {
	//iBeacon
	name: 'onBeaconUpdate'
}, {
	//iBeacon
	name: 'onBeaconServiceChange'
},
{
	//获取小程序的授权设置
	name: 'getSetting',
	param_def: [],
	param_nor: []
},{
	//提前授权
	name: 'authorize',
	param_def: [['scope']],
	param_nor: []
},{
	//获取屏幕亮度
	name: 'getScreenBrightness',
	param_def: [],
	param_nor: []
},{
	//设置屏幕亮度
	name: 'setScreenBrightness',
	param_def: [['value','number']],
	param_nor: []
},{
	//保存联系人到系统通讯录
	name: 'addPhoneContact',
	param_def: [['firstName']],
	param_nor: [['photoFilePath'],['nickName'],['lastName'],['middleName'],
		['remark'],['mobilePhoneNumber'],['weChatNumber'],['addressCountry'],
		['addressState'],['addressCity'],['addressStreet'],['addressPostalCode'],
		['organization'],['title'],['workFaxNumber'],['workPhoneNumber'],
		['hostNumber'],['email'],['url'],['workAddressCountry'],
		['workAddressState'],['workAddressCity'],['workAddressStreet'],['workAddressPostalCode'],
		['homeFaxNumber'],['homePhoneNumber'],['homeAddressCountry'],['homeAddressState'],
		['homeAddressCity'],['homeAddressStreet'],['homeAddressPostalCode'],
	]
},{
	//动态更新转发菜单设置
	name: 'updateShareMenu',
	param_def: [['withShareTicket','boolean']],
	param_nor: []
},{
	// 使手机发生较长时间的振动（400ms）
	name: 'vibrateLong',
	param_def: [],
	param_nor: []
},{
	// 使手机发生较短时间的振动（15ms）
	name: 'vibrateShort',
	param_def: [],
	param_nor: []
},{
	//获取微信运动数据
	name: 'getWeRunData',
	param_def: [],
	param_nor: []
},{
	//保存图片到系统相册
	name: 'saveImageToPhotosAlbum',
	param_def: [['filePath']]
},{
	//保存视频到系统相册
	name: 'saveVideoToPhotosAlbum',
	param_def: [['filePath']]
},

//	组件模块
{
	name: 'getBackgroundAudioManager'
}

];

// //组件及控制器
// let componentsParams = [
//
// 	// 1.2.0基带以后的组件
// 	{
// 		// 获取背景音频管理器
// 		name: 'getBackgroundAudioManager',
// 		event: []
// 	}
// ]


module.exports = {
	launchScene,
	methodsParams,
	methodsCalls
}