var fio = require("../util/fileio");
var ti = require("../aggregation/timeitems");
var tu = require("../util/timeutil");

//1 Get the file reading to produce an array 
// of timeitemobjects


var MainReport = function() {}
MainReport.prototype = {
	parseLoggedLine: function (line){
		if (!this.timeItemList){
			this.timeItemList = [];
		}
		//console.log(line);
		//console.log("sss");
		var items = line.split('\t');
		timeItem = {
			start: items[0],
			end: items[1],
			duration: tu.conversion.getTimeDiffStrToMinutes(items[0], items[1]),
			project: items[3],
			activity: items[4],
			comment: items[5],
		}

		this.timeItemList.push(timeItem);
		//console.log(timeItem);
		//return timeItem
		//console.log(JSON.stringify(timeItem));
		}, 
	timeItemList: [],
	aggregate: function(responseWrite){			
		var instance = this;		
		//fio.readfile("./resources/log.txt", function(line){instance.parseLoggedLine(line)}, 
		//	function(){instance.showTimeItemList(instance.writeInfoToConsole);});
		fio.readfile("./resources/log.txt", function(line){instance.parseLoggedLine(line)}, 
			function(){instance.showTimeItemList(responseWrite);});

		//responseWrite("aggregation called at " + tu.conversion.getFullTime(new Date().getTime()));
	},
	showTimeItemList: function(presentationCallback){
		for (var i = 0; i<this.timeItemList.length;i++){
			console.log(this.timeItemList[i]);
			presentationCallback(JSON.stringify(this.timeItemList[i]));
		}

		


	},
	writeInfoToConsole: function(info){
		console.log(info);
	}
};

var mainReport = new MainReport();

/*
	Apparently when you export a function the
	class it resides in is not passed so you 
	basically call the function only, and have no
	access to the other fields in the class

	exports.aggregate = mainReport.aggregate;

	Using the above exported function will fail
	because the timeItemList referred inside the function
	is not accesible.

	Thus the whole class needs to be exported

*/
exports.mainReport = mainReport;

