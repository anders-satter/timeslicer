var fileio = require("../util/fileio");
var agg = require("../aggregation/main");
var url = require("url");
var nfc = require("../test/nodeflowcontrol");
//var prom = require("../test/promise");

var tu = require("../util/timeutil");
var q = require("q");

/**
 *
 * Main router logic
 * @param pathname
 * @param request
 * @param responseWrite
 * @param finishedCallback
 *
 */
var route = function(pathname, request, response,responseWrite, finishedCallback) {
  'use strict';
  var tUrlParts = url.parse(request.url, true);
  console.log("route called");
  console.log("pathname:" + pathname);

  var allItemsHolder = {};

  if(pathname === "/favicon.ico") {
    /*
     no return statement needed, as of yet
     */
    //return;

  } else if(pathname === "/timeslicer/readFile") {
    console.log("readFile called");
    console.log(tUrlParts.query.name);
    fileio.readfile(tUrlParts.query.name, responseWrite, finishedCallback);
  } else if(pathname === "/") {
    fileio.readfile("resources/log.txt", responseWrite, finishedCallback);
  } else if(pathname === "/timeslicer/allItems") {
    console.log("allItems called");
    /*
     Return all items in json format
     http://localhost:8888/allItems
     */
    allItemsHolder = new AllItemsHolder();
    //allItemsHolder.getAllItems(finishedCallback);
    
//    allItemsHolder.getAllItemsPromise().then(finishedCallback, function (err){
//      console.log(err);
//    });
    allItemsHolder.getAllItemsPromise().then(allItemsHolder.resultProcessor(request, response), function (err){
      console.log(err);
    });

    
 } else if(pathname === "/timeslicer/projects") {
    /*
     Return a sum of all items in json format
     http://localhost:8888/totTime
     */
    allItemsHolder = new AllItemsHolder();
    allItemsHolder.getAllItems(sumAllItems);
  } else if(pathname === "/timeslicer/totTime") {
    /*
     Return a sum of all items in json format
     http://localhost:8888/totTime
     */
    allItemsHolder = new AllItemsHolder();
    allItemsHolder.getAllItems(sumAllItems);

  } else if(pathname === "/agg") {
    agg.mainReport.aggregate(responseWrite);
  } else if(pathname === "/test") {
    //nfc.run();
  }
};

/**
 * Sums the durations of allItemsList
 * @param allItemsList
 */
function sumAllItems(allItemsList) {
  'use strict';

  var sum = 0;
  for(var i = 0; i < allItemsList.length; i++) {
    console.log(allItemsList[i]);
    if(allItemsList[i].end) {
      sum += allItemsList[i].duration;
    }
  }
  console.log("sum: " + sum / 600.0);
}


var ProjectFinder = function(){
  
};
ProjectFinder.prototype = {
  projectList: [],
  projectFileName: "resources/prj.txt",
  
  /**
   * The resultprocessor comes from outside
   * @param {type} resultProcessor
   * @returns {undefined}
   */
  getProjects: function(resultProcessor){
    var instance = this;
    fileio.readfile(this.projectFileName,
    /*
     * parsing the line
     * @param {type} line
     * @returns {undefined}
     */
    function(line){
      
    }, 
    /*
     * resultprocessor
     * @returns {undefined}
     */
    function(){
      
    });
  }
};

/**
 *
 * AllItemsHolder class
 */
