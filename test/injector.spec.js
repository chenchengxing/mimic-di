
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
});