'use strict';

angular.module('helloApp').factory('MainFactory',['$http', function($http){
		var s = {};
		s.touch = function(){
      //function setDSID() {
          var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz',
              stringLength = 10,
              dsid = '',
              randomNumber,
              i;
          for (i = 0; i < stringLength; i++) {
              randomNumber = Math.floor(Math.random() * chars.length);
              dsid += chars.substring(randomNumber, randomNumber + 1);
          }
          document.cookie = 'dsid=' + dsid + ';path=/';
          //return dsid;
        //}
        //setDSID();        
			$http.get('/TDE_DAP_Portal_REST_WEB/api/v1/identification/touch').
      //$http.get('/TDE_DAP_Portal_REST_WEB/api/v1/engagement/overview').
			   success(function(data, status, headers, config) {
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
angular.module('helloApp').controller('Rest1Ctrl', function ($scope, MainFactory){    
    $scope.personList = [
    {
      "name": "Anders",
      "id": "p950ase"
    }, 
    {
      "name": "Lars",
      "id": "p950skw"
    },     
    {
      "name": "Grodan",
      "id": "p950gro"
    }];        
    MainFactory.touch();
  });
