// register the interceptor as a service
angular.module('testApp').factory('myHttpInterceptor', function($q) {
  return {
    // optional method
    'request': function(config) {
      console.log("request interceptor called")

      // do something on success
      return config || $q.when(config);
    },

//    // optional method
//    'requestError': function(rejection) {
//      // do something on error
//      if (canRecover(rejection)) {
//        return responseOrNewPromise
//      }
//      return $q.reject(rejection);
//    },



    // optional method
    'response': function(response) {
      console.log("response interceptor called")

      // do something on success
      return response || $q.when(response);
    }

    // optional method
//    'responseError': function(rejection) {
//      // do something on error
//      if (canRecover(rejection)) {
//        return responseOrNewPromise
//      }
//      return $q.reject(rejection);
//    }
  };
});