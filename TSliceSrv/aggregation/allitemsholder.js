var q = require("q");
var fileio = require("../util/fileio");
var tu = require("../util/timeutil");
var glob = require("../util/globalutil");
var url = require("url");
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
  //logFileName: "resources/log.txt",
  logFileName: glob.settings.logFileName, 
    
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
   *  Functon that returns all items
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

exports.AllItemsHolder = AllItemsHolder;