angular.module('testApp').controller('InputTimeItemCtrl',['$scope', 'Util',
  'InputFactory','$state',
  function($scope, util, inputFactory, $state){
    $scope.currentDate = inputFactory.getCurrentDate();
    $scope.currentProject = inputFactory.getCurrentProject();
    $scope.currentActivity = inputFactory.getCurrentActivity();
    
    
    $scope.save = function() {
      /*
       * write to the database
       */
      $state.go('input');
    };
    $scope.cancel = function() {
      $state.go('input');
    };
}]);