'use strict';

/*
  can be used to used to call rest/ajax functions via
  the $http object to 
  a factory returns a function
  To make 
*/

angular.module('testApp')
  .factory('awsomeThingsFactory', function () {
    // Service logic
    var awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma',
      'Benson',
      'solange',
      'goskejse',
      'grejsvare',
      'looking good!'
    ];

    //this is not the way that dan wahlin does it
    //he will return the whole factory

    // Public API here
    return {
      awesomeThings: function () {
        return awesomeThings;
      }
    };

  });
