/**
 * Created by JasonD on 17/5/18.
 */
const $tools = require('../utils/index');
const wx_config = require('../config/wx_config');
const wxCalls = wx_config.methodsCalls;

//微信接口封装访问器
/** 此接口用于访问未支持的wx接口，提供二次封装，并支持链式调用方式。
 * 调用方法-分类回调形式：
 *      常规配置方法： MinQuery.wxMethod('wxMethodName',{config: value,success(re){},fail(err){}});
 *      Thenjs方法：
 *          MinQuery.wxMethod('wxMethodName',{config:value})
 *              .then((cont,res)=>{cont()})
 *              .fail((cont,err)=>{cont()})
 *              .fin((cont,err,res)=>{cont(err)});
 *      单回调形式： MinQuery.wxMethod(wxMethodName,function(re){});
 *      单一参数型： MinQuery.wxMethod(wxMethodName,paramValue);
 */
//将所有微信接口变为then链式调用形式
let _wxMethodsThenTransformer = function (methodName, _options, wrapperCall, context) {
	// 检测并设置wx对象上下文
	!context && (context = wx);
	// 检测调用方法名称及是否存在
	let options = !_options ? {} : _options;
	if (typeof methodName == 'string' && methodName in context) {
		return Thenjs(function (cont) {
			let mannuComp = options.complete;
			// 仅在参数集为Object的情况下进行回调封装继承
			_$.isPlainObject(options) && $extend(options, {
				complete(e) {
					if (_$.isFunction(mannuComp)) mannuComp(e);
					// 支持Then.js的链式反应链
					if (methodName == 'request' && e.statusCode === 200) {
						cont(null,e);
					} else {
						let _msg = e.errMsg.split(":");
						if (_msg[1] === "ok") {
							cont(null,e);
						} else {
							cont(e);
						}
					}
				}
			});
			//执行方法
			_$.isFunction(wrapperCall)
				? $errorCarry(null, wrapperCall, context[methodName], options)
				: _$.isArray(options) ? context[methodName].apply(null, options) : context[methodName].call(null, options);
		})
	} else {
		//微信版本提示
		wx.showModal({
			title: '提示',
			content: `当前微信版本过低，无法使用[${methodName}]功能，请升级到最新微信版本后重试。`
		})
		console.error(`Do not have method [${methodName}] on context:`, context);
	}
}
let wxMethodsPackages = {};
$tools.each(wx_config.methodsParams, function (i, _oj) {
	if (_oj.name && _oj.name in wx) {
		wxMethodsPackages[_oj.name] = (function (_inob) {
			let _param_def = _inob['param_def'], _param_nor = _inob['param_nor'], _param_all;
			if ($tools.isArray(_param_def)) {
				_param_all = $tools.isArray(_param_nor) ? _param_def.concat(_param_nor) : _param_def;
			} else _param_all = null;
			return function (a) {
				// 返回的封装函数
				let args = $tools.slice.call(arguments), _has_config = $tools.isArray(_param_all), _type = 'string',
					_type_matches = [], _preset = '', _cur_param, _first = args[0], options = {};
				// 如果存在配置，则表明此项一定是异步回调形式，则进行预设参数进行继承
				if (_has_config) {
					// 优先进行配置项预设
					$tools.each(_param_all, function (_i, dar) {
						_preset = dar[2];
						// 仅设置有预制项的字段
						if (!$tools.isUndefined(_preset)) options[dar[0]] = _preset;
					});
					if ($tools.isPlainObject(_first)) {
						$tools.extend(options, _first);
					} else $tools.each(args, function (_i, ar) {
						_type_matches = [];
						_cur_param = _param_all[_i];
						// 存在配置预设项则进行验证，不存在，则忽略此字段
						if (!!_cur_param && !$tools.isUndefined(ar)) {
							_type = !!_cur_param[1] ? _cur_param[1] : 'string';
							_type = _type.split("|");
							// 判断是否符合多个类型中的某一个类型
							$tools.each(_type, function (_, t) {
								if ($tools.type(ar) === t) {
									//匹配到一个则中断
									_type_matches = [];
									return false;
								} else {
									_type_matches.push(t);
								}
							})
							if (_type_matches.length == 0) {
								options[_cur_param[0]] = ar;
							} else {
								console.error(`${_inob.name} method's param ${_cur_param[0]} should be ${_type_matches.join(' or ')}!`)
							}
						} else return false;
					});
				} else {
					options = args;
				}
				return _wxMethodsThenTranformer(_inob.name, options, _inob['agent_call']);
			}
		})(_oj);
	}
});

module.exports ={
	_wxMethodsThenTransformer,
	wxMethodsPackages
}