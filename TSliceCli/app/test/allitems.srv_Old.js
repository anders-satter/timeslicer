angular.module('testApp').factory('TimeslicerFactory', ['$resource', '$q','$http', function($resource, $q, $http) {
  //fetching all items from backend
  return {
    getAllItems: function(onsuccess) {
      var r = new $resource('/timeslicer/allItems', {}, {
        get: {
          isArray: true,
          method: 'GET'
        }});
      //return r.get().$promise.next(onsuccess);
      console.log("returning the callback case");
      return r.get().$promise;
    },
    /**
     * calling the http variant of the function
     * @returns {*|Array|Object|Mixed|promise|the}
     */
    getAllItemsHttp: function() {
      //return $http.get('/timeslicer/allItems');
      return $http({
        method: 'GET',
        url: '/timeslicer/allItems',
        params: {'startDate': '2013-12-01',
                 'endDate':'2013-12-31'
        }
      })
    }
  }
}]);
