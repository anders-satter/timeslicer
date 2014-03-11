'use strict';


/**
 * initializing the angular module
 */
angular.module('testApp')
  .controller('TimeslicerCtrl', ['$scope', 'TimeslicerFactory', 
    function($scope, TimeslicerFactory) {
    $scope.allItems = [];
    $scope.startdate = '2013-12-01';
    $scope.enddate = '2013-12-31';


    /* In the rest factory we will insert a function
     * that retrieves the data
     */
    //console.log(TimeslicerFactory.getAllItemsHttp());
    $scope.getAllItems = function(){
    TimeslicerFactory.getAllItemsHttp($scope.startdate, $scope.enddate)
      .then(function (ret){
        //console.log(ret.status);
        $scope.allItems = ret.data;
      })
      .catch(function (message){
        $scope.allItems = message;
      })
      ['finally'](function(){
        //console.log('finally function called...');
      });      
    }
}]);

