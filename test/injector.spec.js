
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

});