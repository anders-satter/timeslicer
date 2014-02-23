'use strict';

// Here we attach this controller to our testApp module

angular.module('testApp')
  // The controller function let's us give our controller a name: MainCtrl
  // We'll then pass an anonymous function to serve as the controller
  //awsomeThingsFactory is a factory which is placed in the
  .controller('MainCtrl', function($scope, awsomeThingsFactory) {
    // Using AngularJS dependency injection, we've injected the $scope variable
    // Anything we attach to scope will be available to us in the view.
    function init() {
      $scope.awesomeThings = awsomeThingsFactory.awesomeThings();
    }

    init();
  });
