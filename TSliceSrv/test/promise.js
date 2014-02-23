
/**
 * Created by anders on 2014-02-23.
 */

var ag = function(name) {

  var deferred = $q.defer();

  setTimeout(function() {
    // since this fn executes async in a future turn of the event loop, we need to wrap
    // our code into an $apply call so that the model changes are properly observed.
    scope.$apply(function() {
      deferred.notify('About to greet ' + name + '.');

      if (okToGreet(name)) {
        deferred.resolve('Hello, ' + name + '!');
      } else {
        deferred.reject('Greeting ' + name + ' is not allowed.');
      }
    });
  }, 1000);

  return deferred.promise;
};

var promise = asyncGreet('Robin Hood');
promise.then(function(greeting) {
  alert('Success: ' + greeting);
}, function(reason) {
  alert('Failed: ' + reason);
}, function(update) {
  alert('Got notification: ' + update);
});

if (typeof exports != "undefined"){
  exports.run = runSeries;
}

exports.asyncGreet = ag;