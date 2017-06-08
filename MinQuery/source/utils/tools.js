/**
 * Created by JasonD on 17/5/18.
 */
const $mq_config = require('../config/mq_config');

// MinQuery 工具方法及变量
// 页面数据操作主体
let
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
	
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
// 生成类型字典
let _classTypeInitial = [false, 0, '', function () {
}, [], Date.now(), new RegExp(), {}, new Error(), 0];
("Boolean Number String Function Array Date RegExp Object Error Uint8Array".split(" ")).forEach(function (name, i) {
	let _l_name = name.toLowerCase();
	class2type["[object " + name + "]"] = _l_name;
	typeInitial[_l_name] = _classTypeInitial[i];
});

let $tools = {
	
	version: $mq_config.version,
	
	slice: slice,
	
	error: function (msg) {
		console.error(msg);
	},
	//是否开启了调试模式
	debugMode: false,
	//是否存在代理错误处理函数
	errorHandler: null,
	// MinQuery 错误事件捕捉器
	carry: function (context, fn) {
		let _fn_ret, args = [].slice.call(arguments, 2);
		if ($tools.debugMode) {
			try {
				_fn_ret = fn.apply(context ? context : null, args);
			} catch (e) {
				typeof $tools.errorHandler == 'function' ? $tools.errorHandler(e) : console.error(e);
			}
		} else _fn_ret = fn.apply(context ? context : null, args);
		return _fn_ret;
	},
	
	noop: function () {
	},
	
	isFunction: function (obj) {
		return $tools.type(obj) === "function";
	},
	
	isArraylike: function (obj) {
		let length = obj.length,
			type = $tools.type(obj);
		
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
		return !$tools.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
	},
	
	isPlainObject: function (obj) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		if ($tools.type(obj) !== "object") {
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
		return typeof str === 'undefined' || str === null || $tools.trim(str + "") == "";
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
	// 数据镜像：将已有数据镜像还原到某一原状态；//框架内部使用
	recoveryObject: function (source, mirror, deep) {
		let isArray, s;
		// 支持对象数据恢复，deep操作时支持数组
		if ($tools.isPlainObject(source) || (deep && $tools.isArray(source))) {
			for (s in source) {
				// 均存在这恢复镜像数据到源数据
				if (!(s in source) && !(s in mirror)) {
					if (deep) {
						// 进行深度恢复操作
						if ($tools.isPlainObject(source[s]) || (deep && $tools.isArray(source[s]))) {
							$tools.recoveryObject(source[s], mirror[s], deep);
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
			
			isArray = $tools.isArraylike(obj);
		
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
			if ($tools.isArraylike(Object(arr))) {
				$tools.merge(ret,
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
			isArray = $tools.isArraylike(elems),
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
	/**
	 * 格式化日期，支持时间戳和Date实例
	 * @param date 要格式话的日期
	 * @param fmt String 日期格式模板：{y:'年',m:'月',d:'日',h:'时',i:'分',s:'秒',q:'季度',S:'毫秒'}
	 * @template ('2017.11.12','yyyy年mm月dd日') =>2017年11月12日
	 * @return {*}
	 */
	formatDate: function (date, fmt) {
		//author: meizz,jason
		if (date instanceof Date || $tools.isNumeric(date) || $tools.isString(date)) {
			date = new Date(date);
		} else {
			console.error("The formatDate first param must be an Date() instance or timestamp or date format string!");
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
	/**
	 * 生成随机16进制颜色字符串方法
	 * @return {string}
	 */
	randomColor() {
		let rgb = [], i = 0;
		for (; i < 3; ++i) {
			let color = Math.floor(Math.random() * 256).toString(16)
			color = color.length == 1 ? '0' + color : color
			rgb.push(color)
		}
		return '#' + rgb.join('')
	},
	// 当前时间戳
	now: Date.now,
	//对象继承
	extend: function () {
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
		if (typeof target !== "object" && !$tools.isFunction(target)) {
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
					if (deep && copy && ($tools.isPlainObject(copy) || (copyIsArray = $tools.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && $tools.isArray(src) ? src : [];
							
						} else {
							clone = src && $tools.isPlainObject(src) ? src : {};
						}
						
						// Never move original objects, clone them
						target[name] = $tools.extend(deep, clone, copy);
						
						// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
		
		// Return the modified object
		return target;
	}
};

module.exports = $tools;