'use strict';

angular.module('testApp').factory('TimeslicerFactory', ['$http', function($http){
		var s = {};
		s.allItems = function(onerror, onsuccess){
      $http.get('/timeslicer/allItems').
			   success(function(data, status, headers, config) {
          /*
          The data is fetched and return in the callback
           */
          onsuccess(data, status);
        }).
			   error(function(data, status, headers, config) {
			    window.console.log(data);
			    window.console.log(status);
          onerror(data, status);
			  });
		};
		return s;
	}]);

/**
 * initializing the angular module
 */
angular.module('testApp')
    .controller('TimeslicerCtrl', function ($scope, TimeslicerFactory) {
        $scope.allItems = [];
        /* In the rest factory we will insert a function
         * that retrieves the data
         */
        var fetchDataFunction = function(data, status){
          $scope.allItems = data;
          //console.log("status: " + status);
        };
        var onError = function(data,status){
          console.log('Error: status: ' + status);
          console.log('Error: data: ' + data);
        };
        TimeslicerFactory.allItems(onError, fetchDataFunction);
      });











