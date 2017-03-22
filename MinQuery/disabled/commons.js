// methods acronym
var arr = [],
    slice = arr.slice,
    concat = arr.concat,
    push = arr.push,
    indexOf = arr.indexOf,
    class2type = {},
    toString = class2type.toString,
    hasOwn = class2type.hasOwnProperty,
    // version
    version = "1.2.1",
    // Make sure we trim string's NBSP etc.
    // rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    rtrim = /[\s]+$/g;
var $Commons = {
    // Assume MinQuery is ready without the ready module
    isReady: false,

    error: function (msg) {
        console.error(msg);
    },

    noop: function () { },

    isFunction: function (obj) {
        return this.type(obj) === "function";
    },

    isArraylike: function (obj) {
        var length = obj.length,
            type = this.type(obj);

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
        return !this.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
    },

    isPlainObject: function (obj) {
        // Not plain objects:
        // - Any object or value whose internal [[Class]] property is not "[object Object]"
        if (this.type(obj) !== "object") {
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
        return typeof str === 'undefined' || str === null || this.trim(str + "") == "";
    },

    isEmptyObject: function (obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    },

    typeList: {},

    type: function (obj) {
        if (obj == null) {
            return obj + "";
        }
        // Support: Android<4.0, iOS<6 (functionish RegExp)
        return typeof obj === "object" || typeof obj === "function" ?
            this.typeList[toString.call(obj)] || "object" :
            typeof obj;
    },

    // args is for internal usage only
    each: function (obj, callback, args) {
        console.log(this)
        var value,
            i = 0,
            length = obj.length,
            
            isArray = this.findProp("isArraylike")(obj);

        if (args) {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.apply(obj[i], args);

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
                for (; i < length; i++) {
                    value = callback.call(obj[i], i, obj[i]);

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
        var ret = results || [];

        if (arr != null) {
            if (this.isArraylike(Object(arr))) {
                this.merge(ret,
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
            isArray = this.isArraylike(elems),
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
    formatDate: function (date,fmt) { 
        //author: meizz,jason
        if(date instanceof Date || typeof date === 'number'){
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
};
// 加载typelist
var objTypes = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
objTypes.forEach(function (name, i) {
    $Commons.typeList["[object " + name + "]"] = name.toLowerCase();
});

module.exports = $Commons;