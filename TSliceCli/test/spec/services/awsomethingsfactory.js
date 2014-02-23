'use strict';

describe('Service: awsomeThingsFactory', function () {

  // load the service's module
  beforeEach(module('testApp'));

  // instantiate service
  var awsomeThingsFactory;
  beforeEach(inject(function (_awsomeThingsFactory_) {
    awsomeThingsFactory = _awsomeThingsFactory_;
  }));

  it('should do something', function () {
    expect(!!awsomeThingsFactory).toBe(true);
  });

});
