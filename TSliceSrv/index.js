var server = require("./web/server");
var router = require("./web/router");

server.start(router.route);