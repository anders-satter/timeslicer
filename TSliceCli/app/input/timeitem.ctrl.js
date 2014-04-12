angular.module('testApp').controller('InputTimeItemCtrl',['$scope', 'Util',
  'InputFactory','$state','TimeslicerDataFactory',
  function($scope, util, inputFactory, $state, TimeslicerDataFactory){
    $scope.currentDate = inputFactory.getCurrentDate();
    $scope.currentProject = inputFactory.getCurrentProject();
    $scope.currentActivity = inputFactory.getCurrentActivity();
    $scope.currentStartTime = inputFactory.getCurrentStartTime();    
    $scope.currentTime = inputFactory.getCurrentTime();
    
    
    
    $scope.save = function() {
      inputFactory.setCurrentProject($scope.currentProject);
      inputFactory.setCurrentActivity($scope.currentActivity);
      inputFactory.setCurrentStartTime($scope.currentStartTime);
      /*
       * 
       */
      TimeslicerDataFactory.postTimeItem();
      /*
       * after saving reset the starttime with the current endtime
       */
      inputFactory.setCurrentStartTime($scope.currentTime);      
      $state.go('input');
    };
    $scope.cancel = function() {
      $state.go('input');
    };
}]);