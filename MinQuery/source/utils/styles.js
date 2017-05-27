/**
 * Created by JasonD on 17/5/18.
 */
let $tools = require('tools');
let $path = require('path');

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
		if ($tools.isArray(img_url)) {
			style_value = 'url(' + $path.autoMendServer(img_url[0], 'imageServer') + ")";
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
//删除样式
const removeClass = function (sourceClassStr, className) {
	if (typeof sourceClassStr === "string") {
		let cindex = hasClass(sourceClassStr, className);
		sourceClassStr = sourceClassStr.split(" ");
		cindex !== -1 && sourceClassStr.splice(cindex, 1);
		return sourceClassStr.join(" ");
	}
}

const styleController = {
	styleToJson: styleToJson,
	jsonToStyle: jsonToStyle,
	styleExtend: styleExtend,
	hasClass: hasClass,
	addClass: addClass,
	removeClass: removeClass
};

module.exports = {
	styleController
};