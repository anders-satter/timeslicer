var TimeItem = function(aJsonTimeItem){
  this.jsonTimeItem = aJsonTimeItem;
};
TimeItem.prototype = {
  jsonToLogFormat: function(){
    /*
     * return this string to write to log file
     */
    return this.jsonTimeItem.toString();
  }
};

var Project = function(aJsonProjectName){
  this.jsonProjectName = aJsonProjectName.name;
  this.activityList = [];
};
Project.prototype = {
  jsonToLogFormat: function(){
    /*
     * return this string to write to log file
     */
    return this.jsonProjectName.name;
  },
  addActivity: function(aActivityName){
    this.activityList.push('+' + aActivityName);
  }
};



