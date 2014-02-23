
// function init(){
// 	if (typeof exports != undefined){
// 		//exports = {};
// 	} else {
// 		exports = {};
// 	}
// }
// init();

function hello(){
	console.log("In nodeflowcontrol.js");	
}

/* 
	Call a number of async functions in series 
	Examples from http://book.mixu.net/node/ch7.html
*/



	/*
	 Detta första exempel fungerar om man har ett 
	 rekursivt problem med ett anrop per argument
	 i en array till samma asnynkrona funktion.


 	The series launches one async() operation, 
 	and passes a callback to it. The callback 
 	pushes the result into the results array 
 	and then calls series with the next item 
 	in the items array. When the items array 
 	is empty, we call the final() 


	 */

// Async task (same in all examples in this chapter)
function async1(arg, callback) {

  console.log('do something with \''+arg+'\', return 1 sec later');

  setTimeout(function() { callback(arg * 2); }, 1000);
}

// Final task (same in all the examples)
function final1() { console.log('Done', results); }

// A simple async series:
var items = [ 1, 2, 3, 4, 5, 6 ];
var results = [];
function series1(item) {

  if(item) {
  	/*
  	Det finns fortfarande parametrar kvar i 
  	listan -> vi får ett anrop till async
  	*/
    async1( item, function(result) {
      results.push(result);
      return series1(items.shift());
    });
  } else {
    return final1();
  }
}


function run (){
	series1(items.shift());	
}



/*
	standard
	Anropar en array av funktioner och resultatet av varje funktion hamnar 
	i results-arrayen. I och användningen av 
		results.push(Array.prototype.slice.call(arguments));
	kan varje funktion leverera mer än ett resultat, kanske ett error objekt 
	till exempel


The callback functions get a next() function as their first parameter 
which they should call when they have completed their async operations. 
This allows us to use any async function as part of the control flow.

NB This series does NOT pass in the result of the previous function
as input of the next... For this functionality look at the seriesPassingParam
function below


Observations from series:
- series: the next function is called from the callback of the prevoius


*/

function series(callbacks, last) {
	console.log("series called");
  //remember that the callbacks array 
  //contains wrappers around the actual
  //performing functions which takes a 
  //function argument (next)


  //array to gather results		
  var results = [];

  //define the next inner function
  function next() {
  	console.log("next in series called");
  	// get the next wrapper function callbacks
    var callback = callbacks.shift();
    console.log(callback);
    if(callback) {
    	/*
    		call current wrapper function, passing a an anonymous f as
      	paramenter next, which is the result callback function. 
    	*/
      callback(function() {
	      /*
	      	This callback function is recieves the result of each functions operation.
	      	It corresponds to the first next in
	      		function(next) { asyncMultiply11(1, next);}
					So the worker function actutally calls the next function of
					its wrapper.					 
	      */
      	console.log("NB callback is received from function, with the result(s) " 
      		+ Array.prototype.slice.call(arguments));      	
	      /*
	      	The fact that we use 
	      		Array.prototype.slice.call(arguments)
	      	to parse the arguments of the callback function, means that the worker 
	      	functions can send any number of parameters, which makes the series function
	      	more general. The result array where is function stores an array of 
	      	results, ie an array of arrays.
	      */
	      results.push(Array.prototype.slice.call(arguments));
				next();
	      });
    } else {
      last(results);
    }
  }
  //run next function
  console.log("last next in series called");
  next();
}

// Example task
/*
	Denna function tar ett argument, hanterar det och anropar sedan
	sin reslutat callback funktion med detta argument
*/
function asyncMultiply11(arg, callback) {
  var delay = Math.floor(Math.random() * 5 + 1) * 100; // random ms

  //doing the operation
  var thisFunctionsResult  = arg * 11;

  console.log('asyncMultiply11 with \''+arg+'\', return in '+delay+' ms');

  //the passed callback function will be called in [delay] time
  // and has receiver the result as inparameter
  //setTimeout(function() {callback(arg,thisFunctionsResult); }, delay);
  setTimeout(function() {callback(thisFunctionsResult); }, delay);
}

function asyncAdd123(arg, callback) {
  var delay = Math.floor(Math.random() * 5 + 1) * 100; // random ms
  var thisFunctionsResult = arg + 123;
  console.log('asyncAdd123 with \''+arg+'\', return in '+delay+' ms');
  //setTimeout(function() {arg, callback(thisFunctionsResult); }, delay);
  setTimeout(function() {callback(thisFunctionsResult); }, delay);
}
function asyncSubtract5(arg, callback) {
  var delay = Math.floor(Math.random() * 5 + 1) * 100; // random ms
  var thisFunctionsResult = arg - 5;
  
  console.log('asyncSubtract5 with \''+arg+'\', return in '+delay+' ms');
  //setTimeout(function() {arg, callback(thisFunctionsResult); }, delay);
  setTimeout(function() {callback(thisFunctionsResult); }, delay);
}


/**
	Last function which just shows the results array
*/
function asyncFinal(results) { 
	console.log('Done', results); 
}

function runSeries(){
	//array to hold the functions to run
	var funcsToRun = [];
	//wrap each function to be run in an outer function receiving the paramater
	//and add it with its in argument to the array

	funcsToRun.push(function(next) { asyncMultiply11(1, next); });
	funcsToRun.push(function(next) { asyncAdd123(2, next); });
	funcsToRun.push(function(next) { asyncSubtract5(3, next); });
	//call the series function with the array func and the 
	//final function as parameters.
	series(funcsToRun, asyncFinal);
}




/*
	VARIANT PÅ OVANSTÅENDE, DÄR RESULTATEN FRÅN DEN TIDIGARE FUNKTION
	SKICKAS SOM INARGUMENT TILL NÄSTA.
*/

function seriesPassingParam(passingParam, callbacks, last) {
  //array to gather results		
  var results = [];

  //define the next inner function, takes one argument 
  function next(passingParam) {
  	console.log("next in series called");
  	// get the next wrapper function callbacks
    var callback = callbacks.shift();
    console.log(callback);
    if(callback) {
      //call current wrapper function, passing a an anonymous f as
      //paramenter next, which is the result callback function. 
      console.log("calling wrapper function");
      callback(passingParam,function(res) {
        //results.push(Array.prototype.slice.call(arguments));
      results.push(res);
      next(res);
      });
    } else {
    	/*
    		Call the presentation function to show the result
    	*/
      last(results);
    }
  }
  //run next function
  console.log("last next in series called");
  next(passingParam);
}


function runSeriesPassingParam(){
	//array to hold the functions to run
	var funcsToRun = [];
	//wrap each function to be run in an outer function receiving the paramater
	//and add it with its in argument to the array

	var passingParam = 100;

	funcsToRun.push(function(passingParam, next) { asyncMultiply11(passingParam, next); });
	funcsToRun.push(function(passingParam, next) { asyncAdd123(passingParam, next); });
	funcsToRun.push(function(passingParam, next) { asyncSubtract5(passingParam, next); });
	//call the series function with the array func and the 
	//final function as parameters.
	seriesPassingParam(passingParam, funcsToRun, asyncFinal);
}


if (typeof exports != "undefined"){
	exports.run = runSeries;	
}
