angular.module('testApp').factory('ReportAggregationFactory',
  ['$q',
    function($q) {
      //fetching all items from backend

      return {
        summarizeTimes: function(itemList) {
          var sum = 0;
          angular.forEach(itemList, function(item) {
            sum += item.duration;
          });
          return sum;
        },
        /**
         * Returns a list of projects 
         * @param {type} itemList
         * @returns {undefined}
         */
        getProjectList: function(itemList) {

          /*
           * 
           * perform operations on a copy of 
           * the original array
           */
          var ar = itemList.slice();

          var resultList = [];
          /*
           * First sort on the project name
           * so that project names get lumped 
           * together.
           */
          ar.sort(function(itemA, itemB) {
            if (itemA.project > itemB.project) {
              return 1;
            } else if (itemA.project === itemB.project) {
              return 0;
            } else {
              return -1;
            }
          });

          /*
           * 
           */
          if (ar.length > 0) {
            var currentProject = {};
            for (var i = 0; i < ar.length; i++) {
              if (i === 0) {
                //first item
                currentProject = {
                  name: ar[i].project,
                  duration: ar[i].duration
                };
                if (i === ar.length - 1) {
                  resultList.push(currentProject);
                  break;
                }
              } else if (currentProject.name !== ar[i].project) {
                //current project name has changed - push what's in the variable
                resultList.push(currentProject);
                //and reset the variable
                currentProject = {
                  name: ar[i].project,
                  duration: ar[i].duration
                };
                if (i === ar.length - 1) {
                  resultList.push(currentProject);
                  break;
                }
              } else {
                /*
                 * currentProjectName is the same
                 */
                currentProject.duration = ar[i].duration;
                //if last item
                if (i === ar.length - 1) {
                  resultList.push(currentProject);
                  break;
                }
              }
            }
          }

          return resultList;
        },
        /**
         * 
         * @param {type} itemList
         * @returns {Array}
         */
        getProjectActivityList: function(itemList) {
          /* 
           * perform operations on a copy of 
           * the original array
           */
          var ar = itemList.slice();
          var resultList = [];
          /*
           * First sort on the project  AND activity names
           * to assure that we don't mix activities with the 
           * same name in different projects. 
           * together.
           */
          ar.sort(function(itemA, itemB) {
            if (itemA.project + itemA.activity > itemB.project + itemB.activity) {
              return 1;
            } else if (itemA.project + itemA.activity === itemB.project + itemB.activity) {
              return 0;
            } else {
              return -1;
            }
          });
          if (ar.length > 0) {
            var currentActivity = {name: ar[0].project + ar[0].activity,
              duration: ar[0].duration};
            angular.forEach(ar, function(item) {
              if (currentActivity.name !== item.project + item.activity) {
                resultList.push(currentActivity);
                currentActivity = {name: item.project + item.activity,
                  duration: item.duration};
              } else {
                currentActivity.duration += item.duration;
              }
            });
          }
          return resultList;
        }

      };
    }]);
