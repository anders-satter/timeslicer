angular.module('testApp').factory('InputFactory',
  ['Util', function(util) {
      var currentDate = '';
      var currentProject = '';
      var currentActivity = '';

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
        }
      };
    }]);