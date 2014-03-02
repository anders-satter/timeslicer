'use strict';

angular.module('testApp').factory('TimeslicerFactory', ['$resource', '$q','$http', function($resource, $q, $http) {
  /*
   *  What happens if this fails?;
   */
  //console.log('we are in the resource function - hallo!');
  //return $resource('/timeslicer/allItems', {});


  return {
    getAllItems: function(onsuccess) {
      var r = new $resource('/timeslicer/allItems', {}, {
        get: {
          isArray: true,
          method: 'GET'
        }});
      //return r.get().$promise.next(onsuccess);
      console.log("returning the callback case");
      return r.get().$promise;
    },
    getAllItemsHttp: function() {
      return $http.get('/timeslicer/allItems');
      //return s;
    }
  }
}]);


/**
 * initializing the angular module
 */
angular.module('testApp')
  .controller('TimeslicerCtrl', ['$scope', 'TimeslicerFactory', function($scope, TimeslicerFactory) {
    $scope.allItems = [];
    /* In the rest factory we will insert a function
     * that retrieves the data
     */
    //console.log(TimeslicerFactory.getAllItemsHttp());
    TimeslicerFactory.getAllItemsHttp()
      .then(function (ret){
        console.log(ret.status);
        $scope.allItems = ret.data;
      })
      .catch(function (message){
        $scope.allItems = message;
      })
      ['finally'](function(){
        console.log('finally function called');
      });


/*
    This is the resource variant
 */
//    TimeslicerFactory.getAllItems()
//      .then(function(data) {
//        $scope.allItems = data;
//      },
//      //error
//      function(error) {
//        console.log(error);
//      },
//      function() {
//        console.log("notify called");
//      }
//    )['finally'](function(mess) {
//      console.log('finally called with mess: ' + mess);
//    });
  }]);






