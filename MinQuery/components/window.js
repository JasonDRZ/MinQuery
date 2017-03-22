var getSystemInfo = function (targetObj) {
    var sys, res = {};
    try {
        sys = wx.getSystemInfoSync()
        // res.model pixelRatio windowWidth windowHeight language version platform
        res.DPI = sys.pixelRatio;
        res.width = sys.windowWidth;
        res.height = sys.windowHeight;
        res.language = sys.language;
        res.versino = sys.version;
        res.platform = sys.platform;
        res.model = sys.model;
        res.system = sys.system;
        targetObj = res;
    } catch (e) {
        // try async model 
        wx.getSystemInfo({
            success: function (sys) {
                res.DPI = sys.pixelRatio;
                res.width = sys.windowWidth;
                res.height = sys.windowHeight;
                res.language = sys.language;
                res.versino = sys.version;
                res.platform = sys.platform;
                res.model = sys.model;
                res.system = sys.system;
                targetObj = res;
            }
        })
    }
    return res;
}

module.exports = getSystemInfo;
// wx.chooseImage({
//     success: function (res) {
//         var tempFilePaths = res.tempFilePaths
//         wx.uploadFile({
//             url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
//             filePath: tempFilePaths[0],
//             name: 'file',
//             formData: {
//                 'user': 'test'
//             },
//             success: function (res) {
//                 var data = res.data
//                 //do something
//             }
//         })
//     }
// });


// var promise = function (main) {
//     var funcs = [];
//     var _returns;
//     var execFuncs = function (init, error) {
//         for (var i = 0; i < funcs.length; i++) {
//             if (i === 0) {
//                 _returns = typeof funcs[i] == "function" ? funcs[i](init, error) : undefined;
//             } else {
//                 _returns = typeof funcs[i] == "function" ? funcs[i](_returns, error) : undefined;
//             }
//         }
//     }
//     function resolve(value) {
//         execFuncs(value, null);
//     }
//     function reject(error) {
//         execFuncs(undefined, error);
//     }
//     main(resolve, reject);
//     return {
//         then(func) {
//             funcs.push(func);
//             return this;
//         }
//     }
// };

// var req = new promise(function (resolve, reject) {
//     wx.chooseImage({
//         success: function (res) {
//             var tempFilePaths = res.tempFilePaths
//             resolve(tempFilePaths);
//         }, fail: function (error) {
//             reject(error);
//         }
//     });
// });
// req.then(function(res,error){
//     res && console.log(res);
//     error && console.error(error);
//     return res ? res[0] : null;
// }).then(function(res){
//     console.log(res);
// })