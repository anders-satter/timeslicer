angular.module('testApp').factory('Util', ['$filter', function($filter) {
    //fetching all items from backend
    return {
      getUniqueList: function(list, itemNameField) {
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
      },
      time: {
        getDay: function(aTimeInMs) {
          var tDate = new Date(aTimeInMs);
          var year = tDate.getFullYear();
          var month = tDate.getMonth() + 1 > 9 ? tDate.getMonth() + 1 : "0" + (tDate.getMonth() + 1);
          var date = tDate.getDate() > 9 ? tDate.getDate() : "0" + tDate.getDate();
          return year + '-' + month + '-' + date;
        },
        getMinutesFromMilliseconds: function(aMilliseconds, aTruncated) {
          if (aTruncated) {
            return Math.floor(aMilliseconds / 1000 / 60);
          } else {
            return aMilliseconds / 1000 / 60;
          }
        },
        getHoursFromSeconds: function(seconds) {
          return  this.getHoursFromMS(seconds * 1000);
        },
        getHoursFromMS: function(milliseconds) {
          var hours = Math.floor(milliseconds / 3600000);
          var splitHour = milliseconds % 3600000;
          var mins = Math.floor(splitHour / 60000);
          var splitMins = splitHour % 60000;
          var seconds = Math.floor(splitMins / 1000);
          var splitSecs = splitMins % 1000;
          var ms = Math.floor(splitSecs / 1); //won't care about rounding to nearest  millisecond,just truncate
          if (ms < 10) {
            ms = "00" + ms;
          } else if (ms < 100) {
            ms = "0" + ms;
          }

          if (seconds < 10) {
            seconds = "0" + seconds;
          }
          if (mins < 10) {
            mins = "0" + mins;
          }
          if (hours < 10) {
            hours = "0" + hours;
          }
          return  hours + ":" + mins + ":" + seconds + "." + ms;
        },
        getFullTime: function(aTimeInMs) {
          var tDate = new Date(aTimeInMs);
          var year = tDate.getFullYear();
          var month = tDate.getMonth() + 1 > 9 ? tDate.getMonth() + 1 : "0" + (tDate.getMonth() + 1);
          var date = tDate.getDate() > 9 ? tDate.getDate() : "0" + tDate.getDate();
          var hour = tDate.getHours() > 9 ? tDate.getHours() : "0" + tDate.getHours();
          var minutes = tDate.getMinutes() > 9 ? tDate.getMinutes() : "0" + tDate.getMinutes();
          var seconds = tDate.getSeconds() > 9 ? tDate.getSeconds() : "0" + tDate.getSeconds();
          var millis = tDate.getMilliseconds();
          if (millis < 10) {
            millis = '00' + millis;
          } else if (millis < 100) {
            millis = '0' + millis;
          }
          return year + '-' + month + '-' + date + '_' + hour + ':' + minutes + ':' + seconds + '.' + millis;
        },
        getTimeDiffFromStrToMS: function(startDate, endDate) {
          return new Date(endDate).getTime() - new Date(startDate).getTime();
        },
        /*
         Timeslicer convenience methods
         */
        getTimeDiffStrToMinutes: function(startDate, endDate) {
          return (new Date(endDate).getTime() - new Date(startDate).getTime()) / 60000;
        },
        getMsFromDate: function(aDateStr) {
          return new Date(aDateStr).getTime();
        },
        getDayOnly: function(aDateStr) {
          return aDateStr.substring(0, 10);
        },
        mtsToFracHours: function(minutes, pad) {
          var num = $filter('number')(minutes / 60.0, 2);
          if (num < 10 && pad) {
            num = '0' + num;
          }
          return num;
        },
        percent: function(part, total, pad) {
          var num = $filter('number')(part / total * 100, 2);

          if (num < 10 && pad) {
            num = '0' + num;
          }
          return  num + '%';
        }
      }
    };
  }]);
