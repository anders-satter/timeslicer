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
var route = function(pathname, request, responseWrite, finishedCallback) {
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
    allItemsHolder.getAllItemsPromise().then(finishedCallback, function (err){
      console.log(err);
    });


  } else if(pathname === "/timeslicer/totTime") {
    //console.log("totTime called");
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
   *  and writes it to the console.log
   * @param allItemsList
   */
  writeJsonToConsole: function(allItemsList) {
    console.log(JSON.stringify(allItemsList));
  },

  /**
   *  function that gets all the items
   *  The item processor takes care of the
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
   *  function that gets all the items
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
    this.removeExtraQoute(timeItem);
    return timeItem;
  },

  /**
   * utility the removes the extra qoute
   * @param timeItem
   */
  removeExtraQoute: function(timeItem) {
    'use strict';
    timeItem.project = timeItem.project.replace(/"/g, '');
    timeItem.activity = timeItem.activity.replace(/"/g, '');
    timeItem.comment = timeItem.comment.replace(/"/g, '');
  }
};


exports.route = route;

//http://nodejs.org/docs/latest/api/url.html#url_url_parse_urlstr_parsequerystring_slashesdenotehost
