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

  describe('modules', function () {
    beforeEach(function () {
      setupModuleLoader(window);
    });

    it('allows registering a module', function() {
      var module = angular.module('app', []);
      expect(module).to.exist;
      expect(module.name).to.equal('app');
    });

    it('replaces a module when registered with same name again', function() {
      var module = angular.module('app', []);
      var module2 = angular.module('app', []);
      expect(module).to.not.equal(module2);
      expect(module).to.eql(module2);
    });

    it('attaches the requires array to registered module', function() {
      var module = angular.module('app', []);
      expect(module.requires).to.eql([]);
    });

    it('allows getting a module', function() {
      var module = angular.module('app', []);
      expect(angular.module('app')).to.equal(module);
    });

    it('throws when trying to get a nonexistent module', function() {
      expect(function () {
        angular.module('app');
      }).to.throw();
    });

    it('does not allow a module name hasOwnProperty', function() {
      expect(function () {
        angular.module('hasOwnProperty', []);
      }).to.throw();
    });

    
  });
});

