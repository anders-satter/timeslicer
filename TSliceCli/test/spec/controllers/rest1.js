'use strict';

describe('Controller: Rest1Ctrl', function () {

  // load the controller's module
  beforeEach(module('testApp'));

  var Rest1Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Rest1Ctrl = $controller('Rest1Ctrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
