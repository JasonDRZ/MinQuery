/**
 * Created by JasonD on 17/5/18.
 */
let $tools = require('../utils/tools');
const $pages = require('pages');

// 全局数据配置，一般用于设置访问服务器地址等
let serverHook = {
	__configurations__: {},
	// 设置
	set(key, value) {
		$tools.type(key) === 'number' && (key = key.toString());
		if ($tools.isPlainObject(key)) {
			$tools.extend(this.__configurations__, key);
		} else if ($tools.isString(key) && !$tools.isUndefined(value)) {
			this.__configurations__[key] = value;
		}
	},
	get(key, preset) {
		if ($tools.isString(key)) {
			return key in this.__configurations__ ? this.__configurations__[key] : preset ? (this.__configurations__[key] = preset) : undefined;
		} else {
			return preset;
		}
	}
};

// 设置公共的ajax请求服务器地址
// 设置Socket服务器地址
// 设置upLoadFile服务器地址
// 设置downloadFile服务器地址
// 设置imageServer图片服务器地址
// 设置audioServer音频服务器地址
// 设置videoServer视频服务器地址
const _serverTypes = 'ajaxServer,socketServer,uploadServer,downloadServer,imageServer,imageLocal,audioServer,videoServer'.split(',');
$tools.each(_serverTypes, function (i, k) {
	serverHook.set(k, '');
});

// 单个、批量设置服务器地址，或单个，全部服务器地址设置信息获取
const configServers = function (serverName, serverAddress) {
	if ($tools.isPlainObject(serverName)) {
		$tools.each(serverName, function (sname, saddress) {
			if ($tools.isString(saddress)) {
				serverHook.set(sname, saddress);
			}
		})
	} else if ($tools.isString(serverName)) {
		if ($tools.isString(serverAddress)) {
			serverHook.set(serverName, serverAddress);
		} else {
			return serverHook.get(serverName);
		}
	}
	let _servers = {};
	// 获取所有可设置的服务器地址字段
	$tools.each(_serverTypes, function (i, st) {
		_servers[st] = serverHook.get(st);
	});
	// 更新所有已注册页面中的服务器地址设置，检测是否为更新服务项，否则将出现死循环调用，导致内存溢出。
	!!serverName && $tools.each($pages.get(), function (pname, pcontext) {
		pcontext.setData('$servers', _servers);
	})
	return _servers;
};

module.exports = {
	configServers,
	serverHook
}