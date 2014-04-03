var q = require("q");
var fileio = require("../util/fileio");
var tu = require("../util/timeutil");
var url = require("url");

var ProjectList = function() {
  this.itemList = [];
};
ProjectList.prototype = {
  projectFileName: "resources/prj.txt",
  writeItemsToConsole: function() {
  },
  getItems: function() {
    var instance = this;
    /*
     defining the return value
     */
    var deferred = q.defer();

    /*
     retrieving the readfilepromise
     */
    var readFilePromise = fileio.simpleReadFile(this.projectFileName);

    /*
     calling the then method of the readfile promise
     */
    readFilePromise.then(function(data) {
      /*
       Using try..catch should be ok since we
       are returning a promise
       */
      try {
        //console.log('then of the promise is called!' + data);
        var lines = data.split('\n');
        //console.log('number of the lines: ' + lines.length)
        for (var j = 0; j < lines.length; j++) {
          //console.log('data: ' + lines[j].length);
          if (lines[j].length > 0) {
            instance.itemList.push(lines[j]);
          }
        }
        var json = instance.jsonifyProjectFileContent(instance.itemList);
        deferred.resolve(json);
      } catch (err) {
        deferred.reject('Error in getItemPromise function ' + err);
      }

    });
    return deferred.promise;
  },
  
  jsonifyProjectFileContent: function(itemList) {
    /*
     * get the indeces of the projectnames
     */
    var projJsonObj = [];
    var currentProj = '';
    var currentActivity = [];
    var currentActivityList = [];
    var instance = this;

    itemList.forEach(function(item, index, list) {
      if (item.indexOf('#') > -1) {
        /*
         * this is a new project
         * push the previous one to the list
         * if it os not empty
         */
        if (currentProj !== '') {
          projJsonObj.push({
            "name": currentProj,
            "activityList": currentActivityList
          });
        }

        /*
         * reinitialize
         */
        currentProj = instance.removeCarriageReturn(item);
        currentActivityList = [];

        if (index === list.length - 1) {
          /*
           * this is the last item
           * Could be just a project
           * name, if it is a newly 
           * created one
           */
          projJsonObj.push({
            "name": currentProj,
            "activityList": currentActivityList
          });
        }
      } else if (item.indexOf('+') > -1) {

        currentActivity = instance.removeCarriageReturn(item);
        currentActivityList.push(currentActivity);
        if (index === list.length - 1) {
          /*
           * this is the last item
           */
          projJsonObj.push({
            "name": currentProj,
            "activityList": currentActivityList
          });
        }

      }
    });
    var jsonObj = JSON.stringify(projJsonObj);
    JSON.stringify(projJsonObj);
    return jsonObj;
  },
  /**
   * 
   * @param {type} item
   * @returns {undefined}
   */
  removeCarriageReturn: function(item) {
    'use strict';
    if (item) {
      item = item.replace(/\r/g, '');
      item = item.replace(/#/g, '');
      item = item.replace(/\+/g, '');
    }
    return item;
  }
};

exports.ProjectList = ProjectList;

