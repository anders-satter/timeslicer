var fs = require("fs");
var path = require("path");
var readLine = require("readline");
var tu = require("../util/timeutil");
var ti = require("../aggregation/timeitems")


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
	  		rd.on('line', function (line){
	  			//console.log(line);
	  			if (line.length > 0){
	  				forEachLineCallback(line);
	  			}
	  		});	

	  		rd.on('close', function () {finishedCallBack();});	
		}
	});
}

function readfileOld3(fileName, performWrite) {
	fs.exists(fileName, function(exists) {
	  	if (exists) {

	  		var rd = readLine.createInterface({
	  				input: fs.createReadStream(fileName), 
	  				output: process.stdout, 
	  				terminal: false
	  			});
	  		rd.on('line', function(line){
	  			parseLoggedLine(line)
	  		})
		}
	});
}

function readfileOld2(performWrite, fileName) {
	fs.exists(fileName, function(exists) {
	  if (exists) {
	  	//fs.stat returns info about the file
	    fs.stat(fileName, function(error, stats) {
     		var read_stream = fs.createReadStream(fileName);
    		read_stream.on('data', writeCallback);
    		read_stream.on('close', closeCallback);

    		function writeCallback(data){
        		performWrite(data);
    		}

    		function closeCallback(){
        		console.log( "closeCallback called");
    		}		      
	    });
	  }
	});	
}

function readfileOld(performWrite, fileName) {
	fs.exists(fileName, function(exists) {
	  if (exists) {
	  	//fs.stat returns info about the file
	    fs.stat(fileName, function(error, stats) {
	    	//fd = file descriptor
	      	fs.open(fileName, "r", function(error, fd) {
	        var buffer = new Buffer(stats.size);
	 
	        fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
	          var data = buffer.toString("utf8", 0, buffer.length);	 
	          var jsonObj = JSON.stringify(data);
	          //performWrite(data);
	          performWrite(jsonObj);
	          fs.close(fd);

	        });
	      });
	    });
	  }
	});	
}






exports.readfile = readfile;

/*
     var read_stream = fileSystem.createReadStream('myfile.txt');
    read_stream.on('data', writeCallback);
    read_stream.on('close', closeCallback);

    function writeCallback(data){
        response.write(data);
    }

    function closeCallback(){
        response.end();
    }

*/