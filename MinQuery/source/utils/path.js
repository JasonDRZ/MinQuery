/**
 * Created by JasonD on 17/5/18.
 */
let $tools = require('tools');
let $global = require('../global/index');

// 检查是否存在http或https或wss协议头
const hasHttp_sPrefix = function (target) {
	if ($tools.isString(target)) {
		// 全路径文件匹配/^((http):\/\/[\w\/\.]*)?\w+\.{1}[a-z]+$/
		let _ishttp = /^(http):\/\/[\w\/\.]*?\w+/.test(target),
			_ishttps = /^(https):\/\/[\w\/\.]*?\w+/.test(target),
			_iswss = /^(wss):\/\/[\w\/\.]*?\w+/.test(target);
		if (_ishttp || _ishttps || _iswss) {
			return true;
		}
	} else return false;
}
// 允许可发直接数据页面的名称即可访问页面，而非输入全路径。
/**
 * 允许你传入这样的页面路径：pageName, /pageName，./pagePath/to/pageName?q=1
 * 全路径不被处理：../pageName, ../path/pageName,../../path/pageName
 * @param url
 * @return {*}
 */
const autoMendLocalPath = function (url) {
	if ($tools.isString(url)) {
		let _isFullPath = /^..\//.test(url), _needToFix = url[0] !== '!';
		//只对非全路径和需要进行补全的路径进行处理
		if (!_isFullPath && _needToFix) {
			let _hasSlash = url.indexOf('/') !== -1,
				_splitPath = url.split('/'),
				_pathLastSplit = _splitPath.pop().split('?'),
				_query = _pathLastSplit[1];
			//将最后一位的query字段进行抽离
			_splitPath.push(_pathLastSplit[0]);
			//去掉空路径和单点路径
			_splitPath.filter(function (pa, i) {
				return $tools.trim(pa) !== '' || $tools.trim(pa) !== '.';
			});
			//定位到同一主目录的页面
			if (_splitPath.length == 1) {
				url = '../' + _splitPath[0] + '/' + _splitPath[0] + (!!_query ? ('?' + _query) : '');
			} else {
				url = '../' + _splitPath.join('/') + (!!_query ? ('?' + _query) : '')
			}
			;
		}
		// 如果不需要补全则删掉第一位的感叹号
		!_needToFix && (url = url.substr(1));
	}
	return url;
};

// 自动分析链接中是否存在http或https协议头开始的路径，如果存在则认为是全路径，直接返回；如果不存在，则根据需求添加本地设置的响应服务器路径。
const autoMendServer = function (url, serverType) {
	let _server = $global.$servers.serverHook.get(serverType, '');
	if ($tools.isString(url)) {
		// 取消链接的补全
		let _needToFix = url[0] !== '!';
		// 如果不需要补全则删掉第一位的感叹号
		!_needToFix && (url = url.substr(1));
		if (_needToFix) {
			if (!hasHttp_sPrefix(url)) {
				if ($tools.trim(url) === '') {
					url = _server;
				} else {
					_server = Array.from(_server);
					url = Array.from(url);
					let _server_end_is_slash = _server[_server.length - 1] === '/';
					if (_server_end_is_slash) {
						url = url[0] !== '/' ? (_server.join('') + url.join('')) : (url.shift(), _server.join('') + url.join(''));
					} else {
						url = url[0] !== '/' ? (_server.join('') + '/' + url.join('')) : (_server.join('') + url.join(''));
					}
				}
			}
		}
	}
	return url;
}

module.exports = {
	autoMendServer,
	autoMendLocalPath
}