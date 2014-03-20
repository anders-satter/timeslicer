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
      
      /**
       * initialize all fields
       * @returns {undefined}
       */
      var init = function() {
        $scope.allItems = [];
        $scope.startdate = '2013-12-01';
        $scope.enddate = '2013-12-31';
        $scope.totalSum = "0";
        //$scope.startdate = $filter('date')(new Date(), 'yyyy-MM-dd');
        //$scope.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.projectList = [];
        $scope.projectTimeList = [];
        $scope.activityTimeList = [];
      };
      
      /**
       * plot the data to the page
       * project1 sum (%ofTotal)
       * -> activity1 sum, (%ofProject, %ofToal)
       * -> activity2 sum, (%ofProject, %ofToal)
       * ..
       * project2 sum, (%ofTotal)
       * -> activity1 sum (%ofProject, %ofToal)
       * -> activity2 sum (%ofProject, %ofToal)
       * ..
       * Total sum
       * 
       * @returns {undefined}
       */
      
      var writeTimeSumData = function(){
        
      };
      
      
      init();
      /*
       * This is the place where we are retrieving all the information
       */
      $scope.getAllItems = function() {
        TimeslicerFactory.getAllItemsHttp($scope.startdate, $scope.enddate)
          .then(function(ret) {
            //console.log(ret.status);
            $scope.totalSum = ReportAggregationFactory.summarizeTimes(ret.data, 
              function(item){return item.duration;});            
            
           /*
             * the list of all projects for a time period and the summ of time
             * for each project
             */
            $scope.projectTimeList = ReportAggregationFactory
              .getProjectList(ret.data, function(item){return item.project;}, 
            function(item){return item.duration;}).itemList;
            
           /*
             * get activities for each project 
             */
            
           // $scope.activityTimeList = ReportAggregationFactory
           //   .getProjectActivityList(ret.data, function(item){return item.project+item.activity;}, 
           // function(item){return item.duration;}).itemList;
            
           /*
            * get all projects
            */
            $scope.activityTimeList = ReportAggregationFactory
              .getProjectNameList(ret.data, function(item)
                {return item.project;});
           
           
            /*
             * get alla items for a project
             */
//            $scope.activityTimeList = ReportAggregationFactory
//              .getActivities(ret.data, "Team TDE" );
            
            /*
             * plot all data
             */
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
