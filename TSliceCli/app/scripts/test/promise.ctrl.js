/**
 * Created by anders on 2014-02-23.
 */
'use strict';

angular.module('testApp').factory('PromisesFactory', ['$resource', function($resource){
  /*
   *  What happens if this fails?;
   */
  console.log('we are in the resource function');
  return $resource('/timeslicer/allItems', {});

}]);



angular.module('testApp').controller('PromiseCtrl', ['$scope', '$q', function($scope,$q){

  /*
    Promises: you don't have to write error handling at each step
   */
  $scope.addOne = function(num){
    var q = $q.defer();
    $scope.step++;
    if (angular.isNumber(num)){
      /*
        q.resolve is the success callback
       */
      setTimeout(function(){q.resolve(num+1)}, 1000);
    } else {
      /*
        reject is the onerror callback, which only needs to be passed in at the
        last .then clause where the
       */
      q.reject('NaN');
    }
    return q.promise;
  }

  $scope.addThree = function(num){
    var q = $q.defer();
    $scope.step++;
    if (angular.isNumber(num)){
      setTimeout(function(){
        q.resolve(num+3);
      },3000);
    } else {
      q.reject('NaN');
    }
    return q.promise;
  }


  $scope.myValue = 0;
  $scope.step  = 0;

  $scope.promise = $scope.addOne($scope.myValue);

  //Chaining functions where each function defines and returns a promise
  $scope.promise
    .then(function(v){return $scope.addOne(v)})
    .then(function(v){return $scope.addOne(v)})
    .then(function(v){return $scope.addThree(v)})
    .then(function(v){return $scope.addOne(v)})
    //And in the last we put in the error handling callback
    .then(function(v){$scope.myValue=v}, function (err){$scope.myValue=err});

}]);







///**
// * initializing the angular module
// */
//angular.module('testApp')
//  .controller('PromiseCtrl',['$scope','$q',function ($scope, $q) {
//    // for the purpose of this example let's assume that variables `$q`, `scope` and `okToGreet`
//    // are available in the current lexical scope (they could have been injected or passed in).
//
//    function okToGreet(name){
//      return false;
//    }
//    function asyncGreet(name) {
//      /*
//      $q.defer() returns a Deferred object,
//      which represents a task that will finish in the future
//       */
//      var deferred = $q.defer();
//
//      setTimeout(function() {
//        // since this fn executes async in a future turn of the event loop, we need to wrap
//        // our code into an $apply call so that the model changes are properly observed.
//        $scope.$apply(function() {
//          deferred.notify('About to greet ' + name + '.');
//
//          if (okToGreet(name)) {
//            deferred.resolve('Hello, ' + name + '!');
//          } else {
//            deferred.reject('Greeting ' + name + ' is not allowed.');
//          }
//        });
//      }, 1000);
//
//      return deferred.promise;
//    }
//
//    var promise = asyncGreet('Robin Hood');
//    promise.then(function(greeting) {
//      //alert('Success: ' + greeting);
//    }, function(reason) {
//      //alert('Failed: ' + reason);
//    }, function(update) {
//      //alert('Got notification: ' + update);
//    });
//    //document.asyncGreet = asyncGreet();
//  }] );


