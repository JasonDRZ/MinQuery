var $utils = {
    isUndefined: function (obj) {
        return typeof str === 'undefined';
    },

    isEmptyObject: function (obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    },
    trim: function (text) {
        return text == null ?
            "" :
            (text + "").replace(rtrim, "");
    },
    inArray: function (elem, arr, i) {
        return arr == null ? -1 : Array.prototype.indexOf.call(arr, elem, i);
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
}
module.exports = $utils