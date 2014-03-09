'use strict';


/*
  This is the main app.js, it is where the app is created
  and where we configure the routeProviders through the config
  function
*/
// Here we set up an angular module. We'll attach controllers and 
// other components to this module.

angular.module('testApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
   'ui.router'

])
//  .config(function ($routeProvider) {
//    // We use AngularJS dependency injection to fetch the route provider.
//    // The route provider is used to setup our app's routes.
//
//    // The config below simply says when you visit '/' it'll render
//    // the views/main.html template controlled by the MainCtrl controller.
//
//    // The otherwise method specifies what the app should do if it doesn't recognise
//    // the route entered by a user. In this case, redirect to home
//    $routeProvider
//      .when('/', {
//        templateUrl: 'views/main.html',
//        controller: 'MainCtrl'
//      })
//      .when('/myRoute', {
//        templateUrl: 'views/myroute.html',
//        controller: 'MyrouteCtrl'
//      })
//      .when('/rest1', {
//        templateUrl: 'views/rest1.html',
//        controller: 'Rest1Ctrl'
//      })
//      .when('/timeslicer/allItems', {
//        templateUrl: 'reporting/allitems.view.html',
//        controller: 'TimeslicerCtrl'
//      })
//      .when('/test/promise', {
//        templateUrl: 'scripts/test/promise.view.html',
//        controller: 'PromiseCtrl'
//      })
//      .otherwise({
//        redirectTo: '/'
//      });
//  });





  angular.module('testApp').config(function($httpProvider){
    $httpProvider.interceptors.push('myHttpInterceptor');
  });