var AllItemsHolder = function() {
  'use strict';
  /*
   * Need to reset the allItemsList 
   * when we do new to the function.
   * When we do new the prototype is NOT
   * reset, so this needs to be done 
   * explicitly
   */
  this.allItemsList = [];
};
AllItemsHolder.prototype = {
  /*
   Parsed list of logitems
   */
  allItemsList: [],
  logFileName: "resources/log.txt",
  /**
   *
   * @param allItemsList
   */
  writeItemsToConsole: function(allItemsList) {
    for(var i = 0; i < allItemsList.length; i++) {
      console.log(allItemsList[i]);
    }
  },

  /**
   * Takes a list of items and formats it to json
   * and writes it to the console.log
   * @param allItemsList
   */
  writeJsonToConsole: function(allItemsList) {
    console.log(JSON.stringify(allItemsList));
  },

  /**
   * function that gets all the items
   * The item processor takes care of the
   * @param {type} resultProcessor
   * @returns {undefined}
   */
  getAllItems: function(resultProcessor) {
    'use strict';
    //console.log("resultProcessor" + resultProcessor);
    var instance = this;
    fileio.readfile(this.logFileName,
      /*
       This function pushes every line in the file to the allItemsList
       */
      function(line) {
        instance.allItemsList.push(instance.parseLoggedLine(line));
      },
      /*
       This cb function is to be provided by clients to take care of the result
       */
      function() {
        resultProcessor(instance.allItemsList);
      });
  },
  /**
   *  Funct
   *  The item processor takes care of the
   *  Function returns a promise wich
   *  can take a resultprocessor
   *
   */
  getAllItemsPromise: function() {
    'use strict';
    
    var instance = this;
    /*
     defining the return value
     */
    var deferred = q.defer();

    /*
    retrieving the readfilepromise
     */
    var readFilePromise = fileio.simpleReadFile(this.logFileName);

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
        for(var j = 0; j < lines.length; j++) {
          //console.log('data: ' + lines[j].length);
          if (lines[j].length > 0){
            instance.allItemsList.push(instance.parseLoggedLine(lines[j]));
          }
        }
        //throw new Error('Test error');
        deferred.resolve(instance.allItemsList);
      } catch (err){
        deferred.reject('Error in readFilePromise function ' + err);
      }

    });
    return deferred.promise;
  },
  /**
   * returns a parsed logline
   * @param line
   * @returns {{start: *, end: *, duration: *, project: *, activity: *, comment: *}}
   */
  parseLoggedLine: function(line) {
    'use strict';
    //first we split the line on tab
    var items = line.split('\t');
    var timeItem = {
      start: items[0],
      end: items[1],
      duration: tu.conversion.getTimeDiffStrToMinutes(items[0], items[1]),
      project: items[3],
      activity: items[4],
      comment: items[5]
    };
    if (timeItem){
      this.removeExtraQoute(timeItem);  
      return timeItem;
    }
    
    
    
  },

  /**
   * utility the removes the extra qoute
   * @param timeItem
   */
  removeExtraQoute: function(timeItem) {
    'use strict';
    //console.log('in removeExtraQuote');
    //console.log('timeItem:'+timeItem);
    if (timeItem){
      if (timeItem.project){
        timeItem.project = timeItem.project.replace(/"/g, '');
      }
      
      if (timeItem.activity){
        timeItem.activity = timeItem.activity.replace(/"/g, '');
      }
      
      if (timeItem.comment){
        timeItem.comment = timeItem.comment.replace(/"/g, '');  
      }      
    }
  
  },
  /**
 * Function returning resultprocessor and processing the 
 * result of it
 * @param {type} request
 * @param {type} response
 * @returns {getResponseResultProcessor.resultProcessor}
 */
  resultProcessor:function (request, response) {
  /*
   * We are returning the actual resultProcessor as a closure
   * and the response is reachable through the functions
   * closure context.
   * I suppose this is a good way to achieve enacpsulation
   */


  var resultProcessor = function(itemsList) {
    console.log('resultprocessor');

    /*
     * sorting on start time
     */
    var sortOnStartTime = function(item1, item2) {
      return new Date(item1.start).getTime() - new Date(item2.start).getTime();
    };
    console.log('sorting the itemslist');
    itemsList.sort(sortOnStartTime);

    /*
     * Filter out the items that don't fall in the time
     * period that we are interested in.
     */
    var filteredList = [];
    var query = url.parse(request.url, true).query;
    var startTime = tu.conversion.getMsFromDate(query.startDate);
    var endTime = tu.conversion.getMsFromDate(query.endDate);

    for (var j = 0; j < itemsList.length; j++) {
      if (itemsList[j]) {
        var dOnly = tu.conversion.getDayOnly(itemsList[j].start);
        var tStart = tu.conversion.getMsFromDate(dOnly);
 
        if (tStart >= startTime && tStart <= endTime) {
          filteredList.push(itemsList[j]);
        }
      } else {
        console.log('not logging');
      }
    }

    /*
    console.log("showing the filtered list");
    for (var x = 0; x < filteredList.length; x++) {
      console.log(filteredList[x]);
    }
    */

    /*
     * the response is reachable due to 
     * closure technology
     */
    console.log('return the filtered list');
    response.end(JSON.stringify(filteredList));
  };
  /*
   * This exposes the callback function
   */
  return resultProcessor;
}

};


exports.route = route;

//http://nodejs.org/docs/latest/api/url.html#url_url_parse_urlstr_parsequerystring_slashesdenotehost
