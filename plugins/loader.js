var pluginLoader = function(plugin){
    var t_p = require(plugin+"/"+plugin);
    return t_p.plugin;
}

exports.load = pluginLoader;