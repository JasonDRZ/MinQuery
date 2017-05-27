/**
 * Created by JasonD on 17/5/19.
 */
let $tools = require('tools');
//数据处理引擎
// 支持对象设置及单数据键值设置的数据查询引擎
let dataEngine = function (sourceData, keyString, keyValue) {
	// 如果传入的是data 查询的 key 并且使用call方法调用
	if ($tools.isString(sourceData)) {
		sourceData = this[sourceData];
	}
	if (sourceData) {
		
		// 如果不存在则返回数据源
		if (!keyString) {
			return sourceData;
		}
		// 是否获取指定键值
		let dataRequire = false, obj = {};
		if ($tools.isString(keyString) && $tools.isUndefined(keyValue)) {
			dataRequire = true;
			obj[keyString] = {};
		}
		// 如果关闭获取指定键值下，keyString不是数据对象时，则报错
		if ((!dataRequire && $tools.isUndefined(keyValue) && !$tools.isPlainObject(keyString)) || (!$tools.isUndefined(keyValue) && !$tools.isString(keyString))) {
			console.error(`AnalysisDataEngine params error!`, keyString, keyValue);
			return sourceData;
		}
		// 复制object
		if (!dataRequire) {
			if ($tools.isPlainObject(keyString)) {
				obj = keyString;
			} else
				obj[keyString] = keyValue;
		}
		// dataRequire模式，不存在则返回false，并终止；
		// 非dataRequire模式，将自动初始化对象的值为指定的objInit值
		let analyType = function (_data, key, objInit) {
			if ($tools.trim(key) !== '' && !_data[key]) {
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
					}
					;
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
							}
							;
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
						}
						;
						_rd = _rd[eackKey];
					}
				}
			}
		}
	} else {
		console.log(`AnalysisDataEngine require's a sourceData!`)
	}
}

module.exports = {
	dataEngine
};

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