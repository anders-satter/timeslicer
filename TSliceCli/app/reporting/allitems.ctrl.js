'use strict';

/**
 * initializing the angular module
 */
angular.module('testApp')

  /**
   * 
   * @param {type} $scope
   * @param {type} TimeslicerFactory
   * @param {type} $filter
   * @param {type} ReportAggregationFactory
   * @returns {undefined}
   */
  .controller('TimeslicerCtrl', ['$scope', 'TimeslicerFactory',
    '$filter', 'ReportAggregationFactory',
    function($scope, TimeslicerFactory, $filter, ReportAggregationFactory) {
      var init = function() {
        $scope.allItems = [];
        $scope.startdate = '2013-12-01';
        $scope.enddate = '2013-12-31';
        $scope.summa = "0";
        //$scope.startdate = $filter('date')(new Date(), 'yyyy-MM-dd');
        //$scope.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.projectList = [];
        $scope.projectTimeList = [];
        $scope.activityTimeList = [];
      };
      init();
      /*
       * This is the place where we are retrieving all the information
       */
      $scope.getAllItems = function() {
        TimeslicerFactory.getAllItemsHttp($scope.startdate, $scope.enddate)
          .then(function(ret) {
            //console.log(ret.status);
          /*
          $scope.projectTimeList = ReportAggregationFactory
              .showSummarizeOnField(ret.data, function(item){return item.project;}, 
            function(item){return item.duration;});
          */
            $scope.summa = ReportAggregationFactory.summarizeTimes(ret.data);            
            $scope.projectTimeList = ReportAggregationFactory
              .getProjectList(ret.data, function(item){return item.project;}, 
            function(item){return item.duration;});
            $scope.activityTimeList = ReportAggregationFactory
              .getProjectActivityList(ret.data, function(item){return item.project+item.activity;}, 
            function(item){return item.duration;});
            $scope.allItems = ret.data;
            
          })
          .catch(function(message) {
            $scope.allItems = message;
          })
          ['finally'](function() {
          //console.log('finally function called...');
        });
      };
    }]);
