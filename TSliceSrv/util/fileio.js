var fs = require("fs");
var path = require("path");
var readLine = require("readline");
var tu = require("../util/timeutil");
var ti = require("../aggregation/timeitems");
var q = require("q");


function readfile(fileName, forEachLineCallback, finishedCallBack) {
  console.log("fileName: " + fileName);

  fs.exists(fileName, function(exists) {
    if (exists) {
      var rd = readLine.createInterface({
        input: fs.createReadStream(fileName),
        output: process.stdout,
        terminal: false
      });

      /*
       For each line in the file run th
       anonymous function
       */
      rd.on('line', function(line) {
        //console.log(line);
        if (line.length > 0) {
          forEachLineCallback(line);
        }
      });

      rd.on('close', function() {
        finishedCallBack();
      });
    }
  });
}

/**
 * Testing the promise api
 * @param fileName
 * @param forEachLineCallback
 * @param finishedCallBack
 * @param onerrorcb
 * @returns {Promise.promise|*}
 */
function readfilePromise(fileName, forEachLineCallback, finishedCallBack, onerrorcb) {
  console.log('########################################');
  console.log('Promise version of the reafFile function');
  console.log('########### This does not work #########');
  console.log('########################################');

  var deferred = q.defer();

  fs.exists(fileName, function(exists) {
    console.log('file exists...');
    if (exists) {
      var rd = readLine.createInterface({
        input: fs.createReadStream(fileName),
        output: process.stdout,
        terminal: false
      });

      /*
       For each line in the file run the
       anonymous function
       */
      console.log('before resolve');
      deferred.resolve(function(line) {
        console.log('running resolve...');
        rd.on('line', function(line) {
          console.log('rd.on called');
          if (line.length > 0) {
            forEachLineCallback(line);
          }
        });
        rd.on('close', function() {
          finishedCallBack();
        });
      });
    } else {
      console.log('running deferred.reject');
      deferred.reject(onerrorcb);
    }
  });
  return deferred.promise;
}

/**
 * Returns a promise with the data 
 * from the file name 
 * @param {type} fileName
 * @returns {q@call;defer.promise}
 */
function simpleReadFile(fileName) {
  var deferred = q.defer();
  fs.readFile(fileName, 'utf8', function(err, data) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data);
    }
  });
  return deferred.promise;
}
/**
 * Appends 'data' to the supplied file
 * and creates the file if it does not
 * exist
 * @param {type} fileName
 * @param {type} data
 * @returns {q@call;defer.promise}
 */
function writeToFile(fileName, data) {
  var deferred = q.defer();
  fs.appendFile(fileName, data, function(err) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve('success');
      console.log('The "data to append" was appended to file!');
    }
  });
  return deferred.promise;
}



/*
 How could the task be split into several ones?
 */
exports.readfile = readfile;
exports.readfilePromise = readfilePromise;
exports.simpleReadFile = simpleReadFile;
exports.writeToFile = writeToFile;

