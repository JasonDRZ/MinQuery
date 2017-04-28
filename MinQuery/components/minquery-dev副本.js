/*!
 * MinQuery for Wechat Min-App Development JavaScript Library v1.0.2
 * https://github.com/JasonDRZ/MinQuery
 *
 * Copyright 2016, 2017 JasonDRZ.
 * Released under the MIT license
 *
 * Date: 2017-4-15 16.21
 */

// 框架配置项
const $mq_config = {
    pageEvents: "onLoad,onReady,onShow,onHide,onUnload,onPullDownRefresh,onReachBottom,onShareAppMessage".split(","),
    appEvents: "onLaunch,onShow,onError,onHide".split(","),
    inherentStaticKeys: {
        "$id": ["$id", "To store element,whitch selected by id!"],
        "$cs": ["$cs", "To store element,whitch selected by data-min-class!"],
        "$window": ["$window", "To store system infomation."],
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
        "$children": ["$children", "To mark children elements,whitch are wraped by this element! Not recommend to access!"],
        "$animation": ["$animation", "To manage the element animation object!Access method: $id/$cs.elementID/mClass.$animation;"],
        "$text": ["$text", "To manage the element text string! Access method: $id/$cs.elementID/mClass.$text"],
        "$events": ["$events", "To manage the element events bank route! Not recommend to access!"],
        "$selectorType": "To cache the element selector type!",
        "$selectorName": "To cache the element selector name!"
    },
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

const wxLaunchScene = {
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

// 微信小程序原生接口支持，不支持组件接口
const wxMethodsParamsConfig = [{
    name: "request",
    param_def: [['url']],
    param_nor: [['data', 'object|string'], ['header', 'object', {
        'content-type': 'application/json'
    }], ['method'], ['dataType', 'string', 'json']],
    agent_call: function (wxMethod, options) {
        // 用于支持用户小写输入
        !!options && !!options.method && (options.method = options.method.toUpperCase());
        // 加入设置的apiUrl头
        options.url = autoMendServer(options.url, 'ajaxServer');
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
        options.url = autoMendServer(options.url, 'uploadServer');
        wxMethod(options);
    }
}, {
    name: 'downloadFile',
    param_def: [['url']],
    param_nor: [['header', 'object']],
    agent_call: function (wxMethod, options) {
        // 加入设置的apiUrl头
        options.url = autoMendServer(options.url, 'downloadServer');
        wxMethod(options);
    }
}, {
    // webSocket
    name: 'connectSocket',
    param_def: [['url']],
    param_nor: [['data', 'object'], ['header', 'object'], ['method']],
    agent_call: function (wxMethod, options) {
        // 加入设置的apiUrl头
        options.url = autoMendServer(options.url, 'socketServer');
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
    // 选择视频
    name: 'chooseVideo',
    param_def: [],
    param_nor: [['sourceType', 'array'], ['maxDuration', 'number'], ['camera']]
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
    param_def: [['itemList']],
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
        options.url = smartToCompleteLocalPath(options.url);
        wxMethod(options);
    }
}, {
    name: 'redirectTo',
    param_def: [['url']],
    param_nor: [],
    agent_call: function (wxMethod, options) {
        // 自动补全本地路径
        options.url = smartToCompleteLocalPath(options.url);
        wxMethod(options);
    }
}, {
    name: 'switchTab',
    param_def: [['url']],
    param_nor: [],
    agent_call: function (wxMethod, options) {
        // 自动补全本地路径
        options.url = smartToCompleteLocalPath(options.url);
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
        options.url = smartToCompleteLocalPath(options.url);
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
}];

// MinQuery 工具方法及变量
// 页面数据操作主体 
let
    // version
    version = "2.1.2",
    arr = [],
    slice = arr.slice,
    concat = arr.concat,
    push = arr.push,
    indexOf = arr.indexOf,
    class2type = {},
    // 用于初始化某一类型的对象
    typeInitial = {},
    toString = class2type.toString,
    hasOwn = class2type.hasOwnProperty,

    rtrim = /\s/g;
// 生成类型字典
let _classTypeInitial = [false, 0, '', function () { }, [], Date.now(), new RegExp(), {}, new Error(), 0];
("Boolean Number String Function Array Date RegExp Object Error Uint8Array".split(" ")).forEach(function (name, i) {
    let _l_name = name.toLowerCase();
    class2type["[object " + name + "]"] = _l_name;
    typeInitial[_l_name] = _classTypeInitial[i];
});

let debugMode = false ;
// MinQuery 错误事件捕捉器
const $errorCarry = function (fn) {
    let _fn_ret;
    if (debugMode) {
        try {
            _fn_ret = fn.apply(null, [].slice(arguments, 1));
        } catch (e) {
            console.error(e);
        }
    } else _fn_ret = fn.apply(null, [].slice(arguments, 1));
    return _fn_ret;
}

let _$ = {
    error: function (msg) {
        console.error(msg);
    },

    noop: function () { },

    isFunction: function (obj) {
        return _$.type(obj) === "function";
    },

    isArraylike: function (obj) {
        let length = obj.length,
            type = _$.type(obj);

        if (type === "function") {
            return false;
        }

        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    },

    isArray: Array.isArray,

    isNumeric: function (obj) {
        // parseFloat NaNs numeric-cast false positives (null|true|false|"")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        // adding 1 corrects loss of precision from parseFloat (#15100)
        return !_$.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
    },

    isPlainObject: function (obj) {
        // Not plain objects:
        // - Any object or value whose internal [[Class]] property is not "[object Object]"
        if (_$.type(obj) !== "object") {
            return false;
        }

        if (obj.constructor &&
            !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
            return false;
        }

        // If the function hasn't returned already, we're confident that
        // |obj| is a plain object, created by {} or constructed with new Object
        return true;
    },

    isString: function (str) {
        return typeof str === 'string';
    },

    isEmpty: function (str) {
        return typeof str === 'undefined' || str === null || _$.trim(str + "") == "";
    },

    isUndefined: function (obj) {
        return typeof obj === 'undefined';
    },

    isEmptyObject: function (obj) {
        let name;
        for (name in obj) {
            return false;
        }
        return true;
    },

    type: function (obj) {
        if (obj == null) {
            return obj + "";
        }
        // Support: Android<4.0, iOS<6 (functionish RegExp)
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[toString.call(obj)] || "object" :
            typeof obj;
    },
    // 数据镜像：将已有数据镜像还原到某一原状态；
    recoveryObject: function (source, mirror, deep) {
        let isArray, s;
        // 支持对象数据恢复，deep操作时支持数组
        if (_$.isPlainObject(source) || (deep && _$.isArray(source))) {
            for (s in source) {
                // 均存在这恢复镜像数据到源数据
                if (!(s in source) && !(s in mirror)) {
                    if (deep) {
                        // 进行深度恢复操作
                        if (_$.isPlainObject(source[s]) || (deep && _$.isArray(source[s]))) {
                            _$.recoveryObject(source[s], mirror[s], deep);
                        } else {
                            // 非对象或数组，则进行赋值操作
                            source[s] = mirror[s];
                        }
                    } else {
                        // 非深度恢复，则进行赋值操作
                        source[s] = mirror[s]
                    }
                } else if (!(s in source) && s in mirror) {
                    // 如果镜像数据不存在，而源数据存在，则删除源数据
                    delete source[s];
                } else {
                    // 如果镜像数据存在，源数据不存在，则恢复
                    source[s] = mirror[s];
                }
            }
        }
    },
    // args is for internal usage only
    each: function (obj, callback, args) {
        let value,
            i = 0,
            length = obj.length,

            isArray = _$.isArraylike(obj);

        if (args) {
            if (isArray) {
                for (; i < length;) {
                    value = callback.apply(obj[i++], args);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            }

            // A special, fast, case for the most common use of each
        } else {
            if (isArray) {
                for (; i < length;) {
                    value = callback.call(obj[i], i, obj[i++]);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            }
        }

        return obj;
    },

    trim: function (text) {
        return text == null ?
            "" :
            (text + "").replace(rtrim, "");
    },

    // results is for internal usage only
    makeArray: function (arr, results) {
        let ret = results || [];

        if (arr != null) {
            if (_$.isArraylike(Object(arr))) {
                _$.merge(ret,
                    typeof arr === "string" ? [arr] : arr
                );
            } else {
                push.call(ret, arr);
            }
        }

        return ret;
    },

    inArray: function (elem, arr, i) {
        return arr == null ? -1 : indexOf.call(arr, elem, i);
    },

    merge: function (first, second) {
        let len = +second.length,
            j = 0,
            i = first.length;

        for (; j < len; j++) {
            first[i++] = second[j];
        }

        first.length = i;

        return first;
    },

    grep: function (elems, callback, invert) {
        let callbackInverse,
            matches = [],
            i = 0,
            length = elems.length,
            callbackExpect = !invert;

        // Go through the array, only saving the items
        // that pass the validator function
        for (; i < length; i++) {
            callbackInverse = !callback(elems[i], i);
            if (callbackInverse !== callbackExpect) {
                matches.push(elems[i]);
            }
        }

        return matches;
    },

    // arg is for internal usage only
    map: function (elems, callback, arg) {
        let value,
            i = 0,
            length = elems.length,
            isArray = _$.isArraylike(elems),
            ret = [];

        // Go through the array, translating each of the items to their new values
        if (isArray) {
            for (; i < length; i++) {
                value = callback(elems[i], i, arg);

                if (value != null) {
                    ret.push(value);
                }
            }

            // Go through every key on the object,
        } else {
            for (i in elems) {
                value = callback(elems[i], i, arg);

                if (value != null) {
                    ret.push(value);
                }
            }
        }

        // Flatten any nested arrays
        return concat.apply([], ret);
    },
    // 短横线[或其他连接符]转驼峰
    toHump: function (str, symbal) {
        let reg = new RegExp((symbal ? symbal : "-") + "(\w)", 'g');
        return str.replace(reg, function ($0, $1) {
            return $1.toUpperCase();
        });
    },
    // 驼峰转中横线或任意链接符
    humpToAny: function (str, symbal) {
        return str.replace(/([A-Z])/g, (symbal ? symbal : "-") + "$1").toLowerCase();
    },
    // 格式化日期，支持时间戳和Date实例
    formatDate: function (date, fmt) {
        //author: meizz,jason
        if (date instanceof Date || typeof date === 'number') {
            typeof date === 'number' && (date = new Date(date));
        } else {
            console.error("The formatDate first param must be an Date() instance or timestamp!");
            return date;
        }
        let o = {
            "m+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "i+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    // 当前时间戳
    now: Date.now
}, _$_proto_ = {

};
// 简易原型继承方法，框架外部使用时仅能做对象浅层继承
const $extend = function () {
    let options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;

        // Skip the boolean and the target
        target = arguments[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !_$.isFunction(target)) {
        target = {};
    }

    // Extend MinQuery itself if only one argument is passed
    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (_$.isPlainObject(copy) || (copyIsArray = _$.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && _$.isArray(src) ? src : [];

                    } else {
                        clone = src && _$.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[name] = $extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};
// 工具方法
// 支持对象设置及单数据键值设置的数据查询引擎
const $analysisDataEngine = function (sourceData, keyString, keyValue) {
    // 如果传入的是data 查询的 key 并且使用call方法调用
    if (_$.isString(sourceData)) {
        sourceData = this[sourceData];
    }
    if (sourceData) {

        // 如果不存在则返回数据源
        if (!keyString) {
            return sourceData;
        }
        // 是否获取指定键值
        let dataRequire = false, obj = {};
        if (_$.isString(keyString) && _$.isUndefined(keyValue)) {
            dataRequire = true;
            obj[keyString] = {};
        }
        // 如果关闭获取指定键值下，keyString不是数据对象时，则报错
        if ((!dataRequire && _$.isUndefined(keyValue) && !_$.isPlainObject(keyString)) || (!_$.isUndefined(keyValue) && !_$.isString(keyString))) {
            console.error(`AnalysisDataEngine params error!`, keyString, keyValue);
            return sourceData;
        }
        // 复制object
        if (!dataRequire) {
            if (_$.isPlainObject(keyString)) {
                obj = keyString;
            } else
                obj[keyString] = keyValue;
        }
        // dataRequire模式，不存在则返回false，并终止；
        // 非dataRequire模式，将自动初始化对象的值为指定的objInit值
        let analyType = function (_data, key, objInit) {
            if (!_data[key]) {
                if (dataRequire) {
                    // undefindData(key, _data);
                    return false;
                } else {
                    _data[key] = objInit
                    return true;
                }
            } else {
                return true;
            }
        }
        let dotKeys, arrKeys, eackKey, noArrKey, value, l, d;
        // 对象循环
        dataEach: for (l in obj) {
            let _rd = sourceData;
            // 优先筛选dot key
            dotKeys = l.split(".");
            // 存储当前字段数据
            value = obj[l];
            // 循环查询当前dotkey 和 arrkey对象
            // 数组循环
            dotKeyEach: for (d = 0; d < dotKeys.length; d++) {
                eackKey = dotKeys[d];
                // 忽略空键，直接进入下一阶段解析
                if (eackKey.replace(/\s/g, "") === "") {
                    continue dotKeyEach;
                }
                arrKeys = eackKey.match(/\[(\d+)\]/g);
                if (arrKeys) {
                    if (eackKey[eackKey.length - 1] !== "]") {
                        console.error(`Data setter key format error: [${d}];Should like: "key","key.key","key[1].key","key[1][0].key"`);//no support "key[1][0].key[1]"
                        // break dataEach;
                        // 终止当前数据项后续循环步骤
                        break dotKeyEach;
                    }
                    let a, ai = 0, _len = arrKeys.length;
                    // 去掉数组key
                    noArrKey = eackKey.replace(arrKeys.join(""), "");
                    // 检测遍历类型
                    if (!analyType(_rd, noArrKey, [])) {
                        return undefined;
                    };
                    // 递归赋值
                    noArrKey !== '' && (_rd = _rd[noArrKey]);
                    for (; ai < _len; ai++) {
                        a = arrKeys[ai];
                        a = Array.from(a);
                        // 去掉中括号
                        a.shift();
                        a.pop();
                        a = a.join("");
                        // 返回查询数据
                        if (d == dotKeys.length - 1 && ai == arrKeys.length - 1) {
                            if (dataRequire) {
                                return _rd[a];
                            } else _rd[a] = value;
                        } else {
                            // 检测并初始化为数组
                            if (!analyType(_rd, a, [])) {
                                return undefined;
                            };
                            _rd = _rd[a];
                        }
                    }
                } else {
                    // 返回查询的数据
                    if (d == dotKeys.length - 1) {
                        if (dataRequire) {
                            return _rd[eackKey];
                        }
                        _rd[eackKey] = value;
                    } else {
                        // 检测并初始化为对象
                        if (!analyType(_rd, eackKey, {})) {
                            return undefined;
                        };
                        _rd = _rd[eackKey];
                    }
                }
            }
        }
    } else {
        console.log(`AnalysisDataEngine require's a sourceData!`)
    }
};


const wxCalls = "fail,success,complete,cancel,delay,exec".split(",");
const wxMethodsCallbackGenerate = function (methodName, _options, wrapperCall, context) {
    // 检测并设置wx对象上下文
    !context && (context = wx);
    // 检测调用方法名称及是否存在
    let options = !_options ? {} : _options;
    if (typeof methodName == 'string' && methodName in context) {
        let _backup = {}, k, f;
        // 剥离参数中的类型回调函数
        for (k in wxCalls) {
            f = options[k];
            if (_$.isFunction(f)) {
                // 仅存储预设回调名称中的回调函数
                _backup[k] = f;
                // 删除参数中非预定回调函数
                delete options[k];
            } else {
                _backup[k] = _$.noop;
            }
        }
        let _continue_func;
        // 仅在参数集为Object的情况下进行回调封装继承
        _$.isPlainObject(options) && $extend(options, {
            fail(e) {
                // 运行外部分离的场景处理函数
                'fail' in _backup && $errorCarry(_backup['fail'], e);
            },
            success(e) {
                'success' in _backup && $errorCarry(_backup['success'], e);
            },
            complete(e) {
                'complete' in _backup && $errorCarry(_backup['complete'], e);
                // 支持Then.js的链式反应链
                let _msg = e.errMsg.split(":"), _err = null, _data;
                if (_msg[1] === "ok") {
                    delete e.errMsg;
                    _data = e;
                } else {
                    _err = e;
                }
                _$.isFunction(_continue_func) && $errorCarry(_continue_func, _err, _data);
            },
            cancel(e) {
                'cancel' in _backup && $errorCarry(_backup['cancel'], e);
            }
        });
        _$.isFunction(wrapperCall)
            ? $errorCarry(wrapperCall, context[methodName], options)
            : _$.isArray(options) ? context[methodName].apply(null, options) : context[methodName].call(null, options);
        // 支持then.js
        const _suport_then = function (cont) {
            _continue_func = cont;
        }
        // 属性方法用于方法的链式调用
        wxCalls.forEach((m, i) => {
            _suport_then[m] = (function (_m) {
                return function (cb) {
                    _$.isFunction(cb) && (_backup[_m] = cb);
                    return this;
                }
            })(m)
        });
        return _suport_then;
    } else {
        console.error(`Do not have method [${methodName}] on context:`, context);
    }
}
let _wxMethodsPackages = {};
_$.each(wxMethodsParamsConfig, function (i, _oj) {
    if (_oj.name) {
        _wxMethodsPackages[_oj.name] = (function (_inob) {
            let _param_def = _inob['param_def'], _param_nor = _inob['param_nor'], _param_all;
            if (_$.isArray(_param_def)) {
                _param_all = _$.isArray(_param_nor) ? _param_def.concat(_param_nor) : _param_def;
            } else _param_all = null;
            return function () {
                // 返回的封装函数
                let args = slice.call(arguments), _has_config = _$.isArray(_param_all), _type = 'string', _type_match = false, _preset = '', _cur_param, _first = args[0], options = {};
                // 如果存在配置，则表明此项一定是异步回调形式，则进行预设参数进行继承
                if (_has_config) {
                    // 优先进行配置项预设
                    _$.each(_param_all, function (_i, dar) {
                        _preset = dar[2];
                        // 仅设置有预制项的字段
                        if (!_$.isUndefined(_preset)) options[dar[0]] = _preset;
                    });
                    if (_$.isPlainObject(_first)) {
                        $extend(options, _first);
                    } else _$.each(args, function (_i, ar) {
                        _type_match = false;
                        _cur_param = _param_all[_i];
                        // 存在配置预设项则进行验证，不存在，则忽略此字段
                        if (!!_cur_param) {
                            _type = !!_cur_param[1] ? _cur_param[1] : 'string';
                            _type = _type.split("|");
                            // 判断是否符合多个类型中的某一个类型
                            _$.each(_type, function (_, t) {
                                if (_$.type(ar) === t) { _type_match = true; return false };
                            })
                            if (_type_match) {
                                options[_cur_param[0]] = ar;
                            } else {
                                console.error(`${_inob.name} method's param ${_cur_param[0]}`)
                            }
                        } else return false;
                    });
                } else {
                    options = args;
                }
                return wxMethodsCallbackGenerate(_inob.name, options, _inob['agent_call']);
            }
        })(_oj);
    }
});
// **Github:** https://github.com/teambition/then.js
//
// **License:** MIT
const Thenjs = (function () {
    let maxTickDepth = 100
    let toString = Object.prototype.toString
    let hasOwnProperty = Object.prototype.hasOwnProperty
    let nextTick = typeof setImmediate === 'function' ? setImmediate : function (fn) {
        setTimeout(fn, 0)
    }
    let isArray = Array.isArray || function (obj) {
        return toString.call(obj) === '[object Array]'
    }

    // 将 `arguments` 转成数组，效率比 `[].slice.call` 高很多
    function slice(args, start) {
        start = start || 0
        if (start >= args.length) return []
        let len = args.length
        let ret = Array(len - start)
        while (len-- > start) ret[len - start] = args[len]
        return ret
    }

    function map(array, iterator) {
        let res = []
        for (let i = 0, len = array.length; i < len; i++) res.push(iterator(array[i], i, array))
        return res
    }

    // 同步执行函数，同时捕捉异常
    function carry(errorHandler, fn) {
        try {
            fn.apply(null, slice(arguments, 2))
        } catch (error) {
            errorHandler(error)
        }
    }

    // 异步执行函数，同时捕捉异常
    function defer(errorHandler, fn) {
        let args = arguments
        nextTick(function () {
            carry.apply(null, args)
        })
    }

    function toThunk(object) {
        if (object == null) return object
        if (typeof object.toThunk === 'function') return object.toThunk()
        if (typeof object.then === 'function') {
            return function (callback) {
                object.then(function (res) {
                    callback(null, res)
                }, callback)
            }
        } else return object
    }

    function arrayToTasks(array, iterator) {
        return map(array, function (value, index, list) {
            return function (done) {
                iterator(done, value, index, list)
            }
        })
    }

    // ## **Thenjs** 主函数
    function Thenjs(start, debug) {
        let self = this
        let cont
        if (start instanceof Thenjs) return start
        if (!(self instanceof Thenjs)) return new Thenjs(start, debug)
        self._chain = 0
        self._success = self._parallel = self._series = null
        self._finally = self._error = self._result = self._nextThen = null
        if (!arguments.length) return self

        cont = genContinuation(self, debug)
        start = toThunk(start)
        if (start === void 0) cont()
        else if (typeof start === 'function') defer(cont, start, cont)
        else cont(null, start)
    }

    Thenjs.defer = defer

    Thenjs.parallel = function (tasks, debug) {
        return new Thenjs(function (cont) {
            carry(cont, parallel, cont, tasks)
        }, debug)
    }

    Thenjs.series = function (tasks, debug) {
        return new Thenjs(function (cont) {
            carry(cont, series, cont, tasks)
        }, debug)
    }

    Thenjs.each = function (array, iterator, debug) {
        return new Thenjs(function (cont) {
            carry(cont, parallel, cont, arrayToTasks(array, iterator))
        }, debug)
    }

    Thenjs.eachSeries = function (array, iterator, debug) {
        return new Thenjs(function (cont) {
            carry(cont, series, cont, arrayToTasks(array, iterator))
        }, debug)
    }

    Thenjs.parallelLimit = function (tasks, limit, debug) {
        return new Thenjs(function (cont) {
            parallelLimit(cont, tasks, limit)
        }, debug)
    }

    Thenjs.eachLimit = function (array, iterator, limit, debug) {
        return new Thenjs(function (cont) {
            parallelLimit(cont, arrayToTasks(array, iterator), limit)
        }, debug)
    }

    Thenjs.nextTick = function (fn) {
        let args = slice(arguments, 1)
        nextTick(function () {
            fn.apply(null, args)
        })
    }

    // 全局 error 监听
    Thenjs.onerror = function (error) {
        console.error('Thenjs caught error: ', error)
        throw error
    }

    let proto = Thenjs.prototype
    // **Thenjs** 对象上的 **finally** 方法
    proto.fin = proto['finally'] = function (finallyHandler) {
        return thenFactory(function (cont, self) {
            self._finally = wrapTaskHandler(cont, finallyHandler)
        }, this)
    }

    // **Thenjs** 对象上的 **then** 方法
    proto.then = function (successHandler, errorHandler) {
        return thenFactory(function (cont, self) {
            if (successHandler) self._success = wrapTaskHandler(cont, successHandler)
            if (errorHandler) self._error = wrapTaskHandler(cont, errorHandler)
        }, this)
    }

    // **Thenjs** 对象上的 **fail** 方法
    proto.fail = proto['catch'] = function (errorHandler) {
        return thenFactory(function (cont, self) {
            self._error = wrapTaskHandler(cont, errorHandler)
            // 对于链上的 fail 方法，如果无 error ，则穿透该链，将结果输入下一链
            self._success = function () {
                let args = slice(arguments)
                args.unshift(null)
                cont.apply(null, args)
            }
        }, this)
    }

    // **Thenjs** 对象上的 **parallel** 方法
    proto.parallel = function (tasks) {
        return thenFactory(function (cont, self) {
            self._parallel = function (_tasks) {
                parallel(cont, tasks || _tasks)
            }
        }, this)
    }

    // **Thenjs** 对象上的 **series** 方法
    proto.series = function (tasks) {
        return thenFactory(function (cont, self) {
            self._series = function (_tasks) {
                series(cont, tasks || _tasks)
            }
        }, this)
    }

    // **Thenjs** 对象上的 **each** 方法
    proto.each = function (array, iterator) {
        return thenFactory(function (cont, self) {
            self._parallel = function (_array, _iterator) {
                // 优先使用定义的参数，如果没有定义参数，则从上一链结果从获取
                // `_array`, `_iterator` 来自于上一链的 **cont**，下同
                parallel(cont, arrayToTasks(array || _array, iterator || _iterator))
            }
        }, this)
    }

    // **Thenjs** 对象上的 **eachSeries** 方法
    proto.eachSeries = function (array, iterator) {
        return thenFactory(function (cont, self) {
            self._series = function (_array, _iterator) {
                series(cont, arrayToTasks(array || _array, iterator || _iterator))
            }
        }, this)
    }

    // **Thenjs** 对象上的 **parallelLimit** 方法
    proto.parallelLimit = function (tasks, limit) {
        return thenFactory(function (cont, self) {
            self._parallel = function (_tasks) {
                parallelLimit(cont, tasks || _tasks, limit)
            }
        }, this)
    }

    // **Thenjs** 对象上的 **eachLimit** 方法
    proto.eachLimit = function (array, iterator, limit) {
        return thenFactory(function (cont, self) {
            self._series = function (_array, _iterator) {
                parallelLimit(cont, arrayToTasks(array || _array, iterator || _iterator), limit)
            }
        }, this)
    }

    // **Thenjs** 对象上的 **toThunk** 方法
    proto.toThunk = function () {
        let self = this
        return function (callback) {
            if (self._result) {
                callback.apply(null, self._result)
                self._result = false
            } else if (self._result !== false) {
                self._finally = self._error = callback
            }
        }
    }

    // util.inspect() implementation
    proto.inspect = function () {
        let obj = {}
        for (let key in this) {
            if (!hasOwnProperty.call(this, key)) continue
            obj[key] = key === '_nextThen' ? (this[key] && this[key]._chain) : this[key]
        }
        return obj
    }

    // 核心 **continuation** 方法
    // **continuation** 收集任务结果，触发下一个链，它被注入各个 handler
    // 其参数采用 **node.js** 的 **callback** 形式：(error, arg1, arg2, ...)
    function continuation() {
        let self = this
        let args = slice(arguments)

        // then链上的结果已经处理，若重复执行 cont 则直接跳过；
        if (self._result === false) return
        // 第一次进入 continuation，若为 debug 模式则执行，对于同一结果保证 debug 只执行一次；
        if (!self._result && self._chain) {
            self.debug.apply(self, ['\nChain ' + self._chain + ': '].concat(slice(args)))
        }
        // 标记已进入 continuation 处理
        self._result = false

        carry(function (err) {
            if (err === args[0]) continuationError(self, err)
            else continuation.call(self._nextThen, err)
        }, continuationExec, self, args)
    }

    function continuationExec(ctx, args) {
        if (args[0] == null) args[0] = null
        else {
            args = [args[0]]
            if (!ctx._finally) throw args[0]
        }
        if (ctx._finally) return ctx._finally.apply(null, args)
        let success = ctx._success || ctx._parallel || ctx._series
        if (success) return success.apply(null, slice(args, 1))
        // 对于正确结果，**Thenjs** 链上没有相应 handler 处理，则在 **Thenjs** 链上保存结果，等待下一次处理。
        ctx._result = args
    }

    function continuationError(ctx, err) {
        let _nextThen = ctx
        let errorHandler = ctx._error || ctx._finally

        // 获取后链的 error handler
        while (!errorHandler && _nextThen._nextThen) {
            _nextThen = _nextThen._nextThen
            errorHandler = _nextThen._error || _nextThen._finally
        }

        if (errorHandler) {
            return carry(function (_err) {
                // errorHandler 存在则 _nextThen._nextThen 必然存在
                continuation.call(_nextThen._nextThen, _err)
            }, errorHandler, err)
        }
        // 如果定义了全局 **onerror**，则用它处理
        if (Thenjs.onerror) return Thenjs.onerror(err)
        // 对于 error，如果没有任何 handler 处理，则保存到链上最后一个 **Thenjs** 对象，等待下一次处理。
        while (_nextThen._nextThen) _nextThen = _nextThen._nextThen
        _nextThen._result = [err]
    }

    function genContinuation(ctx, debug) {
        function cont() {
            return continuation.apply(ctx, arguments)
        }
        // 标记 cont，cont 作为 handler 时不会被注入 cont，见 `wrapTaskHandler`
        cont._isCont = true
        // 设置并开启 debug 模式
        if (debug) {
            proto.debug = typeof debug === 'function' ? debug : defaultDebug
            ctx._chain = 1
        }
        return cont
    }

    // 注入 cont，执行 fn，并返回新的 **Thenjs** 对象
    function thenFactory(fn, ctx, debug) {
        let nextThen = new Thenjs()
        let cont = genContinuation(nextThen, debug)

        // 注入 cont，初始化 handler
        fn(cont, ctx)
        if (!ctx) return nextThen
        ctx._nextThen = nextThen
        if (ctx._chain) nextThen._chain = ctx._chain + 1
        // 检查上一链的结果是否处理，未处理则处理，用于续接 **Thenjs** 链
        if (ctx._result) {
            nextTick(function () {
                continuation.apply(ctx, ctx._result)
            })
        }
        return nextThen
    }

    // 封装 handler，`_isCont` 判定 handler 是不是 `cont` ，不是则将 `cont` 注入成第一个参数
    function wrapTaskHandler(cont, handler) {
        return handler._isCont ? handler : function () {
            let args = slice(arguments)
            args.unshift(cont)
            handler.apply(null, args)
        }
    }

    // ## **parallel** 函数
    // 并行执行一组 `task` 任务，`cont` 处理最后结果
    function parallel(cont, tasks) {
        if (!isArray(tasks)) return cont(errorify(tasks, 'parallel'))
        let pending = tasks.length
        let result = []

        if (pending <= 0) return cont(null, result)
        for (let i = 0, len = pending; i < len; i++) tasks[i](genNext(i))

        function genNext(index) {
            function next(error, value) {
                if (pending <= 0) return
                if (error != null) {
                    pending = 0
                    cont(error)
                } else {
                    result[index] = value
                    return !--pending && cont(null, result)
                }
            }
            next._isCont = true
            return next
        }
    }

    // ## **series** 函数
    // 串行执行一组 `array` 任务，`cont` 处理最后结果
    function series(cont, tasks) {
        if (!isArray(tasks)) return cont(errorify(tasks, 'series'))
        let i = 0
        let end = tasks.length - 1
        let run
        let result = []
        let stack = maxTickDepth

        if (end < 0) return cont(null, result)
        next._isCont = true
        tasks[0](next)

        function next(error, value) {
            if (error != null) return cont(error)
            result[i] = value
            if (++i > end) return cont(null, result)
            // 先同步执行，嵌套达到 maxTickDepth 时转成一次异步执行
            run = --stack > 0 ? carry : (stack = maxTickDepth, defer)
            run(cont, tasks[i], next)
        }
    }

    function parallelLimit(cont, tasks, limit) {
        let index = 0
        let pending = 0
        let len = tasks.length
        let queue = []
        let finished = false

        limit = limit >= 1 ? Math.floor(limit) : Number.MAX_VALUE
        // eslint-disable-next-line
        do { checkNext() } while (index < len && pending < limit)

        function checkNext() {
            if (finished) return
            if (index >= len) {
                finished = true
                return parallel(cont, queue)
            }
            if (pending >= limit) return
            pending++
            queue.push(evalTask())
        }

        function evalTask() {
            return new Thenjs(tasks[index++]).fin(function (next, err, res) {
                if (err != null) {
                    finished = true
                    return cont(err)
                }
                pending--
                checkNext()
                next(null, res)
            }).toThunk()
        }
    }

    // 默认的 `debug` 方法
    function defaultDebug() {
        console.log.apply(console, arguments)
    }

    // 参数不合法时生成相应的错误
    function errorify(obj, method) {
        return new Error('The argument ' + (obj && obj.toString()) + ' in "' + method + '" is not Array!')
    }

    Thenjs.NAME = 'Thenjs'
    Thenjs.VERSION = '2.0.3'
    return Thenjs
})();

//style转json
const styleToJson = function (styleString) {
    let object = {};
    styleString = styleString.split(';');
    for (let i = 0; i < styleString.length; i++) {
        if (styleString[i].replace(/\s/g, "") !== "") {
            let temp = styleString[i].split(':');
            temp.length === 2 && (object[temp[0]] = temp[1]);
        }
    }
    return object;
}

//格式化style数据未字符串
const jsonToStyle = function (styleJson, extraStyle) {
    if (extraStyle !== undefined) {
        typeof extraStyle == "string" && (extraStyle = styleToJson(extraStyle));
        for (let key in extraStyle) {
            // 合并两个style json数据
            styleJson[key] = extraStyle[key];
        }
    }
    let style = '', style_value, img_url;
    for (let key in styleJson) {
        style_value = styleJson[key], img_url = style_value.match(/url\(([^\s}]+)\)/);
        if (_$.isArray(img_url)) {
            style_value = 'url(' + autoMendServer(img_url[0], 'imageServer') + ")";
        }
        style += `${key}:${style_value};`;
    }
    return style;
};
//样式承接=>旨在更新原有样式，添加新的样式，而非删除原有添加新样式
const styleExtend = function () {
    let args = arguments, first = arguments[0], len = arguments.length, i = 1;
    if (typeof first === "string") {
        first = styleToJson(first);
    }
    for (; i < len;) {
        first = jsonToStyle(first, args[i++]);
    }
    return first;
}

// 检查是否存在某个样式
const hasClass = function (sourceClassStr, className) {
    if (typeof sourceClassStr === "string") {
        sourceClassStr = sourceClassStr.split(" ");
        return sourceClassStr.indexOf(className);
    } else if (sourceClassStr instanceof Array) {
        return sourceClassStr.indexOf(className);
    } else {
        return -1;
    }
}

// 添加样式
const addClass = function (sourceClassStr, className) {
    if (typeof sourceClassStr === "string") {
        sourceClassStr = sourceClassStr.split(" ");
        sourceClassStr.push(className)
        return sourceClassStr.join(" ");
    }
}

const removeClass = function (sourceClassStr, className) {
    if (typeof sourceClassStr === "string") {
        let cindex = hasClass(sourceClassStr, className);
        sourceClassStr = sourceClassStr.split(" ");
        cindex !== -1 && sourceClassStr.splice(cindex, 1);
        return sourceClassStr.join(" ");
    }
}

const $csscontrol = {
    styleToJson: styleToJson,
    jsonToStyle: jsonToStyle,
    styleExtend: styleExtend,
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass
};


// 页面标示，用于存储对应页面的MinQuery对象，防止二次注册页面
const $pageMQRegisterTags = {};
// 页面MQ对象存储器，仅在页面被load后才加载到此对象上，unload后卸载相应页面对象
// 获取/打开打开的页面MQ实例对象
const $pageLoadedInstances = {
    __loadedInstances__: {},
    get(pageName) {
        if (pageName) {
            if (pageName in this.__loadedInstances__) {
                return this.__loadedInstances__[pageName];
            } else {
                return undefined;
            }
        } else {
            return this.__loadedInstances__;
        }
    },
    set(pageName, tMQ) {
        if (pageName) {
            if (!!tMQ && !!tMQ.expando && pageName in this.__loadedInstances__) {
                console.error("Page Loaded instance can not be registered twice!", pageName);
                return;
            }
            if (tMQ === null) {
                delete this.__loadedInstances__[pageName];
            } else if (!!tMQ.expando) {
                this.__loadedInstances__[pageName] = tMQ;
            }
        }
    }
}
// set window object 
let $windowInfo = {};
// bind system info
let getSystemInfo = function (targetObj) {
    let sys, res = {};
    try {
        sys = wx.getSystemInfoSync()
        // res.model pixelRatio windowWidth windowHeight language version platform
        res.DPI = sys.pixelRatio;
        res.width = sys.windowWidth;
        res.height = sys.windowHeight;
        res.language = sys.language;
        res.version = sys.version;
        res.platform = sys.platform;
        res.model = sys.model;
        res.system = sys.system;
        $extend(targetObj, res)
    } catch (e) {
        // try async model 
        wx.getSystemInfo({
            success: function (sys) {
                res.DPI = sys.pixelRatio;
                res.width = sys.windowWidth;
                res.height = sys.windowHeight;
                res.language = sys.language;
                res.version = sys.version;
                res.platform = sys.platform;
                res.model = sys.model;
                res.system = sys.system;
                $extend(targetObj, res)
            }
        })
    }
    return res;
}
getSystemInfo($windowInfo);
// Events across the page
const $globalEvents = {
    __events__: {},
    // 分离需要执行的和不被执行的
    classifyFilter(filter, _negative, _positive) {
        if (filter instanceof Array) {
            filter.forEach((f) => {
                f = Array.from(f);
                if (f[0] === "!") {
                    f.shift();
                    _negative[f.join("")] = f;
                } else {
                    _positive[f.join("")] = f;
                }
            })
        }
    },
    register(pname, ename, method) {
        if (!pname) return;
        if (typeof ename === "string" && typeof method === 'function') {
            if (!(pname in this.__events__)) {
                this.__events__[pname] = {
                    [ename]: method
                };
            } else {
                if (!(ename in this.__events__[pname])) {
                    this.__events__[pname][ename] = method;
                } else {
                    // 禁止在同一页面多次注册同一全局事件
                    console.error("Can not regiser a global event name in the same page again!");
                }
            }
        }
    },
    // filter arr: 触发指定页面的当前事件['page1','page1']，触发除了过滤页面以外所有页面的当前事件["!page1","!page2"]
    trigger(pname, ename, data, filter) {
        if (!pname) return;
        let _exec = {}, _ignore = {}, _perm;
        this.classifyFilter(filter, _ignore, _exec);
        for (let pg in this.__events__) {
            if (pg in _ignore) continue;
            if (!_$.isEmptyObject(_exec)) {
                if (pg in _exec) _perm = true;
                else _perm = false;
            } else {
                _perm = true
            }
            if (_perm && pg in this.__events__ && ename in this.__events__[pg]) {
                // 如果data为函数则派发到回调的第一个参数
                typeof data === 'function' ? this.__events__[pg][ename](data, {
                    from: pname,
                    data: undefined
                }) : this.__events__[pg][ename]({
                    from: pname,
                    data: data
                });
            }
        }
    },
    // filter arr: 关闭对应页面的当前事件['page1','page1']，关闭除了过滤页面以外所有页面的当前事件["!page1","!page2"]
    distory(ename, filter) {
        let _off = {}, _keep = {}, _perm = false;
        this.classifyFilter(filter, _keep, _off);
        for (let pg in this.__events__) {
            if (pg in _keep) continue;
            if (!_$.isEmptyObject(_off)) {
                if (pg in _off) _perm = true;
                else _perm = false;
            } else {
                _perm = true
            }
            if (_perm && pg in this.__events__ && ename in this.__events__[pg]) {
                delete this.__events__[pg][ename];
            }
        }
    }
};
// 全局数据配置，一般用于设置访问服务器地址等
let globalConfiguration = {
    __configurations__: {},
    // 设置
    set(key, value) {
        _$.type(key) === 'number' && (key = key.toString());
        if (_$.isPlainObject(key)) {
            $extend(this.__configurations__, key);
        } else if (_$.isString(key) && !_$.isUndefined(value)) {
            this.__configurations__[key] = value;
        }
    },
    get(key, preset) {
        if (_$.isString(key)) {
            return key in this.__configurations__ ? this.__configurations__[key] : preset ? (this.__configurations__[key] = preset) : undefined;
        } else {
            return preset;
        }
    }
};
// 设置公共的ajax请求服务器地址
// 设置Socket服务器地址
// 设置upLoadFile服务器地址
// 设置downloadFile服务器地址
// 设置imageServer图片服务器地址
// 设置audioServer音频服务器地址
// 设置videoServer视频服务器地址
const _serverTypes = 'ajaxServer,socketServer,uploadServer,downloadServer,imageServer,audioServer,videoServer'.split(',');
_$.each(_serverTypes, function (i, k) {
    globalConfiguration.set(k, '');
});

// 检查是否存在http或https协议头
const hasHttp_sPrefix = function (target) {
    if (_$.isString(target)) {
        // 全路径文件匹配/^((http):\/\/[\w\/\.]*)?\w+\.{1}[a-z]+$/
        let _ishttp = /^(http):\/\/[\w\/\.]*?\w+/.test(target),
            _ishttps = /^(https):\/\/[\w\/\.]*?\w+/.test(target),
            _iswss = /^(wss):\/\/[\w\/\.]*?\w+/.test(target);
        if (_ishttp || _ishttps || _iswss) {
            return true;
        }
    } else return false;
}
// 自动分析链接中是否存在http或https协议头开始的路径，如果存在则认为是全路径，直接返回；如果不存在，则根据需求添加本地设置的响应服务器路径。
const autoMendServer = function (url, serverType) {
    let _server = _serverTypes.indexOf(serverType) !== -1 ? globalConfiguration.get(serverType, '') : '';
    if (_$.isString(url)) {
        // 取消链接的补全
        let _needToFix = url[0] !== '!';
        // 如果不需要补全则删掉第一位的感叹号
        !_needToFix && (url = url.substr(1));
        if (_needToFix) {
            if (!hasHttp_sPrefix(url)) {
                if (_$.trim(url) === '') {
                    url = _server;
                } else {
                    _server = Array.from(_server);
                    url = Array.from(url);
                    let _server_end_is_slash = _server[_server.length - 1] === '/';
                    if (_server_end_is_slash) {
                        url = url[0] !== '/' ? (_server.join('') + url.join('')) : (url.shift(), _server.join('') + url.join(''));
                    } else {
                        url = url[0] !== '/' ? (_server.join('') + '/' + url.join('')) : (_server.join('') + url.join(''));
                    }
                }
            }
        }
    }
    return url;
}
// 允许可发直接数据页面的名称即可访问页面，而非输入全路径。
const smartToCompleteLocalPath = function (url) {
    if (_$.isString(url)) {
        let _isFullPath = /^..\//.test(url), _needToFix = url[0] !== '!';
        if (!_isFullPath && _needToFix) {
            let _hasSlash = url.indexOf('/') !== -1, _splitPath = url.split('/');
            if (_hasSlash) {
                let _pname = _splitPath[_splitPath.length - 1];
                url = '../' + _pname + '/' + _pname;
            } else url = '../' + url + '/' + url;
        }
        // 如果不需要补全则删掉第一位的感叹号
        !_needToFix && (url = url.substr(1));
    }
    return url;
}

let serverSetUpdateCallbacks = {};
// 单个、批量设置服务器地址，或单个，全部服务器地址设置信息获取
const configServers = function (serverName, serverAddress) {
    if (_$.isPlainObject(serverName)) {
        _$.each(serverName, function (sname, saddress) {
            if (_$.isString(saddress)) {
                globalConfiguration.set(sname, saddress);
            }
        })
    } else if (_$.isString(serverName)) {
        if (_$.isString(serverAddress)) {
            globalConfiguration.set(serverName, serverAddress);
        } else {
            return globalConfiguration.get(serverName);
        }
    }
    let _servers = {};
    // 获取所有可设置的服务器地址字段
    _$.each(_serverTypes, function (i, st) {
        _servers[st] = globalConfiguration.get(st);
    });
    // 更新所有已注册页面中的服务器地址设置，检测是否为更新服务项，否则将出现死循环调用，导致内存溢出。
    !!serverName && _$.each($pageLoadedInstances.get(), function (pname, pcontext) {
        pcontext.setData('$servers', _servers);
    })
    return _servers;
};


// 方法主体
const rootMinQuery = function (pageName, recoveryMode) {
    // 检测pageName是否为字符串
    if (!typeof pageName === "string") {
        console.error(`MinQuery initialization require's a pageName, such as: app/pageNameOne;`);
        return undefined;
    }

    // 验证缺失再次尝试获取列表
    if (!$windowInfo.DPI) {
        $getSystemInfo($windowInfo);
    }
    // 定义MinQuery本地函数体
    // selector为选择器
    let MinQuery = function (selector) {
        // The MinQuery object is actually just the init constructor 'enhanced'
        // Need init if MinQuery is called (just allow error to be thrown if not included)
        return new pageInit(selector);
    };
    // *******原型方法无法调用私有方法，私有方法可以调用原型方法*******
    // 
    // 原型工具方法及配置
    MinQuery.fn = MinQuery.prototype = {
        // The current version of MinQuery being used
        MinQuery: version,

        constructor: MinQuery,

        // Start with an empty selector
        selector: "",

        // The default length of a MinQuery object is 0
        length: 0,

        toArray: function () {
            return slice.call(this);
        },

        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function (num) {
            return num != null ?

                // Return just the one element from the set
                (num < 0 ? this[num + this.length] : this[num]) :

                // Return all the elements in a clean array
                slice.call(this);
        },

        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function (elems) {

            // Build a new MinQuery matched element set
            let ret = _$.merge(this.constructor(), elems);

            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;

            // Return the newly-formed element set
            return ret;
        },

        // Execute a callback for every element in the matched set.
        // (You can seed the arguments with an array of args, but this is
        // only used internally.)
        each: function (callback, args) {
            return _$.each(this, callback, args);
        },

        map: function (callback) {
            return this.pushStack(_$.map(this, function (elem, i) {
                return callback.call(elem, i, elem);
            }));
        },

        slice: function () {
            return this.pushStack(slice.apply(this, arguments));
        },

        first: function () {
            return this.eq(0);
        },

        last: function () {
            return this.eq(-1);
        },

        eq: function (i) {
            console.log(this);
            let len = this.length,
                j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },

        end: function () {
            return this.prevObject || this.constructor(null);
        },

        // For internal use only.
        // Behaves like an Array's method, not like a MinQuery method.
        push: push,
        sort: arr.sort,
        splice: arr.splice
    };
    // 集成extend module
    MinQuery.extend = MinQuery.fn.extend = $extend;

    // 继承common methods
    MinQuery.extend(MinQuery, {
        // Unique for each copy of MinQuery on the page
        expando: "MinQuery_" + (version + Math.random()).replace(/\D/g, ""),

        // Unique page indicator, will be use in query currentPage data!
        pageName: pageName,
        // To detecte if the Page event onReady is triggered
        isReady: false,
        // To identify if the MinQuery initial data has been injected in Page Function;
        pageInjected: false
    },
        // 继承外部工具方法
        _$, {
            // Thenjs挂载到$when对象上
            $when: Thenjs
        });

    MinQuery.extend({
        // 单个、批量设置服务器地址，或单个，全部服务器地址设置信息获取
        $servers: configServers,
        // 自动补全服务器地址信息
        /**
         * url String 需要进行补全的url链接
         * serverType String 服务器地址类型
         * 
         * return Complete Url 返回补全后的地址
         */
        autoMendServer: autoMendServer
    })

    /** 此接口用于访问未支持的wx接口，提供二次封装，并支持链式调用方式。
     * 调用方法-分类回调形式：
     *      常规链式方法 MinQuery.wxMethod(wxMethodName,{config: value,success(re){}}).fail(err=>{});
     *      Thenjs方法 Thenjs(MinQuery.wxMethod(wxMethodName,{config: value})).then((cont,res)=>{cont()}).fin((cont,err,res)=>{cont(err)});
     * 单回调形式
     *      MinQuery.wxMethod(wxMethodName,function(re){});
     * 单一参数型
     *      MinQuery.wxMethod(wxMethodName,paramValue);
     */
    MinQuery.wxMethod = wxMethodsCallbackGenerate;


    MinQuery.extend(_wxMethodsPackages);

    MinQuery.extend({
        // Ajax methods
        ajax(url, config, call) {
            if (MinQuery.isPlainObject(url)) {
                call = config;
                config = url;
                url = null;
            }
            let _conf = MinQuery.isPlainObject(config) ? config : {};
            MinQuery.isString(url) && (_conf['url'] = url);
            MinQuery.isFunction(call) && (_conf['success'] = call);
            return _wxMethodsPackages.request(_conf);
        },
        get: function (url, data, call) {
            if (MinQuery.isFunction(data)) {
                call = data;
                data = {};
            }
            return this.ajax({
                url: url,
                data: data,
                success(e) { call && call(e); }
            })
        },
        post(url, data, call) {
            if (MinQuery.isFunction(data)) {
                call = data;
                data = {};
            }
            return this.ajax({
                url: url,
                data: data,
                method: "post",
                success(e) { call && call(e); }
            })
        }
    });

    //window字段查询方法
    MinQuery.extend({
        $window: $windowInfo
    })
    //window字段查询方法，这里的方法只能对window对象进行查询
    MinQuery.fn.extend({
        width() {
            let ele = this[0];
            if (!!ele && ele.$selectorName === "window") {
                return ele.width;
            }
        },
        height() {
            let ele = this[0];
            if (!!ele && ele.$selectorName === "window") {
                return ele.height;
            }
        },
        // 获取所有配置信息
        info(key) {
            let ele = this[0];
            if (!!ele && ele.$selectorName === "window") {
                return !!key ? ele[key] : ele;
            }
        }
    })


    // Query Engine
    // Elements Data Selecte Engine MinQuery
    MinQuery.extend({
        // MinQuery固有Data和Page事件属性标识
        inherentStaticKeys: $mq_config.inherentStaticKeys,
        // 注册固有静态keys
        registerInherentKey(key, description) {
            if (MinQuery.isPlainObject(key) && !description) {
                for (let k in key) {
                    MinQuery.inherentStaticKeys[k] = [k, key[k]];
                }
            } else {
                MinQuery.inherentStaticKeys[key] = [key, description];
            }
        },
        selectorsBank: $mq_config.selectorsBank
    });
    // 元素固有操作属性初始化

    // 全局接口，获取每一个运行中的页面、获取app数据
    let appData;
    MinQuery.extend({
        page(pageName) {
            return $pageLoadedInstances.get(pageName);
        },
        app(searchkeys) {
            !appData && (appData = getApp());
            return MinQuery.dataProcessor(appData, searchkeys);
        }
    })
    /**
     * current  apply & call
     */
    MinQuery.extend({
        $apply(_tar, argsArr) {
            let _this = this;
            MinQuery.isFunction(_tar) && $errorCarry(function () { _tar.apply(_this, argsArr) });
        },
        $call() {
            let args = slice.call(arguments), _tar = args[0], _this = this;
            args.shift();
            MinQuery.isFunction(_tar) && $errorCarry(function () { _tar.apply(_this, args) });
        }
    })

    /**
     * 跨页面数据传输事件注册及触发
     */
    MinQuery.extend({
        // 绑定某个事件的处理方法，每个事件支持绑定多个处理方法，每个方法附带自己的与设置数据
        $on(event, callback) {
            $globalEvents.register(MinQuery.pageName, event, callback.bind(this));
        },
        // 事件传播，及附带数据，并在分发完成后执行Callback
        $off(event, filterArr) {
            $globalEvents.distory(event, filterArr);
        },
        // 事件广播
        $trigger(event, data, filterArr) {
            $globalEvents.trigger(MinQuery.pageName, event, data, filterArr);
        }
    })
    /** 
     * 查询对象的事件注册、触发、销毁器
     */
    MinQuery.fn.extend({
        // 在其他页面或地方对当前页面注册查询对象扩展处理方法，可注册多次注册
        // 注册的函数将会在on或是bind方法绑定函数触发时同步触发，此类方法不存在返回值，并无法使用trigger方法直接进行触发
        registerEvent(_type, data, method) {
            if (typeof data === 'function') {
                method = data;
                data = undefined;
            }
            if (!!this && this.length > 0) {
                this.each(function () {
                    // 禁止监听Page固有事件之外的事件
                    if ((this.$selectorName === "page" || this.$selectorName === "app") && !(_type in MinQuery.pageInheritEventKVPair)) {
                        console.error(`There is no such ${this.$selectorName} inherent event named '${_type}' on page object!`);
                        return;
                    }
                    eventHooks.set(this, `registerEvent.${_type}`, method, data);
                })
            }
            return this;
        },
        // 元素和Page公用事件触发监听回调形式,
        // 主要用于处理元素的绑定事件和Page固有事件监听回调
        on(_type, data, method) {
            if (typeof data === 'function') {
                method = data;
                data = undefined;
            }
            if (!!this && this.length > 0) {
                this.each(function () {
                    // 禁止监听Page固有事件之外的事件
                    if ((this.$selectorName === "page" || this.$selectorName === "app") && !(_type in MinQuery.pageInheritEventKVPair)) {
                        console.error(`There is no such ${this.$selectorName} inherent event named '${_type}'!`);
                        return;
                    }
                    eventHooks.set(this, `bind.${_type}`, method, data);
                })
            }
            return this;
        },
        // 元素专用事件捕捉触发监听回调形式
        // 主要处理元素的Catch事件监听回调，Page不能使用该方法进行回调注册
        catch(_type, data, method) {
            if (typeof data === 'function') {
                method = data;
                data = undefined;
            }
            if (!!this && this.length > 0) {
                this.each(function () {
                    // 禁止在Page上catch事件
                    if (this.$selectorName === "page" || this.$selectorName === "app") {
                        console.error(`Can not use catch method to catch a ${this.$selectorName} event!`);
                        return;
                    }
                    eventHooks.set(this, `catch.${_type}`, method, data);
                })
            }
            return this;
        },
        // 元素和Page公用自定义函数绑定方法
        // 对于元素而言，其表现与on事件回调绑定机制相同
        // 对于Page而言，此方法将会在传入Page方法的实例对象上新建独立的事件处理函数，并且此回调名称不能与已有的任何事件或是属性名称相同。
        // 绑定的data将绑定到回调函数的第一个事件形参的$data属性上
        bind(_type, data, method) {
            if (typeof data === 'function') {
                method = data;
                data = undefined;
            }
            if (!!this && this.length > 0) {
                let self = this;
                this.each(function () {
                    // 禁止触发Page固有事件
                    if (this.$selectorName === "page" || this.$selectorName === "app") {
                        // Page事件绑定仅能在加载函数内进行绑定
                        if (MinQuery.isReady) {
                            console.log(`The ${this.$selectorName} events operation should be run in the MinQuery init function!`);
                            return;
                        };
                        // 禁止再次绑定page固有事件
                        if (_type in MinQuery.pageInheritEventKVPair) {
                            console.error(`The ${this.$selectorName} event ${_type} has already bound as a inherit event callback!`);
                            return;
                        }
                        let _page = self[0];
                        // 检测是否为以存在的键
                        !(_type in _page) && (_page[_type] = function (e) {
                            // 为Page自定义番薯传递数据
                            MinQuery.isPlainObject(e)
                                ? (e['$data'] = data)
                                : (e = { "$event": e, "$data": data });
                            method.call(_page, e);
                        });
                        eventHooks.set(this, `bind.${_type}`, method, data);
                    } else {
                        eventHooks.set(this, `bind.${_type}`, method, data);
                    }
                })
            }
            return this;
        },
        // 自定义事件出发器
        trigger(_type, data, triggerCall, iscatch) {
            // 默认触发bind方法下的事件
            if (typeof triggerCall === "boolean") {
                iscatch = triggerCall;
            }
            if (typeof data === 'function') {
                triggerCall = data;
                data = undefined;
            }
            let triggerType = iscatch === true ? 'catch' : 'bind';
            if (!!this && this.length > 0) {
                // 验证是否触发Page固有事件
                let eroute, res;
                let self = this;
                this.each(function () {
                    if (this.$selectorName === "page" || this.$selectorName === "app") {
                        // 禁止触发Page固有事件
                        if (_type in MinQuery.pageInheritEventKVPair) {
                            console.error(`You can not trigger an ${this.$selectorName} inherent event named [${_type}]!`);
                        } else {
                            // 触发根节点绑定事件
                            if (_type in this && MinQuery.isFunction(this[_type])) {
                                res = this[_type](data);
                                MinQuery.isFunction(triggerCall) && $errorCarry(triggerCall, { "$data": data, "$res": res });
                            };
                        }
                    } else {
                        // 获取当前元素事件路径
                        eroute = this.$events[triggerType] ? this.$events[triggerType][_type] : undefined;
                        // 触发传递数据，并接收返回数据
                        res = eventHooks.get(eroute, {}, data);
                        // 执行callback
                        MinQuery.isFunction(triggerCall) && $errorCarry(triggerCall, { "$data": data, "$res": res });
                    }
                })
            }
            return this;
        },
        // 自定义事件卸载器
        off(_type, offCall, iscatch) {
            // 默认触发bind方法下的事件
            if (typeof offCall === "boolean") {
                iscatch = offCall;
            }
            let triggerType = iscatch === true ? 'catch' : 'bind', _this = this;
            if (!!this && this.length > 0) {
                let eroute;
                this.each(function () {
                    eventHooks.set(this, `${triggerType}.${_type}`, false);
                    MinQuery.isFunction(offCall) && $errorCarry(function () { offCall.call(_this) });
                })
            }
            return this;
        },
        // 用于仅执行一次的触发方法
        one(_type, data, oneceCall, iscatch) {
            // 默认触发bind方法下的事件
            if (typeof oneceCall === "boolean") {
                iscatch = oneceCall;
            }
            if (typeof data === 'function') {
                oneceCall = data;
                data = undefined;
            }
            let triggerType = !!iscatch ? 'catch' : 'bind';
            MinQuery(this)[triggerType](_type, data, function () {
                let etype = _type, ecall = oneceCall;
                MinQuery(this).off(etype, function () { console.log("OFF Event:" + _type) }, triggerType);
                ecall.apply(this, arguments);
            })
            return this;
        }
    });
    // Page固有事件处理器
    let pageInheritEventHandlers = {};
    // 页面固有事件名称管理器，用于防止用户再次注册固有事件。并且可以进行事件查询操作。
    MinQuery.pageInheritEventKVPair = {};

    let pageEventMiddleware;
    // 注册Page固有事件到MinQuery事件代理器
    MinQuery.inheritEventRegister = function (_c_e_name, _middleware) {
        // 如果是外部注册，则添加到主事件列表中
        MinQuery.pageInheritEventList.indexOf(_c_e_name) === -1 && MinQuery.pageInheritEventList.push(_c_e_name);
        // 生成字典
        let noOnEN = Array.from(_c_e_name);
        // 去掉on开头
        noOnEN.splice(0, 2)
        // 降级大写字母
        noOnEN = noOnEN.join("").toLowerCase();
        // 设置双向查询字典
        MinQuery.pageInheritEventKVPair[_c_e_name] = noOnEN;
        MinQuery.pageInheritEventKVPair[noOnEN] = _c_e_name;

        // 设置当前功能处理对象
        pageInheritEventHandlers[_c_e_name] = function (e, ename = _c_e_name) {
            let _this = this;
            // 运行自定义添加的中间件事件处理器
            MinQuery.isFunction(_middleware) && _middleware.call(_this, e, ename);
            // 调用中间件管理器，并处理事件返回值
            return pageEventMiddleware.call(_this, e, ename);
        };
    }
    // 如果是App页面的注册，则启用
    if (MinQuery.pageName === "app") {
        MinQuery.pageInheritEventList = $mq_config.appEvents;
        pageEventMiddleware = function (e, ename) {
            var _rewrite_event = {};
            MinQuery.each(e, function (k, v) {
                // 处理场场景值
                if (k === 'scene') {
                    _rewrite_event[k] = v in wxLaunchScene ? wxLaunchScene[v] : [v, ''];
                } else {
                    _rewrite_event[k] = v;
                }
            })
            // 冻结事件对象
            Object.freeze(_rewrite_event);
            // 等待扩展固有事件方法的快速调用接口，每个固有事件处理器只能被注册一次
            if (ename === MinQuery.pageInheritEventKVPair.launch) {
                // 设置已加载的页面的MQ实例
                $pageLoadedInstances.set(MinQuery.pageName, MinQuery);
            }
            // onReady方法会触发
            if (ename === MinQuery.pageInheritEventKVPair.show) {
                // 设置ready标示，用于标示此页面是否已经加载过了
                MinQuery.isReady = true;
            };
            if (ename === MinQuery.pageInheritEventKVPair.hide) {
                // 离开页面时，回收所有框架注册对象数据
                $pageLoadedInstances.set(MinQuery.pageName, null);
                MinQuery.isReady = false;
            };
            // 优先在事件管理器上查询并执行对应去掉on的自定义事件
            let ret = eventHooks.get(`${MinQuery.selectorsBank.app[0]}.app`, `bind.${MinQuery.pageInheritEventKVPair[ename]}`, _rewrite_event);
            // 未查询到自定义事件是执行查询原始事件名称事件
            if (ret === '[No Handler]') {
                // 查询执行元素原生事件
                return eventHooks.get(`${MinQuery.selectorsBank.app[0]}.app`, `bind.${ename}`, _rewrite_event);
            } else {
                return ret;
            }
        }
    } else {
        // Page固有事件名转换查询列表，如：{onLoad: load,ready: onReady};
        // Page固有事件数组列表
        MinQuery.pageInheritEventList = $mq_config.pageEvents;
        // Page事件查询中间管理器，接收源page事件
        pageEventMiddleware = function (e, ename) {
            // 等待扩展固有事件方法的快速调用接口，每个固有事件处理器只能被注册一次
            if (ename === MinQuery.pageInheritEventKVPair.load) {
                // 映射Page初始化完毕后的实例对象
                MinQuery.pageInstance = this;
                // 检测是否已经注入过
                if (MinQuery.pageInjected) {
                    // 如已经注入加载过，更具模式判断是否需要恢复数据到初始化状态。
                    !!recoveryMode && MinQuery.recoveryObject(MinQuery.$pageInitObject.data, MinQuery.pageInstance.data, true);
                }
                // 将load事件中打来的路径参数绑定到框架上
                MinQuery.querys = e;
                // 设置已加载的页面的MQ实例
                $pageLoadedInstances.set(MinQuery.pageName, MinQuery);
            }
            // onReady方法会触发
            if (ename === MinQuery.pageInheritEventKVPair.ready) {
                // 设置ready标示，用于标示此页面是否已经加载过了
                MinQuery.isReady = true;
            };
            // 关闭页面则回收对象
            if (ename === MinQuery.pageInheritEventKVPair.unload) {
                // 离开页面时，回收所有框架注册对象数据
                // MinQuery("*").stop();
                $pageLoadedInstances.set(MinQuery.pageName, null);
                MinQuery.pageInstance = null;
                MinQuery.querys = null;
                MinQuery.isReady = false;
            };
            // 优先在事件管理器上查询并执行对应去掉on的自定义事件
            let ret = eventHooks.get(`${MinQuery.selectorsBank.page[0]}.page`, `bind.${MinQuery.pageInheritEventKVPair[ename]}`, e);
            // 未查询到自定义事件是执行查询原始事件名称事件
            if (ret === '[No Handler]') {
                // 查询执行元素原生事件
                return eventHooks.get(`${MinQuery.selectorsBank.page[0]}.page`, `bind.${ename}`, e);
            } else {
                return ret;
            }
        }
    }
    // 给每一个Page固有函数绑定中间件
    MinQuery.each(MinQuery.pageInheritEventList, function (i, pe) {
        MinQuery.inheritEventRegister(pe);
    });


    // a hook for event set/get
    let eventHooks = {
        // 设置对应的元素事件到事件管理器中并给当前元素写入事件查询地址
        set: function (elem, eventkeys, method, binddata) {
            if (MinQuery.isUndefined(elem) && !MinQuery.isEmpty(eventkeys)) return;
            let elekeys = `${elem.$selectorType}.${elem.$selectorName}`,
                eleEventRoute = `${elekeys}.$events.${eventkeys}`,
                eventManagerRoute = `${elekeys}.${eventkeys}`,
                hasEvent = MinQuery.getData(eleEventRoute),
                isRegisterEvent = eventkeys.split(".").indexOf("registerEvent") !== -1;
            // 只有存在绑定事件时才能对事件进行开启/关闭操作，register事件不具有这一特性
            if (!!hasEvent && !isRegisterEvent) {
                // 如若已注册事件处理，接收的method为非函数型，则关闭触发器
                if (method === false) {
                    MinQuery.dataProcessor(MinQuery.eventManager, `${eventManagerRoute}.active`, false);
                } else {
                    // 如若已近存在某个事件处理函数，则直接激活它
                    MinQuery.dataProcessor(MinQuery.eventManager, `${eventManagerRoute}.active`, true);
                }
            } else if (!MinQuery.isEmpty(method)) {
                // 设置元素事件查询路径,同步框架数据与Page实例数据
                setCurrentPageData(eleEventRoute, [elekeys, eventkeys]);
                // 设置当前事件函数的上下文，不一定会设置上下文
                MinQuery.dataProcessor(MinQuery.eventManager, elekeys + ".context", elekeys);
                // 设置当前事件函数到对应的事件存储器上,支持元素事件绑定和Page事件绑定
                // 将registerEvent事件处理为数组处理函数集，注册事件只能在绑定事件触发时才会被触发
                if (isRegisterEvent) {
                    let rglist = MinQuery.dataProcessor(MinQuery.eventManager, `${eventManagerRoute}.method`);
                    !rglist && (rglist = []);
                    rglist.push(method);
                    method = rglist;
                } else {
                    // 只对非注册型事件进行激活处理
                    MinQuery.dataProcessor(MinQuery.eventManager, `${eventManagerRoute}.active`, true);
                }
                MinQuery.dataProcessor(MinQuery.eventManager, `${eventManagerRoute}.method`, method);
                // 设置当前事件函数的附带绑定数据
                !!binddata && MinQuery.dataProcessor(MinQuery.eventManager, `${eventManagerRoute}.data`, binddata);
            } else {
                console.error(`Element event Setter requires at least three params![element, eventkeys, method]`, elem, eventkeys, method);
            }
        },
        // 从事件管理器中遍历对应的事件处理函数
        get: function (elekeys, eventkeys, eventdata, triggerdata) {
            // 当元素keys和事件查询keys以数组形式一起出入时，变量承载重排序
            if (elekeys instanceof Array) {
                if (eventdata) triggerdata = eventdata;
                if (eventkeys) eventdata = eventkeys;
                eventkeys = elekeys[1];
                elekeys = elekeys[0];
            };
            let noFunc = "[No Handler]";
            if (!elekeys) {
                return noFunc;
            }
            // 查询元素
            let eventEle = MinQuery.getData(MinQuery.eventManager, elekeys),
                // 查询事件
                eventObj = eventEle ? MinQuery.getData(eventEle, eventkeys) : false;
            // 查询注册扩展事件
            let regObj = eventEle ? MinQuery.getData(eventEle, `registerEvent.${eventkeys.split(".").pop()}`) : false,
                // 将事件绑定的data数据绑定到eventdata事件数据的$data字段上
                dataArr = [], ei = 0, eleContext = MinQuery.getData(eventEle.context);
            if (!!eventObj && !!eventObj.active) {
                // 将绑定数据挂在到event数据上的$data属性上
                if (!!eventdata) {
                    if (!!eventObj.data) MinQuery.isPlainObject(eventdata)
                        ? (eventdata['$data'] = eventObj.data)
                        : (eventdata = { "$event": eventdata, "$data": eventObj.data })
                    dataArr[ei++] = eventdata;
                }
                // 将trigger数据追加到event数据后
                if (!!triggerdata) {
                    triggerdata instanceof Array
                        ? (MinQuery.merge(dataArr, triggerdata))
                        : (dataArr[ei] = triggerdata);
                };
                // 处理批量registerEvent方法

                !!regObj && regObj.method && MinQuery.each(regObj.method, (i, reg) => { 
                    MinQuery.isFunction(reg) && $errorCarry(function () { reg.apply(eleContext, dataArr) }) 
                });

                let _method_return;
                _method_return = MinQuery.isFunction(eventObj.method) ? $errorCarry(function () { return eventObj.method.apply(eleContext, dataArr) }) : noFunc;
                // 返回绑定当前域的处理方法，返回处理后的数据
                return _method_return
            } else {
                return noFunc
            }

        }
    }
    // 此字段对应selectorsBank的选择器键值
    MinQuery.eventManager = {
        "$id": {
            // 元素：context用于指向当前元素指代的控制域数据，data绑定处理事件时绑定的数据，...事件类型=>事件名称，
            // "element": {"context": {},"bind": {"tap": {method:function (e) {},"data": null}}}
        },
        "$cs": {},
        "$page": {
            // 与元素的不同之处在于，没有context
            // "page": {"bind": {"load": {method:function (e) {},"data": null}}
        },
        "$app": {
            // 与元素的不同之处在于，没有context
            // "app": {"bind": {"load": {method:function (e) {},"data": null}}
        },
        "$window": {},
        // 主要承载数据更改时触发的事件
        "$data": {}
    }

    // 元素事件处理集
    let elementEventHandlers = {
        // 处理bind事件
        "$bind": function (e) {
            findElementEventHandler(e, "bind");
        },
        // 处理catch事件
        "$catch": function (e) {
            findElementEventHandler(e, "catch");
        }
    }
    // 获取元素处理事件
    let findElementEventHandler = function (e, _type) {
        // 做target与currentTarget之间的权衡选择，首选target
        // id获取来源是否是
        // 解决小程序catch与bind时出现的事件错误
        let cur_id = MinQuery.getData(e, 'currentTarget.id'),
            tar_id = MinQuery.getData(e, 'target.id'),
            cur_class = MinQuery.getData(e, 'currentTarget.dataset.mClass'),
            tar_class = MinQuery.getData(e, 'target.dataset.mClass'),
            // 用于canvas画布的id选中
            tar_tar = MinQuery.getData(e, 'target.target');
        let tid = cur_id
            ? cur_id
            : tar_id,
            tcs = cur_class
                ? cur_class
                : tar_class;
        tid = tid ? tid : tar_tar;
        // event对象扩展
        if (e.type === "submit") MinQuery.extend(e, {
            // 设置访问formData快捷接口
            form(key) {
                if (key) {
                    return MinQuery.getData(this.detail, `value.${key}`);
                } else return MinQuery.getData(this.detail, `value`);
            }
        })
        MinQuery.extend(e, {
            // 访问当前元素
            current(key) {
                let _target = !!this.currentTarget ? this.currentTarget : this.target;
                if (key) {
                    return MinQuery.getData(_target, key);
                } else return _target
            },
            // 访问当前元素data属性
            data(key) {
                let dataset = this.current(`dataset`);
                if (key) return dataset[key];
                else return dataset;
            }
        })
        // 优先查询ID绑定池并执行;渲染层事件触发不存在返回数据
        let ret = tid ? eventHooks.get(`${MinQuery.selectorsBank["#"][0]}.${tid}`, `${_type}.${e.type}`, e) : "[No Handler]";
        // 如果不存在ID事件绑定则查询data-min-class绑定版
        (ret === "[No Handler]") && tcs && eventHooks.get(`${MinQuery.selectorsBank["."][0]}.${tcs}`, `${_type}.${e.type}`, e);
    }

    // 存储已注册元素路径
    MinQuery.registeredElements = [];
    // elements find method
    MinQuery.find = function (selector) {
        // 跟数据查询
        if (selector.length !== 1 && selector in MinQuery.selectorsBank) {
            return MinQuery.getData(MinQuery.selectorsBank[selector][0]);
        }
        // 元素按id或data-min-class查询
        let prevfix = selector[0];
        let _elarr = Array.from(selector);
        _elarr.shift();
        let elem = _elarr.join("");
        let eleType = "", eleName = "", f_elem, r_path = "";
        if (selector.length > 1 && prevfix in MinQuery.selectorsBank) {
            // 查询类型
            eleType = MinQuery.selectorsBank[prevfix][0];
            r_path = `${eleType}.${elem}`;
            f_elem = MinQuery.getData(r_path);
            eleName = elem;
        } else if (selector.length === 1 && MinQuery.selectorsBank[prevfix][0] === '$all') {
            // 查询全部
            let eles = [];
            MinQuery.each(MinQuery.registeredElements, (i, r) => {
                eles.push(MinQuery.getData(r));
            });
            return eles;
        } else {
            f_elem = MinQuery.getData(selector);
            r_path = eleName = selector;
        }
        if (f_elem) {
            return f_elem;
        } else {
            MinQuery.registeredElements.push(r_path);
            // 获取元素初始化对象
            let newEleAttr = $mq_config.getElementInitialData();
            // 元素所属类型
            newEleAttr.$selectorType = eleType;
            // 去前缀元素名称
            newEleAttr.$selectorName = eleName;
            // 初始化元素对象
            setCurrentPageData(r_path, newEleAttr);
            // 查询元素对象
            return MinQuery.getData(r_path);
        }
    };
    // page initial object
    MinQuery.$pageInitObject = pageName == 'app' ? {
        "$selectorType": "$app",
        "$selectorName": "app",
        "data": {
            "$servers": MinQuery.$servers()
        }
    } : {
            "$pageIndicator": MinQuery.pageName,
            "$selectorType": "$page",
            "$selectorName": "page",
            "data": {
                "$id": {},
                "$cs": {},
                "$window": MinQuery.extend($windowInfo, {
                    "$selectorType": "$window",
                    "$selectorName": "window",
                }),
                // page的data和attr属性
                "$data": {},
                "$attr": {},
                "$servers": MinQuery.$servers()
            }
        };
    // 下一步，使pageInit继承MinQuery，抽出MinQuery不在进行重复性的初始化，使用extend方法
    // Page主选择器
    let pageInit = function (selector) {
        if (!selector) {
            return this;
        }
        if (MinQuery.isString(selector)) {
            let _selectors = selector.split(","), multis, tar_selectorTypes = [], s = 0;
            for (; s < _selectors.length; s++) {
                let _sele = _selectors[s];
                multis = {};
                let _lowsele = _sele.toLowerCase();
                // 当前页面对象查询
                if (_lowsele === "page") {
                    tar_selectorTypes.push(MinQuery.selectorsBank[_lowsele][0]);
                    multis[0] = MinQuery.$pageInitObject;
                    multis.length = 1;
                }
                // 对APP对象查询
                else if (_lowsele == "app") {
                    tar_selectorTypes.push(MinQuery.selectorsBank[_lowsele][0]);
                    if (MinQuery.pageName == 'app') {
                        multis[0] = MinQuery.$pageInitObject;
                    } else {
                        // 获取app对象实例
                        multis[0] = MinQuery.page('app')('app')[0];
                    }
                    multis.length = 1;
                }
                // 查询所有已注册元素
                else if (_sele === "*") {
                    tar_selectorTypes.push(MinQuery.selectorsBank[_sele][0]);
                    multis = MinQuery.find(_sele);
                    console.log(multis)
                }
                // 当前页面中的data附属查询
                else if (_lowsele == "window") {
                    tar_selectorTypes.push(MinQuery.selectorsBank[_lowsele][0]);
                    multis[0] = MinQuery.find(_lowsele);
                    multis.length = 1;
                } else if (_lowsele == "data") {
                    tar_selectorTypes.push(MinQuery.selectorsBank[_lowsele][0]);
                    multis[0] = MinQuery.find(_lowsele);
                    multis.length = 1;
                } else if (_sele[0] == ".") {
                    tar_selectorTypes.push(MinQuery.selectorsBank[_sele[0]][0]);
                    multis[0] = MinQuery.find(_sele);
                    multis.length = 1;
                } else if (_sele[0] == "#") {
                    tar_selectorTypes.push(MinQuery.selectorsBank[_sele[0]][0]);
                    multis[0] = MinQuery.find(_sele);
                    multis.length = 1;
                } else {
                    tar_selectorTypes.push("");
                    multis[0] = MinQuery.find(_sele);
                    multis.length = 1;
                }
                MinQuery.merge(this, multis);
            };
            this.selector = selector;
            this.selectorType = tar_selectorTypes.join(",");
            return this;
        } else if (MinQuery.isFunction(selector)) {
            // 执行加载函数
            // 首先运行主体注册函数
            let _exec_page = function () {
                $errorCarry(selector,MinQuery);
                if (MinQuery.pageName === "app") {
                    MinQuery.extend(MinQuery.$pageInitObject, pageInheritEventHandlers);
                    // 启动当前小程序的App初始化函数
                    App(MinQuery.$pageInitObject);
                } else {
                    MinQuery.extend(MinQuery.$pageInitObject, elementEventHandlers, pageInheritEventHandlers);
                    // 启动当前页面的Page初始化函数，判断模式：恢复模式，则传入copy初始化数据；非恢复模式则传入源数据；
                    Page(!!recoveryMode ? (MinQuery.extend(true, {}, MinQuery.$pageInitObject)) : MinQuery.$pageInitObject);
                }
                // 设置ready标示
                MinQuery.pageInjected = true;
                return MinQuery;
            }
            if (selector.name === '$__init__') {
                setTimeout(() => {
                    if (!MinQuery.pageInjected) {
                        _exec_page();
                    }
                }, 5);
            } else {
                if (!MinQuery.pageInjected) {
                    return _exec_page();
                } else {
                    return null;
                }
            }

        }
        // 返回数据源的MinQuery封装对象
        return MinQuery.makeArray(selector, this);
    }
    // 原型拷贝
    pageInit.prototype = MinQuery.prototype;
    // 样式操作
    MinQuery.extend($csscontrol);
    // 元素框架内部访问属性集合
    MinQuery.registerInherentKey({
        "$__priv_keys__": "To cache the element private options!"
    });
    // 用于操作元素的私有属性方法，此设置不参与视图层更新操作
    let elem_priv = {
        priv_keys: "$__priv_keys__",
        // 获取时，允许传入一个预设值，当获取的数据不存在的时候进行预设。
        get(ele, _type, value, arrPush) {
            let cur_priv = MinQuery.getData(ele, `${this.priv_keys}.${_type}`);
            return !!cur_priv ? cur_priv : !!value ? this.set(ele, _type, value, arrPush) : undefined;
        },
        // 设置数据并返回设置的数据
        set(ele, _type, value, arrPush) {
            if (ele) {
                !ele[this.priv_keys] && (ele[this.priv_keys] = {});
                if (arrPush) {
                    !ele[this.priv_keys][_type] && (ele[this.priv_keys][_type] = []);
                    ele[this.priv_keys][_type].push(value);
                } else {
                    ele[this.priv_keys][_type] = value;
                }
                return value;
            }
        },
        // 访问或设置数据
        access(ele, _type, key, value) {
            if (ele) {
                let curPriv = !ele[this.priv_keys] ? (ele[this.priv_keys] = {}) : ele[this.priv_keys];
                let curType = !curPriv[_type]
                if (curType) {
                    if (MinQuery.isPlainObject(curType) && !!key) {
                        !!value ? (curType[key] = value) : curType = key;
                    } else if (MinQuery.isArray(curType)) {
                        !!key && !value ? curType.push(key) : !!key && !!value ? curType.push({
                            [key]: value
                        }) : null;
                    }
                    return curType;
                }
            }
        },
        clear(ele, _type) {
            if (ele) {
                MinQuery.dataProcessor(ele, `${this.priv_keys}.${_type}`, null);
            }
        }
    }
    MinQuery.extend({
        timeOut(call, delay, still) {
            return setTimeout(function () {
                if (!!this.still || !this.still && MinQuery.isReady) {
                    MinQuery.isFunction(this.call) && $errorCarry(this.call);
                }
            }.bind({
                call: call,
                // 标识是否检测ready字段
                still: still
            }), delay);
        }
    });
    // 公用元素属性访问器
    MinQuery.fn.extend({
        /**
         * _type String 【必填】 属性名称
         * handler Function 【可选】自定义操作方法，接收四个参数：ele_data_path[元素数据全路径]、ele_data[元素数据]、key[设置的数据键]、value[设置的数据键值];此方法会进行循环调用，this对象指向当前处理的元素数据。
         * handler函数处理后的返回值可带两个指令性标示，分别是：
         *      handler().$__returns__ //需要返回的内容
         *      handler().$__force_return__  //强制返回$__returns__中的内容
         *      handler().$__force_continue__  //强制忽略后续执行，并进入下一个循环
         * 
         * key String 【必填】键名称 
         * value Anytype 【必填】 键值数据 
         */
        eleAttrAccess(_type, handler, key, value) {
            let i = 0, len = this.length, ele;
            !MinQuery.isFunction(handler) && (handler = function () { });
            for (; i < len;) {
                ele = this[i++];
                let _path = `${ele.$selectorType}.${ele.$selectorName}.${_type}${MinQuery.isString(key) ? ('.' + key) : ''}`,
                    _eledt = ele[_type];
                if (ele.$selectorName === "page") {
                    _path = `${_type}.${MinQuery.isString(key) ? ('.' + key) : ''}`;
                    _eledt = ele.data[_type];
                } else if (MinQuery.pageName !== 'app' && ele.$selectorName === "app") {
                    // 仅针对page页面查询app元素进行修改
                    _eledt = MinQuery.page('app').$pageInitObject.data;
                    key = _path;
                }
                // 执行自定义处理器
                let result = handler.call(ele, _path, _eledt, key, value);
                // 强制进行数据返回
                if (!!result && result.$__force_return__) return result.$__returns__;
                // 强制忽略后续执行，并进入下一个循环
                if (!!result && result.$__force_continue__) continue;
                if (MinQuery.isString(key)) {
                    if (!MinQuery.isUndefined(value)) setCurrentPageData(_path, value);
                    else {
                        return _eledt ? MinQuery.getData(_eledt, key) : undefined;
                    }
                } else return _eledt;
            }
            return this;
        }
    })
    // Elements Attributes Operation Methods
    MinQuery.fn.extend({
        // 设置当前元素data值
        data(key, value) {
            let i = 0, len = this.length, ele;
            for (; i < len;) {
                ele = this[i++];
                let _path = `${ele.$selectorType}.${ele.$selectorName}.$data`,
                    _eledt = ele.$data;
                // 设置样式属性到视图更新
                if (MinQuery.isString(key)) {
                    if (ele.$selectorName === "page") {
                        _path = `$data`;
                        _eledt = ele.data.$data;
                    } else if (MinQuery.pageName !== 'app' && ele.$selectorName === "app") {
                        // 仅针对page页面查询app元素进行修改
                        _eledt = MinQuery.page('app').$pageInitObject.data;
                        key = _path;
                    }
                    // 如果key是字符串
                    // 存在对应数据，则设置数据，返回操作hooks
                    if (value) return setCurrentPageData(_path + `.${key}`, value);
                    else {
                        // 不存在则获取对应数据
                        return _eledt ? MinQuery.getData(_eledt, key) : undefined;
                    }
                } else if (!!key) {
                    // 直接设置非String数据
                    return setCurrentPageData(_path, key);
                } else {
                    // 如果key和value均不存在，则返回$data数据
                    return _eledt;
                };
            }
        },
        attr(key, value) {
            var _this = this;
            if (MinQuery.isPlainObject(key)) {
                MinQuery.each(key, function (_k, _v) {
                    _this.eleAttrAccess('$attr', null, _k, _v);
                })
                return _this;
            } else return _this.eleAttrAccess('$attr', null, key, value);
        },
        /**
         * config方法允许使用键值对形式进行配置设置，并且可在元素事件操作中进行config的调用，例如
         * let _ele = $('.ele').config();
         * 
         */
        config(key, value) {
            var _this = this;
            if (MinQuery.isPlainObject(key)) {
                MinQuery.each(key, function (_k, _v) {
                    _this.eleAttrAccess('$cf', null, _k, _v);
                })
                return _this;
            } else return _this.eleAttrAccess('$cf', null, key, value);
            // return this.eleAttrAccess('$cf', function (_path, _eledata, k, v) {
            //     let _cf = elem_priv.get(this, "$cf-configuration"), plainKey = false, stringKey = false;
            //     if ((stringKey = MinQuery.isString(k)) && !!v || (plainKey = MinQuery.isPlainObject(k))) {
            //         if (plainKey) {
            //             let _nkv = {};
            //             MinQuery.each(k, (kk, kv) => {
            //                 _nkv[`${_path}.${kk}`] = kv;
            //             });
            //             k = _nkv;
            //         } else k = `${_path}`;
            //         if (!_cf) {
            //             elem_priv.set(this, "$cf-configuration", MinQuery.setData(k, v, true, true));
            //         } else {
            //             let _hook = MinQuery.setData(k, v, true, true), _hk;
            //             for (_hk in _hook) _cf[_hk] = _hook[_hk];
            //         }
            //         return {
            //             $__force_continue__: true
            //         }
            //     } else if (!k || stringKey && !v) {
            //         let operate = {};
            //         if (stringKey) operate = _cf[k].get();
            //         else {
            //             delete _cf.__length__;
            //             delete _cf.__paths__;
            //             MinQuery.each(_cf, function (confName, confHook) {
            //                 operate[confName] = function (value) {
            //                     let _hook = confHook;
            //                     if (!!value) _hook.set(value);
            //                     else return _hook.get();
            //                 };
            //             })
            //         }
            //         return {
            //             $__force_return__: true,
            //             $__returns__: operate
            //         }
            //     }
            // }, key, value);
        },
        text(text) {
            let i = 0, len = this.length, ele;
            for (; i < len;) {
                ele = this[i++];
                // 获取当前样式的JSON格式
                let _text = ele.$text;
                if (!!text) {
                    _text = text;
                } else return text;
                // 设置样式属性到视图更新
                setCurrentPageData(`${ele.$selectorType}.${ele.$selectorName}.$text`, _text);
            }
            return this;
        },
        // animation delay
        delay(time) {
            if (typeof time === 'number') {
                this.each(function () {
                    elem_priv.set(this, "$animation-delay", time);
                })
            } else {
                console.error("Delay method should be performed before the animation method,and requires a number param!")
            }
            return this;
        },
        // 停止动画
        stop(jumpToEnd) {
            this.each(function () {
                console.log("ANI STOPPed")
                let _queTime = elem_priv.get(this, "$animation-queue-time");
                let _queFunc = elem_priv.get(this, "$animation-queue-func");
                // 销毁所有动画队列
                if (_queTime instanceof Array) {
                    MinQuery.each(_queTime, (i, e) => {
                        clearTimeout(e);
                        e = null;
                    })
                    elem_priv.clear(this, "$animation-queue")
                }
                if (jumpToEnd) {
                    // 设置当前动画结束到最后样式
                    elem_priv.set(this, "$animation-to-end", jumpToEnd);
                    if (_queFunc instanceof Array) {
                        MinQuery.each(_queFunc, (i, f) => {
                            MinQuery.isFunction(f) && $errorCarry(f);
                        });
                        elem_priv.clear(this, "$animation-to-end")
                    }
                }
            });
            return this;
        },
        // animation step setting
        animation(animateStepFunc, speed, easing, origin) {
            let config = {
                origin: "50% 50%",
                speed: 1000,
                easing: "ease",
                delay: 0
            };
            typeof speed === 'number' ? (config.speed = speed) : MinQuery.isPlainObject(speed) ? MinQuery.extend(config, speed) : null;
            MinQuery.isString(easing) && (config.easing = easing);
            MinQuery.isString(origin) && (config.origin = origin);
            let nativeCf = {
                transformOrigin: config.origin,
                duration: config.speed,
                timingFunction: config.easing,
                delay: config.delay
            };
            this.each(function () {
                // 获取或是创建动画
                let animateObj = this.$animationObject
                    ? this.$animationObject
                    : (this.$animationObject = wx.createAnimation(nativeCf))
                animateStepFunc.call(animateObj, animateObj);
                // 动画当前步骤配置
                animateObj.step(nativeCf);
                // 获取通过delay预先设置的延时
                let delayTime = elem_priv.get(this, "$animation-delay") || 0;
                // 重置animationDelay
                elem_priv.set(this, "$animation-delay", 0);
                // 延时更新动画数据
                let aniQueueMet = function () {
                    if (!!elem_priv.get(this.ele, "$animation-to-end")) {
                        console.log(this.stepCF)
                        this.stepCF.delay = 0;
                        this.stepCF.duration = 0;
                        this.aniData.step(this.stepCF);
                    }
                    setCurrentPageData(this.eleRoute, this.aniData.export());
                }.bind({
                    aniData: animateObj,
                    stepCf: nativeCf,
                    eleRoute: `${this.$selectorType}.${this.$selectorName}.$animation`,
                    ele: this
                });
                // 将timeOut对象加入到当前元素的动画队列
                elem_priv.set(this, "$animation-queue-time", MinQuery.timeOut(aniQueueMet, delayTime), true);
                elem_priv.set(this, "$animation-queue-func", aniQueueMet, true);
            })
            return this;
        },
        // 基于css创建动画：stylesGetFunc[接收一个返回style字符串或是对象的匿名函数，或是直接的style字符串或对象]、speed[动画执行时长，以毫秒计算，整数形式，默认200ms]、bezier[支持贝塞尔曲线函数，字符串形式，不填则默认ease]、targetStyleArr[需要进行动画过度的目标样式数组，如：height；没有则默认all]
        cssAnimation(stylesGetFunc, speed, bezier, targetStyleArr) {
            let aniStyles;
            // 校验贝塞尔曲线函数
            let getBezier = function (str) {
                if (!MinQuery.isString(str)) {
                    return "ease";
                }
                let _matchs = /cubic-bezier\(([^*]+)\)/g.exec(str);
                if (!!_matchs && _matchs.length === 2) {
                    let _vs = _matchs[1].split(",");
                    if (_vs.length === 4) {
                        return _matchs[0];
                    } else {
                        return "ease";
                    }
                } else {
                    if (str.split(",").length === 4) {
                        return `cubic-bezier(${str})`;
                    }
                    return "ease";
                }
            }
            this.each(function () {
                if (MinQuery.isFunction(stylesGetFunc)) {
                    aniStyles = $errorCarry(stylesGetFunc);
                } else {
                    aniStyles = stylesGetFunc;
                }
                let _transition = `transition: ${MinQuery.isArray(targetStyleArr) ? targetStyleArr.join(" ") : "all"} ${typeof speed === "number" ? speed : 200}ms ${getBezier(bezier)};`;
                // 样式继承
                aniStyles = MinQuery.styleExtend(aniStyles, _transition);
                // 获取通过delay预先设置的延时
                let delayTime = elem_priv.get(this, "$animation-delay") || 0;
                // 重置animationDelay
                elem_priv.set(this, "$animation-delay", 0);
                // 延时更新动画数据
                let aniQueueMet = function () {
                    if (!!elem_priv.get(this.ele, "$animation-to-end")) {
                        this.aniStyle = MinQuery.styleExtend(this.aniStyle, `transition: none;`);
                    }
                    MinQuery(this.ele).css(this.aniStyle, undefined, '$cssAnimation');
                }.bind({
                    ele: this,
                    aniStyle: aniStyles
                });
                // 将timeOut对象加入到当前元素的动画队列
                elem_priv.set(this, "$animation-queue-time", MinQuery.timeOut(aniQueueMet, delayTime), true);
                elem_priv.set(this, "$animation-queue-func", aniQueueMet, true);
            })
            return this;
        },
        // style 样式设置，支持样式字符串、单个样式键值和多样式对象设置三种写法
        // 支持$.css("color:red;height:12px");$.css("color","red"),$.css({"color": "red","height": "12px"});
        css(key, value, animationKey) {
            let i = 0, len = this.length, ele;
            for (; i < len;) {
                ele = this[i++];
                // 获取当前样式的JSON格式    
                let styleJson = !!animationKey ? ele[animationKey] : ele.$style;
                // 清除cssAnimation残余的transition
                styleJson = MinQuery.styleExtend(styleJson, `transition: none;`);
                // 整合新的样式到已有样式
                if (MinQuery.isString(key) && MinQuery.isString(value)) {
                    // 支持单个样式键值组写法
                    styleJson = MinQuery.styleExtend(styleJson, `${key}:${value}`);
                } else if (MinQuery.isPlainObject(key) && !value) {
                    // 支持多样式对象写法
                    styleJson = MinQuery.styleExtend(styleJson, key);
                } else {
                    if (MinQuery.isString(key) && key.indexOf(":") !== -1) {
                        // 支持多样式字符串写法
                        styleJson = MinQuery.styleExtend(styleJson, key);
                    } else {
                        // 返回一个设置的样式值
                        return styleJson ? styleJson[key] : undefined;
                    }
                }
                // 设置样式属性到视图更新
                setCurrentPageData(`${ele.$selectorType}.${ele.$selectorName}.${!!animationKey ? animationKey : '$style'}`, styleJson);
            }
            return this;
        },
        // 检测某个样式是否存在
        hasClass(className, hover) {
            let i = 0, len = this.length, ele;
            for (; i < len;) {
                ele = this[i++];
                if (MinQuery.isFunction(className)) className = $errorCarry(className,ele);
                return MinQuery.hasClass(ele[!hover ? "$class" : "$hoverClass"], className) !== -1;
            }
        },
        // 添加一个不存在的样式
        addClass(className, hover) {
            this.each(function () {
                if (MinQuery.isFunction(className)) className = $errorCarry(className,this);
                if (!MinQuery(this).hasClass(className)) {
                    className = MinQuery.addClass(this.$class, className);
                    setCurrentPageData(`${this.$selectorType}.${this.$selectorName}.${!hover ? "$class" : "$hoverClass"}`, className);
                }
            })
            return this;
        },
        // 删除一个样式
        removeClass(className, hover) {
            this.each(function () {
                if (MinQuery.isFunction(className)) className = $errorCarry(className,this);
                className = MinQuery.removeClass(this.$class, className);
                setCurrentPageData(`${this.$selectorType}.${this.$selectorName}.${!hover ? "$class" : "$hoverClass"}`, className);
            });
            return this;
        },
        // toggle样式，支持单样式和双样式之间切换
        toggleClass(classOne, classTwo, hover) {
            this.each(function () {
                if (!!classTwo) {
                    if (MinQuery.isString(classOne) && MinQuery.isString(classTwo)) {
                        let ho = MinQuery(this).hasClass(classOne, hover), ht = MinQuery(this).hasClass(classTwo, hover);
                        if (ho && ht) {
                            // 同时存在时去掉第二个样式，保留第一个
                            MinQuery(this).removeClass(classTwo, hover);
                        } else if (ho && !ht) {
                            MinQuery(this).removeClass(classOne, hover);
                            MinQuery(this).addClass(classTwo, hover);
                        } else if (!ho && ht) {
                            MinQuery(this).removeClass(classTwo, hover);
                            MinQuery(this).addClass(classOne, hover);
                        } else {
                            // 都不存在时添加第一个
                            MinQuery(this).addClass(classOne, hover);
                        }
                    }
                } else if (!!classOne) {
                    // 单个样式来回切换
                    if (MinQuery(this).hasClass(classOne, hover)) {
                        MinQuery(this).removeClass(classOne, hover);
                    } else {
                        MinQuery(this).hasClass(classOne, hover);
                    }
                }
            })
            return this;
        },
        // hover样式控制支持
        hasHover(className) {
            return MinQuery(this).hasClass(className, true);
        },
        addHover(className) {
            return MinQuery(this).addClass(className, true);
        },
        removeHover(className) {
            return MinQuery(this).removeClass(className, true);
        },
        toggleHover(classOne, classTwo, hover) {
            return MinQuery(this).toggleClass(classOne, classTwo, true);
        }
    });
    // 组件操作
    MinQuery.fn.extend({
        canvas(operationCall, extraMovementCall) {
            let i = 0, len = this.length, ele, cobj = {};
            for (; i < len;) {
                ele = this[i++];
                let cid = ele.$selectorName,
                    callIsFunction = MinQuery.isFunction(operationCall),
                    // 预先获取一下当前元素的canvas对象
                    context = elem_priv.get(ele, "$canvas-context"),
                    // 验证是否为canvas对象
                    isPrevContext = !!operationCall && !callIsFunction && operationCall.hasOwnProperty('canvasId') && operationCall.hasOwnProperty("actions") && operationCall.hasOwnProperty("path");
                // 当创建了canvas动作时
                if (isPrevContext) {
                    // 当只创建了canvas上下文时，直接返回上下文
                    context = elem_priv.get(ele, "$canvas-context", operationCall);
                    // 如果存在额外的动作操作函数，则执行
                    if (MinQuery.isFunction(extraMovementCall)) $errorCarry(function(){extraMovementCall.call(context, context)});
                    if (!!context.canvasId) $errorCarry(context.draw);
                    else wx.drawCanvas({
                        canvasId: cid,
                        actions: context.getActions() // 获取绘图动作数组
                    });
                } else {
                    // 当通过原型方法创建时，则开始绘制
                    context = !!context ? context : elem_priv.get(ele, "$canvas-context", wx.createCanvasContext(cid));
                    if (callIsFunction) {
                        $errorCarry(function(){operationCall.call(context, context)});
                        $errorCarry(context.draw);
                    }
                }
                // 每次均返回context上下文，便于自定义使用外部方法进行画布的编辑工作
                if (len > 1) cobj[ele.$selectorName] = context;
                else return context;
            }
            if (_$.isEmptyObject(cobj))
                return this;
            else return cobj;
        },
        video() {
            let i = 0, len = this.length, ele, cobj = {};
            for (; i < len;) {
                ele = this[i++];
                let vid = ele.$selectorName,
                    context = MinQuery.video.call(ele, vid);
                // 每次均返回context上下文，便于自定义使用外部方法进行画布的编辑工作
                if (len > 1) cobj[ele.$selectorName] = context;
                else return context;
            }
            if (_$.isEmptyObject(cobj))
                return this;
            else return cobj;
        },
        audio(src) {
            let i = 0, len = this.length, ele, cobj = {};
            for (; i < len;) {
                ele = this[i++];
                let vid = ele.$selectorName,
                    context = MinQuery.audio.call(ele, vid);
                if (MinQuery.isString(src)) { autoMendServer(src, 'audioServer'); context.setSrc(src); }
                // 每次均返回context上下文，便于自定义使用外部方法进行画布的编辑工作
                if (len > 1) cobj[ele.$selectorName] = context;
                else return context;
            }
            if (_$.isEmptyObject(cobj))
                return this;
            else return cobj;
        },
        Map() {
            let i = 0, len = this.length, ele, cobj = {};
            for (; i < len;) {
                ele = this[i++];
                let vid = ele.$selectorName,
                    context = MinQuery.Map.call(ele, vid);
                // 每次均返回context上下文，便于自定义使用外部方法进行画布的编辑工作
                if (len > 1) cobj[ele.$selectorName] = context;
                else return context;
            }
            if (_$.isEmptyObject(cobj))
                return this;
            else return cobj;
        }
    });
    // 创建独立canvas画布对象
    MinQuery.extend({
        canvas(canvasId, contextMovementCall) {
            // 支持无id创建canvas上下文
            if (MinQuery.isFunction(canvasId)) {
                contextMovementCall = canvasId; canvasId = null;
            }
            let priv_context_path = `$canvas-context-${!!canvasId ? canvasId : MinQuery.now()}`;
            let current_context = elem_priv.get(this, priv_context_path, !!canvasId ? wx.createCanvasContext(canvasId) : wx.createContext());
            if (MinQuery.isFunction(contextMovementCall)) {
                $errorCarry(function(){contextMovementCall.call(current_context, current_context)});
            }
            return current_context;
        },
        video(videoId) {
            if (!MinQuery.isString(videoId)) return;
            let context = elem_priv.get(this, "$video-context", wx.createVideoContext(videoId));
            context.send = function (message) {
                this.sendDanmu({
                    text: message,
                    color: MinQuery.randomColor()
                })
            };
            return context
        },
        audio(audioId) {
            if (!MinQuery.isString(audioId)) return;
            let context = elem_priv.get(this, "$audio-context", wx.createAudioContext(audioId));
            context.start = function () {
                this.seek(0);
            }
            return context;
        },
        Map(mapId) {
            return elem_priv.get(this, "$Map-context", wx.createMapContext(mapId));
        },
        randomColor() {
            let rgb = [], i = 0;
            for (; i < 3; ++i) {
                let color = Math.floor(Math.random() * 256).toString(16)
                color = color.length == 1 ? '0' + color : color
                rgb.push(color)
            }
            return '#' + rgb.join('')
        }
    })
    // 用于存储当前页面所设置的数据hook对象，防止二次设置
    let __registeredDataHooks__ = {};
    let __dataHooks__ = {
        // 获取
        /**
         * 传入的key可以是返回对象的查询字段名，也可以是全路径
         * key [key] 或 [a.b.c]
         */
        get(key) {
            var _key = MinQuery.type(key) == 'string' || MinQuery.type(key) == 'number' ? `.${key}` : '';
            // 多键设置
            if (MinQuery.isArray(this.__path__)) {
                var _gt, _kn = this.__hooks__;
                // 如果是多键形式，则直接进行根域查询
                if (key.indexOf('.') != -1) {
                    return MinQuery.getData(key);
                } else {
                    MinQuery.each(this.__path__, function (i, pt) {
                        if (_kn[i] == key) {
                            _gt = MinQuery.getData(pt);
                        }
                    });
                    return _gt;
                }
            } else {
                // 单键设置
                return MinQuery.getData(this.__path__ + _key);
            }
        },
        // 对象操作
        // 修改当前对象中对应的键值
        set(key, value) {
            if (!value) { value = key; key = null }
            var _key = MinQuery.type(key) == 'string' || MinQuery.type(key) == 'number' ? `.${key}` : '';
            // 多字段设置
            if (MinQuery.isArray(this.__path__) && !!key) {
                var _kp = this.__path__;
                // 如果是多键形式，则直接进行根域数据设置
                if (key.indexOf('.') != -1) {
                    return setCurrentPageData(key, value);
                } else {
                    MinQuery.each(this.__hooks__, function (i, hn) {
                        console.log(hn[i], _kp[i], key);
                        if (hn == key) {
                            setCurrentPageData(_kp[i], value);
                        }
                    });
                }
            } else {
                // 当前子段设置
                setCurrentPageData(this.__path__ + _key, value);
            }
            return this;
        },
        // 将当前或某一字段设置为null，或指定的值
        clear(key, _type) {
            if (!MinQuery.isUndefined(key) && MinQuery.isUndefined(_type)) { _type = key; key = null };
            key = !!key ? `.${key}` : "";
            _type = !MinQuery.isUndefined(_type) ? _type : null;
            if (MinQuery.isArray(this.__path__)) {
                let _clear = {};
                MinQuery.each(this.__path__, function (i, pt) {
                    _clear[pt + key] = _type;
                });
                setCurrentPageData(_clear);
            } else setCurrentPageData(this.__path__ + key, _type);
            return this;
        },
        // 数组操作：不支持多字段跟字段操作
        // 如果当前或某一子字段为数组形式，则可以使用此接口进行项目添加
        append(value, isBatch) {
            if (!value) {
                return;
            }
            let _path = this.__path__, _old_val = MinQuery.getData(_path), r_index;
            if (MinQuery.isArray(_old_val)) {
                // 支持传入数组继承到源素组
                if (MinQuery.isArray(value) && isBatch === true) {
                    _old_val = _old_val.concat(value);
                } else {
                    _old_val.push(value);
                }
                r_index = _old_val.length - 1;
                setCurrentPageData(_path, _old_val);
            }
            return r_index;
        },
        prepend(value, isBatch) {
            if (!value) {
                return;
            }
            let _path = this.__path__, _old_val = MinQuery.getData(_path), r_index;
            if (MinQuery.isArray(_old_val)) {
                if (MinQuery.isArray(value) && isBatch === true) {
                    _old_val = value.concat(_old_val);
                    r_index = value.length - 1;
                } else {
                    _old_val.unshift(value);
                    r_index = 0;
                }
                setCurrentPageData(_path, _old_val);
            }
            return r_index;
        },
        // 在数组的某一个索引后添加元素
        after(index, value, isBatch) {
            let _path = this.__path__, _old_val = MinQuery.getData(_path), r_index;
            // 仅对数组类型数据进行修改尝试
            if (MinQuery.isArray(_old_val)) {
                if (MinQuery.isArray(value) && isBatch === true) {
                    let _len = _old_val.length, _bef = _old_val.slice(0, index), _af = _old_val.slice(index, _len);
                    _old_val = _bef.concat(value, _af);
                    r_index = _bef.length + value.length - 1;
                } else {
                    _old_val.splice(index + 1, 0, value);
                    r_index = index;
                }
                setCurrentPageData(_path, _old_val);
            }
            return r_index;
        },
        // 在数组的某一个索引前添加元素
        before(index, value, isBatch) {
            let _path = this.__path__, _old_val = MinQuery.getData(_path), r_index;
            // 仅对数组类型数据进行修改尝试
            if (MinQuery.isArray(_old_val)) {
                if (MinQuery.isArray(value) && isBatch === true) {
                    index = index + 1;
                    let _len = _old_val.length, _bef = _old_val.slice(0, index), _af = _old_val.slice(index, _len);
                    _old_val = _bef.concat(value, _af);
                    r_index = _bef.length + value.length - 1;
                } else {
                    _old_val.splice(index, 0, value);
                    r_index = index;
                }
                setCurrentPageData(_path, _old_val);
            }
            return r_index;
        },
        // 在删除某个数组中的指定元素
        remove(key, index) {
            if (MinQuery.type(key) === 'number') { index = key; key = null }
            let _path = this.__path__ + (!!key ? `.${key}` : ""), _old_val = MinQuery.getData(_path), r_index;
            // 仅对数组类型数据进行修改尝试
            if (MinQuery.isArray(_old_val)) {
                _old_val.splice(index, 1);
                setCurrentPageData(_path, _old_val);
                r_index = index;
            }
            return r_index;
        }
    };
    // 设置数据[keyString'设置查询的字符串'，keyValue'设置值']
    /**
     * stayFormat Boolean 用于标识单个数据设置时，是否保留对象状态，而非返回当前当个hook
     * detdetecteInerit Boolean 用于标识是否进行框架固有key检测，避免无意间破坏框架固有属性规则
     */
    let setCurrentPageData = function (keyString, keyValue, stayFormat, detecteInerit) {
        // 将数据格式统一规划为对象方式
        let i = 0, returns = {
            __path__: [],
            __length__: 0,
            __hooks__: []
        }, k, ka, ik, fk, oldValue;
        // if (MinQuery.isString(keyString) && !!keyValue) {
        if (MinQuery.isString(keyString)) {
            keyString = {
                [keyString]: keyValue
            }
        } else if (!MinQuery.isUndefined(keyValue)) {
            detecteInerit = stayFormat;
            stayFormat = keyValue;
        }
        if (!MinQuery.isPlainObject(keyString))
            return;
        // 限制开发者直接修改框架固有管理对象属性，导致管理出现混乱
        for (k in keyString) {
            // 执行$watch
            detecteWatchTarget(k, keyString[k]);

            if (MinQuery.trim(k) == "")
                return;
            ka = k.split(".");
            i++;
            if (detecteInerit === true) {
                for (ik in MinQuery.inherentStaticKeys) {
                    if (ka.indexOf(ik) !== -1) {
                        console.error(`You can not directly to tamper with MinQuery inherent data attribute ${ik}。 Please check MinQuery attribute "inherentStaticKeys" to avoid more conflict!`);
                        return undefined;
                    }
                }
            }
            // 验证设置的值是否与Page实例对象上的值相同，避免框架数据篡改带来的影响
            oldValue = !!MinQuery.pageInstance ? MinQuery.getData(MinQuery.pageInstance.data, k) : MinQuery.getData(k);
            if (oldValue === keyString[k]) delete keyString[k];

            // 获取操作key的最后一位，作为当前返回操作的标识
            fk = ka[ka.length - 1];
            // 若当前后缀已经被上一个数据对象占用，则直接使用全路径
            if (fk in returns) {
                fk = ka;
            }
            // 设置returns的同时挂载到dataHook上；
            returns[fk] = {
                // 操作hook的目标查询路径
                __path__: k
            }
            if (ka in __registeredDataHooks__) {
                returns[fk] = __registeredDataHooks__[ka];
            } else {
                MinQuery.extend(returns[fk], __dataHooks__);
                __registeredDataHooks__[ka] = returns[fk];
                // 当前返回的数据操作hook数
                returns.__length__++;
                // 数据调用名
                returns.__hooks__.push(fk);
                // 数据访问路径
                returns.__path__.push(k);
            }
        }
        ;
        if (!_$.isEmptyObject(keyString)) {
            // 如果存在page对象则将数据绑定到page对象上
            // 小程序原型方法
            !!MinQuery.pageInstance && MinQuery.pageInstance.setData(keyString);
            // 同步更新框架上的数据
            MinQuery.dataProcessor(MinQuery.$pageInitObject.data, keyString);
        }
        // 如果
        if (stayFormat !== true && returns.__length__ === 1) {
            returns = returns[returns.__hooks__[0]]
        } else {
            // 多个字段时，在根节点上挂载处理方法
            MinQuery.extend(returns, __dataHooks__);
        }
        // 返回一个后期操作hook，
        return returns;
    }
    // 数据操作方法主体
    MinQuery.extend({
        // 加载数据解析引擎
        dataProcessor: $analysisDataEngine,
        // 获取数据接口
        getData(queryObj, keys) {
            if (typeof queryObj === "string") {
                keys = queryObj;
                queryObj = MinQuery.$pageInitObject.data;
            };
            let res = MinQuery.dataProcessor(queryObj, keys);
            return res;
        },
        // 设置键值数据，保证Page数据与框架数据的同步性
        // 此接口主要供给插件访问接口
        setData(keyString, keyValue, stayFormat, forceAccess) {
            if (MinQuery.isString(keyString) && MinQuery.isUndefined(keyValue)) {
                // setData Hook 访问器，可在访问的同时设置一次当前数据Hook的值
                let _hook = __registeredDataHooks__[keyString];
                if (_hook) {
                    return _hook;
                } else return undefined;
            }

            // 修改并使用Page实例对象中的setData原生方法同步数据
            return setCurrentPageData(keyString, keyValue, !!stayFormat ? stayFormat : false, MinQuery.type(forceAccess) === "boolean" ? !forceAccess : true);
        },
        /** 用于检测数据变化，接收一个查询key组成的字符串和一个改变触发匿名处理函数;
         *  @param: fuzzy 参数为可选参数,类型为Boolean。设置为true时则对key字符串进行模糊匹配，而非绝对匹配
         */
        watch(watchDataKey, watchCall, fuzzy) {
            if (!watchDataKey) return;
            if (MinQuery.isPlainObject(watchDataKey) && watchDataKey.__path__) {
                watchDataKey = watchDataKey.__path__;
            }

            this.__data_watchs[watchDataKey] = {
                path: watchDataKey,
                call: watchCall,
                isFuzzy: fuzzy
            }
        },
        __data_watchs: {}
    })
    // 数据监视检索方法
    let detecteWatchTarget = function (_path, _newValue) {
        if (!_path) return;
        for (let w in MinQuery.__data_watchs) {
            let _w = MinQuery.__data_watchs[w];
            if (_w.isFuzzy === true) {
                _path.indexOf(_w.path) !== -1 && _w.call(_newValue, MinQuery.getData(_path), _path);
            } else {
                _path === _w.path && _w.call(_newValue, MinQuery.getData(_path), _path);
            }
        }
    }
    return MinQuery;
}
// 抛出接口
wx.MinQuery = function (pageName, recoveryMode) {
    if (typeof pageName !== "string") {
        console.error(`MinQuery instance loader a string page name, not this:`, pageName);
        return;
    }
    // 做降级转换提高选择器准确性
    pageName = pageName.toLowerCase();
    // 检测页面是否被注册
    if (pageName in $pageMQRegisterTags) {
        console.error(`The Page name [${pageName}] has been registered!`);
        return;
    }
    $pageMQRegisterTags[pageName] = {
        registered: true
    };

    const _MQ = rootMinQuery(pageName, recoveryMode);
    _MQ(function $__init__() { console.info('自动执行Page()方法进行页面初始化！！注意：请在复杂页面逻辑的情况下调用$(()=>{})主执行方法来执行数据和事件的绑定操作，确保事件和数据的有效注入。不然可能会因为异步逻辑执行时差不一而导致报错，或数据和事件无法正确的被注入到Page()实例当中！') });
    return _MQ;
};

// 开启debug模式，开发阶段建议开启此模式，方便调试应用，并且防止异常报错导致的内存溢出和IDE崩溃现象。
wx.MinQuery.debug = function(on){
    if(on){
        debugMode = true;
    }
}

module.exports = wx.MinQuery;

// (function (source,key,value, _$) {
// 	if (!_$.isPlainObject(source)) return undefined;
// 	if (!key) return source;

// 	let keyIsString = _$.isString(key),
// 		keyIsPlainObject = _$.isPlainObject(key),
// 		valueIsUndefined = _$.isUndefined(value),
// 		//判断是否为获取数据，只能进行单个键值数据获取
// 		dataRequire = keyIsString && valueIsUndefined,
// 		//设置数据时
// 		dataSetters =  keyIsPlainObject ? key : {};
// 	//将数据进行键值对设置
// 	if(keyIsString) dataSetters[key] = !dataRequire ? value : undefined;

// 	// dataRequire模式，不存在则返回false，并终止；
// 	// 非dataRequire模式，将自动初始化对象的值为指定的objInit值
// 	let detecteAndInit = function (_data, key, objInit) {
// 		if (!(key in _data)) {
// 			if (dataRequire) {
// 				return false;
// 			} else {
// 				_data[key] = objInit
// 				return true;
// 			}
// 		} else {
// 			return true;
// 		}
// 	};

// 	let dataAccess = function (_source,_key,_val) {
// 		if (_$.isUndefined(_key)) return _source;

// 		let _select_source,_split_k = _key.split('.');

// 		let traverseKey = function (_tra_so,_sin_k) {
// 			if (_$.isString(_sin_k) && _$.trim(_sin_k) !== ''){
// 				let _arrK = _sin_k.match(/\[(\d+)\]/g),_strK = _sin_k.replace(_arrK.join(""),"");
// 				if (_$.trim(_strK) !== ''){
// 					_tra_so = _tra_so[_strK];
// 				}
// 				if (_arrK.length > 0){
//                     _$.each(_arrK,function(i,ak){

//                     })
//                 }

// 				return _tra_so;
// 			} else {
// 				return _tra_so;
// 			}
// 		}
// 		_$.each(_split_k,function(i,mulK){
//             _select_source = traverseKey(_source,mulK);
//         })
// 		if(_val) _select_source = _val;
// 		 else return _select_source;
// 	};
// 	//如果是获取值则直接查询
// 	if (dataRequire) return dataAccess(source,key);
// 	//如果是设置值，则进行对象循环设置
// 	else _$.each(dataSetters,function (set_k,set_v) {
// 		dataAccess(source,set_k,set_v);
// 	})



// })({a:{b:1}},'a.b', 3, $);