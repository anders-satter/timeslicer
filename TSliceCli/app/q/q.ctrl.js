
angular.module('testApp')
    .controller('qCtrl', ['$scope','qFact',function($scope, qFact){
    $scope.result = "";
    $scope.startValue  = 1;
    $scope.runAdd = function(){
        $scope.result = qFact.add($scope.startValue)
            .then(
                function(val){
                 $scope.result = val;   
                }
            )
            .catch(function (err){
                console.log('error:' +  err);
            })
            ['finally'](
                console.log('finally is run in q.add')
            );
    };

    $scope.runAll = function(){
        qFact.add($scope.startValue)
        .then(function(v){
            return qFact.divide(v);
        })
        .then (function(v){
            return qFact.deduct(v);
        })
        .then (function(v){
            $scope.result=v;
        })
        /*
         * Error handling
         */
        .catch(function (err){
            console.log('error:' +  err);
        })
        .finally(function(){
            console.log('finally is run in q.add');
        });
    };
}]);
