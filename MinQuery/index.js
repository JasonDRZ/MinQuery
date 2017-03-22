// components
var MinQuery = require("components/minquery");
// MinQuery.plugin("$wx",{expando:false});
module.exports = wx.MinQuery = MinQuery;

// var cloneMinQuery = function (pname) {
//     var _cloneMQ = function(){};
//     _cloneMQ.prototype = (new MinQuery).constructor;
//     _cloneMQ.prototype.indicater = pname;
//     return _cloneMQ;
// }

// // 为区分不同Page使用Symbol作为键值存储当前copy MinQuery;
// var rootMinQuery = {};

// // 绑定到wx对象上
// wx.MinQuery = {
//     load(pageName) {
//         if (!pageName) {
//             console.error("MinQuery load requires pageName for load method!");
//             return;
//         }
//         if (rootMinQuery[pageName]) {
//             console.error(`MinQuery load target name [${pageName}] has already been registered,please check!`);
//             return;
//         }
//         rootMinQuery[pageName] = cloneMinQuery(pageName);
//         return rootMinQuery[pageName];
//     }
// };
// console.info(wx)
// module.exports = wx.MinQuery;




