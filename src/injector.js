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
  
  var loadModule = function (moduleName) {
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
  };

  var invoke = function (fn, self, locals) {
    var args = [];
    var annotateArray = annotate(fn);
    for (var i = 0; i < annotateArray.length; i++) {
      var injectItem = annotateArray[i];
      if (typeof injectItem !== 'string') {
        throw 'can not inject non string into fn';
      }
      if (locals && locals.hasOwnProperty(injectItem)) {
        args[i] = locals[injectItem];
      } else {
        args[i] = cache[injectItem];
      }
    }
    if (typeof fn !== 'function') {
      fn = fn[fn.length - 1];
    }
    return fn.apply(self, args);
  };

  var FN_ARGS = /^function\s*\(([^\)]*)\)/m;
  var FN_ARG = /\s*(\S+)\s*/;
  var annotate = function (fn) {
    if (typeof fn === 'function') {
      if (fn.$inject) {
        return fn.$inject;
      } else if (!fn.length) {
        return [];
      } else {
        var fnArgsString = fn.toString().match(FN_ARGS)[1];
        var resultArray = fnArgsString.split(',');
        for (var i = 0; i < resultArray.length; i++) {
          resultArray[i] = resultArray[i].match(FN_ARG)[1];
        };
        return resultArray;
      }
    } else {
      return fn.slice(0, fn.length - 1);
    }
  };

  for (var i = 0; i < modules.length; i++) {
    loadModule(modules[i]);
  }
  return {
    has: function (name) {
      return cache.hasOwnProperty(name);
    },
    get: function (name) {
      return cache[name];
    },
    invoke: invoke,
    annotate: annotate
  };
}