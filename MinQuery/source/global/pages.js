/**
 * Created by JasonD on 17/5/18.
 */
// 页面MQ对象存储器，仅在页面被load后才加载到此对象上，unload后卸载相应页面对象
// 获取/打开打开的页面MQ实例对象
const $pages = {
	// 页面标示，用于存储对应页面的MinQuery对象，防止二次注册页面
	__registeredPages__: {},
	//存储页面的实例对象数据
	__loadedInstances__: {},
	//获取对应页面的对象或是数据【仅能是已经打开的页面】
	get(pageName) {
		if (pageName) {
			if (pageName in this.__loadedInstances__ && this.__loadedInstances__[pageName].isReady) {
				return this.__loadedInstances__[pageName];
			} else {
				return undefined;
			}
		} else {
			return this.__loadedInstances__;
		}
	},
	set(pageName, tMQ) {
		if (pageName) {
			if (!!tMQ && !!tMQ.expando && pageName in this.__loadedInstances__) {
				console.error("Page Loaded instance can not be registered twice!", pageName);
				return;
			}
			if (tMQ === null) {
				delete this.__loadedInstances__[pageName];
			} else if (!!tMQ.expando) {
				this.__loadedInstances__[pageName] = tMQ;
			}
		}
	}
};

module.exports = $pages;