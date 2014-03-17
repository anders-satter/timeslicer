angular.module('testApp').factory('qFact', ['$q', function($q) {
    var addValue = 100;
    var divideValue = 0.5;
    var deductValue = 18;
    return {
      /**
       * @param {type} val
       * @returns {$q@call;defer.promise}
       */
      add: function(val) {
        var deferred = $q.defer();
        try {
          var result = Number(val) + addValue;
          if (!result) {
            throw Error('Input not numeric!');
          }
          setTimeout(function() {
            deferred.resolve(result);
          }, 2000);
        } catch (err) {
          deferred.reject('from add: ' + err);
        }
        return deferred.promise;
      },
      /**
       * 
       * @param {type} val
       * @returns {$q@call;defer.promise}
       */
      divide: function(val) {
        var deferred = $q.defer();
        try {
          var result = Number(val) / divideValue;
          if (!result) {
            throw Error('Input not numeric!');
          }

          deferred.resolve(result);
        } catch (err) {
          deferred.reject('from divide: ' + err);
        }
        return deferred.promise;
      },
      /**
       * Detta kommer man
       * @param {type} val
       * @returns {$q@call;defer.promise}
       */
      deduct: function(val) {
        var deferred = $q.defer();
        try {
          var result = Number(val) - deductValue;
          if (!result) {
            throw Error('Input not numeric!');
          }
          deferred.resolve(result);
        } catch (err) {
          deferred.reject('from deduct: ' + err);
        }
        return deferred.promise;
      }
    };
  }]);
