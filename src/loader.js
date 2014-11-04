function setupModuleLoader (window) {
  function ensure (obj, name, factory) {
    return obj[name] = obj[name] || factory();
  }

  var angular = ensure(window, 'angular', Object);

  var modules = {};

  var createModule = function (name, requires) {
    if (name === 'hasOwnProperty') {
      throw 'hasOwnProperty is not a valid module name';
    }
    var moduleInstance = {
      name: name,
      requires: requires,
      _invokeQueue: [],
      constant: function (name, value) {
        
        moduleInstance._invokeQueue.push(['constant', [name, value]]);
      }
    };
    modules[name] = moduleInstance;
    return moduleInstance;
  };

  var getModule = function (name) {
    if (name && !modules.hasOwnProperty(name)) {
      throw 'no ' + name + ' module defines';
    }
    return modules[name];
  };

  ensure(angular, 'module', function () {
    return function (name, requires) {
      if (requires) {
        return createModule(name, requires);
      } else {
        return getModule(name);
      }
    };
  });
}