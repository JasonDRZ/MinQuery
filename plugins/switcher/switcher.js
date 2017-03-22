var switcherConfig = {
    header: {},
    body: {}
};
var currentElement = null;

var handleConfig = function (arr) {
    arr.forEach(function (s, i) {
        if (i == 0) {
            switcherConfig.header[s] = "active";
            switcherConfig.body[s] = "active";
        } else {
            switcherConfig.header[s] = "";
            switcherConfig.body[s] = "";
        }
    })
    getCurrentPages().pop().switcher = {
        trigger: function (e) {
            currentElement = e;
            console.log(e);
            getCurrentPages().pop().setData({
                switcher: switcherConfig
            })
        }
    };
    getCurrentPages().pop().setData({
        switcher: switcherConfig
    });
}

var switchActive = function (key) {
    var _h = switcherConfig.switcherHeader;
    var _b = switcherConfig.switcherBody;
    for (var h in _h) {
        h === key ? (_h[h] = "active") : (_h[h] = "");
    }
    for (var b in _b) {
        b === key ? (_b[b] = "active") : (_b[b] = "");
    }
}


exports.plugin = function (switches) {
    switches = switches ? switches : ["history", "comment"];
    handleConfig(switches);
    return {
        switch: function (ele) {
            getCurrentPages().pop().data.switcher
        }
    }
}