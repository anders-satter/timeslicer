angular.module('testApp').factory('TimeslicerFactory', ['$resource', '$q','$http', function($resource, $q, $http) {
  //fetching all items from backend
  return {
    /**
     * calling the http variant of the function
     * @returns {*|Array|Object|Mixed|promise|the}
     */
    getAllItemsHttp: function(aStartDate, aEndDate) {
      return $http({
        method: 'GET',
        url: '/timeslicer/allItems',
        params: {'startDate': aStartDate,
                 'endDate': aEndDate
        }
      })
    }
  }
}]);
