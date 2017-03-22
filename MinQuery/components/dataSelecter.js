// Elements Data Selecte Engine Walnut
var Walnut = function(electer){

};
var SelectConfig = {};
var TestData = {
    "$id": {
        "element": {
            "$class": "",
            "$hoverClass": "",
            "$attr": {},
            "$style": "",
            "$data": {},
            "$children": ["element"],
            "$animation": null
        }
    },
    "$cs": {},
    "$window": {},
    "$data": {}
}
// 元素固有操作属性
var elementAttributes = SelectConfig.elementAttributes = {
    "$class": "",
    "$hoverClass": "",
    "$attr": {},
    "$style": "",
    "$data": {},
    "$children": [],
    "$animation": null
}

var selectersBank = SelectConfig.selectersBank = {
    "#": "$id",
    ".": "$cs",
    "window": "$window",
    "data": "$data",
    "root": "root"//获取根数据
};
// 数据操作钩子
Walnut.dataHooks = {};
// 元素所在数据路径钩子，存储在对象的__proto__对象上
var hookRoute = Walnut.dataHooks.route = {
    set: function (parentData, key, value) {
        if (typeof parentData === "object" && typeof key === "string" && typeof value !== "undefind") {
            // 给父数据添加新的数据节点
            parentData[key] = value;
            // 设置data route
            parentData[key].__proto__["$route"] = (parentData.__proto__["$route"] ? (parentData.__proto__["$route"] + ".") : "") + key;
        }
    },
    get: function (targetData) {
        if(targetData.__proto__["$route"]){
            return targetData.__proto__["$route"];
        } else {
            return undefined;
        }
    }
}
var hookSelect = Walnut.dataHooks.select = {
    get: function(rootData, selecter){
        // 跟数据查询
        if(selecter in selectersBank){
            return rootData[selecter];
        }
        // 元素按id或data-min-class查询
        var prevfix = selecter[0];
        var _elarr = Array.from(selecter);
        _elarr.shift();
        var elem = _elarr.join("");
        if(prevfix in selectersBank){
            return rootData[selectersBank[prevfix]] ? rootData[selectersBank[prevfix]][elem] : undefined;
        } else {
            console.error(`MinQuery does not suport element selecter ${selecter}!Just suport: [#ele_id,.ele_data-min-class,window,data,root]`);
            return undefined;
        }
    }
}
// 设置默认元素数据节点初始化数据
var elementAttr = Walnut.elementAttr = {
    "ADD": function (key, initData) {
        if (typeof key === "string" && key[0] === "$") {
            if (typeof initData === "undefind") {
                console.error(`The elementAttribute ${key} must have an non-undefind initData!Could be an instance of String、Object、Array or an null.`);
                return (key, initData);
            }
            if (key in elementAttributes || key in elementKeyRoute) {
                console.error(`The elementAttribute ${key} has already been registered!`);
                return (key, initData);
            }
            elementAttributes[key] = initData;
        } else {
            console.error("The elementAttribute name must begin with '$' sign,such as: $class");
        }
    },
    "LOADONE": function (elem,attrKey,attrValue) {
        hookRoute.set(elem,attrKey,attrValue);
    },
    "LOADALL": function (elem) {
        for(var ak in elementAttributes){
            elementAttr.LOADONE(elem,ak,elementAttributes[ak]);
        }
    }
}

var _select = Walnut.select = function () {

}