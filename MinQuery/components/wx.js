// 链式注册对象
var wxHandlerRegister = {};
// 链式注册三类异步处理函数
var registerWxHandler = function (mname) {
    // 支持多次注册
    wxHandlerRegister[mname] = {
        fail: [],
        cancel: [],
        success: [],
        complete: []
    };
    return {
        fail(cb) {
            wxHandlerRegister[mname].fail = cb;
            return this;
        },
        success(cb) {
            wxHandlerRegister[mname].success = cb;
            return this;
        },
        complete(cb) {
            wxHandlerRegister[mname].complete = cb;
            return this;
        },
        cancel(cb) {
            wxHandlerRegister[mname].complete = cb;
        }
    }
}
var triggerWxHandler = function (mname, method, res) {
    if (wxHandlerRegister[mname] && wxHandlerRegister[mname][method]) {
        var targetMethod = wxHandlerRegister[mname][method];
        if (targetMethod instanceof Array) {
            for(var f in targetMethod){
                typeof targetMethod[f] === "function" && targetMethod[f](res);
            }
        } else if (typeof targetMethod === "function") {
            targetMethod(res);
        }
    }
}
// complete函数错误处理
var completeHandler = function (e, call) {
    e = e.errMsg.split(":");
    if (e[1] === "ok") {
        call && cal({ success: true }, e);
    } else {
        call && cal({ fail: e[1] }, e);
    }
};
// 已注册分类
// @界面
// --->交互反馈
// --->设置导航条
// --->导航
// @网络
// --->发起请求
// @媒体
// --->录音
// --->音频播放控制
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
// --->
var $wx = {
    // showToast
    showToast(title, icon, delay, mask, call) {
        var icons = {
            loading: "loading",
            success: "success"
        }
        if (typeof title !== "string") {
            console.error("The toast title param must be a string!");
            return "";
        } else if (typeof icon === "boolean") {
            mask = icon;
            icon = null;
        } else if (typeof delay === "boolean") {
            mask = delay;
            delay = null;
            if (!icons[icon]) {
                console.error(`Wx do not suport icon type of [${icon}]!`);
                return;
            }
        }
        wx.showToast({
            title: title,
            icon: icon ? icon : '',
            duration: delay ? delay : 2000,
            fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
            success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
            complete(e) { completeHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
        });
        return registerWxHandler("showToast")
    },
    // hideToast
    hideToast(delay) {
        setTimeout(wx.hideToast, delay ? delay : 0);
    },
    // showActionSheet
    actionSheet(items, color, call) {
        if (!items instanceof Array) {
            console.error("showActionSheet items must be an Array instance!");
            return;
        }
        wx.showActionSheet({
            itemList: items,
            itemColor: color ? color : "",
            fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
            success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
            complete(e) { completeHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
        });
        return registerWxHandler("showActionSheet")
    },
    // showModal
    modal(title, content, config, call) {
        if ((typeof title !== "string" && !this.isEmpty(title)) || typeof content !== "string") {
            console.error("The Modal title and content type must be string!", title, content);
            return;
        }
        var options = {
            showCancel: true,
            cancelText: "取消",
            cancelColor: "#000000",
            confirmText: "确定",
            confirmColor: "#3CC51F"
        }
        if (config instanceof Object) {
            this.extend(options, config);
        }
        wx.showModal({
            title: title,
            content: '这是一个模态弹窗',
            showCancel: options.showCancel,
            cancelText: options.cancelText,
            cancelColor: options.cancelColor,
            confirmText: options.confirmText,
            confirmColor: options.confirmText,
            fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
            success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
            complete(e) { completeHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
        });
        return registerWxHandler("showModal");
    },
    // setNavigationBarTitle
    navTitle(title, call) {
        if (this.isEmpty(title)) {
            console.error("setNavigationBar title must be an non-empty string！")
            return;
        }
        wx.setNavigationBarTitle({
            title: title,
            fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
            success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
            complete(e) { completeHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
        })
        return registerWxHandler("setNavigationBarTitle");
    },
    // NavigationBarLoading
    navLoading: {
        show() {
            wx.showNavigationBarLoading();
        },
        hide() {
            wx.hideNavigationBarLoading()
        }
    },
    // Navigations
    navigateTo(url, call) {
        wx.navigateTo({
            url: url,
            fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
            success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
            complete(e) { completeHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
        });
        return registerWxHandler("navigateTo");
    },
    redirectTo(url, call) {
        wx.redirectTo({
            url: url,
            fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
            success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
            complete(e) { completeHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
        });
        return registerWxHandler("redirectTo");
    },
    switchTab(url, call) {
        wx.switchTab({
            url: url,
            fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
            success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
            complete(e) { completeHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
        });
        return registerWxHandler("switchTab");
    },
    navigateBack(pageNum) {
        wx.navigateBack({
            delta: pageNum
        })
    },

    // Ajax methods
    ajax(config) {
        function request(_conf) {
            var options = {
                url: "",
                data: null,
                header: {
                    'content-type': 'application/json'
                },
                method: "get",
                dataType: "json"
            }
            this.extend(options, _conf);
            var _fail = options.fail, _success = options.success, _complete = options.complete;
            this.extend(options, {
                fail(e) { triggerWxHandler("wxRequest", "fail", e); _fail && _fail(e) },
                success(e) { triggerWxHandler("wxRequest", "success", e); _success && _success(e) },
                complete(e) { completeHandler(e, call); triggerWxHandler("wxRequest", "complete", e); _complete && _complete(e); }
            })
            // 将method值转大写
            options.method = options.method.toUpperCase();
            wx.request(options);
            // 错误方法
            return registerWxHandler("wxRequest");
        }
        return new request(config);
    },
    get: function (url, data, call) {
        if (typeof data === 'function') {
            call = data;
            data = null;
        }
        return this.ajax({
            url: url,
            data: data,
            method: "get",
            success(e) { call && call(e); }
        })
    },
    post(url, data, call) {
        return this.ajax({
            url: url,
            data: data,
            method: "post",
            success(e) { call && call(e); }
        })
    },
    // 录音控制
    startRecord(call) {
        wx.startRecord({
            fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
            success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
            complete(e) { completeHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
        })
        return registerWxHandler("startRecord");
    },
    stopRecord(delay) {
        setTimeout(wx.stopRecord, delay ? delay : 0);
    },
    // 录音播放
    playVoice(filePath, call) {
        wx.playVoice({
            filePath: filePath,
            fail(e) { triggerWxHandler(e.errMsg.split(":")[0], "fail", e) },
            success(e) { triggerWxHandler(e.errMsg.split(":")[0], "success", e) },
            complete(e) { completeHandler(e, call); triggerWxHandler(e.errMsg.split(":")[0], "complete", e) }
        })
        return registerWxHandler("startRecord");
    },
    pauseVoice(delay) {
        setTimeout(wx.pauseVoice, delay ? delay : 0);
    },
    stopVoice(delay) {
        setTimeout(wx.stopVoice, delay ? delay : 0);
    }
}

module.exports = {
    wx: $wx,
    registerWxHandler: registerWxHandler,
    triggerWxHandler: triggerWxHandler,
    completeHandler: completeHandler
}