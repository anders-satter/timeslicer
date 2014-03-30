angular.module('testApp').controller('ProjectCtrl', ['$scope', '$state',
  'TimeslicerDataFactory','InputFactory',
  function($scope, $state, TimeslicerDataFactory, InputFactory) {

    var init = function() {
      $scope.activities = [];
      $scope.projectList = [];
      $scope.selectedProject = '';
      $scope.selectedActivity = '';
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
      InputFactory.setCurrentProject($scope.selectedProject.name);
      InputFactory.setCurrentActivity($scope.selectedActivity);
      
      $state.go('inputTimeItem');
    };
    $scope.cancel = function() {
      $state.go('allItems');
    };
    
    
    $scope.getProjects();

  }]);
