/*!
 * MinQuery MinApp Development JavaScript Library v2.1.2
 * http://jquery.com/
 *
 * Copyright 2016, 2017 Jason.DRZ.
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2017-3-15 16.21
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
        // 固有事件处理函数标识
        "$bind": ["$bind", "A unified bind[event] handler."],
        "$catch": ["$catch", "A unified catch[event] handler."],
        // 元素固有操作属性标识
        "$class": ["$class", "To manage the element class string! Access method: $id/$cs.elementID/mClass/mClass.$class"],
        "$hoverClass": ["$hoverClass", "To manage the element hover-class string! Access method: $id/$cs.elementID/mClass.$hoverClass"],
        "$attr": ["$attr", "To manage the element multiple attributes value! Access method: $id/$cs.elementID/mClass.$attr.disabled;"],
        "$cf": ["$cf", "To manage the Min App View Plugin's configuration! Access method: $id/$cs.elementID/mClass.$attr.disabled;"],
        "$style": ["$style", "To manage the element style string! Access method: $id/$cs.elementID/mClass.$style;"],
        "$cssAnimation": ["$cssAnimation", "To manage the element css animation string! Access method: $id/$cs.elementID/mClass.$cssAnimation;"],
        "$data": ["$data", "To manage the element multiple custom data object! Access method: $id/$cs.elementID/mClass.$data.imageSrc;"],
        "$children": ["$children", "To mark children elements,whitch are wraped by this element! Not recommend to access!"],
        "$animation": ["$animation", "To manage the element animation object!Access method: $id/$cs.elementID/mClass.$animation;"],
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
}
// 原型工具方法
const isEmptyObject = function (obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
};
// 简易原型继承方法，框架外部使用时仅能做对象浅层继承
const $extend = function () {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    if (typeof target !== "object") {
        target = {};
    }
    // Extend Caller itself if only one argument is passed
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
                if (copy !== undefined) {
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
    if (typeof sourceData === "string") {
        sourceData = this[sourceData];
    }
    if (sourceData) {

        // 如果不存在则返回数据源
        if (!keyString) {
            return sourceData;
        }
        // 是否获取指定键值
        var dataRequire = false, obj = {};
        if (typeof keyString === "string" && typeof keyValue === "undefined") {
            dataRequire = true;
            obj[keyString] = {};
        }
        // 如果关闭获取指定键值下，keyString不是数据对象时，则报错
        if ((!dataRequire && typeof keyValue === "undefined" && !keyString instanceof Object) || (!typeof keyValue === "undefined" && typeof keyString !== "string")) {
            console.error(`AnalysisDataEngine params error!`, keyString, keyValue);
            return sourceData;
        }
        // 复制object
        if (!dataRequire) {
            if (keyString instanceof Object) {
                obj = keyString;
            } else
                obj[keyString] = keyValue;
        }
        var undefindData = function (key, _tar) {
            console.error(`The key:[${key}] does not exist in data:`, _tar);
        }
        // dataRequire模式，不存在则返回false，并终止；
        // 非dataRequire模式，将自动初始化对象的值为指定的objInit值
        var analyType = function (_data, key, objInit) {
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
            var _rd = sourceData;
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
                arrKeys = eackKey.match(/\[(.+?)\]/g);
                if (arrKeys) {
                    if (eackKey[eackKey.length - 1] !== "]") {
                        console.error(`Data setter key format error: [${d}];Should like: "key","key.key","key[1].key","key[1][0].key"`);
                        // break dataEach;
                        // 终止当前数据项后续循环步骤
                        break dotKeyEach;
                    }
                    // 去掉数组key
                    noArrKey = eackKey.replace(arrKeys.join(""), "");
                    // 检测遍历类型
                    if (!analyType(_rd, noArrKey, [])) {
                        return undefined;
                    };
                    // 递归赋值
                    _rd = _rd[noArrKey];
                    arrKeys.forEach((a, ai) => {
                        a = Array.from(a);
                        // 去掉中括号
                        a.shift();
                        a.pop();
                        a = a.join("");
                        // 返回查询数据
                        if (d == dotKeys.length - 1 && ai == arrKeys.length - 1) {
                            if (dataRequire) {
                                return _rd[a];
                            }
                            _rd[a] = value;
                        } else {
                            // 检测并初始化为数组
                            if (!analyType(_rd, a, [])) {
                                return undefined;
                            };
                            _rd = _rd[a];
                        }
                    })
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
    let style = '';
    for (let key in styleJson) {
        style += `${key}:${styleJson[key]};`;
    }
    return style;
};
//样式承接=>旨在更新原有样式，添加新的样式，而非删除原有添加新样式
const styleExtend = function () {
    var args = arguments, first = arguments[0], len = arguments.length, i = 1;
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
        var cindex = hasClass(sourceClassStr, className);
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
const $getSystemInfo = function (targetObj) {
    var sys, res = {};
    try {
        sys = wx.getSystemInfoSync()
        if (sys) {
            // res.model pixelRatio windowWidth windowHeight language version platform
            res.DPI = sys.pixelRatio;
            res.width = sys.windowWidth;
            res.height = sys.windowHeight;
            res.language = sys.language;
            res.versino = sys.version;
            res.platform = sys.platform;
            res.model = sys.model;
            res.system = sys.system;
            targetObj = res;
            return res;
        }
    } catch (e) {
        // try async method 
        wx.getSystemInfo({
            success: function (sys) {
                res.DPI = sys.pixelRatio;
                res.width = sys.windowWidth;
                res.height = sys.windowHeight;
                res.language = sys.language;
                res.versino = sys.version;
                res.platform = sys.platform;
                res.model = sys.model;
                res.system = sys.system;
                targetObj = res;
            }
        })
    }
};
// 页面标示，用于存储对应页面的MinQuery对象，防止二次注册页面
const $pageMQRegisterInstances = {};
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
// 服务器注册,用于补全各个接口
const $minServers = {
    api: "",
    image: "",
    video: "",
    socket: "",
    audio: ""
}
// set window object 
var $windowInfo = {};
// bind system info
var getSystemInfo = function (targetObj) {
    var sys, res = {};
    try {
        sys = wx.getSystemInfoSync()
        // res.model pixelRatio windowWidth windowHeight language version platform
        res.DPI = sys.pixelRatio;
        res.width = sys.windowWidth;
        res.height = sys.windowHeight;
        res.language = sys.language;
        res.versino = sys.version;
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
                res.versino = sys.version;
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
// Events across the pages
const $globalEvents = {
    __events__: {},
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
        var _exec = {}, _ignore = {}, _perm;
        this.classifyFilter(filter, _ignore, _exec);
        for (var pg in this.__events__) {
            if (pg in _ignore) continue;
            if (!isEmptyObject(_exec)) {
                if (pg in _exec) _perm = true;
                else _perm = false;
            } else {
                _perm = true
            }
            if (_perm && pg in this.__events__ && ename in this.__events__[pg]) {
                this.__events__[pg][ename]({
                    from: pname,
                    data: data
                });
            }
        }
    },
    // filter arr: 关闭对应页面的当前事件['page1','page1']，关闭除了过滤页面以外所有页面的当前事件["!page1","!page2"]
    distory(ename, filter) {
        var _off = {}, _keep = {}, _perm = false;
        this.classifyFilter(filter, _keep, _off);
        for (var pg in this.__events__) {
            if (pg in _keep) continue;
            if (!isEmptyObject(_off)) {
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
}

// 方法主体
var rootMinQuery = function (pageName, recoveryMode) {
    // 检测pageName是否为字符串
    if (!typeof pageName === "string") {
        console.error(`MinQuery initialization require's a pageName, such as: app/pageNameOne;`);
        return undefined;
    }

    // 验证缺失再次尝试获取列表
    if (!$windowInfo.DPI) {
        $getSystemInfo($windowInfo);
    }

    // 页面数据操作主体 
    var
        // version
        version = "2.1.2",
        arr = [],
        slice = arr.slice,
        concat = arr.concat,
        push = arr.push,
        indexOf = arr.indexOf,
        class2type = {},
        toString = class2type.toString,
        hasOwn = class2type.hasOwnProperty,

        rtrim = /\s/g,
        // 定义MinQuery本地函数体
        // selector为选择器
        MinQuery = function (selector) {
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
            var ret = MinQuery.merge(this.constructor(), elems);

            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;
            // 

            // Return the newly-formed element set
            return ret;
        },

        // Execute a callback for every element in the matched set.
        // (You can seed the arguments with an array of args, but this is
        // only used internally.)
        each: function (callback, args) {
            return MinQuery.each(this, callback, args);
        },

        map: function (callback) {
            return this.pushStack(MinQuery.map(this, function (elem, i) {
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
            var len = this.length,
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
    MinQuery.extend = MinQuery.fn.extend = function () {
        var options, name, src, copy, copyIsArray, clone,
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
        if (typeof target !== "object" && !MinQuery.isFunction(target)) {
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
                    if (deep && copy && (MinQuery.isPlainObject(copy) || (copyIsArray = MinQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && MinQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && MinQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = MinQuery.extend(deep, clone, copy);

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

    // 继承common methods
    MinQuery.extend({
        // Unique for each copy of MinQuery on the page
        expando: "MinQuery_" + (version + Math.random()).replace(/\D/g, ""),

        // Unique page indicator, will be use in query currentPage data!
        pageName: pageName,
        // To detecte if the Page event onReady is triggered
        isReady: false,
        // To identify if the MinQuery initial data has been injected in Page Function;
        pageInjected: false,

        error: function (msg) {
            console.error(msg);
        },

        noop: function () { },

        isFunction: function (obj) {
            return MinQuery.type(obj) === "function";
        },

        isArraylike: function (obj) {
            var length = obj.length,
                type = MinQuery.type(obj);

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
            return !MinQuery.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
        },

        isPlainObject: function (obj) {
            // Not plain objects:
            // - Any object or value whose internal [[Class]] property is not "[object Object]"
            if (MinQuery.type(obj) !== "object") {
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
            return typeof str === 'undefined' || str === null || MinQuery.trim(str + "") == "";
        },

        isUndefined: function (obj) {
            return typeof str === 'undefined';
        },

        isEmptyObject: isEmptyObject,

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
            var isArray, s;
            // 支持对象数据恢复，deep操作时支持数组
            if (MinQuery.isPlainObject(source) || (deep && MinQuery.isArray(source))) {
                for (s in source) {
                    // 均存在这恢复镜像数据到源数据
                    if (!MinQuery.isUndefined(source[s]) && !MinQuery.isUndefined(mirror[s])) {
                        if (deep) {
                            // 进行深度恢复操作
                            if (MinQuery.isPlainObject(source[s]) || (deep && MinQuery.isArray(source[s]))) {
                                MinQuery.recoveryObject(source[s], mirror[s], deep);
                            } else {
                                // 非对象或数组，则进行赋值操作
                                source[s] = mirror[s];
                            }
                        } else {
                            // 非深度恢复，则进行赋值操作
                            source[s] = mirror[s]
                        }
                    } else if (!MinQuery.isUndefined(source[s]) && MinQuery.isUndefined(mirror[s])) {
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
            var value,
                i = 0,
                length = obj.length,

                isArray = MinQuery.isArraylike(obj);

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
                        value = callback.apply(obj[i++], args);

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
                        value = callback.call(obj[i], i, obj[i++]);

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
            var ret = results || [];

            if (arr != null) {
                if (MinQuery.isArraylike(Object(arr))) {
                    MinQuery.merge(ret,
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
            var len = +second.length,
                j = 0,
                i = first.length;

            for (; j < len; j++) {
                first[i++] = second[j];
            }

            first.length = i;

            return first;
        },

        grep: function (elems, callback, invert) {
            var callbackInverse,
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
            var value,
                i = 0,
                length = elems.length,
                isArray = MinQuery.isArraylike(elems),
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
            var reg = new RegExp((symbal ? symbal : "-") + "(\w)", 'g');
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
            var o = {
                "m+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "i+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        // 当前时间戳
        now: Date.now
    });
    // 生成类型字典
    MinQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    // 继承wx二次封装接口
    // 链式注册对象
    var wxHandlerRegister = {};
    // 链式注册三类异步处理函数
    var registerWxHandler = function (mname) {
        // 支持多次注册
        wxHandlerRegister[mname] = {
            fail: [],
            cancel: [],
            success: [],
            complete: []
        };
        return {
            fail(cb) {
                wxHandlerRegister[mname].fail = cb;
                return this;
            },
            error(cb) {
                return this.fail(cb);
            },
            success(cb) {
                wxHandlerRegister[mname].success = cb;
                return this;
            },
            complete(cb) {
                wxHandlerRegister[mname].complete = cb;
                return this;
            },
            cancel(cb) {
                wxHandlerRegister[mname].cancel = cb;
            }
        }
    }
    var triggerWxHandler = function (mname, method, res) {
        if (wxHandlerRegister[mname] && wxHandlerRegister[mname][method]) {
            var targetMethod = wxHandlerRegister[mname][method];
            if (MinQuery.isFunction(targetMethod)) {
                responseHandler(res, targetMethod, wxHandlerRegister[mname]);
            }
        }
    }
    // complete函数错误处理
    var responseHandler = function (e, call, callBank) {
        var _err = e.errMsg.split(":");
        if (_err[1] === "ok" && e.statusCode == 200) {
            if (MinQuery.isPlainObject(callBank)) call = callBank['success'];
            call && call(e.data, {
                errMsg: e.errMsg,
                statusCode: e.statusCode
            });
        } else {
            if (MinQuery.isPlainObject(callBank)) call = callBank['fail'];
            call && call(e);
        }
    };
    // Ajax 请求方法
    function ajaxRequest(_conf, data, call) {
        var options = {
            url: "",
            data: data,
            header: {
                'content-type': 'application/json'
            },
            method: "get",
            dataType: "json"
        }
        if (MinQuery.isPlainObject(_conf)) MinQuery.extend(options, _conf);
        else if (MinQuery.isString(_conf)) options.url = _conf;
        var _fail = options.fail, _success = options.success, _complete = options.complete;
        MinQuery.extend(options, {
            fail(e) { triggerWxHandler("wxRequest", "fail", e); MinQuery.isFunction(_fail) && _fail(e) },
            success(e) { triggerWxHandler("wxRequest", "success", e); MinQuery.isFunction(_success) && _success(e) },
            complete(e) { responseHandler(e, call); triggerWxHandler("wxRequest", "complete", e); MinQuery.isFunction(_complete) && _complete(e); }
        })
        // 将method值转大写
        options.method = options.method.toUpperCase();
        wx.request(options);
        // 错误方法
        return registerWxHandler("wxRequest");
    }
    MinQuery.extend({
        $window: $windowInfo,
        // scanCode
        scan(call) {
            wx.scanCode({
                phoneNumber: phone,
                fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
                success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
                complete(e) { responseHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
            });
            return registerWxHandler("scanCode");
        },
        // makePhoneCall
        phoneCall(phone, call) {
            wx.makePhoneCall({
                phoneNumber: phone,
                fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
                success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
                complete(e) { responseHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
            });
            return registerWxHandler("makePhoneCall");
        },
        // showToast
        showToast(title, icon, delay, mask, call) {
            var icons = {
                loading: "loading",
                success: "success"
            }
            if (MinQuery.isString(title)) {
                console.error("The toast title param must be a string!");
                return "";
            } else if (typeof icon === "boolean") {
                mask = icon;
                icon = null;
            } else if (typeof delay === "boolean") {
                mask = delay;
                delay = null;
                if (!icons[icon]) {
                    console.error(`Wx do not suport icon type of [${icon}]!`);
                    return;
                }
            }
            wx.showToast({
                title: title,
                icon: icon ? icon : '',
                duration: delay ? delay : 2000,
                fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
                success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
                complete(e) { responseHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
            });
            return registerWxHandler("showToast")
        },
        // hideToast
        hideToast(delay) {
            MinQuery.timeOut(wx.hideToast, delay ? delay : 0,true);
        },
        // showActionSheet
        actionSheet(items, color, call) {
            if (!items instanceof Array) {
                console.error("showActionSheet items must be an Array instance!");
                return;
            }
            wx.showActionSheet({
                itemList: items,
                itemColor: color ? color : "",
                fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
                success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
                complete(e) { responseHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
            });
            return registerWxHandler("showActionSheet")
        },
        showActionSheet: MinQuery.actionSheet,
        // showModal
        modal(title, content, config, call) {
            if ((MinQuery.isString(title) && !MinQuery.isEmpty(title)) || MinQuery.isString(content)) {
                console.error("The Modal title and content type must be string!", title, content);
                return;
            }
            var options = {
                showCancel: true,
                cancelText: "取消",
                cancelColor: "#000000",
                confirmText: "确定",
                confirmColor: "#3CC51F"
            }
            if (config instanceof Object) {
                MinQuery.extend(options, config);
            }
            wx.showModal({
                title: title,
                content: '这是一个模态弹窗',
                showCancel: options.showCancel,
                cancelText: options.cancelText,
                cancelColor: options.cancelColor,
                confirmText: options.confirmText,
                confirmColor: options.confirmText,
                fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
                success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
                complete(e) { responseHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
            });
            return registerWxHandler("showModal");
        },
        showModal: MinQuery.modal,
        // setNavigationBarTitle
        navTitle(title, call) {
            if (MinQuery.isEmpty(title)) {
                console.error("setNavigationBar title must be an non-empty string！")
                return;
            }
            wx.setNavigationBarTitle({
                title: title,
                fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
                success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
                complete(e) { responseHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
            })
            return registerWxHandler("setNavigationBarTitle");
        },
        setNavigationBarTitle: MinQuery.navTitle,
        // NavigationBarLoading
        navLoading: {
            show() {
                wx.showNavigationBarLoading();
            },
            hide() {
                wx.hideNavigationBarLoading()
            }
        },
        NavigationBarLoading: MinQuery.navLoading,
        // Navigations
        navigateTo(url, call) {
            wx.navigateTo({
                url: url,
                fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
                success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
                complete(e) { responseHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
            });
            return registerWxHandler("navigateTo");
        },
        redirectTo(url, call) {
            wx.redirectTo({
                url: url,
                fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
                success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
                complete(e) { responseHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
            });
            return registerWxHandler("redirectTo");
        },
        switchTab(url, call) {
            wx.switchTab({
                url: url,
                fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
                success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
                complete(e) { responseHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
            });
            return registerWxHandler("switchTab");
        },
        navigateBack(pageNum) {
            wx.navigateBack({
                delta: pageNum
            })
        },

        // Ajax methods
        ajax(config, data, call) {
            if (MinQuery.isFunction(data)) {
                call = data;
                data = {};
            }
            return ajaxRequest(config, data, call);
        },
        get: function (url, data, call) {
            if (MinQuery.isFunction(data)) {
                call = data;
                data = {};
            }
            return this.ajax({
                url: url,
                data: data,
                method: "get",
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
        },
        // 录音控制
        startRecord(call) {
            wx.startRecord({
                fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
                success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
                complete(e) { responseHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
            })
            return registerWxHandler("startRecord");
        },
        stopRecord(delay) {
            MinQuery.timeOut(wx.stopRecord, delay ? delay : 0,true);
        },
        // 录音播放
        playVoice(filePath, call) {
            wx.playVoice({
                filePath: filePath,
                fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
                success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
                complete(e) { responseHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
            })
            return registerWxHandler("playVoice");
        },
        pauseVoice(delay) {
            MinQuery.timeOut(wx.pauseVoice, delay ? delay : 0,true);
        },
        stopVoice(delay) {
            MinQuery.timeOut(wx.stopVoice, delay ? delay : 0,true);
        }
    });

    // Query Engine
    // Elements Data Selecte Engine MinQuery
    MinQuery.extend({
        // MinQuery固有Data和Page事件属性标识
        inherentStaticKeys: $mq_config.inherentStaticKeys,
        // 注册固有静态keys
        registerInherentKey(key, description) {
            if (MinQuery.isPlainObject(key) && !description) {
                for (var k in key) {
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
    var appData;
    MinQuery.extend({
        pages(pageName) {
            return $pageLoadedInstances.get(pageName);
        },
        app(searchkeys) {
            !appData && (appData = getApp());
            return MinQuery.dataProcessor(appData, searchkeys);
        }
    })
    /**
     * 跨页面数据传输事件注册及触发
     */
    MinQuery.extend({
        // 绑定某个事件的处理方法，每个事件支持绑定多个处理方法，每个方法附带自己的与设置数据
        $on(event, callback) {
            $globalEvents.register(MinQuery.pageName, event, callback);
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
                    eventOperation.set(this, `registerEvent.${_type}`, method, data);
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
                    eventOperation.set(this, `bind.${_type}`, method, data);
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
                    eventOperation.set(this, `catch.${_type}`, method, data);
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
                var self = this;
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
                        var _page = self[0];
                        // 检测是否为以存在的键
                        !(_type in _page) && (_page[_type] = function (e) {
                            // 为Page自定义番薯传递数据
                            MinQuery.isPlainObject(e)
                                ? (e['$data'] = data)
                                : (e = { "$event": e, "$data": data });
                            method.call(_page, e);
                        });
                        eventOperation.set(this, `bind.${_type}`, method, data);
                    } else {
                        eventOperation.set(this, `bind.${_type}`, method, data);
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
            var triggerType = iscatch === true ? 'catch' : 'bind';
            if (!!this && this.length > 0) {
                // 验证是否触发Page固有事件
                var eroute, res;
                var self = this;
                this.each(function () {
                    // 禁止触发Page固有事件
                    if (this.$selectorName === "page" || this.$selectorName === "app") {
                        if (_type in MinQuery.pageInheritEventKVPair) {
                            console.error(`You can not trigger an ${this.$selectorName} inherent event named [${_type}]!`);
                            return;
                        } else {
                            var _page = self[0];
                            if (_page[_type] && MinQuery.isFunction(_page[_type])) {
                                MinQuery(this.$selectorName)[0][_type](data);
                                return;
                            };
                        }
                    }
                    // 获取当前元素事件路径
                    eroute = this.$events[triggerType] ? this.$events[triggerType][_type] : undefined;
                    // 触发传递数据，并接收返回数据
                    res = eventOperation.get(eroute, {}, data);
                    // 执行callback
                    MinQuery.isFunction(triggerCall) && triggerCall(res);
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
            var triggerType = iscatch === true ? 'catch' : 'bind';
            if (!!this && this.length > 0) {
                var eroute;
                this.each(function () {
                    eventOperation.set(this, `${triggerType}.${_type}`, false);
                    MinQuery.isFunction(offCall) && offCall.call(this);
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
            var triggerType = !!iscatch ? 'catch' : 'bind';
            MinQuery(this)[triggerType](_type, data, function () {
                var etype = _type, ecall = oneceCall;
                MinQuery(this).off(etype, function () { console.log("OFF Event:" + _type) }, triggerType);
                ecall.apply(this, arguments);
            })
            return this;
        }
    });
    // Page固有事件处理器
    var pageInheritEventHandlers = {};
    // 页面固有事件名称管理器，用于防止用户再次注册固有事件。并且可以进行事件查询操作。
    MinQuery.pageInheritEventKVPair = {};

    var pageEventMiddleware;
    // 注册Page固有事件到MinQuery事件代理器
    MinQuery.inheritEventRegister = function (_c_e_name, _middleware) {
        // 如果是外部注册，则添加到主事件列表中
        MinQuery.pageInheritEventList.indexOf(_c_e_name) === -1 && MinQuery.pageInheritEventList.push(_c_e_name);
        // 生成字典
        var noOnEN = Array.from(_c_e_name);
        // 去掉on开头
        noOnEN.splice(0, 2)
        // 降级大写字母
        noOnEN = noOnEN.join("").toLowerCase();
        // 设置双向查询字典
        MinQuery.pageInheritEventKVPair[_c_e_name] = noOnEN;
        MinQuery.pageInheritEventKVPair[noOnEN] = _c_e_name;

        // 设置当前功能处理对象
        pageInheritEventHandlers[_c_e_name] = function (e, ename = _c_e_name) {
            // 运行自定义添加的中间件事件处理器
            MinQuery.isFunction(_middleware) && _middleware.call(this, e, ename);
            // 调用中间件管理器，并处理事件返回值
            return pageEventMiddleware.call(this, e, ename);
        };
    }
    // 如果是App页面的注册，则启用
    if (MinQuery.pageName === "app") {
        MinQuery.pageInheritEventList = $mq_config.appEvents;
        pageEventMiddleware = function (e, ename) {
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
            var ret = eventOperation.get(`${MinQuery.selectorsBank.app[0]}.app`, `bind.${MinQuery.pageInheritEventKVPair[ename]}`, e);
            // 未查询到自定义事件是执行查询原始事件名称事件
            if (ret === '[No Handler]') {
                // 查询执行元素原生事件
                return eventOperation.get(`${MinQuery.selectorsBank.app[0]}.app`, `bind.${ename}`, e);
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
                    !!recoveryMode && MinQuery.recoveryObject($pageInitObject.data, MinQuery.pageInstance.data, true);
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
            var ret = eventOperation.get(`${MinQuery.selectorsBank.page[0]}.page`, `bind.${MinQuery.pageInheritEventKVPair[ename]}`, e);
            // 未查询到自定义事件是执行查询原始事件名称事件
            if (ret === '[No Handler]') {
                // 查询执行元素原生事件
                return eventOperation.get(`${MinQuery.selectorsBank.page[0]}.page`, `bind.${ename}`, e);
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
    var eventOperation = {
        // 设置对应的元素事件到事件管理器中并给当前元素写入事件查询地址
        set: function (elem, eventkeys, method, binddata) {
            if (!MinQuery.isUndefined(elem) && !MinQuery.isEmpty(eventkeys)) return;
            var elekeys = `${elem.$selectorType}.${elem.$selectorName}`,
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
                    var rglist = MinQuery.dataProcessor(MinQuery.eventManager, `${eventManagerRoute}.method`);
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
            var noFunc = "[No Handler]";
            if (!elekeys) {
                return noFunc;
            }
            // 查询元素
            var eventEle = MinQuery.getData(MinQuery.eventManager, elekeys),
                // 查询事件
                eventObj = eventEle ? MinQuery.getData(eventEle, eventkeys) : false;
            // 查询注册扩展事件
            var regObj = eventEle ? MinQuery.getData(eventEle, `registerEvent.${eventkeys.split(".").pop()}`) : false,
                // 将事件绑定的data数据绑定到eventdata事件数据的$data字段上
                dataArr = [], ei = 0;
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
                !!regObj && regObj.method && MinQuery.each(regObj.method, (i, reg) => { MinQuery.isFunction(reg) && reg.apply(MinQuery.getData(eventEle.context), dataArr) });
                // 返回绑定当前域的处理方法，返回处理后的数据
                return !!eventObj.method ? eventObj.method.apply(MinQuery.getData(eventEle.context), dataArr) : noFunc;
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
    var elementEventHandlers = {
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
    var findElementEventHandler = function (e, _type) {
        // 做target与currentTarget之间的权衡选择，首选target
        // id获取来源是否是
        // 解决小程序catch与bind时出现的事件错误
        var tid = _type === "catch"
            ? e.currentTarget.id
            : e.target.id
                ? e.target.id
                : e.currentTarget.id,
            tcs = _type === "catch"
                ? e.currentTarget.dataset.mClass
                : e.target.dataset.mClass
                    ? e.target.dataset.mClass
                    : e.currentTarget.dataset.mClass;
        // event对象扩展
        if (e.type === "submit") MinQuery.extend(e,{
            // 设置访问formData快捷接口
            form(key) {
                if (key) {
                    return MinQuery.getData(this.detail, `value.${key}`);
                } else return MinQuery.getData(this.detail, `value`);
            }
        })
        MinQuery.extend(e,{
            // 访问当前元素
            current(key) {
                if (key) {
                    return MinQuery.getData(this.currentTarget, key);
                } else return this.currentTarget
            },
            // 访问当前元素data属性
            data(key) {
                var dataset = this.current(`dataset`);
                if (key) return dataset[key];
                else return dataset;
            }
        })
        // 优先查询ID绑定池并执行;渲染层事件触发不存在返回数据
        var ret = tid ? eventOperation.get(`${MinQuery.selectorsBank["#"][0]}.${tid}`, `${_type}.${e.type}`, e) : "[No Handler]";
        // 如果不存在ID事件绑定则查询data-min-class绑定版
        (ret === "[No Handler]") && tcs && eventOperation.get(`${MinQuery.selectorsBank["."][0]}.${tcs}`, `${_type}.${e.type}`, e);
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
        var prevfix = selector[0];
        var _elarr = Array.from(selector);
        _elarr.shift();
        var elem = _elarr.join("");
        var eleType = "", eleName = "", f_elem, r_route = "";
        if (selector.length > 1 && prevfix in MinQuery.selectorsBank) {
            // 查询类型
            eleType = MinQuery.selectorsBank[prevfix][0];
            r_route = `${eleType}.${elem}`;
            f_elem = MinQuery.getData(r_route);
            eleName = elem;
        } else if (selector.length === 1 && MinQuery.selectorsBank[prevfix][0] === '$all') {
            // 查询全部
            var eles = [];
            MinQuery.each(MinQuery.registeredElements, (i, r) => {
                eles.push(MinQuery.getData(r));
            });
            return eles;
        } else {
            f_elem = MinQuery.getData(selector);
            r_route = eleName = selector;
        }
        if (f_elem) {
            return f_elem;
        } else {
            MinQuery.registeredElements.push(r_route);
            // 获取元素初始化对象
            var newEleAttr = $mq_config.getElementInitialData();
            // 元素所属类型
            newEleAttr.$selectorType = eleType;
            // 去前缀元素名称
            newEleAttr.$selectorName = eleName;
            // 初始化元素对象
            setCurrentPageData(r_route, newEleAttr);
            // 查询元素对象
            return MinQuery.getData(r_route);
        }
    };
    // page initial object
    var $pageInitObject = {
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
            "$attr": {}
        }
    };

    // app initial object
    var $appInitObject = {
        "$selectorType": "$app",
        "$selectorName": "app"
    }
    // 下一步，使pageInit继承MinQuery，抽出MinQuery不在进行重复性的初始化，使用extend方法
    // Page主选择器
    var pageInit = function (selector) {
        if (!selector) {
            return this;
        }
        if (MinQuery.isString(selector)) {
            var _selectors = selector.split(","), multis, tar_selectorTypes = [], s = 0;
            for (; s < _selectors.length; s++) {
                var _sele = _selectors[s];
                multis = {};
                var _lowsele = _sele.toLowerCase();
                // 当前页面对象查询
                if (_lowsele === "page") {
                    tar_selectorTypes.push(MinQuery.selectorsBank[_lowsele][0]);
                    multis[0] = $pageInitObject;
                    multis.length = 1;
                }
                // 对APP对象查询
                else if (_lowsele == "app") {
                    tar_selectorTypes.push(MinQuery.selectorsBank[_lowsele][0]);
                    multis[0] = $appInitObject;
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
            if (!MinQuery.pageInjected) {
                // 首先运行主体注册函数
                var res = selector(MinQuery);
                if (MinQuery.pageName === "app") {
                    MinQuery.extend($appInitObject, pageInheritEventHandlers);
                    // 启动当前小程序的App初始化函数
                    App($appInitObject);
                } else {
                    MinQuery.extend($pageInitObject, elementEventHandlers, pageInheritEventHandlers);
                    // 启动当前页面的Page初始化函数，判断模式：恢复模式，则传入copy初始化数据；非恢复模式则传入源数据；
                    Page(!!recoveryMode ? (MinQuery.extend(true, {}, $pageInitObject)) : $pageInitObject);
                }
                // 设置ready标示
                MinQuery.pageInjected = true;
                return res;
            } else {
                return null;
            }
        }
        // 返回数据源的MinQuery封装对象
        return MinQuery.makeArray(selector, this);
    }
    // 原型拷贝
    pageInit.prototype = MinQuery.prototype;
    // 样式操作
    MinQuery.extend({
        // 样式字符串转换器
        jsonToStyle: $csscontrol.jsonToStyle,
        // 样式Json转换器
        styleToJson: $csscontrol.styleToJson,
        // 样式继承，后面的所有样式均继承到第一个样式中，并返回继承处理后的样式字符串。支持字符串和对象形式
        styleExtend: $csscontrol.styleExtend,
    });
    // 元素框架内部访问属性集合
    MinQuery.registerInherentKey({
        "$__priv_keys__": "To cache the element private options!"
    });
    // 用于操作元素的私有属性方法，此设置不参与视图层更新操作
    var elem_priv = {
        priv_keys: "$__priv_keys__",
        get(ele, _type) {
            return MinQuery.getData(ele,`${this.priv_keys}.${_type}`);
        },
        set(ele, _type, value, arrPush) {
            if (ele) {
                !ele[this.priv_keys] && (ele[this.priv_keys] = {});
                if (arrPush) {
                    !ele[this.priv_keys][_type] && (ele[this.priv_keys][_type] = []);
                    ele[this.priv_keys][_type].push(value);
                } else {
                    ele[this.priv_keys][_type] = value;
                }
            }
        },
        clear(ele, _type) {
            if (ele) {
                MinQuery.dataProcessor(ele,`${this.priv_keys}.${_type}`,null);
                // ele[this.priv_keys] && ele[this.priv_keys][_type] && (delete ele[this.priv_keys][_type]);
            }
        }
    }
    MinQuery.extend({
        timeOut(call,delay,still){
            return setTimeout(function(){
                if(!!this.still || !this.still && MinQuery.isReady){
                    MinQuery.isFunction(this.call) && this.call();
                }
            }.bind({
                call: call,
                // 标识是否检测ready字段
                still: still
            }),delay);
        }
    })
    // Elements Attributes Operation Methods
    MinQuery.fn.extend({
        // 设置当前元素data值
        data(key, value, attr) {
            var _type = attr ? '$attr' : '$data', i = 0, len = this.length, ele;
            for (; i < len;) {
                ele = this[i++];
                var _route = `${ele.$selectorType}.${ele.$selectorName}.${_type}.${key}`,
                    _eledt = ele[_type];
                if (ele.$selectorName === "page") {
                    _route = `${_type}.${key}`;
                    _eledt = ele.data[_type];
                }
                if (typeof key === "string") {
                    if (value) {
                        setCurrentPageData(_route, value);
                    } else {
                        return _eledt ? MinQuery.getData(_eledt, key) : undefined;
                    }
                } else {
                    return undefined;
                }
            }
            return this;
        },
        attr(key, value) {
            return MinQuery(this).data(key, value, true);
        },
        // animation delay
        delay(time) {
            if (typeof time === 'number') {
                this.each(function () {
                    elem_priv.set(this, "$animationDelay", time);
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
                var _queTime = elem_priv.get(this, "$animationQueueTime");
                var _queFunc = elem_priv.get(this, "$animationQueueFunc");
                // 销毁所有动画队列
                if (_queTime instanceof Array) {
                    MinQuery.each(_queTime, (i, e) => {
                        clearTimeout(e);
                        e = null;
                    })
                    elem_priv.clear(this, "$animationQueue")
                }
                if (jumpToEnd) {
                    // 设置当前动画结束到最后样式
                    elem_priv.set(this, "$animationToEnd", jumpToEnd);
                    if (_queFunc instanceof Array) {
                        MinQuery.each(_queFunc, (i, f) => {
                            MinQuery.isFunction(f) && f();
                        });
                        elem_priv.clear(this, "$animationToEnd")
                    }
                }
            });
            return this;
        },
        // animation step setting
        animation(animateStepFunc, speed, easing, origin) {
            var config = {
                origin: "50% 50%",
                speed: 1000,
                easing: "ease",
                delay: 0
            };
            typeof speed === 'number' ? (config.speed = speed) : MinQuery.isPlainObject(speed) ? MinQuery.extend(config, speed) : null;
            MinQuery.isString(easing) && (config.easing = easing);
            MinQuery.isString(origin) && (config.origin = origin);
            var nativeCf = {
                transformOrigin: config.origin,
                duration: config.speed,
                timingFunction: config.easing,
                delay: config.delay
            };
            this.each(function () {
                // 获取或是创建动画
                var animateObj = this.$animationObject
                    ? this.$animationObject
                    : (this.$animationObject = wx.createAnimation(nativeCf))
                animateStepFunc.call(animateObj, animateObj);
                // 动画当前步骤配置
                animateObj.step(nativeCf);
                // 获取通过delay预先设置的延时
                var delayTime = elem_priv.get(this, "$animationDelay") || 0;
                // 重置animationDelay
                elem_priv.set(this, "$animationDelay", 0);
                // 延时更新动画数据
                var aniQueueMet = function () {
                    if (!!elem_priv.get(this.ele, "$animationToEnd")) {
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
                elem_priv.set(this, "$animationQueueTime", MinQuery.timeOut(aniQueueMet, delayTime), true);
                elem_priv.set(this, "$animationQueueFunc", aniQueueMet, true);
            })
            return this;
        },
        // 基于css创建动画：stylesGetFunc[接收一个返回style字符串或是对象的匿名函数，或是直接的style字符串或对象]、speed[动画执行时长，以毫秒计算，整数形式，默认200ms]、bezier[支持贝塞尔曲线函数，字符串形式，不填则默认ease]、targetStyleArr[需要进行动画过度的目标样式数组，如：height；没有则默认all]
        cssAnimation(stylesGetFunc, speed, bezier, targetStyleArr) {
            var aniStyles;
            // 校验贝塞尔曲线函数
            var getBezier = function (str) {
                if (!MinQuery.isString(str)) {
                    return "ease";
                }
                var _matchs = /cubic-bezier\(([^*]+)\)/g.exec(str);
                if (!!_matchs && _matchs.length === 2) {
                    var _vs = _matchs[1].split(",");
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
                    aniStyles = stylesGetFunc();
                } else {
                    aniStyles = stylesGetFunc;
                }
                var _transition = `transition: ${MinQuery.isArray(targetStyleArr) ? targetStyleArr.join(" ") : "all"} ${typeof speed === "number" ? speed : 200}ms ${getBezier(bezier)};`;
                // 样式继承
                aniStyles = $csscontrol.styleExtend(aniStyles, _transition);
                // 获取通过delay预先设置的延时
                var delayTime = elem_priv.get(this, "$animationDelay") || 0;
                // 重置animationDelay
                elem_priv.set(this, "$animationDelay", 0);
                // 延时更新动画数据
                var aniQueueMet = function () {
                    if (!!elem_priv.get(this.ele, "$animationToEnd")) {
                        this.aniStyle = $csscontrol.styleExtend(this.aniStyle, `transition: none;`);
                    }
                    MinQuery(this.ele).css(this.aniStyle, undefined, '$cssAnimation');
                }.bind({
                    ele: this,
                    aniStyle: aniStyles
                });
                // 将timeOut对象加入到当前元素的动画队列
                elem_priv.set(this, "$animationQueueTime", MinQuery.timeOut(aniQueueMet, delayTime), true);
                elem_priv.set(this, "$animationQueueFunc", aniQueueMet, true);
            })
            return this;
        },
        // style 样式设置，支持样式字符串、单个样式键值和多样式对象设置三种写法
        // 支持$.css("color:red;height:12px");$.css("color","red"),$.css({"color": "red","height": "12px"});
        css(key, value, animationKey) {
            var i = 0, len = this.length, ele;
            for (; i < len;) {
                ele = this[i++];
                // 获取当前样式的JSON格式
                let styleJson = !!animationKey ? ele[animationKey] : ele.$style;
                // 清除cssAnimation残余的transition
                styleJson = $csscontrol.styleExtend(styleJson, `transition: none;`);
                // 整合新的样式到已有样式
                if (MinQuery.isString(key) && MinQuery.isString(value)) {
                    // 支持单个样式键值组写法
                    styleJson = $csscontrol.styleExtend(styleJson, `${key}:${value}`);
                } else if (MinQuery.isPlainObject(key) && !value) {
                    // 支持多样式对象写法
                    styleJson = $csscontrol.styleExtend(styleJson, key);
                } else {
                    if (MinQuery.isString(key) && key.indexOf(":") !== -1) {
                        // 支持多样式字符串写法
                        styleJson = $csscontrol.styleExtend(styleJson, key);
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
            var i = 0, len = this.length, ele;
            for (; i < len;) {
                ele = this[i++];
                if (typeof className === "function") className = className.call(ele);
                return $csscontrol.hasClass(ele[!hover ? "$class" : "$hoverClass"], className) !== -1;
            }
        },
        // 添加一个不存在的样式
        addClass(className, hover) {
            this.each(function () {
                if (typeof className === "function") className = className.call(this);
                if (!MinQuery(this).hasClass(className)) {
                    className = $csscontrol.addClass(this.$class, className);
                    setCurrentPageData(`${this.$selectorType}.${this.$selectorName}.${!hover ? "$class" : "$hoverClass"}`, className);
                }
            })
            return this;
        },
        // 删除一个样式
        removeClass(className, hover) {
            this.each(function () {
                if (typeof className === "function") className = className.call(this);
                className = $csscontrol.removeClass(this.$class, className);
                setCurrentPageData(`${this.$selectorType}.${this.$selectorName}.${!hover ? "$class" : "$hoverClass"}`, className);
            });
            return this;
        },
        // toggle样式，支持单样式和双样式之间切换
        toggleClass(classOne, classTwo, hover) {
            this.each(function () {
                if (!!classTwo) {
                    if (MinQuery.isString(classOne) && MinQuery.isString(classTwo)) {
                        var ho = MinQuery(this).hasClass(classOne, hover), ht = MinQuery(this).hasClass(classTwo, hover);
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
    // Canvas 操作
    MinQuery.fn.extend({
        canvas(operationCall) {
            var i = 0, len = this.length, ele, cobj = {};
            for (; i < len;) {
                var self = this[i++];
                var cid = self.$selectorName;
                var context = wx.createCanvasContext(cid);
                if (MinQuery.isFunction(operationCall)) {
                    operationCall.call(context);
                    context.draw();
                } else if (operationCall === true) {
                    if (len > 1) cobj[self.$selectorName] = context;
                    else return context;
                }
            }
            if (MinQuery.isEmptyObject(cobj))
                return this;
            else return cobj;
        }
    })

    // 设置数据[keyString'设置查询的字符串'，keyValue'设置值']
    var setCurrentPageData = function (keyString, keyValue) {
        // 如果存在page对象则将数据绑定到page对象上
        // 小程序原型方法
        if (keyString instanceof Object) {
            !!MinQuery.pageInstance
                && MinQuery.pageInstance.setData(keyString);
        } else if (typeof keyString === "string") {
            !!MinQuery.pageInstance
                && MinQuery.pageInstance.setData({
                    [keyString]: keyValue
                });
        }
        // 同步更新框架上的数据
        // 执行$watch
        if (MinQuery.isPlainObject(keyString)) {
            for (var k in keyString) {
                detecteWatchTarget(k, keyValue);
            }
        } else detecteWatchTarget(keyString, keyValue);


        MinQuery.dataProcessor($pageInitObject.data, keyString, keyValue)
    }
    // 数据操作方法主体
    MinQuery.extend({
        // 加载数据解析引擎
        dataProcessor: $analysisDataEngine,
        // 获取数据接口
        getData(queryObj, keys) {
            if (typeof queryObj === "string") {
                keys = queryObj;
                queryObj = $pageInitObject.data;
            };
            return MinQuery.dataProcessor(queryObj, keys);
        },
        // 设置键值数据，保证Page数据与框架数据的同步性
        // 此接口主要供给插件访问接口
        setData(keyString, keyValue, watchCall) {
            // 将数据格式统一规划为对象方式
            var i = 0, returns = {
                __length__: 0,
                __routes__: []
            };
            if (MinQuery.isString(keyString) && !!keyValue) {
                keyString = {
                    [keyString]: keyValue
                }
            }
            if (!MinQuery.isPlainObject(keyString))
                return;
            // 限制开发者直接修改框架固有管理对象属性，导致管理出现混乱
            for (var k in keyString) {
                if (MinQuery.trim(k) == "")
                    return;
                var ka = k.split(".");
                i++;
                for (var ik in MinQuery.inherentStaticKeys) {
                    if (ka.indexOf(ik) !== -1) {
                        console.error(`You can not directly to tamper with MinQuery inherent data attribute ${ik}。 Please check MinQuery attribute "inherentStaticKeys" to avoid more conflict!`);
                        return undefined;
                    }
                }
                var fk = ka[ka.length - 1];
                returns[fk] = {
                    __path__: k,
                    get(key) {
                        return MinQuery.getData(this.__path__ + (!!key ? `.${key}` : ""));
                    },
                    set(key, value) {
                        if (!value) { value = key; key = null }
                        setCurrentPageData(this.__path__ + (!!key ? `.${key}` : ""), value);
                    }
                }
                returns.__length__ = i;
                returns.__routes__.push(fk);
            }

            // 修改并使用Page实例对象中的setData原生方法同步数据
            setCurrentPageData(keyString, keyValue);
            // 返回一个后期操作hook
            returns.__length__ === 1 && (returns = returns[returns.__routes__[0]]);
            return returns;
        },
        /** 用于检测数据变化，接收一个查询key组成的字符串和一个改变触发匿名处理函数;
         *  @param: fuzzy 参数为可选参数,类型为Boolean。设置为true时则对key字符串进行模糊匹配，而非绝对匹配
         */
        $watch(watchDataKey, watchCall, fuzzy) {
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
    var detecteWatchTarget = function (_path, _newValue) {
        if (!_path) return;
        for (var w in MinQuery.__data_watchs) {
            var _w = MinQuery.__data_watchs[w];
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
module.exports = {
    load(pageName, recoveryMode) {
        if (typeof pageName !== "string") {
            console.error(`MinQuery instance loader a string page name, not this:`, pageName);
            return;
        }
        // 做降级转换提高选择器准确性
        pageName = pageName.toLowerCase();
        // 检测页面是否被注册
        if (pageName in $pageMQRegisterInstances) {
            console.error(`The Page name [${pageName}] has been registered!`);
            return;
        }
        $pageMQRegisterInstances[pageName] = {
            registered: true
        };
        return rootMinQuery(pageName, recoveryMode);
    },
    pages(pageName) {
        return $pageLoadedInstances.get(pageName);
    }
};