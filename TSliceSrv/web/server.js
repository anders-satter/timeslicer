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

    console.log("calling route");
    route(pathname, requestThis, responseThis,
      function(text) {
        console.log("pushes to the datacollection");
        dataCollection.push(text);
      },
      function(requestThis, responseThis){
        console.log('outside callback is called');
      });
  };

  http.createServer(onRequest).listen(8888);
  console.log("Server started - listening to port 8888");
}
var dataCollection = [];

exports.start = start;
