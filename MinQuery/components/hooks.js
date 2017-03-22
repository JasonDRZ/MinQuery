var _CurrentMQHooks = {};
// 数据当前对象__proto__.$route为到page.data的key路径
// _CurrentMQHooks.dataRoute = {
//     set: function (parentData, key, value) {
//         if (typeof parentData === "object" && typeof key === "string" && typeof value !== "undefind") {
//             // 给父数据添加新的数据节点
//             parentData[key] = value;
//             // 设置data route
//             parentData[key].__proto__["$route"] = (parentData.__proto__["$route"] ? (parentData.__proto__["$route"] + ".") : "") + key;
//         }
//     },
//     get: function (targetData) {
//         if (targetData.__proto__["$route"]) {
//             return targetData.__proto__["$route"];
//         } else {
//             return undefined;
//         }
//     }
// }
// var elementAttr = MinQuery.elementAttr = {
//         "ADD": function (key, initData) {
//             if (typeof key === "string" && key[0] === "$") {
//                 if (typeof initData === "undefind") {
//                     console.error(`The elementAttribute ${key} must have an non-undefind initData!Could be an instance of String、Object、Array or an null.`);
//                     return (key, initData);
//                 }
//                 if (key in MinQuery.getElementAttributesInit() || key in elementKeyRoute) {
//                     console.error(`The elementAttribute ${key} has already been registered!`);
//                     return (key, initData);
//                 }
//                 MinQuery.getElementAttributesInit()[key] = initData;
//             } else {
//                 console.error("The elementAttribute name must begin with '$' sign,such as: $class");
//             }
//         }
//     }
module.exports = {
    // 钩子注册
    registerHooks: function (hname, hobj) {
        if (hname in _CurrentMQHooks[hname]) {
            console.error(`The hook ${hname} has already been registered!`);
            return;
        }
        if (!hname in MinQuery.dataHooks) {
            _CurrentMQHooks[hname] = {};
            if ('get' in hobj || 'set' in hobj) {
                _CurrentMQHooks[hname] && (_CurrentMQHooks[hname] = hobj);
            } else {
                console.error(`The hook object must have an set or get method,or both of them!`);
                return;
            }
        }
    },
    // 获取钩子
    getHooks: function (hname, hmethod) {
        return _CurrentMQHooks[hname] && _CurrentMQHooks[hname] && _CurrentMQHooks[hname][hmethod] ? _CurrentMQHooks[hname][hmethod] : function () {
            console.error(`Could not find a hook method by route [${hname}.${hmethod}] to handle ${arguments}!`);
        }
    }
}
