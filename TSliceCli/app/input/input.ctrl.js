angular.module('testApp').controller('InputCtrl', ['$scope', '$state',
  function($scope, $state) {

    $scope.projects = ['proj1', 'proj2', 'proj3'];

    $scope.selectedProject = $scope.projects[0];
    $scope.activities = [];

    
    $scope.fillActivities = function() {
      if ($scope.selectedProject === 'proj1') {
        $scope.activities = ['p1act1', 'p1act2', 'p1act3'];
        $scope.selectedActivity = $scope.activities[0];
      } else {
        $scope.activities = [];
      }

    }





    $scope.save = function() {
      /*
       * perform saving operations
       */
      $state.go('allItems');
    };
    $scope.cancel = function() {
      $state.go('allItems');
    };
  }]);
