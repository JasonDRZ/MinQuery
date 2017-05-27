/**
 * Created by JasonD on 17/5/18.
 */
let $tools = require('tools');

// bind system info
let getSystemInfo = function (cb) {
	let sys, res = {};
	try {
		sys = wx.getSystemInfoSync();
		// res.model pixelRatio windowWidth windowHeight language version platform
		res.DPI = sys.pixelRatio;
		res.width = sys.windowWidth;
		res.height = sys.windowHeight;
		delete sys.pixelRatio;
		delete sys.windowHeight;
		delete sys.windowWidth;
		$tools.extend(res, sys);
		$tools.isFunction() && cb(res);
	} catch (e) {
		// try async model
		wx.getSystemInfo({
			success: function (sys) {
				res.DPI = sys.pixelRatio;
				res.width = sys.windowWidth;
				res.height = sys.windowHeight;
				delete sys.pixelRatio;
				delete sys.windowHeight;
				delete sys.windowWidth;
				$tools.extend(res, sys);
				$tools.isFunction(cb) && cb(res);
			}
		})
	}
};

module.exports = {
	getSystemInfo
};