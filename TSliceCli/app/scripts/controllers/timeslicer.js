'use strict';

//angular.module('testApp').factory('TimeslicerFactory', ['$http', function($http){
//		var s = {};
//		s.allItems = function(onerror, onsuccess){
//
//      $http.get('/timeslicer/allItems').
//			   success(function(data, status, headers, config) {
//          /*
//          The data is fetched and return in the callback
//           */
//          onsuccess(data, status);
//        }).
//			   error(function(data, status, headers, config) {
//			    window.console.log(data);
//			    window.console.log(status);
//          onerror(data, status);
//			  });
//		};
//		return s;
//	}]);

angular.module('testApp').factory('TimeslicerFactory', ['$resource', function($resource){
    /*
     *  What happens if this fails?;
     */
    console.log('we are in the resource function');
    return $resource('/timeslicer/allItems', {});

	}]);



/**
 * initializing the angular module
 */
angular.module('testApp')
    .controller('TimeslicerCtrl',['$scope','TimeslicerFactory',function ($scope, TimeslicerFactory) {
    $scope.allItems = [];
    /* In the rest factory we will insert a function
     * that retrieves the data
     */
    var fetchDataFunction = function(data, status){
      $scope.allItems = data;
      //console.log("status: " + status);
    };
    TimeslicerFactory.query(function(response){
      $scope.allItems = response;
    });
  }] );






//angular.module('testApp')
//  .controller('TimeslicerCtrl', function ($scope, TimeslicerFactory) {
//    $scope.allItems = [];
//    /* In the rest factory we will insert a function
//     * that retrieves the data
//     */
//    var fetchDataFunction = function(data, status){
//      $scope.allItems = data;
//      //console.log("status: " + status);
//    };
//    var onError = function(data,status){
//      console.log('Error: status: ' + status);
//      console.log('Error: data: ' + data);
//    };
//    TimeslicerFactory.allItems(onError, fetchDataFunction);
//  });



/*
  URI/URL are representing a resource, an object
  Can be a collection of things
  a collection of things


 */







