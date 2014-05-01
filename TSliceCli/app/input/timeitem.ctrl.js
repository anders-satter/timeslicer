angular.module('testApp').controller('InputTimeItemCtrl', ['$scope', 'Util',
    'InputFactory', '$state', 'TimeslicerDataFactory',
    function($scope, util, inputFactory, $state, TimeslicerDataFactory) {
        $scope.currentDate = inputFactory.getCurrentDate();
        $scope.currentProject = inputFactory.getCurrentProject();
        $scope.currentActivity = inputFactory.getCurrentActivity();
        $scope.currentStartTime = inputFactory.getCurrentStartTime();
        $scope.currentTime = inputFactory.getCurrentTime();
        $scope.currentComment = inputFactory.getCurrentComment();

        $scope.save = function() {
            inputFactory.setCurrentProject($scope.currentProject);
            inputFactory.setCurrentActivity($scope.currentActivity);
            inputFactory.setCurrentStartTime($scope.currentStartTime);
            inputFactory.setCurrentComment($scope.currentComment);

            /*
             * Fill the timeitem with info              
             */
            timeItem = {
                'startTime': inputFactory.getCurrentDate() 
                        + ' ' + inputFactory.getCurrentStartTime(),
                'endTime': inputFactory.getCurrentDate() 
                        + ' ' + inputFactory.getCurrentTime(),
                'project': inputFactory.getCurrentProject(),
                'activity': inputFactory.getCurrentActivity(),
                'comment': inputFactory.getCurrentComment()
            };

            TimeslicerDataFactory.postTimeItem(timeItem);
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