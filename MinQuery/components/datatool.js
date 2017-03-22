
// 支持对象设置及单数据键值设置
var analysisDataEngine = function (sourceData, keyString, keyValue) {
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

module.exports = {
    analysisDataEngine: analysisDataEngine
}