angular.module('testApp').factory('InputFactory',
  ['Util', function(util) {
      var currentDate = '';
      var currentProject = '';
      var currentActivity = '';      
      var currentStartTime = '';
      var currentTime = '';
      

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
        getCurrentStartTime: function(){
          return currentStartTime;
        },        
        setCurrentStartTime: function(startTime){
          currentStartTime = startTime;
        },        
        getCurrentTime: function(){
          currentTime = util.time.getCurrentHourMinutes();
          return currentTime;
        }        
      };
    }]);