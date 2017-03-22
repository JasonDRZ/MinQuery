var appEvents = {
    "launch": "onLaunch",
    "show": "onShow",
    "error": "onError",
    "hide": "onHide"
};

var $App = {
    on
}

var e = {
    onLaunch: function () {
        // Do something initial when launch.
    },
    onShow: function () {
        // Do something when show.
    },
    onHide: function () {
        // Do something when hide.
    },
    onError: function (msg) {
        console.log(msg)
    }
}