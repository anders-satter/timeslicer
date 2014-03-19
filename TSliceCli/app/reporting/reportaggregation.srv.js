angular.module('testApp').factory('ReportAggregationFactory',
  [function() {
      /**
       * 
       * @param {type} list of items to be summarized
       * @param {type} itemNameField function returning the name of the field
       * @param {type} itemSumField function returning the field to be summarized
       * @returns {Array}
       */
      var summarizeOnField = function(list, itemNameField, itemSumField) {

        var resultList = [];
        var totalSum = 0.0;
        //clone the incoming list
        var ar = list.slice();

        /*
         * First sort on the item field 
         * so that field names get lumped 
         * together in the resulting array
         */
        ar.sort(function(itemA, itemB) {
          if (itemNameField(itemA) > itemNameField(itemB)) {
            return 1;
          } else if (itemNameField(itemA) === itemNameField(itemB)) {
            return 0;
          } else {
            return -1;
          }
        });

        /*
         * Go through the array, perform summing and
         * push results to the result list.
         */
        if (ar.length > 0) {
          var currentItem = {};
          for (var i = 0; i < ar.length; i++) {
            if (i === 0) {
              //first item
              currentItem = {
                name: itemNameField(ar[i]),
                sum: itemSumField(ar[i])
              };
              totalSum += itemSumField(ar[i]);
              if (i === ar.length - 1) {
                resultList.push(currentItem);
                break;
              }
            } else if (currentItem.name !== itemNameField(ar[i])) {
              //current project name has changed - push what's in the variable
              resultList.push(currentItem);
              //and reset the variable
              currentItem = {
                name: itemNameField(ar[i]),
                sum: itemSumField(ar[i])
              };
              totalSum += itemSumField(ar[i]);

              if (i === ar.length - 1) {
                resultList.push(currentItem);
                break;
              }
            } else {
              /*
               * currentItemName is the same
               */
              currentItem.sum += itemSumField(ar[i]);
              totalSum += itemSumField(ar[i]);
              //if last item
              if (i === ar.length - 1) {
                resultList.push(currentItem);
                break;
              }
            }
          }
        }

        return {
          itemList: resultList,
          totalSum: totalSum
        }
      };

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
          return summarizeOnField(projectList, projectNameField, projectSumField);
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
          return summarizeOnField(activityList, activityNameField,
            activitySumField);
       },
        /**
         * 
         * @param {type} itemList
         * @param {type} projectName
         * @returns {_L2.summarizeOnField.Anonym$1|Array}
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
          var actList = summarizeOnField(resultList,
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
        }
      };
    }]);
