angular.module('testApp').factory('TimeslicerDataFactory', ['$resource', '$q',
  '$http', function($resource, $q, $http) {
    //fetching all items from backend
    return {
      /**
       * calling the http variant of the function
       * @param {type} aStartDate
       * @param {type} aEndDate
       * @returns {unresolved}
       */
      getAllItemsHttp: function(aStartDate, aEndDate) {
        return $http({
          method: 'GET',
          url: '/timeslicer/allItems',
          params: {'startDate': aStartDate,
            'endDate': aEndDate
          }
        });
      },
      getAllProjects: function(){
         return $http({
          method: 'GET',
          url: '/timeslicer/projects'
        });
      }, 
      postTimeItem: function(){
        var timeItem = {
          'startTime': '2013-12-31 08:00',
          'endTime': '2013-12-31 10:00',
           'project': 'TestProject',
           'activity': 'TestActivity1',
           'comment': 'this is a test comment'
         };
         
        $http({
          method: 'POST',
          url: '/timeslicer/timeitem',
          data: timeItem,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
      }
    };
  }]);
