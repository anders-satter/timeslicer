'use strict';

/**
 * initializing the angular module
 */
angular.module('testApp')

  /**
   * 
   * @param {type} $scope
   * @param {type} TimeslicerDataFactory
   * @param {type} $filter
   * @param {type} ReportAggregationFactory
   * @returns {undefined}
   */
  .controller('TimeslicerCtrl', ['$scope', 'TimeslicerDataFactory',
    '$location', 'ReportAggregationFactory', 'Util','$state',
    function($scope, TimeslicerDataFactory, $location, ReportAggregationFactory, Util,$state) {

      /**
       * initialize all fields
       * @returns {undefined}
       */
      var init = function() {
        $scope.allItems = [];
        $scope.startdate = '2013-12-01';
        $scope.enddate = '2013-12-31';
    
      };

      $scope.input = function(){
        $state.go('input');
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


      init();
      /*
       * This is the place where we are retrieving all the information
       */
      $scope.getAllItems = function() {
        TimeslicerDataFactory.getAllItemsHttp($scope.startdate, $scope.enddate)
          .then(function(ret) {
            //console.log(ret.status);
            /*
             * 
             * calculate total sum of minutes
             */
            var totalSum = ReportAggregationFactory.summarizeTimes(ret.data,
              function(item) {
                return item.duration;
              });

            /*
             * the list of all projects for a time period and the sum of time
             * for each project
             */
            var projectTimeList = ReportAggregationFactory
              .getProjectList(ret.data, function(item) {
                return item.project;
              },
                function(item) {
                  return item.duration;
                }).itemList;

            var presentationList = [];
            angular.forEach(projectTimeList, function(projItem) {
              /*
               * first we push the project name and totals
               */
              presentationList.push({
                name: projItem.name,
                dur: Util.time.mtsToFracHours(projItem.sum),
                perc: Util.time.percent(projItem.sum, totalSum)
              });
              /*
               * Fetch all actitvites for this project
               */
              var activities = ReportAggregationFactory.
                getActivities(ret.data, projItem.name);
              angular.forEach(activities.activityList, function(actItem) {
                /*
                 * then we push each activity to the resultList
                 */
                presentationList.push({
                  name: '--> ' + actItem.name,
                  dur: Util.time.mtsToFracHours(actItem.sum),
                  perc: Util.time.percent(actItem.sum, totalSum)
                });
              });
            });
            /*
             * add to total to the presentation list
             */
            presentationList.push({
              name: 'Total',
              dur: Util.time.mtsToFracHours(totalSum),
              perc: Util.time.percent(totalSum, totalSum)
            });

            $scope.resultList = presentationList;



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
