angular.module('testApp').factory('ReportAggregationFactory',
  ['$q', function($q) {
      //fetching all items from backend

      var summarizeOnField = function(list, itemNameField, itemSumField) {

        var resultList = [];
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

        if (ar.length > 0) {
          var currentItem = {};
          for (var i = 0; i < ar.length; i++) {
            if (i === 0) {
              //first item
              currentItem = {
                name: itemNameField(ar[i]),
                sum: itemSumField(ar[i])
              };
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
              if (i === ar.length - 1) {
                resultList.push(currentItem);
                break;
              }
            } else {
              /*
               * currentItemName is the same
               */
              currentItem.sum += itemSumField(ar[i]);
              //if last item
              if (i === ar.length - 1) {
                resultList.push(currentItem);
                break;
              }
            }
          }
        }

        return resultList;
      };

      return {
        showSummarizeOnField: function(itemList, itemNameField, itemSumField) {
          return summarizeOnField(itemList, itemNameField,itemSumField );
        },
        summarizeTimes: function(itemList) {
          var sum = 0;
          angular.forEach(itemList, function(item) {
            sum += item.duration;
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
        getProjectList: function(projectList, projectNameField, projectSumField){
          return summarizeOnField(projectList, projectNameField,projectSumField );          
        },
        
        /**
         * 
         * @param {type} activityList
         * @param {type} activityNameField
         * @param {type} activitySumField
         * @returns {Array}
         */
        getProjectActivityList: function(activityList, activityNameField, 
          activitySumField){
            return summarizeOnField(activityList, activityNameField, 
              activitySumField);          
        }
      };
    }]);
