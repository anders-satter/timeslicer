var conversion = {
    getMinutesFromMilliseconds: function(aMilliseconds, aTruncated) {
        if (aTruncated) {
            return Math.floor(aMilliseconds / 1000 / 60);
        } else {
            return aMilliseconds / 1000 / 60;
        }
    },
    getHoursFromSeconds: function(seconds) {
        return  this.getHoursFromMS(seconds * 1000);
    },
    getHoursFromMS: function(milliseconds) {
        var hours = Math.floor(milliseconds / 3600000);
        var splitHour = milliseconds % 3600000;
        var mins = Math.floor(splitHour / 60000);
        var splitMins = splitHour % 60000;
        var seconds = Math.floor(splitMins / 1000);
        var splitSecs = splitMins % 1000;
        var ms = Math.floor(splitSecs / 1); //won't care about rounding to nearest  millisecond,just truncate
        if (ms < 10) {
            ms = "00" + ms;
        } else if (ms < 100) {
            ms = "0" + ms;
        }

        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        if (mins < 10) {
            mins = "0" + mins;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        return  hours + ":" + mins + ":" + seconds + "." + ms;
    },
    getFullTime: function(aTimeInMs) {
        var tDate = new Date(aTimeInMs);
        var year = tDate.getFullYear();
        var month = tDate.getMonth() + 1 > 9 ? tDate.getMonth() + 1 : "0" + (tDate.getMonth() + 1);
        var date = tDate.getDate() > 9 ? tDate.getDate() : "0" + tDate.getDate();
        var hour = tDate.getHours() > 9 ? tDate.getHours() : "0" + tDate.getHours();
        var minutes = tDate.getMinutes() > 9 ? tDate.getMinutes() : "0" + tDate.getMinutes();
        var seconds = tDate.getSeconds() > 9 ? tDate.getSeconds() : "0" + tDate.getSeconds();
        var millis = tDate.getMilliseconds();
        if (millis < 10) {
            millis = '00' + millis;
        } else if (millis < 100) {
            millis = '0' + millis;
        }
        return year + '-' + month + '-' + date + '_' + hour + ':' + minutes + ':' + seconds + '.' + millis;
    },
    getTimeDiffFromStrToMS: function (startDate, endDate){
        return new Date(endDate).getTime() - new Date(startDate).getTime();
    },

    /*
        Timeslicer convenience methods
    */
    getTimeDiffStrToMinutes: function (startDate, endDate){
        return (new Date(endDate).getTime() - new Date(startDate).getTime())/60000;
    }

};

var start = "2013-12-01 08:30";
var end = "2013-12-01 12:30";
var mins = conversion.getMinutesFromMilliseconds(
        conversion.getTimeDiffFromStrToMS(start, end));

mins = conversion.getTimeDiffStrToMinutes(start, end);


var hrs = conversion.getHoursFromMS(conversion.getTimeDiffFromStrToMS(start, end));
//console.log(mins);
//console.log(hrs);



exports.conversion = conversion;