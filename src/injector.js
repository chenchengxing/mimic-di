function createInjector (modules) {
  var cache = {};
  var loadedModules = {};
  var $provide = {
    constant: function (name, value) {
      if (name === 'hasOwnProperty') {
        throw 'can not register constant with name hasOwnProperty';
      }
      cache[name] = value;
    }
  }
  for (var i = 0; i < modules.length; i++) {
    loadModule(modules[i]);
  }
  function loadModule (moduleName) {
    if (!loadedModules.hasOwnProperty(moduleName)) {
      loadedModules[moduleName] = true;
      var module = angular.module(moduleName);
      if (module.requires.length) {
        for (var j = 0; j < module.requires.length; j++) {
          loadModule(module.requires[j]);
        }
      }
      var invokeQueue = module._invokeQueue;
      for (var i = 0; i < invokeQueue.length; i++) {
        var method = invokeQueue[i][0];
        $provide[method].apply(null, invokeQueue[i][1]);
      };
    }
  }
  return {
    has: function (name) {
      return cache.hasOwnProperty(name);
    },
    get: function (name) {
      return cache[name];
    },
    invoke: function (fn, self, locals) {
      var args = [];
      for (var i = 0; i < fn.$inject.length; i++) {
        var injectItem = fn.$inject[i];
        if (typeof injectItem !== 'string') {
          throw 'can not inject non string into fn';
        }
        if (locals && locals.hasOwnProperty(injectItem)) {
          args[i] = locals[injectItem];
        } else {
          args[i] = cache[injectItem];
        }
      }
      return fn.apply(self, args);
    }
  };
}