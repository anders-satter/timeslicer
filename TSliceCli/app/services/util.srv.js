angular.module('testApp').factory('Util', [function() {
    //fetching all items from backend
    return {
      
      getUniqueList: function(list, itemNameField){
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
          var currentName = '';
          for (var i = 0; i < ar.length; i++) {
            if (i === 0) {
              //first item
              currentName = itemNameField(ar[i]);
                
              
              if (i === ar.length - 1) {
                resultList.push(currentName);
                break;
              }
            } else if (currentName !== itemNameField(ar[i])) {
              //current project name has changed - push what's in the variable
              resultList.push(currentName);
              //and reset the variable
              currentName = itemNameField(ar[i]);
              
              if (i === ar.length - 1) {
                resultList.push(currentName);
                break;
              }
            } else {
              /*
               * currentItemName is the same
               */
              //if last item
              if (i === ar.length - 1) {
                resultList.push(currentName);
                break;
              }
            }
          }
        }
        return resultList;
      },
      
      /**
       * 
       * @param {type} list
       * @param {type} itemNameField
       * @param {type} itemSumField
       * @returns {_L1.Anonym$1.summarizeOnField.Anonym$2}
       */
      summarizeOnField: function(list, itemNameField, itemSumField) {

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
        };
      }
    };
  }]);
