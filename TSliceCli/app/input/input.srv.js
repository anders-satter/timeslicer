angular.module('testApp').factory('InputFactory',
        ['Util', function(util) {
                var currentDate = '';
                var currentProject = '';
                var currentActivity = '';
                var currentStartTime = '';
                var currentTime = '';
                var currentComment = '';

                return {
                    setCurrentProject: function(aCurrentProject) {
                        currentProject = aCurrentProject;
                    },
                    getCurrentProject: function() {
                        return currentProject;
                    },
                    setCurrentActivity: function(aCurrentActivity) {
                        currentActivity = aCurrentActivity;
                    },
                    getCurrentActivity: function() {
                        return currentActivity;
                    },
                    getCurrentDate: function() {
                        currentDate = util.time.getDay(new Date().getTime());
                        return currentDate;
                    },
                    getCurrentStartTime: function() {
                        if (!currentStartTime){
                            currentStartTime = this.getCurrentTime();
                        }
                        return currentStartTime;
                    },
                    setCurrentStartTime: function(startTime) {
                        currentStartTime = startTime;
                    },
                    getCurrentTime: function() {
                        currentTime = util.time.getCurrentHourMinutes();
                        return currentTime;
                    },
                    setCurrentComment: function(comment) {
                        currentComment = comment;
                    },
                    getCurrentComment: function() {
                        return currentComment;
                    }
                };
            }]);