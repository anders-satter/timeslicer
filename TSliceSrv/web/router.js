var fileio = require("../util/fileio");
var agg = require("../aggregation/allitemsholder");
var prj = require("../aggregation/projects");
var url = require("url");
var nfc = require("../test/nodeflowcontrol");
var tu = require("../util/timeutil");
var q = require("q");


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
    allItemsHolder = new agg.AllItemsHolder();
    allItemsHolder.getAllItemsPromise()
      .then(allItemsHolder.resultProcessor(request, response), function (err){
      console.log(err);
    });    
    
 } else if (pathname ==='/timeslicer/projects') {
   var projectList = new prj.ProjectList();
   projectList.getItems()  
    .then(function(data){
      response.end(data);
    });

 } else if(pathname === "/timeslicer/projects/sumtime") {
    /*
     Return a sum of all items in json format
     http://localhost:8888/totTime
     */
    allItemsHolder = new agg.AllItemsHolder();
    allItemsHolder.getAllItems(sumAllItems);
  } else if(pathname === "/timeslicer/projects/sumtime") {
    /*
     Return a sum of all items in json format
     http://localhost:8888/totTime
     */
    allItemsHolder = new agg.AllItemsHolder();
    allItemsHolder.getAllItems(sumAllItems);
  } else if(pathname === "/timeslicer/totTime") {
    /*
     Return a sum of all items in json format
     http://localhost:8888/totTime
     */
    allItemsHolder = new agg.AllItemsHolder();
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


exports.route = route;

//http://nodejs.org/docs/latest/api/url.html#url_url_parse_urlstr_parsequerystring_slashesdenotehost
