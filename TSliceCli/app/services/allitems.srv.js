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
      }
    };
  }]);
