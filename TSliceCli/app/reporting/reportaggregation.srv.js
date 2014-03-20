angular.module('testApp').factory('ReportAggregationFactory',
  ['Util', function(Util) {
      return {
        summarizeTimes: function(itemList, itemSumField) {
          var sum = 0;
          angular.forEach(itemList, function(item) {
            sum += itemSumField(item);
          });
          return sum;
        },
        /**
         * 
         * @param {type} projectList
         * @param {type} projectNameField
         * @param {type} projectSumField
         * @returns {Array}
         */
        getProjectList: function(projectList, projectNameField, projectSumField) {
          //return summarizeOnField(projectList, projectNameField, projectSumField);
          return Util.summarizeOnField(projectList, projectNameField, projectSumField);
        },
        /**
         * 
         * @param {type} activityList
         * @param {type} activityNameField
         * @param {type} activitySumField
         * @returns {Array}
         */
        getProjectActivityList: function(activityList, activityNameField,
          activitySumField) {
          return Util.summarizeOnField(activityList, activityNameField,
            activitySumField);
       },
       /**
        * Returns all activites for a project
        * @param {type} itemList
        * @param {type} aProjectName
        * @returns {_L2.Anonym$2.getActivities.Anonym$3}
        */
        getActivities: function(itemList, aProjectName) {
          var resultList = [];
          //var ar = itemList.slice();

          /*
           * 1. create a flat list af all activities for the project
           */
          angular.forEach(itemList, function(item) {
            if (item.project === aProjectName) {
              resultList.push(item);
            }
          });

          /*
           * 2. summarize and return the activites for the project
           * 
           */
          var actList = Util.summarizeOnField(resultList,
            function(item) {
              return item.activity;
            },
            function(item) {
              return item.duration;
            }).itemList;

          return {
            projectName: aProjectName,
            activityList: actList
          };
        },
        /**
         * 
         * @param {type} itemList
         * @param {type} projectName
         * @returns {undefined}
         */
        getProjectNameList: function(itemList, projectName){
          return Util.getUniqueList(itemList, projectName);
        }
      };
    }]);
