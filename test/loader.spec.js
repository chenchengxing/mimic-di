var expect = chai.expect;

describe('setupModuleLoader', function() {

  beforeEach(function () {
    delete window.angular;
  })

  it('exposes angular on the window', function() {
    setupModuleLoader(window);
    expect(window.angular).to.exist;
  });

  it('create angular just once', function () {
    setupModuleLoader(window);
    var ng = window.angular;
    setupModuleLoader(window);
    expect(window.angular).to.equal(ng);
  });

  it('defines angular.module', function() {
    setupModuleLoader(window);
    expect(window.angular.module).to.exist;
  });

  it('should create angular.module just once', function() {
    setupModuleLoader(window);
    var module = angular.module;
    setupModuleLoader(window);
    expect(angular.module).to.equal(module);
  });
});

