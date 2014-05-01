var fileio = require("../util/fileio");
var agg = require("../aggregation/allitemsholder");
var prj = require("../aggregation/projects");
var url = require("url");
var nfc = require("../test/nodeflowcontrol");
var tu = require("../util/timeutil");
var q = require("q");
var ic = require("../input/inputconverter");


/**
 * 
 * @param {type} pathname
 * @param {type} request
 * @param {type} response
 * @param {type} responseWrite
 * @param {type} finishedCallback
 * @returns {undefined}
 */
var route = function(pathname, request, response, responseWrite, finishedCallback) {
  'use strict';
  var tUrlParts = url.parse(request.url, true);
  console.log("route called");
  console.log("pathname:" + pathname);

  var allItemsHolder = {};

  if (pathname === "/favicon.ico") {
    /*
     no return statement needed, as of yet
     */
    //return;

  } else if (pathname === "/timeslicer/readFile") {
    console.log("readFile called");
    console.log(tUrlParts.query.name);
    fileio.readfile(tUrlParts.query.name, responseWrite, finishedCallback);
  } else if (pathname === "/") {
    fileio.readfile("resources/log.txt", responseWrite, finishedCallback);
  } else if (pathname === "/timeslicer/allItems") {
    console.log("allItems called");
    /*
     Return all items in json format
     http://localhost:8888/allItems
     */
    allItemsHolder = new agg.AllItemsHolder();
    allItemsHolder.getAllItemsPromise()
      .then(allItemsHolder.resultProcessor(request, response), function(err) {
        console.log(err);
      });

  } else if (pathname === '/timeslicer/projects') {
    var projectList = new prj.ProjectList();
    projectList.getItems()
      .then(function(data) {
        response.end(data);
      });

  } else if (pathname === '/timeslicer/project') {
    /*
     * Used to add a project 
     * 
     */
    var projectList = new prj.ProjectList();
    
    var body = "";
    request.on('data', function(chunk) {
      body += chunk;
    });
    request.on('end', function() {
      console.log('body ' + body);
//      var timeItem = new ic.TimeItem(body);
//      timeItem.writeToFile()
//        .then(function(result) {
//          response.writeHead(200);
//        })
//        .catch(function(err) {
//          response.writeHead(401);
//        });
      projectList.addProject('NewProject');
      /*
       * saving must be done in between the different calls!
       */
      projectList.addActivity('NewProject', 'NewActivity1');
      projectList.addProject('Fin');
      response.end('data written to the file');
    });

  } else if (pathname === "/timeslicer/timeitem") {

    var body = "";
    request.on('data', function(chunk) {
      body += chunk;
    });
    request.on('end', function() {
      console.log('body ' + body);
      var timeItem = new ic.TimeItem(body);

      timeItem.writeToFile()
        .then(function(result) {
          response.writeHead(200);
        })
        .catch(function(err) {
          response.writeHead(401);
        });
      response.end('data written to the file');
    });
    //console.log(tUrlParts);
    //response.end('call received');
  } else if (pathname === "/timeslicer/projects/sumtime") {
    /*
     Return a sum of all items in json format
     http://localhost:8888/totTime
     */
    allItemsHolder = new agg.AllItemsHolder();
    allItemsHolder.getAllItems(sumAllItems);
  } else if (pathname === "/timeslicer/totTime") {
    /*
     Return a sum of all items in json format
     http://localhost:8888/totTime
     */
    allItemsHolder = new agg.AllItemsHolder();
    allItemsHolder.getAllItems(sumAllItems);

  } else if (pathname === "/agg") {
    agg.mainReport.aggregate(responseWrite);
  } else if (pathname === "/test") {
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
  for (var i = 0; i < allItemsList.length; i++) {
    console.log(allItemsList[i]);
    if (allItemsList[i].end) {
      sum += allItemsList[i].duration;
    }
  }
  console.log("sum: " + sum / 600.0);
}


var ProjectFinder = function() {

};
ProjectFinder.prototype = {
  projectList: [],
  projectFileName: "resources/prj.txt",
  /**
   * The resultprocessor comes from outside
   * @param {type} resultProcessor
   * @returns {undefined}
   */
  getProjects: function(resultProcessor) {
    var instance = this;
    fileio.readfile(this.projectFileName,
      /*
       * parsing the line
       * @param {type} line
       * @returns {undefined}
       */
        function(line) {

        },
        /*
         * resultprocessor
         * @returns {undefined}
         */
          function() {

          });
      }
  };


exports.route = route;

//http://nodejs.org/docs/latest/api/url.html#url_url_parse_urlstr_parsequerystring_slashesdenotehost
