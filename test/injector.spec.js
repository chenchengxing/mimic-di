
var expect = chai.expect;
describe('injector', function() {
  beforeEach(function() {
    delete window.angular;
    setupModuleLoader(window);
  });

  it('can be created', function() {
    expect(createInjector([])).to.exist;
  });

  it('can register a constant to a module', function() {
    var module = angular.module('app', []);
    module.constant('A', 1);
    var injector = createInjector(['app']);
    expect(injector.has('A')).to.equal(true);
  });

  it('can get hold of a registered constant', function() {
    var module = angular.module('app', []);
    module.constant('A', 1);
    var injector = createInjector(['app']);
    expect(injector.get('A')).to.equal(1);
  });

  it('loads multiple modules', function() {
    var module1 = angular.module('app', []);
    var module2 = angular.module('app2', []);
    module1.constant('A', 1);
    module2.constant('B', 1);
    var injector = createInjector(['app', 'app2']);
    expect(injector.get('A')).to.equal(1);
    expect(injector.get('B')).to.equal(1);
  });

  it('loads the required modules of a module', function() {
    var module1 = angular.module('app', ['app2']);
    var module2 = angular.module('app2', ['app3']);
    var module3 = angular.module('app3', []);
    module1.constant('A', 1);
    module2.constant('B', 1);
    module3.constant('C', 1);
    var injector = createInjector(['app']);
    expect(injector.get('A')).to.equal(1);
    expect(injector.get('B')).to.equal(1);
    expect(injector.get('C')).to.equal(1);
  });

  it('loads each module once', function() {
    var module1 = angular.module('app', ['app2']);
    var module2 = angular.module('app2', ['app']);
    var injector = createInjector(['app']);
  });

  it('invoke a function with $inject', function() {
    var module = angular.module('app', []);
    module.constant('a', 1);
    module.constant('b', 2);
    var injector = createInjector(['app']);
    var fn = function (a, b) {
      return a + b;
    };
    fn.$inject = ['a', 'b'];
    expect(injector.invoke(fn)).to.equal(3);
  });

  it('invoke a function with $inject', function() {
    var module = angular.module('app', []);
    module.constant('a', 1);
    module.constant('b', 2);
    var injector = createInjector(['app']);
    var fn = function (a, b) {
      return a + b;
    };
    fn.$inject = [1, 'b'];
    expect(function () {
      injector.invoke(fn);
    }).to.throw();
  });

  it('should invoke fn with context if given', function() {
    var module = angular.module('app', []);
    module.constant('a', 1);
    var injector = createInjector(['app']);
    var obj = {
      two: 2,
      fn: function (a) {
        return a + this.two;
      }
    };
    obj.fn.$inject = ['a'];
    expect(injector.invoke(obj.fn, obj)).to.equal(3);
  });

  it('should override with locals', function() {
    var module = angular.module('app', []);
    module.constant('a', 1);
    module.constant('b', 2);
    var injector = createInjector(['app']);
    var fn = function (a, b) {
      return a + b;
    };
    fn.$inject = ['a', 'b'];
    expect(injector.invoke(fn, undefined, {b: 3})).to.equal(4);
  });

  describe('annotate', function() {
    it('return $inject', function() {
      var fn = function () {};
      fn.$inject = ['a', 'b'];
      var injector = createInjector([]);
      expect(injector.annotate(fn)).to.eql(['a', 'b']);
    });

    it('should return array annotation', function() {
      var fn = ['a', 'b', function () {}];
      var injector = createInjector([]);
      expect(injector.annotate(fn)).to.eql(['a', 'b']);
    });

    it('should return [] for non-annotated 0-arg fn', function() {
      var fn = function () {
      };
      var injector = createInjector([]);
      expect(injector.annotate(fn)).to.eql([]);
    });

    it('should return array for non-annotated n-arg fn', function() {
      var fn = function (a, b) {
      };
      var injector = createInjector([]);
      expect(injector.annotate(fn)).to.eql(['a', 'b']);
    });
  });

  it('should invoke array-annotated fn', function() {
    var module = angular.module('app', []);
    module.constant('a', 1);
    module.constant('b', 2);
    var fn = ['a', 'b', function (a, b) {
      return a + b;
    }];
    var injector = createInjector(['app']);
    expect(injector.invoke(fn)).to.equal(3);
  });

  it('should invoke non-annotated fn', function() {
    var module = angular.module('app', []);
    module.constant('a', 1);
    module.constant('b', 2);
    var fn = function (a, b) {
      return a + b;
    };
    var injector = createInjector(['app']);
    expect(injector.invoke(fn)).to.equal(3);
  });
});