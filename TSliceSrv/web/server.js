var http = require("http");
var url = require("url");
var route = require("./router");
var tu = require("../util/timeutil");


function start(route) {
  var onRequest = function(request, response) {
    //often two requests, since browsers try to load favicon's as well
    var pathname = url.parse(request.url).pathname;
    response.writeHead(200, {"Content-Type": "application/json; charset=UTF-8"});
    var responseThis = response;
    var requestThis = request;

    //is this the right place to denote the
    //shouldn't the write method be replaced with a function?
    // functions being:
    // 1: return all items
    // 2: return filtered response, ie time period, s
    // present in all times:

    // services, each with its own url
    // should return json objects


    console.log("calling route");
    route(pathname, request, function(text) {
      dataCollection.push(text);
    },
      getResponseResultProcessor(requestThis, responseThis)
      );
  };

  http.createServer(onRequest).listen(8888);
  console.log("Server started - listening to port 8888");
}
var dataCollection = [];

/**
 * Function returning resultprocessor and processing the 
 * result of it
 * @param {type} request
 * @param {type} response
 * @returns {getResponseResultProcessor.resultProcessor}
 */
function getResponseResultProcessor(request, response) {
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

exports.start = start;
