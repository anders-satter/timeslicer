angular.module('testApp')
  .config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /timeslicer/allItems
    $urlRouterProvider.otherwise("/timeslicer/allItems");
    //
    // Now set up the states
    $stateProvider
      .state('allItems', {
        url: '/timeslicer/allItems',
        templateUrl: 'reporting/allitems.view.html',
        controller: 'TimeslicerCtrl'
      })
      .state('allItems.list', {
        //url is appended to the parent state url: timeslicer/allItems/promise
        url: '/promise',
        templateUrl: 'test/promise.view.html',
        controller: 'PromiseCtrl'
      })
      .state('q', {
        //url is appended to the parent state url: timeslicer/allItems/promise
        url: '/q',
        templateUrl: 'q/q.view.html',
        controller: 'qCtrl'
      })
      .state('input', {
        //url is appended to the parent state url: timeslicer/allItems/promise
        url: '/timeslicer/input',
        templateUrl: 'input/input.view.html',
        controller: 'InputCtrl'
      })

//      .state('state1.list', {
//        url: "/list",
//        templateUrl: "partials/state1.list.html",
//        controller: function($scope) {
//          $scope.items = ["A", "List", "Of", "Items"];
//        }
//      })
//      .state('state2', {
//        url: "/state2",
//        templateUrl: "partials/state2.html"
//      })
//      .state('state2.list', {
//        url: "/list",
//        templateUrl: "partials/state2.list.html",
//        controller: function($scope) {
//          $scope.things = ["A", "Set", "Of", "Things"];
//        }
//      })
  });
