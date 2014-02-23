
var tu = require("../util/timeutil")
//var timeItemList = [];

//function pushItemToList(item) {
//	timeItemList.push(item);
//}


var gTimeItemList = [];
/**
	Takes one line in the loggs
	and returns a json object
*/
function parseLoggedLine(line){	
	//console.log("timeItemList:" + gTimeItemList);
	//console.log("parseLoggedLine");
	var items = line.split('\t');
	timeItem = {
		start: items[0],
		end: items[1],
		duration: tu.conversion.getTimeDiffStrToMinutes(items[0], items[1]),
		project: items[3],
		activity: items[4],
		comment: items[5],
	}

	gTimeItemList.push(timeItem);
	//console.log(timeItem);
	//return timeItem
	//console.log(JSON.stringify(timeItem));
}

function showTimeItems(aItemList){
	console.log("showTimeItems called");
	console.log("aItemList: " + aItemList);
	for (var i = 0; i<aItemList.length;i++){
		console.log(aItemList[i]);
	}
}
exports.parseLoggedLine = parseLoggedLine;
exports.showTimeItems = showTimeItems; 