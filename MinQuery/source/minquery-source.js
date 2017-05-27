/*!
 * MinQuery for Wechat Min-App Development JavaScript Library v1.0.2
 * https://github.com/JasonDRZ/MinQuery
 *
 * Copyright 2016, 2017 JasonDRZ.
 * Released under the MIT license
 *
 * Date: 2017-4-15 16.21
 */

// 框架配置项
const $mq_config = require('config/mq_config');

const wx_config = require('config/wx_config');

const wxLaunchScene = wx_config.launchScene;

let $tools = require('utils/index');

const wxMethods = require('wx/methods');

const Thenjs = require('third_part/thenjs');

//全局方法
const $global = require('global/index');

// set window object
let $windowInfo = {};
// bind system info
$tools.getSystemInfo(function (info) {
	$windowInfo = info;
});

/**
 * rootMinQuery方法返回主体。
 * 由于各个页面数据的独立性，前期并未采用函数构造器的方式解决页面之间的数据独立问题。
 * 后续更新将会解决这一问题，使代码更加规范
 * @param pageName String 页面的名称
 * @param recoveryMode
 * @return {*}
 */
const rootMinQuery = function (pageName, recoveryMode) {
	// 检测pageName是否为字符串
	if (!typeof pageName === "string") {
		console.error(`MinQuery initialization require's a pageName, such as: app/pageNameOne;`);
		return undefined;
	}
	
	// 定义MinQuery本地函数体
	// selector为选择器
	let MinQuery = function (selector) {
		// The MinQuery object is actually just the init constructor 'enhanced'
		// Need init if MinQuery is called (just allow error to be thrown if not included)
		return new pageInit(selector);
	};
	// *******原型方法无法调用私有方法，私有方法可以调用原型方法*******
	//
	// 原型工具方法及配置
	MinQuery.fn = MinQuery.prototype = {
		// The current version of MinQuery being used
		MinQuery: $tools.version,
		
		constructor: MinQuery,
		
		// Start with an empty selector
		selector: "",
		
		// The default length of a MinQuery object is 0
		length: 0,
		
		toArray: function () {
			return $tools.slice.call(this);
		},
		
		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function (num) {
			return num != null ?
				
				// Return just the one element from the set
				(num < 0 ? this[num + this.length] : this[num]) :
				
				// Return all the elements in a clean array
				$tools.slice.call(this);
		},
		
		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function (elems) {
			
			// Build a new MinQuery matched element set
			let ret = $tools.merge(this.constructor(), elems);
			
			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			
			// Return the newly-formed element set
			return ret;
		},
		
		// Execute a callback for every element in the matched set.
		// (You can seed the arguments with an array of args, but this is
		// only used internally.)
		each: function (callback, args) {
			return $tools.each(this, callback, args);
		},
		
		map: function (callback) {
			return this.pushStack($tools.map(this, function (elem, i) {
				return callback.call(elem, i, elem);
			}));
		},
		
		slice: function () {
			return this.pushStack($tools.slice.apply(this, arguments));
		},
		
		first: function () {
			return this.eq(0);
		},
		
		last: function () {
			return this.eq(-1);
		},
		
		eq: function (i) {
			console.log(this);
			let len = this.length,
				j = +i + (i < 0 ? len : 0);
			return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
		},
		
		end: function () {
			return this.prevObject || this.constructor(null);
		},
		
		// For internal use only.
		// Behaves like an Array's method, not like a MinQuery method.
		push: [].push,
		sort: [].sort,
		splice: [].splice
	};
	// 集成extend module
	MinQuery.extend = MinQuery.fn.extend = $tools.extend;
	
	//捕获错误
	MinQuery.$catch = $tools.carry;
	
	// 继承common methods
	MinQuery.extend(MinQuery, {
			// Unique for each copy of MinQuery in the page
			expando: "MinQuery_" + ($tools.version + Math.random()).replace(/\D/g, ""),
			
			// Unique page indicator, will be use in query currentPage data!
			pageName: pageName,
			// To detect if the Page event onReady is triggered
			isReady: false,
			// To identify if the MinQuery initial data has been injected in Page Function;
			pageInjected: false
		},
		// 继承外部工具方法
		$tools, {
			// Thenjs挂载到$when对象上
			$when: Thenjs
		});
	
	MinQuery.extend({
		// 单个、批量设置服务器地址，或单个，全部服务器地址设置信息获取
		$servers: $global.$servers.configServers,
		// 自动补全服务器地址信息
		/**
		 * url String 需要进行补全的url链接
		 * serverType String 服务器地址类型
		 *
		 * return Complete Url 返回补全后的地址
		 */
		autoMendServer: $tools.autoMendServer
	})
	
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
	MinQuery.wxMethod = wxMethods._wxMethodsThenTransformer;
	
	//定义模块
	MinQuery.definedModule = $global.$module.defineModule;
	//调用模块
	MinQuery.module = $global.$module.callModule;
	//微信封装接口
	MinQuery.extend(wxMethods.wxMethodsPackages);
	//ajax方法封装
	MinQuery.extend({
		// Ajax methods
		ajax(url, config, call) {
			if ($tools.isPlainObject(url)) {
				call = config;
				config = url;
				url = null;
			}
			let _conf = $tools.isPlainObject(config) ? config : {};
			$tools.isString(url) && (_conf['url'] = url);
			$tools.isFunction(call) && (_conf['success'] = call);
			return wxMethods.wxMethodsPackages.request(_conf);
		},
		get: function (url, data, call) {
			if ($tools.isFunction(data)) {
				call = data;
				data = {};
			}
			return this.ajax({
				url: url,
				data: data,
				success(e) {
					call && call(e);
				}
			})
		},
		post(url, data, call) {
			if ($tools.isFunction(data)) {
				call = data;
				data = {};
			}
			return this.ajax({
				url: url,
				data: data,
				method: "post",
				success(e) {
					call && call(e);
				}
			})
		}
	});
	
	//window字段查询方法
	MinQuery.extend({
		$window: $windowInfo
	})
	//window字段查询方法，这里的方法只能对window对象进行查询
	MinQuery.fn.extend({
		width() {
			let ele = this[0];
			if (!!ele && ele.$selectorName === "window") {
				return ele.width;
			}
		},
		height() {
			let ele = this[0];
			if (!!ele && ele.$selectorName === "window") {
				return ele.height;
			}
		},
		// 获取所有配置信息
		info(key) {
			let ele = this[0];
			if (!!ele && ele.$selectorName === "window") {
				return !!key ? ele[key] : ele;
			}
		}
	})
	
	// Query Engine
	// Elements Data Selecte Engine MinQuery
	MinQuery.extend({
		// 注册固有静态keys
		registerInherentKey(key, description) {
			if ($tools.isPlainObject(key) && !description) {
				for (let k in key) {
					$mq_config.inherentStaticKeys[k] = [k, key[k]];
				}
			} else {
				$mq_config.inherentStaticKeys[key] = [key, description];
			}
		}
	});
	// 元素固有操作属性初始化
	
	// 全局接口，获取每一个运行中的页面、获取app数据
	MinQuery.extend({
		page(pageName) {
			return $global.$pages.get(pageName);
		},
		app(searchkeys) {;
			return MinQuery.dataProcessor(getApp(), searchkeys);
		}
	});
	/**
	 * current  apply & call
	 */
	MinQuery.extend({
		$apply(_tar, argsArr) {
			$tools.isFunction(_tar) && $tools.carry(this, _tar, argsArr);
		},
		$call() {
			let args = $tools.slice.call(arguments), _tar = args[0];
			args.shift();
			$tools.isFunction(_tar) && $tools.carry(this, _tar, args);
		}
	});
	
	/**
	 * 全局事件广播
	 */
	MinQuery.extend({
		/**
		 * 绑定全局事件的处理方法；
		 *
		 * 每个页面对同一事件只能绑定一次，每个方法科附带自己的初始配置数据
		 *
		 * 绑定方法触发时，第一个参数是触发的页面名称，其后才是响应的回传数据
		 *
		 * 不同页面可绑定同一个事件，
		 * @param event
		 * @param callback
		 * @example $.$on('login',function(from,data){});
		 */
		$on(event, callback) {
			$global.$events.register(MinQuery.pageName, event, callback.bind(this));
		},
		/**
		 * 关闭全局事件，支持两个参数
		 * @param event String 事件名称
		 * @param filterArr Array 要忽略的页面名称  配置了忽略项，则不会对忽略页面的当前事件进行关闭
		 * @example $.$off('login',['!index']) 将忽略对index页面的事件关闭
		 */
		$off(event, filterArr) {
			$global.$events.destroy(event, filterArr);
		},
		/**
		 * 全局事件广播
		 *
		 * @param event String
		 * @param data 传入的数据，或回调
		 */
		$trigger(event, data) {
			data = $tools.slice.call(arguments,1);
			$global.$events.trigger(MinQuery.pageName, event, data);
		}
	})
	/**
	 * 查询对象的事件注册、触发、销毁器
	 */
	MinQuery.fn.extend({
		// 在其他页面或地方对当前页面注册查询对象扩展处理方法，可注册多次注册
		/**
		 * 注册事件处理集，可针对同一事件绑定、注册多个处理方法，方法之间互相独立。
		 * 方法将会在on或是bind方法绑定函数触发时同步触发，
		 * 此类方法注册的处理函数不接收返回值，并且无法使用trigger方法直接进行触发
		 * 绑定的data将绑定到回调函数的第一个事件形参的$data属性上
		 * @param _type String 事件名称
		 * @param data [AnyType / optional] 事件触发时要绑定传入的数据
		 * @param method Function 事件同步触发时的回调方法
		 * @return {pushEvent} no returns
		 */
		pushEvent(_type, data, method) {
			if (typeof data === 'function') {
				method = data;
				data = undefined;
			}
			if (!!this && this.length > 0) {
				this.each(function () {
					let _this = this;
					//用于支持多事件同时设置
					MinQuery.each(_type.split(' '), function (i, _t) {
						// 禁止监听Page固有事件之外的事件
						if ((_this.$selectorName === "page" || _this.$selectorName === "app") && !(_t in MinQuery.pageInheritEventKVPair)) {
							console.error(`There is no such ${_this.$selectorName} inherent event named '${_t}' on page object!`);
							return;
						}
						eventHooks.set(_this, `pushEvents.${_t}`, method, data);
					})
				})
			}
			return this;
		},
		/**
		 * 主要用于处理元素的绑定事件和Page固有事件监听回调
		 * 绑定的data将绑定到回调函数的第一个事件形参的$data属性上
		 * @param _type
		 * @param data
		 * @param method
		 * @return {on}
		 */
		on(_type, data, method) {
			if (typeof data === 'function') {
				method = data;
				data = undefined;
			}
			if (!!this && this.length > 0) {
				this.each(function () {
					let _this = this;
					MinQuery.each(_type.split(' '), function (i, _t) {
						// 禁止监听Page固有事件之外的事件
						if ((_this.$selectorName === "page" || _this.$selectorName === "app") && !(_t in MinQuery.pageInheritEventKVPair)) {
							console.error(`There is no such ${_this.$selectorName} inherent event named '${_t}'!`);
							return;
						}
						eventHooks.set(_this, `bind.${_t}`, method, data);
					})
				})
			}
			return this;
		},
		/** 元素专用事件捕捉触发监听回调形式
		 * 主要处理元素的Catch事件监听回调，Page不能使用该方法进行回调注册
		 * 绑定的data将绑定到回调函数的第一个事件形参的$data属性上
		 * @param _type
		 * @param data
		 * @param method
		 * @return {catch}
		 */
		catch(_type, data, method) {
			if (typeof data === 'function') {
				method = data;
				data = undefined;
			}
			if (!!this && this.length > 0) {
				this.each(function () {
					let _this = this;
					MinQuery.each(_type.split(' '), function (i, _t) {
						// 禁止在Page上catch事件
						if (_this.$selectorName === "page" || _this.$selectorName === "app") {
							console.error(`Can not use catch method to catch a ${_this.$selectorName} event!`);
							return;
						}
						eventHooks.set(_this, `catch.${_t}`, method, data);
					})
				})
			}
			return this;
		},
		/** 对于元素而言，其表现与on事件回调绑定机制相同
		 * 对于Page而言，此方法将会在传入Page方法的实例对象上新建独立的事件处理函数，并且此回调名称不能与已有的任何事件或是属性名称相同。
		 * 绑定的data将绑定到回调函数的第一个事件形参的$data属性上
		 * @param _type
		 * @param data
		 * @param method
		 * @return {bind}
		 */
		bind(_type, data, method) {
			if (typeof data === 'function') {
				method = data;
				data = undefined;
			}
			if (!!this && this.length > 0) {
				let self = this;
				this.each(function () {
					let _this = this;
					// 禁止触发Page固有事件
					if (_this.$selectorName === "page" || _this.$selectorName === "app") {
						// Page事件绑定仅能在加载函数内进行绑定
						if (MinQuery.isReady) {
							console.log(`The ${_this.$selectorName} events operation should be run in the MinQuery init function!`);
							return;
						}
						;
						MinQuery.each(_type.split(' '), function (i, _t) {
							// 禁止再次绑定page固有事件
							if (_t in MinQuery.pageInheritEventKVPair) {
								console.error(`The ${_this.$selectorName} event ${_t} has already bound as a inherit event callback!`);
								return;
							}
							let _page = self[0];
							// 检测是否为以存在的键
							!(_t in _page) && (_page[_t] = function (e) {
								// 为Page自定义番薯传递数据
								$tools.isPlainObject(e)
									? (e['$data'] = data)
									: (e = {"$event": e, "$data": data});
								method.call(_page, e);
							});
							eventHooks.set(_this, `bind.${_t}`, method, data);
						})
					} else {
						MinQuery.each(_type.split(' '), function (i, _t) {
							eventHooks.set(_this, `bind.${_t}`, method, data);
						})
					}
				})
			}
			return this;
		},
		/**
		 * 自定义事件触发器，一次只能触发一个事件
		 * @param _type
		 * @param data
		 * @param triggerCall
		 * @param iscatch
		 * @return {trigger}
		 */
		trigger(_type, data, triggerCall, iscatch) {
			// 默认触发bind方法下的事件
			if (typeof triggerCall === "boolean") {
				iscatch = triggerCall;
			}
			if (typeof data === 'function') {
				triggerCall = data;
				data = undefined;
			}
			let triggerType = iscatch === true ? 'catch' : 'bind';
			if (!!this && this.length > 0) {
				// 验证是否触发Page固有事件
				let eroute, res;
				let self = this;
				this.each(function () {
					if (this.$selectorName === "page" || this.$selectorName === "app") {
						// 禁止触发Page固有事件
						if (_type in MinQuery.pageInheritEventKVPair) {
							console.error(`You can not trigger an ${this.$selectorName} inherent event named [${_type}]!`);
						} else {
							// 触发根节点绑定事件
							if (_type in this && $tools.isFunction(this[_type])) {
								res = this[_type](data);
								$tools.isFunction(triggerCall) && $tools.carry(null, triggerCall, {
									"$data": data,
									"$res": res
								});
								// $tools.isFunction(triggerCall) && triggerCall({ "$data": data, "$res": res });
							}
							;
						}
					} else {
						// 获取当前元素事件路径
						eroute = this.$events[triggerType] ? this.$events[triggerType][_type] : undefined;
						// 触发传递数据，并接收返回数据
						res = eventHooks.get(eroute, {}, data);
						// 执行callback
						$tools.isFunction(triggerCall) && $tools.carry(null, triggerCall, {
							"$data": data,
							"$res": res
						});
						// $tools.isFunction(triggerCall) && triggerCall({ "$data": data, "$res": res });
					}
				})
			}
			return this;
		},
		// 自定义事件卸载器，一次只能关闭一个事件
		off(_type, offCall, iscatch) {
			// 默认触发bind方法下的事件
			if (typeof offCall === "boolean") {
				iscatch = offCall;
			}
			let triggerType = iscatch === true ? 'catch' : 'bind', _this = this;
			if (!!this && this.length > 0) {
				let eroute;
				this.each(function () {
					eventHooks.set(this, `${triggerType}.${_type}`, false);
					$tools.isFunction(offCall) && $tools.carry(this, offCall);
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
			let triggerType = !!iscatch ? 'catch' : 'bind';
			let _this = this;
			MinQuery.each(_type.split(' '), function (i, _t) {
				MinQuery(_this)[triggerType](_t, data, function () {
					let etype = _t, ecall = oneceCall;
					MinQuery(_this).off(etype, function () {
						console.log("OFF Event:" + _t)
					}, triggerType);
					ecall.apply(_this, arguments);
				})
			});
			return this;
		}
	});
	// Page固有事件处理器
	let pageInheritEventHandlers = {};
	// 页面固有事件名称管理器，用于防止用户再次注册固有事件。并且可以进行事件查询操作。
	MinQuery.pageInheritEventKVPair = {};
	
	let pageEventMiddleware;
	// 注册Page固有事件到MinQuery事件代理器
	MinQuery.inheritEventRegister = function (_c_e_name, _middleware) {
		// 如果是外部注册，则添加到主事件列表中
		MinQuery.pageInheritEventList.indexOf(_c_e_name) === -1 && MinQuery.pageInheritEventList.push(_c_e_name);
		// 生成字典
		let noOnEN = Array.from(_c_e_name);
		// 去掉on开头
		noOnEN.splice(0, 2)
		// 降级大写字母
		noOnEN = noOnEN.join("").toLowerCase();
		// 设置双向查询字典
		MinQuery.pageInheritEventKVPair[_c_e_name] = noOnEN;
		MinQuery.pageInheritEventKVPair[noOnEN] = _c_e_name;
		
		// 设置当前功能处理对象
		pageInheritEventHandlers[_c_e_name] = function (e, ename = _c_e_name) {
			let _this = this;
			// 运行自定义添加的中间件事件处理器
			$tools.isFunction(_middleware) && _middleware.call(_this, e, ename);
			// 调用中间件管理器，并处理事件返回值
			return pageEventMiddleware.call(_this, e, ename);
		};
	}
	// 如果是App页面的注册，则启用
	if (MinQuery.pageName === "app") {
		MinQuery.pageInheritEventList = $mq_config.appEvents;
		pageEventMiddleware = function (e, ename) {
			var _rewrite_event = {};
			$tools.isPlainObject(e) && MinQuery.each(e, function (k, v) {
				// 处理场场景值
				if (k === 'scene') {
					_rewrite_event[k] = v in wxLaunchScene ? wxLaunchScene[v] : [v, ''];
				} else {
					_rewrite_event[k] = v;
				}
			});
			// 冻结事件对象
			Object.freeze(_rewrite_event);
			// 等待扩展固有事件方法的快速调用接口，每个固有事件处理器只能被注册一次
			if (ename === MinQuery.pageInheritEventKVPair.launch) {
				// 设置已加载的页面的MQ实例
				$global.$pages.set(MinQuery.pageName, MinQuery);
			}
			// onReady方法会触发
			if (ename === MinQuery.pageInheritEventKVPair.show) {
				// 设置ready标示，用于标示此页面是否已经加载过了
				MinQuery.isReady = true;
			}
			;
			if (ename === MinQuery.pageInheritEventKVPair.hide) {
				// 离开页面时，回收所有框架注册对象数据
				$global.$pages.set(MinQuery.pageName, null);
				MinQuery.isReady = false;
			}
			;
			// 优先在事件管理器上查询并执行对应去掉on的自定义事件
			let ret = eventHooks.get(`${$mq_config.selectorsBank.app[0]}.app`, `bind.${MinQuery.pageInheritEventKVPair[ename]}`, _rewrite_event);
			// 未查询到自定义事件是执行查询原始事件名称事件
			if (ret === '[No-Event-Handler]') {
				// 查询执行元素原生事件
				return eventHooks.get(`${$mq_config.selectorsBank.app[0]}.app`, `bind.${ename}`, _rewrite_event);
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
					!!recoveryMode && MinQuery.recoveryObject(MinQuery.$pageInitObject.data, MinQuery.pageInstance.data, true);
				}
				// 将load事件中打来的路径参数绑定到框架上
				MinQuery.querys = e;
				//将wx创建的pageInstance镜像处理
				MinQuery.each(this, function (k, v) {
					if (!(k in MinQuery.$pageInitObject)) {
						MinQuery.$pageInitObject[k] = v;
					}
				});
				// 设置已加载的页面的MQ实例
				$global.$pages.set(MinQuery.pageName, MinQuery);
			}
			// onReady方法会触发
			if (ename === MinQuery.pageInheritEventKVPair.ready) {
				// 设置ready标示，用于标示此页面是否已经加载过了
				MinQuery.isReady = true;
				//尝试更新系统数据，避免在使用switch tab时页面高度出现变化
				$tools.getSystemInfo(function (info) {
					MinQuery.extend($windowInfo, info, {
						"$selectorType": "$window",
						"$selectorName": "window"
					});
					setCurrentPageData('$window', $windowInfo);
				});
			}
			;
			// 关闭页面则回收对象
			if (ename === MinQuery.pageInheritEventKVPair.unload) {
				// 离开页面时，回收所有框架注册对象数据
				// MinQuery("*").stop();
				$global.$pages.set(MinQuery.pageName, null);
				MinQuery.pageInstance = null;
				MinQuery.querys = null;
				MinQuery.isReady = false;
			}
			;
			// 优先在事件管理器上查询并执行对应去掉on的自定义事件
			let ret = eventHooks.get(`${$mq_config.selectorsBank.page[0]}.page`, `bind.${MinQuery.pageInheritEventKVPair[ename]}`, e);
			// 未查询到自定义事件是执行查询原始事件名称事件
			if (ret === '[No-Event-Handler]') {
				// 查询执行元素原生事件
				return eventHooks.get(`${$mq_config.selectorsBank.page[0]}.page`, `bind.${ename}`, e);
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
	let eventHooks = {
		// 设置对应的元素事件到事件管理器中并给当前元素写入事件查询地址
		set: function (elem, eventkeys, method, binddata) {
			if (MinQuery.isUndefined(elem) && !MinQuery.isEmpty(eventkeys)) return;
			let elekeys = `${elem.$selectorType}.${elem.$selectorName}`,
				eleEventRoute = `${elekeys}.$events.${eventkeys}`,
				eventManagerRoute = `${elekeys}.${eventkeys}`,
				hasEvent = MinQuery.getData(eleEventRoute),
				isRegisterEvent = eventkeys.split(".").indexOf("pushEvents") !== -1;
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
					let rglist = MinQuery.dataProcessor(MinQuery.eventManager, `${eventManagerRoute}.method`);
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
			}
			;
			let noFunc = "[No-Event-Handler]";
			if (!elekeys) {
				return noFunc;
			}
			// 查询元素
			let eventEle = MinQuery.getData(MinQuery.eventManager, elekeys),
				// 查询事件
				eventObj = eventEle ? MinQuery.getData(eventEle, eventkeys) : false;
			// 查询注册扩展事件
			let regObj = eventEle ? MinQuery.getData(eventEle, `pushEvents.${eventkeys.split(".").pop()}`) : false,
				// 将事件绑定的data数据绑定到eventdata事件数据的$data字段上
				dataArr = [], ei = 0, eleContext = (function () {
					//查询事件上下文
					if (!!eventEle){
						//拆分Page和App的上下文查询
						if(eventEle.context == '$page.page'){
							return MinQuery('page')[0];
						} else if(eventEle.context == '$app.app') {
							return MinQuery('app')[0];
						} else return MinQuery.getData(eventEle.context);
					} else return null;
				})();
			if (!!eventObj && !!eventObj.active) {
				// 将绑定数据挂在到event数据上的$data属性上
				if (!!eventdata) {
					if (!!eventObj.data) $tools.isPlainObject(eventdata)
						? (eventdata['$data'] = eventObj.data)
						: (eventdata = {"$event": eventdata, "$data": eventObj.data})
					dataArr[ei++] = eventdata;
				}
				// 将trigger数据追加到event数据后
				if (!!triggerdata) {
					triggerdata instanceof Array
						? (MinQuery.merge(dataArr, triggerdata))
						: (dataArr[ei] = triggerdata);
				}
				;
				// 处理批量registerEvent方法
				!!regObj && regObj.method && MinQuery.each(regObj.method, (i, reg) => {
					$tools.isFunction(reg) && $tools.carry(null, function () {
						reg.apply(eleContext, dataArr);
					});
				});
				
				let _method_return;
				_method_return = $tools.isFunction(eventObj.method) ? $tools.carry(null, function () {
					return eventObj.method.apply(eleContext, dataArr);
				})
					: noFunc;
				// 返回绑定当前域的处理方法，返回处理后的数据
				return _method_return
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
	let elementEventHandlers = {
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
	let findElementEventHandler = function (e, _type) {
		// 做target与currentTarget之间的权衡选择，首选target
		// id获取来源是否是
		// 解决小程序catch与bind时出现的事件错误
		let cur_id = MinQuery.getData(e, 'currentTarget.id'),
			cur_class = MinQuery.getData(e, 'currentTarget.dataset.mClass'),
			// 用于canvas画布的id选中
			tar_tar = MinQuery.getData(e, 'target.target'),
			tar_id = MinQuery.getData(e, 'target.id');
		// 不管是是什么类型的事件，均通过currentTarget是进行事件触发标示，避免target事件触发导致无对应处理方法时，出现调用currentTarget事件方法
		let tid = cur_id,
			tcs = cur_class;
		//用于解决Canvas画布的id选择
		if (!("currentTarget" in e)) {
			tid = !!tid ? tid : tar_id ? tar_id : tar_tar;
		}
		// event对象扩展
		if (e.type === "submit") MinQuery.extend(e, {
			// 设置访问formData快捷接口
			form(key) {
				if (key) {
					return MinQuery.getData(this.detail, `value.${key}`);
				} else return MinQuery.getData(this.detail, `value`);
			}
		})
		MinQuery.extend(e, {
			// 访问当前元素
			current(key) {
				let _target = !!this.currentTarget ? this.currentTarget : this.target;
				if (key) {
					return MinQuery.getData(_target, key);
				} else return _target
			},
			// 访问当前元素data属性
			data(key) {
				let dataset = this.current(`dataset`);
				if (key) return dataset[key];
				else return dataset;
			}
		})
		// 优先查询ID事件池并执行;渲染层事件触发不存在返回数据，但如果未找到对应事件处理器，则会返回[No-Event-Handler]字符串；
		let ret = tid ? eventHooks.get(`${$mq_config.selectorsBank["#"][0]}.${tid}`, `${_type}.${e.type}`, e) : "[No-Event-Handler]";
		// 如果不存在ID事件绑定则查询data-min-class绑定版
		(ret === "[No-Event-Handler]") && tcs && eventHooks.get(`${$mq_config.selectorsBank["."][0]}.${tcs}`, `${_type}.${e.type}`, e);
		//尝试去执行一个$all事件，无论元素上触发什么样的事件都会按类型进行触发
		tid && eventHooks.get(`${$mq_config.selectorsBank["#"][0]}.${tid}`, `${_type}.$all`, e);
		tcs && eventHooks.get(`${$mq_config.selectorsBank["."][0]}.${tcs}`, `${_type}.$all`, e);
	}
	
	// 存储已注册元素路径
	MinQuery.registeredElements = [];
	// elements find method
	MinQuery.find = function (selector) {
		// 跟数据查询
		if (selector.length !== 1 && selector in $mq_config.selectorsBank) {
			return MinQuery.getData($mq_config.selectorsBank[selector][0]);
		}
		// 元素按id或data-min-class查询
		let prevfix = selector[0];
		let _elarr = Array.from(selector);
		_elarr.shift();
		let elem = _elarr.join("");
		let eleType = "", eleName = "", f_elem, r_path = "";
		if (selector.length > 1 && prevfix in $mq_config.selectorsBank) {
			// 查询类型
			eleType = $mq_config.selectorsBank[prevfix][0];
			r_path = `${eleType}.${elem}`;
			f_elem = MinQuery.getData(r_path);
			eleName = elem;
		} else if (selector.length === 1 && $mq_config.selectorsBank[prevfix][0] === '$all') {
			// 查询全部
			let eles = [];
			MinQuery.each(MinQuery.registeredElements, (i, r) => {
				eles.push(MinQuery.getData(r));
			});
			return eles;
		} else {
			f_elem = MinQuery.getData(selector);
			r_path = eleName = selector;
		}
		if (f_elem) {
			return f_elem;
		} else {
			MinQuery.registeredElements.push(r_path);
			// 获取元素初始化对象
			let newEleAttr = $mq_config.getElementInitialData();
			// 元素所属类型
			newEleAttr.$selectorType = eleType;
			// 去前缀元素名称
			newEleAttr.$selectorName = eleName;
			// 初始化元素对象
			setCurrentPageData(r_path, newEleAttr);
			// 查询元素对象
			return MinQuery.getData(r_path);
		}
	};
	// page initial object
	MinQuery.$pageInitObject = pageName == 'app' ? {
		"$selectorType": "$app",
		"$selectorName": "app",
		"data": {
			"$servers": MinQuery.$servers()
		}
	} : {
		"$pageIndicator": MinQuery.pageName,
		"$selectorType": "$page",
		"$selectorName": "page",
		"data": {
			"$id": {},
			"$cs": {},
			"$window": MinQuery.extend({
				"$selectorType": "$window",
				"$selectorName": "window"
			}, $windowInfo),
			// page的data和attr属性
			"$data": {},
			"$attr": {},
			"$servers": MinQuery.$servers()
		}
	};
	// 下一步，使pageInit继承MinQuery，抽出MinQuery不在进行重复性的初始化，使用extend方法
	// Page主选择器
	let pageInit = function (selector) {
		if (!selector) {
			return this;
		}
		if ($tools.isString(selector)) {
			let _selectors = selector.split(","), multis, tar_selectorTypes = [], s = 0;
			for (; s < _selectors.length; s++) {
				let _sele = _selectors[s];
				multis = {};
				let _lowsele = _sele.toLowerCase();
				// 当前页面对象查询
				if (_lowsele === "page") {
					tar_selectorTypes.push($mq_config.selectorsBank[_lowsele][0]);
					//如果页面对象已经被初始化，则将pageInstance作为查询目标对象
					multis[0] = MinQuery.pageInstance ? MinQuery.pageInstance : MinQuery.$pageInitObject;
					multis.length = 1;
				}
				// 对APP对象查询
				else if (_lowsele == "app") {
					tar_selectorTypes.push($mq_config.selectorsBank[_lowsele][0]);
					if (MinQuery.pageName == 'app') {
						multis[0] = MinQuery.$pageInitObject;
					} else {
						// 获取app对象实例
						multis[0] = MinQuery.page('app')('app')[0];
					}
					multis.length = 1;
				}
				// 查询所有已注册元素
				else if (_sele === "*") {
					tar_selectorTypes.push($mq_config.selectorsBank[_sele][0]);
					multis = MinQuery.find(_sele);
					console.log(multis)
				}
				// 当前页面中的data附属查询
				else if (_lowsele == "window") {
					tar_selectorTypes.push($mq_config.selectorsBank[_lowsele][0]);
					multis[0] = MinQuery.find(_lowsele);
					multis.length = 1;
				} else if (_lowsele == "data") {
					tar_selectorTypes.push($mq_config.selectorsBank[_lowsele][0]);
					multis[0] = MinQuery.find(_lowsele);
					multis.length = 1;
				} else if (_sele[0] == ".") {
					tar_selectorTypes.push($mq_config.selectorsBank[_sele[0]][0]);
					multis[0] = MinQuery.find(_sele);
					multis.length = 1;
				} else if (_sele[0] == "#") {
					tar_selectorTypes.push($mq_config.selectorsBank[_sele[0]][0]);
					multis[0] = MinQuery.find(_sele);
					multis.length = 1;
				} else {
					tar_selectorTypes.push("");
					multis[0] = MinQuery.find(_sele);
					multis.length = 1;
				}
				MinQuery.merge(this, multis);
			}
			;
			this.selector = selector;
			this.selectorType = tar_selectorTypes.join(",");
			return this;
		} else if ($tools.isFunction(selector)) {
			// 执行加载函数
			// 首先运行主体注册函数
			$tools.carry(MinQuery, selector, MinQuery);
			// selector(MinQuery);
			if (MinQuery.pageName === "app") {
				MinQuery.extend(MinQuery.$pageInitObject, pageInheritEventHandlers);
				// 启动当前小程序的App初始化函数
				App(MinQuery.$pageInitObject);
			} else {
				MinQuery.extend(MinQuery.$pageInitObject, elementEventHandlers, pageInheritEventHandlers);
				// 启动当前页面的Page初始化函数，判断模式：恢复模式，则传入copy初始化数据；非恢复模式则传入源数据；
				Page(!!recoveryMode ? (MinQuery.extend(true, {}, MinQuery.$pageInitObject)) : MinQuery.$pageInitObject);
			}
			// 设置ready标示
			MinQuery.pageInjected = true;
			return MinQuery;
		}
		// 返回数据源的MinQuery封装对象
		return MinQuery.makeArray(selector, this);
	}
	// 原型拷贝
	pageInit.prototype = MinQuery.prototype;
	// 样式操作
	MinQuery.extend($tools.styleController);
	// 元素框架内部访问属性集合
	MinQuery.registerInherentKey({
		"$__priv_keys__": "To cache the element private options!"
	});
	// 用于操作元素的私有属性方法，此设置不参与视图层更新操作
	let elem_priv = {
		priv_keys: "$__priv_keys__",
		// 获取时，允许传入一个预设值，当获取的数据不存在的时候进行预设。
		get(ele, _type, value, arrPush) {
			let cur_priv = MinQuery.getData(ele, `${this.priv_keys}.${_type}`);
			//将文设置webviewId的context对象设置当前的webviewid
			if ($tools.type(cur_priv) == 'object' && cur_priv.hasOwnProperty('webviewId') && $tools.isUndefined(cur_priv.webviewId)) {
				cur_priv.webviewId = MinQuery.pageInstance.__wxWebviewId__;
				console.info(cur_priv.webviewId);
			}
			return !!cur_priv ? cur_priv : !!value ? this.set(ele, _type, value, arrPush) : undefined;
		},
		// 设置数据并返回设置的数据
		set(ele, _type, value, arrPush) {
			if (ele) {
				!ele[this.priv_keys] && (ele[this.priv_keys] = {});
				if (arrPush) {
					!ele[this.priv_keys][_type] && (ele[this.priv_keys][_type] = []);
					ele[this.priv_keys][_type].push(value);
				} else {
					ele[this.priv_keys][_type] = value;
				}
				return value;
			}
		},
		// 访问或设置数据
		access(ele, _type, key, value) {
			if (ele) {
				let curPriv = !ele[this.priv_keys] ? (ele[this.priv_keys] = {}) : ele[this.priv_keys];
				let curType = !curPriv[_type]
				if (curType) {
					if ($tools.isPlainObject(curType) && !!key) {
						!!value ? (curType[key] = value) : curType = key;
					} else if (MinQuery.isArray(curType)) {
						!!key && !value ? curType.push(key) : !!key && !!value ? curType.push({
							[key]: value
						}) : null;
					}
					return curType;
				}
			}
		},
		clear(ele, _type) {
			if (ele) {
				MinQuery.dataProcessor(ele, `${this.priv_keys}.${_type}`, null);
			}
		}
	}
	MinQuery.extend({
		timeOut(call, delay, still) {
			return setTimeout(function () {
				if (!!this.still || !this.still && MinQuery.isReady) {
					$tools.isFunction(this.call) && $tools.carry(null, this.call);
				}
			}.bind({
				call: call,
				// 标识是否检测ready字段
				still: still
			}), delay);
		}
	});
	// 公用元素属性访问器
	MinQuery.fn.extend({
		/**
		 * _type String 【必填】 属性名称
		 * handler Function
		 * 【可选】自定义操作方法，接收四个参数：ele_data_path[元素数据全路径]、ele_data[元素数据]、key[设置的数据键]、value[设置的数据键值];此方法会进行循环调用，this对象指向当前处理的元素数据。
		 * handler函数处理后的返回值可带两个指令性标示，分别是： handler().$__returns__ //需要返回的内容 handler().$__force_return__
		 * //强制返回$__returns__中的内容 handler().$__force_continue__  //强制忽略后续执行，并进入下一个循环
		 *
		 * key String 【必填】键名称
		 * value Anytype 【必填】 键值数据
		 */
		eleAttrAccess(_type, handler, key, value) {
			let i = 0, len = this.length, ele;
			!$tools.isFunction(handler) && (handler = function () {
			});
			for (; i < len;) {
				ele = this[i++];
				let _path = `${ele.$selectorType}.${ele.$selectorName}.${_type}${$tools.isString(key) ? ('.' + key) : ''}`,
					_eledt = ele[_type];
				if (ele.$selectorName === "page") {
					_path = `${_type}.${$tools.isString(key) ? ('.' + key) : ''}`;
					_eledt = ele.data[_type];
				} else if (MinQuery.pageName !== 'app' && ele.$selectorName === "app") {
					// 仅针对page页面查询app元素进行修改
					_eledt = MinQuery.page('app').$pageInitObject.data;
					key = _path;
				}
				// 执行自定义处理器
				let result = handler.call(ele, _path, _eledt, key, value);
				// 强制进行数据返回
				if (!!result && result.$__force_return__) return result.$__returns__;
				// 强制忽略后续执行，并进入下一个循环
				if (!!result && result.$__force_continue__) continue;
				if ($tools.isString(key)) {
					if (!MinQuery.isUndefined(value)) setCurrentPageData(_path, value);
					else {
						return _eledt ? MinQuery.getData(_eledt, key) : undefined;
					}
				} else return _eledt;
			}
			return this;
		},
		//访问私有属性，此方法不参数视图更新
		priv(key, value, arrPush){
			let i = 0, len = this.length;
			for (; i < len;) {
				let _this = this[i++];
				if ($tools.isPlainObject(key)) {
					MinQuery.each(key, function (_k, _v) {
						elem_priv.set(_this, _k, _v);
					});
				} else if (!MinQuery.isUndefined(value)) {
					elem_priv.set(_this, key,value, arrPush)
				} else {
					return elem_priv.get(_this, key)
				}
			};
			return this;
		}
	})
	// Elements Attributes Operation Methods
	MinQuery.fn.extend({
		// 设置当前元素data值,并返回操作hook，类似setData方法
		data(key, value) {
			let i = 0, len = this.length, ele;
			for (; i < len;) {
				ele = this[i++];
				let _path = `${ele.$selectorType}.${ele.$selectorName}.$data`,
					_eledt = ele.$data;
				// 设置样式属性到视图更新
				if ($tools.isString(key)) {
					if (ele.$selectorName === "page") {
						_path = `$data`;
						_eledt = ele.data.$data;
					} else if (MinQuery.pageName !== 'app' && ele.$selectorName === "app") {
						// 仅针对page页面查询app元素进行修改
						_eledt = MinQuery.page('app').$pageInitObject.data;
						key = _path;
					}
					// 如果key是字符串
					// 存在对应数据，则设置数据，返回操作hooks
					if (!MinQuery.isUndefined(value)) return setCurrentPageData(_path + `.${key}`, value);
					else {
						// 不存在则获取对应数据
						return _eledt ? MinQuery.getData(_eledt, key) : undefined;
					}
				} else if ($tools.isPlainObject(key)) {
					MinQuery.each(key,function (k,v) {
						key[_path + "." + k] = v;
						delete key[k];
					})
					// 直接设置非String数据
					return setCurrentPageData(key);
				} else {
					// 如果key和value均不存在，则返回$data数据
					return _eledt;
				}
				;
			};
			return this;
		},
		attr(key, value) {
			var _this = this;
			if ($tools.isPlainObject(key)) {
				MinQuery.each(key, function (_k, _v) {
					_this.eleAttrAccess('$attr', null, _k, _v);
				})
				return _this;
			} else return _this.eleAttrAccess('$attr', null, key, value);
		},
		/**
		 * config方法允许使用键值对形式进行配置设置，并且可在元素事件操作中进行config的调用，例如
		 * let _ele = $('.ele').config();
		 *
		 */
		config(key, value) {
			var _this = this;
			if ($tools.isPlainObject(key)) {
				MinQuery.each(key, function (_k, _v) {
					_this.eleAttrAccess('$cf', null, _k, _v);
				})
				return _this;
			} else return _this.eleAttrAccess('$cf', null, key, value);
			// return this.eleAttrAccess('$cf', function (_path, _eledata, k, v) {
			//     let _cf = elem_priv.get(this, "$cf-configuration"), plainKey = false, stringKey = false;
			//     if ((stringKey = $tools.isString(k)) && !!v || (plainKey = $tools.isPlainObject(k))) {
			//         if (plainKey) {
			//             let _nkv = {};
			//             MinQuery.each(k, (kk, kv) => {
			//                 _nkv[`${_path}.${kk}`] = kv;
			//             });
			//             k = _nkv;
			//         } else k = `${_path}`;
			//         if (!_cf) {
			//             elem_priv.set(this, "$cf-configuration", MinQuery.setData(k, v, true, true));
			//         } else {
			//             let _hook = MinQuery.setData(k, v, true, true), _hk;
			//             for (_hk in _hook) _cf[_hk] = _hook[_hk];
			//         }
			//         return {
			//             $__force_continue__: true
			//         }
			//     } else if (!k || stringKey && !v) {
			//         let operate = {};
			//         if (stringKey) operate = _cf[k].get();
			//         else {
			//             delete _cf.__length__;
			//             delete _cf.__paths__;
			//             MinQuery.each(_cf, function (confName, confHook) {
			//                 operate[confName] = function (value) {
			//                     let _hook = confHook;
			//                     if (!!value) _hook.set(value);
			//                     else return _hook.get();
			//                 };
			//             })
			//         }
			//         return {
			//             $__force_return__: true,
			//             $__returns__: operate
			//         }
			//     }
			// }, key, value);
		},
		text(text) {
			let i = 0, len = this.length, ele;
			for (; i < len;) {
				ele = this[i++];
				// 获取当前样式的JSON格式
				let _text = ele.$text;
				if (!!text) {
					_text = text;
				} else return text;
				// 设置样式属性到视图更新
				setCurrentPageData(`${ele.$selectorType}.${ele.$selectorName}.$text`, _text);
			}
			return this;
		},
		// animation delay
		delay(time) {
			if (typeof time === 'number') {
				this.each(function () {
					elem_priv.set(this, "$animation-delay", time);
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
				let _queTime = elem_priv.get(this, "$animation-queue-time");
				let _queFunc = elem_priv.get(this, "$animation-queue-func");
				// 销毁所有动画队列
				if (_queTime instanceof Array) {
					MinQuery.each(_queTime, (i, e) => {
						clearTimeout(e);
						e = null;
					})
					elem_priv.clear(this, "$animation-queue")
				}
				if (jumpToEnd) {
					// 设置当前动画结束到最后样式
					elem_priv.set(this, "$animation-to-end", jumpToEnd);
					if (_queFunc instanceof Array) {
						MinQuery.each(_queFunc, (i, f) => {
							$tools.isFunction(f) && f();
						});
						elem_priv.clear(this, "$animation-to-end")
					}
				}
			});
			return this;
		},
		// animation step setting
		animation(animateStepFunc, speed, easing, origin) {
			let config = {
				origin: "50% 50%",
				speed: 1000,
				easing: "ease",
				delay: 0
			};
			typeof speed === 'number' ? (config.speed = speed) : $tools.isPlainObject(speed) ? MinQuery.extend(config, speed) : null;
			$tools.isString(easing) && (config.easing = easing);
			$tools.isString(origin) && (config.origin = origin);
			let nativeCf = {
				transformOrigin: config.origin,
				duration: config.speed,
				timingFunction: config.easing,
				delay: config.delay
			};
			this.each(function () {
				// 获取或是创建动画
				let animateObj = this.$animationObject
					? this.$animationObject
					: (this.$animationObject = wx.createAnimation(nativeCf))
				animateStepFunc.call(animateObj, animateObj);
				// 动画当前步骤配置
				animateObj.step(nativeCf);
				// 获取通过delay预先设置的延时
				let delayTime = elem_priv.get(this, "$animation-delay") || 0;
				// 重置animationDelay
				elem_priv.set(this, "$animation-delay", 0);
				// 延时更新动画数据
				let aniQueueMet = function () {
					if (!!elem_priv.get(this.ele, "$animation-to-end")) {
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
				elem_priv.set(this, "$animation-queue-time", MinQuery.timeOut(aniQueueMet, delayTime), true);
				elem_priv.set(this, "$animation-queue-func", aniQueueMet, true);
			})
			return this;
		},
		// 基于css创建动画：stylesGetFunc[接收一个返回style字符串或是对象的匿名函数，或是直接的style字符串或对象]、speed[动画执行时长，以毫秒计算，整数形式，默认200ms]、bezier[支持贝塞尔曲线函数，字符串形式，不填则默认ease]、targetStyleArr[需要进行动画过度的目标样式数组，如：height；没有则默认all]
		cssAnimation(stylesGetFunc, speed, bezier, targetStyleArr) {
			let aniStyles;
			// 校验贝塞尔曲线函数
			let getBezier = function (str) {
				if (!$tools.isString(str)) {
					return "ease";
				}
				let _matchs = /cubic-bezier\(([^*]+)\)/g.exec(str);
				if (!!_matchs && _matchs.length === 2) {
					let _vs = _matchs[1].split(",");
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
				if ($tools.isFunction(stylesGetFunc)) {
					aniStyles = $tools.carry(null, stylesGetFunc);
				} else {
					aniStyles = stylesGetFunc;
				}
				let _transition = `transition: ${MinQuery.isArray(targetStyleArr) ? targetStyleArr.join(" ") : "all"} ${typeof speed === "number" ? speed : 200}ms ${getBezier(bezier)};`;
				// 样式继承
				aniStyles = MinQuery.styleExtend(aniStyles, _transition);
				// 获取通过delay预先设置的延时
				let delayTime = elem_priv.get(this, "$animation-delay") || 0;
				// 重置animationDelay
				elem_priv.set(this, "$animation-delay", 0);
				// 延时更新动画数据
				let aniQueueMet = function () {
					if (!!elem_priv.get(this.ele, "$animation-to-end")) {
						this.aniStyle = MinQuery.styleExtend(this.aniStyle, `transition: none;`);
					}
					MinQuery(this.ele).css(this.aniStyle, undefined, '$cssAnimation');
				}.bind({
					ele: this,
					aniStyle: aniStyles
				});
				// 将timeOut对象加入到当前元素的动画队列
				elem_priv.set(this, "$animation-queue-time", MinQuery.timeOut(aniQueueMet, delayTime), true);
				elem_priv.set(this, "$animation-queue-func", aniQueueMet, true);
			})
			return this;
		},
		// style 样式设置，支持样式字符串、单个样式键值和多样式对象设置三种写法
		// 支持$.css("color:red;height:12px");$.css("color","red"),$.css({"color": "red","height": "12px"});
		css(key, value, animationKey) {
			let i = 0, len = this.length, ele;
			for (; i < len;) {
				ele = this[i++];
				// 获取当前样式的JSON格式
				let styleJson = !!animationKey ? ele[animationKey] : ele.$style;
				// 清除cssAnimation残余的transition
				styleJson = MinQuery.styleExtend(styleJson, `transition: none;`);
				// 整合新的样式到已有样式
				if ($tools.isString(key) && $tools.isString(value)) {
					// 支持单个样式键值组写法
					styleJson = MinQuery.styleExtend(styleJson, `${key}:${value}`);
				} else if ($tools.isPlainObject(key) && !value) {
					// 支持多样式对象写法
					styleJson = MinQuery.styleExtend(styleJson, key);
				} else {
					if ($tools.isString(key) && key.indexOf(":") !== -1) {
						// 支持多样式字符串写法
						styleJson = MinQuery.styleExtend(styleJson, key);
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
			let i = 0, len = this.length, ele;
			for (; i < len;) {
				ele = this[i++];
				if ($tools.isFunction(className)) className = $tools.carry(ele, className, ele);
				return MinQuery.hasClass(ele[!hover ? "$class" : "$hoverClass"], className) !== -1;
			}
		},
		// 添加一个不存在的样式
		addClass(className, hover) {
			this.each(function () {
				if ($tools.isFunction(className)) className = $tools.carry(this, className, this);
				if (!MinQuery(this).hasClass(className)) {
					className = MinQuery.addClass(this.$class, className);
					setCurrentPageData(`${this.$selectorType}.${this.$selectorName}.${!hover ? "$class" : "$hoverClass"}`, className);
				}
			})
			return this;
		},
		// 删除一个样式
		removeClass(className, hover) {
			this.each(function () {
				if ($tools.isFunction(className)) className = $tools.carry(this, className, this);
				className = MinQuery.removeClass(this.$class, className);
				setCurrentPageData(`${this.$selectorType}.${this.$selectorName}.${!hover ? "$class" : "$hoverClass"}`, className);
			});
			return this;
		},
		// toggle样式，支持单样式和双样式之间切换
		toggleClass(classOne, classTwo, hover) {
			this.each(function () {
				if (!!classTwo) {
					if ($tools.isString(classOne) && $tools.isString(classTwo)) {
						let ho = MinQuery(this).hasClass(classOne, hover),
							ht = MinQuery(this).hasClass(classTwo, hover);
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
						MinQuery(this).addClass(classOne, hover);
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
	// 组件操作，组件方法几乎不能进行链式调用。
	MinQuery.fn.extend({
		/**
		 * 元素Canvas接口
		 * @param [prevContext] PlainObject 预先创建的Canvas context对象
		 * @param [extraMovementCalls] Functions 不限数量的动作处理方法
		 * @return {*}
		 */
		canvas(prevContext, extraMovementCalls) {
			let i = 0, len = this.length, ele, cobj = {};
			let args = $tools.slice.call(arguments);
			if ($tools.isPlainObject(args[0])) {
				args = args.slice(1);
				if (!(prevContext.hasOwnProperty('canvasId') && prevContext.hasOwnProperty("actions") && prevContext.hasOwnProperty("path"))) {
					prevContext = null;
				}
			} else {
				prevContext = null;
			}
			for (; i < len;) {
				ele = this[i++];
				let cid = ele.$selectorName,
					// 预先获取一下当前元素的canvas对象
					context = elem_priv.get(ele, "$canvas-context");
				// 当创建了canvas动作时
				if (prevContext) {
					// 当只创建了canvas上下文时，直接返回上下文
					context = elem_priv.get(ele, "$canvas-context", prevContext);
					// 如果存在额外的动作操作函数，则执行
					$tools.each(args, function (i, fn) {
						if ($tools.isFunction(fn)) {
							$tools.carry(context, fn, context)
						}
					});
					if (!!context.canvasId) context.draw();
					else wx.drawCanvas({
						canvasId: cid,
						actions: context.getActions() // 获取绘图动作数组
					});
				} else {
					// 当通过原型方法创建时，则开始绘制
					context = !!context ? context : elem_priv.get(ele, "$canvas-context", wx.createCanvasContext(cid));
					$tools.each(args, function (i, fn) {
						if ($tools.isFunction(fn)) {
							$tools.carry(context, fn, context)
						}
					});
					context.draw();
				}
				// 每次均返回context上下文，便于自定义使用外部方法进行画布的编辑工作
				if (len > 1) cobj[ele.$selectorName] = context;
				else return context;
			}
			if ($tools.isEmptyObject(cobj))
				return this;
			else return cobj;
		},
		video() {
			let i = 0, len = this.length, ele, cobj = {};
			for (; i < len;) {
				ele = this[i++];
				let vid = ele.$selectorName,
					context = MinQuery.video.call(ele, vid);
				// 每次均返回context上下文，便于自定义使用外部方法进行画布的编辑工作
				if (len > 1) cobj[ele.$selectorName] = context;
				else return context;
			}
			if ($tools.isEmptyObject(cobj))
				return this;
			else return cobj;
		},
		audio(src) {
			let i = 0, len = this.length, ele, cobj = {};
			for (; i < len;) {
				ele = this[i++];
				let vid = ele.$selectorName,
					context = elem_priv.get(ele, "$audio-context", wx.createAudioContext(vid));
				context.__proto__.start = function (tick) {
					this.seek($tools.isNumeric(tick) ? tick : 0);
					this.play();
				}
				if ($tools.isString(src)) {
					src = $tools.autoMendServer(src, 'audioServer');
					context.setSrc(src);
				}
				// 每次均返回context上下文，便于自定义使用外部方法进行画布的编辑工作
				if (len > 1) cobj[ele.$selectorName] = context;
				else return context;
			}
			if ($tools.isEmptyObject(cobj))
				return this;
			else return cobj;
		},
		Map() {
			let i = 0, len = this.length, ele, cobj = {};
			for (; i < len;) {
				ele = this[i++];
				let vid = ele.$selectorName,
					context = MinQuery.Map.call(ele, vid);
				// 每次均返回context上下文，便于自定义使用外部方法进行画布的编辑工作
				if (len > 1) cobj[ele.$selectorName] = context;
				else return context;
			}
			if ($tools.isEmptyObject(cobj))
				return this;
			else return cobj;
		}
	});
	// 创建独立canvas画布对象
	MinQuery.extend({
		/**
		 * canvas 作用域创建方法
		 * @param [canvasId] String 已有的canvas-id
		 * @param [contextMovementCalls] Function 一些动作方法
		 * @return {*}
		 */
		canvas(canvasId, contextMovementCalls) {
			var args = $tools.slice.call(arguments);
			if ($tools.isString(args[0])) {
				args = args.slice(1);
			} else canvasId = null;
			//暂存canvas上下文
			let priv_context_path = `$canvas-context-${!!canvasId ? canvasId : MinQuery.now()}`;
			let current_context = elem_priv.get(this, priv_context_path, !!canvasId ? wx.createCanvasContext(canvasId) : wx.createContext());
			//支持多个动作函数
			$tools.each(args, function (i, fn) {
				if ($tools.isFunction(fn)) {
					$tools.carry(current_context, fn, current_context)
				}
			});
			return current_context;
		},
		video(videoId) {
			if (!$tools.isString(videoId)) return;
			let context = elem_priv.get(this, "$video-context", wx.createVideoContext(videoId));
			context.send = function (message) {
				this.sendDanmu({
					text: message,
					color: MinQuery.randomColor()
				})
			};
			return context
		},
		audio(audioId) {
			if (!$tools.isString(audioId)) return;
			let context = elem_priv.get(this, "$audio-context", wx.createAudioContext(audioId));
			context.start = function () {
				this.seek(0);
			}
			return context;
		},
		Map(mapId) {
			return elem_priv.get(this, "$Map-context", wx.createMapContext(mapId));
		},
		randomColor() {
			let rgb = [], i = 0;
			for (; i < 3; ++i) {
				let color = Math.floor(Math.random() * 256).toString(16)
				color = color.length == 1 ? '0' + color : color
				rgb.push(color)
			}
			return '#' + rgb.join('')
		}
	})
	// 用于存储当前页面所设置的数据hook对象，防止二次设置
	let __registeredDataHooks__ = {};
	let __dataHooks__ = {
		// 获取
		/**
		 * 传入的key可以是返回对象的查询字段名，也可以是全路径
		 * key [key] 或 [a.b.c]
		 */
		get(key) {
			var _key = MinQuery.type(key) == 'string' || MinQuery.type(key) == 'number' ? `.${key}` : '';
			// 多键获取
			if (MinQuery.isArray(this.__path__)) {
				var _gt, _kn = this.__hooks__;
				// 如果是多键形式，则直接进行根域查询
				if (_key.indexOf('.') != -1) {
					return MinQuery.getData(key);
				} else {
					MinQuery.each(this.__path__, function (i, pt) {
						if (_kn[i] == _key) {
							_gt = MinQuery.getData(pt);
						}
					});
					return _gt;
				}
			} else {
				// 单键获取
				return MinQuery.getData(this.__path__ + _key);
			}
		},
		// 对象操作
		// 修改当前对象中对应的键值
		set(key, value) {
			if (MinQuery.isUndefined(value)) {
				value = key;
				key = null
			}
			/**
			 * Key的设置存在漏洞，未进行标准化处理！！！
			 *
			 * 待修复：
			 * 拼接的key在数组的时候，被拼接成了dot键
			 *
			 * */
			var _key = MinQuery.type(key) == 'string' || MinQuery.type(key) == 'number' ? `.${key}` : '';
			// 多字段设置
			if (MinQuery.isArray(this.__path__) && !!_key) {
				var _kp = this.__path__;
				// 如果是多键形式，则直接进行根域数据设置
				if (_key.indexOf('.') != -1) {
					return setCurrentPageData(_key, value);
				} else {
					MinQuery.each(this.__hooks__, function (i, hn) {
						if (hn == _key) {
							setCurrentPageData(_kp[i], value);
						}
					});
				}
			} else {
				// 当前子段设置
				setCurrentPageData(this.__path__ + _key, value);
			}
			return this;
		},
		// 将当前或某一字段设置为null，或指定的值
		clear(key, _type) {
			if (!MinQuery.isUndefined(key) && MinQuery.isUndefined(_type)) {
				_type = key;
				key = null
			}
			;
			key = !!key ? `.${key}` : "";
			_type = !MinQuery.isUndefined(_type) ? _type : null;
			if (MinQuery.isArray(this.__path__)) {
				let _clear = {};
				MinQuery.each(this.__path__, function (i, pt) {
					_clear[pt + key] = _type;
				});
				setCurrentPageData(_clear);
			} else setCurrentPageData(this.__path__ + key, _type);
			return this;
		},
		// 数组操作：不支持多字段跟字段操作
		// 如果当前或某一子字段为数组形式，则可以使用此接口进行项目添加
		append(value, isBatch) {
			if (MinQuery.isUndefined(value)) {
				return;
			}
			let _path = this.__path__, _old_val = MinQuery.getData(_path), r_index;
			if (MinQuery.isArray(_old_val)) {
				// 支持传入数组继承到源素组
				if (MinQuery.isArray(value) && isBatch === true) {
					_old_val = _old_val.concat(value);
				} else {
					_old_val.push(value);
				}
				r_index = _old_val.length - 1;
				setCurrentPageData(_path, _old_val);
			}
			return r_index;
		},
		prepend(value, isBatch) {
			if (MinQuery.isUndefined(value)) {
				return;
			}
			let _path = this.__path__, _old_val = MinQuery.getData(_path), r_index;
			if (MinQuery.isArray(_old_val)) {
				if (MinQuery.isArray(value) && isBatch === true) {
					_old_val = value.concat(_old_val);
					r_index = value.length - 1;
				} else {
					_old_val.unshift(value);
					r_index = 0;
				}
				setCurrentPageData(_path, _old_val);
			}
			return r_index;
		},
		// 在数组的某一个索引后添加元素
		after(index, value, isBatch) {
			let _path = this.__path__, _old_val = MinQuery.getData(_path), r_index;
			// 仅对数组类型数据进行修改尝试
			if (MinQuery.isArray(_old_val)) {
				if (MinQuery.isArray(value) && isBatch === true) {
					let _len = _old_val.length, _bef = _old_val.slice(0, index), _af = _old_val.slice(index, _len);
					_old_val = _bef.concat(value, _af);
					r_index = _bef.length + value.length - 1;
				} else {
					_old_val.splice(index + 1, 0, value);
					r_index = index;
				}
				setCurrentPageData(_path, _old_val);
			}
			return r_index;
		},
		// 在数组的某一个索引前添加元素
		before(index, value, isBatch) {
			let _path = this.__path__, _old_val = MinQuery.getData(_path), r_index;
			// 仅对数组类型数据进行修改尝试
			if (MinQuery.isArray(_old_val)) {
				if (MinQuery.isArray(value) && isBatch === true) {
					index = index + 1;
					let _len = _old_val.length, _bef = _old_val.slice(0, index), _af = _old_val.slice(index, _len);
					_old_val = _bef.concat(value, _af);
					r_index = _bef.length + value.length - 1;
				} else {
					_old_val.splice(index, 0, value);
					r_index = index;
				}
				setCurrentPageData(_path, _old_val);
			}
			return r_index;
		},
		// 在删除某个数组中的指定元素
		remove(key, index) {
			if (MinQuery.type(key) === 'number') {
				index = key;
				key = null
			}
			let _path = this.__path__ + (!!key ? `.${key}` : ""), _old_val = MinQuery.getData(_path), r_index;
			// 仅对数组类型数据进行修改尝试
			if (MinQuery.isArray(_old_val)) {
				_old_val.splice(index, 1);
				setCurrentPageData(_path, _old_val);
				r_index = index;
			}
			return r_index;
		}
	};
	// 设置数据[keyString'设置查询的字符串'，keyValue'设置值']
	/**
	 * stayFormat Boolean 用于标识单个数据设置时，是否保留对象状态，而非返回当前当个hook
	 * detdetecteInerit Boolean 用于标识是否进行框架固有key检测，避免无意间破坏框架固有属性规则
	 */
	let setCurrentPageData = function (keyString, keyValue, stayFormat, detecteInerit) {
		// 将数据格式统一规划为对象方式
		let i = 0, returns = {
			__path__: [],
			__length__: 0,
			__hooks__: []
		}, k, ka, ik, fk, oldValue;
		// if ($tools.isString(keyString) && !!keyValue) {
		if ($tools.isString(keyString)) {
			keyString = {
				[keyString]: keyValue
			}
		} else if (!MinQuery.isUndefined(keyValue)) {
			detecteInerit = stayFormat;
			stayFormat = keyValue;
		}
		if (!$tools.isPlainObject(keyString))
			return;
		// 限制开发者直接修改框架固有管理对象属性，导致管理出现混乱
		for (k in keyString) {
			if (MinQuery.trim(k) == "")
				return;
			ka = k.split(".");
			i++;
			if (detecteInerit === true) {
				for (ik in $mq_config.inherentStaticKeys) {
					if (ka.indexOf(ik) !== -1) {
						console.error(`You can not directly to tamper with MinQuery inherent data attribute ${ik}。 Please check MinQuery attribute "inherentStaticKeys" to avoid more conflict!`);
						return undefined;
					}
				}
			}
			// 验证设置的值是否与Page实例对象上的值相同，避免框架数据篡改带来的影响
			oldValue = !!MinQuery.pageInstance ? MinQuery.getData(MinQuery.pageInstance.data, k) : MinQuery.getData(k);
			
			// 执行$watch
			detectWatchTarget(k, keyString[k], oldValue);
			
			if (oldValue === keyString[k]) delete keyString[k];
			
			// 获取操作key的最后一位，作为当前返回操作的标识
			fk = ka[ka.length - 1];
			// 若当前后缀已经被上一个数据对象占用，则直接使用全路径
			if (fk in returns) {
				fk = ka;
			}
			// 设置returns的同时挂载到dataHook上；
			returns[fk] = {
				// 操作hook的目标查询路径
				__path__: k
			}
			if (ka in __registeredDataHooks__) {
				returns[fk] = __registeredDataHooks__[ka];
			} else {
				MinQuery.extend(returns[fk], __dataHooks__);
				__registeredDataHooks__[ka] = returns[fk];
				// 当前返回的数据操作hook数
				returns.__length__++;
				// 数据调用名
				returns.__hooks__.push(fk);
				// 数据访问路径
				returns.__path__.push(k);
			}
		}
		;
		if (!$tools.isEmptyObject(keyString)) {
			// 如果存在page对象则将数据绑定到page对象上
			// 小程序原型方法
			!!MinQuery.pageInstance && MinQuery.pageInstance.setData(keyString);
			// 同步更新框架上的数据
			MinQuery.dataProcessor(MinQuery.$pageInitObject.data, keyString);
		}
		// 如果保持对象输出，则保持
		if (stayFormat !== true && returns.__length__ === 1) {
			returns = returns[returns.__hooks__[0]]
		} else {
			// 多个字段时，在根节点上挂载处理方法
			MinQuery.extend(returns, __dataHooks__);
		}
		// 返回一个后期操作hook，
		return returns;
	}
	let __data_watches = {};
	// 数据操作方法主体
	MinQuery.extend({
		// 加载数据解析引擎
		dataProcessor: $tools.dataEngine,
		/**
		 * 获取当前页面数据或指定数据
		 * @param queryObj 可选 指定数据源
		 * @param keys String 获取的键
		 * @return {*} 返回对应数据
		 */
		getData(queryObj, keys) {
			if (typeof queryObj === "string") {
				keys = queryObj;
				queryObj = MinQuery.$pageInitObject.data;
			}
			;
			let res = MinQuery.dataProcessor(queryObj, keys);
			return res;
		},
		/**
		 * 设置键值数据，保证Page数据与框架数据的同步性    此接口主要供给插件访问接口
		 * @param keyString String | Object 键
		 * @param keyValue AnyType 值
		 * @param stayFormat Boolean
		 * @param forceAccess Boolean
		 * @return {*} OperationHooks
		 */
		setData(keyString, keyValue, stayFormat, forceAccess) {
			if ($tools.isString(keyString) && MinQuery.isUndefined(keyValue)) {
				// setData Hook 访问器，可在访问的同时设置一次当前数据Hook的值
				let _hook = __registeredDataHooks__[keyString];
				if (_hook) {
					return _hook;
				} else return undefined;
			}
			
			// 修改并使用Page实例对象中的setData原生方法同步数据
			return setCurrentPageData(keyString, keyValue, !!stayFormat ? stayFormat : false, MinQuery.type(forceAccess) === "boolean" ? !forceAccess : true);
		},
		/** 用于检测数据变化，接收一个查询key组成的字符串和一个改变触发匿名处理函数;
		 *  @param: fuzzy 参数为可选参数,类型为Boolean。设置为true时则对key字符串进行模糊匹配，而非绝对匹配
		 */
		watch(watchDataKey, watchCall, fuzzy) {
			if (!watchDataKey) return;
			if ($tools.isPlainObject(watchDataKey) && watchDataKey.__path__) {
				watchDataKey = watchDataKey.__path__;
			}
			//暂存监视器
			__data_watches[watchDataKey] = {
				path: watchDataKey,
				call: watchCall,
				isFuzzy: fuzzy
			}
		},
		
	})
	/**
	 * 数据监视检索方法
	 * @param _path String 数据设置路径
	 * @param _newValue
	 * @param _oldValue
	 */
	let detectWatchTarget = function (_path, _newValue, _oldValue) {
		if (!_path) return;
		for (let w in __data_watches) {
			let _w = __data_watches[w];
			if (_w.isFuzzy === true) {
				_path.indexOf(_w.path) !== -1 && $tools.carry(null, _w.call, _newValue, _oldValue, _path);
			} else {
				_path === _w.path && $tools.carry(null, _w.call, _newValue, _oldValue, _path);
			}
		}
	}
	return MinQuery;
}
/**
 * 根方法
 * @param pageName String 注册页面名称，唯一
 * @param recoveryMode Boolean
 * @constructor
 */
wx.MinQuery = function (pageName, recoveryMode) {
	if (typeof pageName !== "string") {
		console.error(`MinQuery instance loader a string page name, not this:`, pageName);
		return;
	}
	// 做降级转换提高选择器准确性
	pageName = pageName.toLowerCase();
	// 检测页面是否被注册
	if (pageName in $global.$pages.__registeredPages__) {
		console.error(`The Page name [${pageName}] has been registered!`);
		return;
	}
	$global.$pages.__registeredPages__[pageName] = {
		registered: true
	};
	//预先创建，然后返回执行数据
	const _MQ = rootMinQuery(pageName, recoveryMode);
	// 若未手动自行主函数，则自动执行一次
	setTimeout(() => {
		if (!_MQ.pageInjected) {
			_MQ(() => {
				console.info('自动执行App()或Page()方法进行页面初始化！！注意：请在复杂页面逻辑的情况下调用$(()=>{})方法来执行数据和事件的绑定操作，确保事件和数据的有效注入。否则可能会因为的异步执行时差导致效应报错，或数据和事件无法正确的被注入到App()或Page()实例当中！')
			})
		}
	}, 5)
	return _MQ;
};

// 开启debug模式，开发阶段建议开启此模式，方便调试应用，并且防止异常报错导致的内存溢出和IDE崩溃现象。
wx.MinQuery.debug = function (on, errorCarry) {
	if (on) {
		$tools.debugMode = true;
	}
	// 自定义错误处理函数
	$tools.isFunction(errorCarry) && ($tools.errorHandler = errorCarry);
};

module.exports = wx.MinQuery;

