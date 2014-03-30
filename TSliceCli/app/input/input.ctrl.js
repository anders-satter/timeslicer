angular.module('testApp').controller('InputCtrl', ['$scope', '$state',
  'TimeslicerDataFactory',
  function($scope, $state, TimeslicerDataFactory) {

    var init = function() {
      $scope.activities = [];
      $scope.projectList = [];
      $scope.selectedProject = '';
    };

    init();

    $scope.getProjects = function() {
      TimeslicerDataFactory.getAllProjects()
        .then(function(ret) {
          $scope.projectList = ret.data;
          if ($scope.projectList.length > 0) {
            $scope.selectedProject = $scope.projectList[0];
          }
        })
        .catch(function(message) {
          $scope.projectList = message;
        })
        ['finally'](function() {
        //console.log('finally function called...');
      });
    };

    $scope.fillActivities = function() {
      if ($scope.selectedProject) {
        $scope.activities = $scope.selectedProject.activityList;
        if ($scope.activities.length>0){
          $scope.selectedActivity = $scope.activities[0];
        }
      } else {
        $scope.activities = [];
      }
    };

    $scope.save = function() {
      /*
       * perform saving operations
       */
      $state.go('allItems');
    };
    $scope.cancel = function() {
      $state.go('allItems');
    };
    $scope.getProjects();

  }]);
