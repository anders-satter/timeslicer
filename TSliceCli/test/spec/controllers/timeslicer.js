'use strict';

describe('Controller: TimeslicerCtrl', function () {

  // load the controller's module
  beforeEach(module('testApp'));

  var TimeslicerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TimeslicerCtrl = $controller('TimeslicerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
