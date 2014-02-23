'use strict';

describe('Service: Awsomethingsservice', function () {

  // load the service's module
  beforeEach(module('testApp'));

  // instantiate service
  var Awsomethingsservice;
  beforeEach(inject(function (_Awsomethingsservice_) {
    Awsomethingsservice = _Awsomethingsservice_;
  }));

  it('should do something', function () {
    expect(!!Awsomethingsservice).toBe(true);
  });

});
