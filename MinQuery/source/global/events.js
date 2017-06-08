/**
 * Created by JasonD on 17/5/18.
 */
let $tools = require('../utils/tools');

const $events = {
	__events__: {},
	// 分离需要执行的和不被执行的
	classifyFilter(filter, _negative, _positive) {
		if (filter instanceof Array) {
			filter.forEach((f) => {
				f = Array.from(f);
				if (f[0] === "!") {
					f.shift();
					_negative[f.join("")] = f;
				} else {
					_positive[f.join("")] = f;
				}
			})
		}
	},
	register(pname, ename, method) {
		if (!pname) return;
		if (typeof ename === "string" && typeof method === 'function') {
			if (!(pname in this.__events__)) {
				this.__events__[pname] = {
					[ename]: method
				};
			} else {
				if (!(ename in this.__events__[pname])) {
					this.__events__[pname][ename] = method;
				} else {
					// 禁止在同一页面多次注册同一全局事件
					console.error(`Can not regiser a global event name in the same page again!PageName:[${pname}];EventName:[${ename}]`);
				}
			}
		}
	},
	// 触发器为全局触发，无筛选器，data为数组形式
	trigger(pname, ename, data) {
		if (!pname) return;
		for (let pg in this.__events__) {
			if (pg in this.__events__ && ename in this.__events__[pg]) {
				// 将来源作为第一个参数传入，其他附属参数紧跟其后
				this.__events__[pg][ename].apply(null,[pname].concat(data));
			}
		}
	},
	// filter arr: 关闭对应页面的当前事件['page1','page2']，关闭除了过滤页面以外所有页面的当前事件["!page1","!page2"]
	destroy(pname, ename, filter) {
		let _off = {}, _keep = {},pg;
		if ($tools.isArray(filter)){
			//删除筛选项内的对应事件
			this.classifyFilter(filter, _keep, _off);
			for (pg in this.__events__) {
				if (pg in _keep) continue;
				if (pg in _off && ename in this.__events__[pg]) {
					delete this.__events__[pg][ename];
				}
			}
		} else if ($tools.isString(filter) && filter == 'all'){
			//删除所有页面的事件
			for (pg in this.__events__) {
				delete this.__events__[pg][ename];
			}
		} else {
			//默认值删除当前页面的事件
			for (pg in this.__events__) {
				if (pg == pname) delete this.__events__[pg][ename];
			}
		}
	}
};
module.exports = $events;