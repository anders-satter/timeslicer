var q = require("q");
var fileio = require("../util/fileio");
var tu = require("../util/timeutil");
var glob = require('../util/globalutil');
var tu = require("../util/timeutil");

var TimeItem = function(aJsonTimeItem) {
    this.jsonTimeItem = aJsonTimeItem;
};
TimeItem.prototype = {
    jsonToLogFormat: function() {
        /*
         * return this string to write to log file
         */
        return this.jsonTimeItem.toString();
    },
    createTimeItemLogString: function() {
        var ti = JSON.parse(this.jsonTimeItem);
        var tab = '\t';
        var newline = "\r\n";

        return newline + ti.startTime + tab
                + ti.endTime + tab
                + '0' + tab
                + '"' + ti.project + '"' + tab
                + '"' + ti.activity + '"' + tab
                + '"' + ti.comment + '"';
    },
    /**
     * writes the timeitem to the file asynchronously
     * and returns a promise. 
     * @returns {undefined}
     */
    writeToFile: function() {
        return fileio.writeToFile(glob.settings.logFileName, this.createTimeItemLogString());
    }
};

var Project = function(aJsonProjectName) {
    this.jsonProjectName = aJsonProjectName.name;
    this.activityList = [];
};
Project.prototype = {
    jsonToLogFormat: function() {
        /*
         * return this string to write to log file
         */
        return this.jsonProjectName.name;
    },
    addActivity: function(aActivityName) {
        this.activityList.push('+' + aActivityName);
    }
};

exports.TimeItem = TimeItem;
exports.Project = Project;

