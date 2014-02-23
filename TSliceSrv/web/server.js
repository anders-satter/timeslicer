var http = require("http");
var url = require("url");
var route = require("./router");
var tu = require("../util/timeutil");

function start(route) {
  var onRequest = function(request, response) {
    //often two requests, since browsers try to load favicon's as well
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received");

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
 * Function returning resultprocessor
 * @param response
 * @returns {resultProcessor}
 */
function getResponseResultProcessor(request, response) {
  /*
   * We are returning the actual resultProcessor as a closure
   * and the response is reachable through the functions
   * closure context.
   * I suppose this is a good way to achieve enacpsulation
   */

  /*
   * reading the parameters on the request to select the
   * period to return
   */



  var resultProcessor = function(itemsList) {
    /*
     * sorting on start time
     */
    var sortOnStartTime = function(item1, item2) {
      return new Date(item1.start).getTime() - new Date(item2.start).getTime();
    };
    itemsList.sort(sortOnStartTime);

    /*
     * the response is reachable due to 
     * closure technology
     */
    response.end(JSON.stringify(itemsList));
  };
  /*
   * This exposes the callback function
   */
  return resultProcessor;
}

exports.start = start;
