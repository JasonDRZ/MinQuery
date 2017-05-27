/**
 * Created by JasonD on 17/5/19.
 */
let $tools = require('../utils/tools');

//模块的存储变量
let $moduleStore = [];
/**
 * 定义一个模块
 * @param moduleName String 当前模块的内容
 * @param [moduleDependencies] Array 当前模块的依赖模块
 * @param [moduleMethod] Function 模块的方法
 * @param [execDirectly] Boolean 是否直接执行当前component的方法，并获取返回值
 */
let defineModule = function (moduleName, moduleDependencies, moduleMethod, execDirectly) {
	if ($tools.isString(moduleName)) {
		if ($tools.isFunction(moduleDependencies)) {
			moduleMethod = moduleDependencies;
			moduleDependencies = [];
		}
		if (!$tools.isArray(moduleDependencies)) moduleDependencies = $tools.makeArray(moduleDependencies);
		if (moduleName in $moduleStore) {
			console.log(`You can't define a component named ${moduleName} twice,please check!`);
		} else {
			$moduleStore[moduleName] = {
				//模块名称
				name: moduleName,
				//模块方法，是否直接执行掉当前定义的模块
				method: !!execDirectly ? $tools.carry(null, moduleMethod) : moduleMethod,
				//模块依赖方法名称
				dependencies: moduleDependencies,
				//模块依赖方法返回数据,与名称一一对应，每次调用都会运行更新
				dependencies_transport: []
			}
		}
	}
};
/**
 * 模块调用
 * @param moduleName String 要调用的模块名称
 * @param componentParams
 */
let callModule = function (moduleName, moduleParams) {
	if ($tools.isString(moduleName)) {
		moduleParams = $tools.slice.call(arguments, 1);
		if (moduleName in $moduleStore) {
			let _currentModule = $moduleStore[moduleName];
			$tools.each(_currentModule.dependencies, function (i, dependencyName) {
				if ($tools.trim(dependencyName) !== '') {
					_currentModule.dependencies_transport[i] = callModule(dependencyName);
				};
			});
			let params = [].concat(_currentModule.dependencies_transport, moduleParams);
			return $tools.isFunction(_currentModule.method) ? $tools.carry.apply(null, [null, _currentModule.method].concat(params)) : _currentModule.method;
		} else {
			console.error(`The [${moduleName}] module is not defined!`)
		}
	}
}

module.exports = {
	defineModule,
	callModule
}