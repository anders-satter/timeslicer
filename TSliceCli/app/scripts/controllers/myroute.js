'use strict';

/*
	This is where we attach this controller to the
	testapp. There is one controller per view 
*/
angular.module('testApp')
  .controller('MyrouteCtrl', function ($scope) {
    $scope.myList = [
      'Signe',
      'crush',
      'benton'
    ];
    $scope.singleValue = 'serrano';
    $scope.singleValue = 'bertil';
  });
