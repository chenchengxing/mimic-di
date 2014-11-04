function createInjector (modules) {
  var cache = {};
  var $provide = {
    constant: function (name, value) {
      if (name === 'hasOwnProperty') {
        throw 'can not register constant with name hasOwnProperty';
      }
      cache[name] = value;
    }
  }
  for (var i = 0; i < modules.length; i++) {
    var module = angular.module(modules[i]);
    loadModule(module);
  }
  function loadModule (module) {
    var invokeQueue = module._invokeQueue;
    for (var i = 0; i < invokeQueue.length; i++) {
      var method = invokeQueue[i][0];
      $provide[method].apply(null, invokeQueue[i][1]);
    };
  }
  return {
    has: function (name) {
      return cache.hasOwnProperty(name);
    },
    get: function (name) {
      return cache[name];
    }
  };
}