'use strict';


angular.module('testApp').factory('restFactory', ['$http', function($http){
		var s = {};
		s.touch = function(fetchData){
      $http.get('/users/allUsers').
      //$http.get('/TDE_DAP_Portal_REST_WEB/api/v1/engagement/overview').
			   success(function(data, status, headers, config) {
          fetchData(data);
			    window.console.log(data);
			    window.console.log(status);
			   }).
			   error(function(data, status, headers, config) {
			    window.console.log(data);
			    window.console.log(status);
			     });
		};
		return s;
	}]);

angular.module('testApp')
  .controller('Rest1Ctrl', function ($scope, restFactory) {
    /*
     * we will initialize this to an empty list
     * which will get populated as the server call
     * returns  
     */
    $scope.personList = [];
    /*
     * In the rest factory we will insert a function
     * that retrieves the data
     */
     restFactory.touch(function (data){
      //$scope.personList = [{"name": data.first_name, "id": data.last_name}];
      $scope.personList = data;
    });
  });
