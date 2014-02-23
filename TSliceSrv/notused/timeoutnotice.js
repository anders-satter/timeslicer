
/**
 * functions and variables to make the old api working 
 * towards nettrade, capax and speedledger
 */
var medWin = false;
var logOut = false;
var updated = false;

/*
 * timeoutUpdateOpenerWindow and checkWindowOpener are only called on the local copy of tdepres.js
 */
function timeout(aTime, active, localeParam) {

    if (active) {
        if (window["timeoutManager"]) {
            timeoutManager.restart();
        }
    }
}

/**
 * Manages the timeout reminder popup window and the logout functionality for af2 applications
 * @param {type} aSecsToTimeout
 * @param {type} aSecsToPopup
 * @param {type} aLogoutUrl
 * @param {type} aSessionUpdateUrl
 * @param {type} aParentWindow
 * @param {type} aMultiWindowLogout
 * @param {type} aLocale
 * @param {type} aTimeoutNoActivityText
 * @returns {TimeoutManager}
 */
var TimeoutManager = function(aSecsToTimeout, aSecsToPopup, aLogoutUrl, aSessionUpdateUrl, aParentWindow, aMultiWindowLogout, aLocale, aTimeoutNoActivityText, aLocalizedPopupTextMap) {
    var secsToTimeoutInternal = aSecsToTimeout;
    var secsToPopupInternal = aSecsToPopup;
    var logoutUrlInternal = aLogoutUrl;
    var sessionUpdateUrlInternal = aSessionUpdateUrl;
    this.parentWindow = aParentWindow;
    this.multiWindowLogout = aMultiWindowLogout;
    this.getLocale = function() {
        return aLocale;
    };
    this.getTimeoutNoActivityText = function() {
        return   aTimeoutNoActivityText;
    };
    this.getLocalizedPopupTextMap = function() {
        return   aLocalizedPopupTextMap;
    };
    //priviliged access
    /**
     * 
     * @returns {TimeoutManager.getConfig.Anonym$0}
     */
    this.getConfig = function() {
        return {
            secsToTimeout: secsToTimeoutInternal,
            secsToPopup: secsToPopupInternal,
            logoutUrl: logoutUrlInternal,
            sessionUpdateUrl: sessionUpdateUrlInternal
        };
    };
    /**
     * 
     * @param {type} aMap
     * @returns {undefined}
     */
    this.setConfig = function(aMap) {
        secsToTimeoutInternal = aMap.secsToTimeout;
        secsToPopupInternal = aMap.secsToPopup;
        logoutUrlInternal = aMap.logoutUrl;
        sessionUpdateUrlInternal = aMap.sessionUpdateUrl;
    };
};

TimeoutManager.prototype = {
    doLog: false,
    suppressPopup: false,
    popupIsVisible: false,
    /**
     * Initialisation of the object and start of 
     * the timer.
     * @returns {undefined}
     */
    init: function() {
        var instance = this;
        this.logToConsole("init" + instance);
        this.executeShowPopup = new this.ExecuteOnce(function() {
            instance.showPopup();
        });
        this.executeShowPopup.reset();
        this.executeTimeout = new this.ExecuteOnce(function() {
            instance.performLogout();
        });
        this.executeTimeout.reset();
        var tNow = new Date().getTime();
        this.popupTime = tNow + this.getConfig().secsToPopup * 1000;
        this.timeoutTime = tNow + this.getConfig().secsToTimeout * 1000;
        this.logToConsole("intervalId before: " + this.intervalId);
        clearInterval(this.intervalId);

        //setting global for backwards compatibility
        updated = false;


        //this.intervalId = setInterval(instance.run,1000);
        /*
         * this is the only way to use setInterval without
         * getting scope problem in the run method
         * The above idiom sets the run method in window scope
         * meaning that it cannot access the members of the current
         * instance of TimeoutManager.
         */
        this.intervalId = setInterval(function() {
            instance.run();
        }, 1000);
        this.logToConsole("intervalId after: " + this.intervalId);
    },
    run: function() {
        var tNow = new Date().getTime();
        if (this.doLog) {
            var ttpu = this.popupTime - tNow;
            if (ttpu <= 0) {
                ttpu = 0;
            }
            var ttto = this.timeoutTime - tNow;
            if (ttto <= 0) {
                ttto = 0;
            }
            this.logToConsole("run timeToPopup: " + timeConversionUtil.getHoursFromMS(ttpu) + " timeToTimeout:" + timeConversionUtil.getHoursFromMS(ttto));
        }
        //for ie...
        window.status = timeConversionUtil.getMinutesFromMilliseconds(this.timeoutTime - tNow + 60000, true) + ' ' + this.getTimeoutNoActivityText();
        if (this.timeIsReached(this.popupTime)) {
            this.executeShowPopup.execute();
        }
        if (this.timeIsReached(this.timeoutTime)) {
            this.executeTimeout.execute();
        }
        ;
    },
    clientExists: function(aClient) {
        var tClientList = this.getClientList();
        for (var i = 0; i < tClientList.length; i++) {
            if (tClientList[i] === aClient) {
                return true;
            }
        }
        return false;
    },
    getClientList: function() {
        var tClientList = new Array();
        /*
         * when doing this the same owner can be added more
         * than once to the array
         */
        for (var i = 0; i < this.doBeforeShowPopupHandlerList.length; i++) {
            tClientList.push(this.doBeforeShowPopupHandlerList[i].owner);
        }
        for (var i = 0; i < this.doBeforeRestartHandlerList.length; i++) {
            tClientList.push(this.doBeforeRestartHandlerList[i].owner);
        }
        for (var i = 0; i < this.doBeforeLogoutHandlerList.length; i++) {
            tClientList.push(this.doBeforeLogoutHandlerList[i].owner);
        }
        return tClientList;
    },
    timeIsReached: function(aTime) {
        var tNow = new Date().getTime();
        return tNow >= aTime;
    },
    stop: function() {
        this.logToConsole("calling stop");
        clearInterval(this.intervalId);
    },
    doBeforeShowPopupHandlerList: (function() {
        return new Array();
    })(),
    doBeforeRestartHandlerList: (function() {
        return new Array();
    })(),
    doBeforeLogoutHandlerList: (function() {
        return new Array();
    })(),
    clearArray: function(aArray) {
        aArray.splice(0, aArray.length);
    },
    clearHandlers: function() {
        this.clearArray(this.doBeforeRestartHandlerList);
        this.clearArray(this.doBeforeShowPopupHandlerList);
        this.clearArray(this.doBeforeLogoutHandlerList);
    },
    /**
     * Closes the popup, if it is open
     * and restarts the timer from 
     * the beginning 
     * @returns {undefined}
     */
    restart: function() {
        this.logToConsole("restart");
        for (var i = 0; i < this.doBeforeRestartHandlerList.length; i++) {
            this.doBeforeRestartHandlerList[i]();
        }
        this.closePopup();
        this.init();
    },
    isNotEmpty: function(aObj) {
        if (typeof(aObj) === "undefined") {
            return false;
        }
        if (aObj !== null) {
            return true;
        } else {
            return false;
        }
    },
    addDoBeforeShowPopupHandler: function(aFunc, aOwnerWindow) {
        if (this.isNotEmpty(aFunc) && this.isNotEmpty(aOwnerWindow)) {
            var tId = Math.floor((Math.random() * 1000000) + 1);
            this.doBeforeShowPopupHandlerList.push({f: aFunc, owner: aOwnerWindow, handlerId: tId});
            return tId;
        } else
            throw new Error("aFunc or ownerWindow was empty");
    },
    addDoBeforeRestartHandler: function(aFunc, aOwnerWindow) {
        if (this.isNotEmpty(aFunc) && this.isNotEmpty(aOwnerWindow)) {
            var tId = Math.floor((Math.random() * 1000000) + 1);
            this.doBeforeRestartHandlerList.push({f: aFunc, owner: aOwnerWindow, handlerId: tId});
            return tId;
        } else
            throw new Error("aFunc or ownerWindow was empty");
    },
    addDoBeforeLogoutHandler: function(aFunc, aOwnerWindow) {
        if (this.isNotEmpty(aFunc) && this.isNotEmpty(aOwnerWindow)) {
            var tId = Math.floor((Math.random() * 1000000) + 1);
            this.doBeforeLogoutHandlerList.push({f: aFunc, owner: aOwnerWindow, handlerId: tId});
            return tId;
        } else
            throw new Error("aFunc or ownerWindow was empty");
    },
    handlerIsRegistered: function(aId, aOwner) {
        this.logToConsole("Checking handler: " + aId + " owner " + aOwner);
        var tRet = false;
        for (var i = 0; i < this.doBeforeShowPopupHandlerList.length; i++) {
            if (this.doBeforeShowPopupHandlerList[i].handlerId === aId && this.doBeforeShowPopupHandlerList[i].owner === aOwner) {
                tRet = true;
                break;
            }
        }
        if (!tRet) {
            for (var i = 0; i < this.doBeforeRestartHandlerList.length; i++) {
                if (this.doBeforeRestartHandlerList[i].handlerId === aId && this.doBeforeRestartHandlerList[i].owner === aOwner) {
                    tRet = true;
                    break;
                }
            }
        }

        if (!tRet) {
            for (var i = 0; i < this.doBeforeLogoutHandlerList.length; i++) {
                if (this.doBeforeLogoutHandlerList[i].handlerId === aId && this.doBeforeLogoutHandlerList[i].owner === aOwner) {
                    tRet = true;
                    break;
                }
            }
        }

        if (tRet)
            this.logToConsole("handler found");
        else
            this.logToConsole("handler NOT found");
        return tRet;
    },
    intervalId: -1,
    popupTime: -1,
    timeoutTime: -1,
    instance: null,
    /**
     * Executes the supplied function once
     * @param {type} aFunc
     * @returns {TimeoutManager.prototype.executeOnce.Anonym$1}
     */
    ExecuteOnce: function(aFunc) {
        var runnit = false;
        var f = aFunc;
        var rst = function() {
            runnit = true;
        };
        var ex = function() {
            if (runnit) {
                f();
                runnit = false;
            }
        };
        return {
            reset: rst,
            execute: ex
        };
    },
    executeShowPopup: null,
    executeTimeout: null,
    /**
     * 
     * @param {type} aArray
     * @param {type} aRemovableItems
     * @returns {undefined}
     */
    removeItemsFromList: function(aArray, aRemovableItems) {
        if (aArray && aArray.length > 0) {
            if (aRemovableItems && aRemovableItems.length > 0) {
                for (var i = 0; i < aRemovableItems.length; i++) {
                    this.logToConsole("removing item" + aRemovableItems[i]);
                    aArray.splice(aRemovableItems[i]);
                }
            }
        }
    },
    /**
     * Only performing
     * @type Boolean
     */
    performDoBeforeShowPopupHandlerList: function() {
        tRemovableItems = [];
        for (var i = 0; i < this.doBeforeShowPopupHandlerList.length; i++) {
            if (this.ownerIsStillAround(this.doBeforeShowPopupHandlerList[i].owner)) {
                this.doBeforeShowPopupHandlerList[i].f();
            } else {
                //owner has disappeared, remove this handler
                tRemovableItems.push(i);
            }
        }
        /*
         * remove functions with no owner
         */
        this.removeItemsFromList(this.doBeforeShowPopupHandlerList, tRemovableItems);
    },
    performDoBeforeRestartHandlerList: function() {
        tRemovableItems = [];
        for (var i = 0; i < this.doBeforeRestartHandlerList.length; i++) {
            if (this.ownerIsStillAround(this.doBeforeRestartHandlerList[i].owner)) {
                this.doBeforeRestartHandlerList[i].f();
            } else {
                //owner has disappeard, remove this handler
                tRemovableItems.push(i);
            }
        }
        /*
         * remove functions with no owner
         */
        this.removeItemsFromList(this.doBeforeRestartHandlerList, tRemovableItems);
    },
    performDoBeforeLogoutHandlerList: function() {
        tRemovableItems = [];
        for (var i = 0; i < this.doBeforeLogoutHandlerList.length; i++) {
            if (this.ownerIsStillAround(this.doBeforeLogoutHandlerList[i].owner)) {
                this.doBeforeLogoutHandlerList[i].f();
            } else {
                //owner has disappeard, remove this handler
                tRemovableItems.push(i);
            }
        }
        /*
         * remove functions with no owner
         */
        this.removeItemsFromList(this.doBeforeLogoutHandlerList, tRemovableItems);
    },
    /**
     * 
     * @param {type} aOwner
     * @returns {Boolean}
     */
    ownerIsStillAround: function(aOwner) {
        if (this.doLog) {
            if (aOwner) {
                this.logToConsole("aOwner exists");
            } else {
                this.logToConsole("aOwner==null or aOwner is undefined");
            }
            if (aOwner.open) {
                this.logToConsole("aOwner.open===true");
            } else {
                this.logToConsole("aOwner.open===false");
            }
            if (!aOwner.closed) {
                this.logToConsole("!aOwner.closed===true");
            } else {
                this.logToConsole("!aOwner.closed===false");
            }
        }
        return aOwner && aOwner.open && !aOwner.closed;
    },
    popupWindow: null,
    constructPopup: function() {
        var tRet = false;
        this.popupWindow = window.open('', "fsbTimeout", "width=450,height=200,screenX=100,screenY=100,top=100,left=100,resizable=no,scrollbars=no,location=0");
        if (!this.popupWindow) {
            //popup was blocked
            return tRet;
        }
        var html = [];
        html.push('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">');
        html.push('<html><head><title>Swedbank AB (publ)</title>');
        html.push('<link href="/DAP_Appl_FrameworkWebResource_WEB/css/main.css" rel="stylesheet" type="text/css" media="all"/>');
        html.push('<link href="/DAP_Appl_FrameworkWebResource_WEB/css/print.css" rel="stylesheet" type="text/css" media="print"/>');
        html.push('<link href="/DAP_Appl_FrameworkWebResource_WEB/css/speech.css" rel="stylesheet" type="text/css" media="speech"/>');
        html.push('<link href="/DAP_Appl_FrameworkWebResource_WEB/css/handheld.css" rel="stylesheet" type="text/css" media="handheld"/>');
        html.push('<script type="text/javascript" src="/DAP_Appl_FrameworkWebResource_WEB/js/jquery.js"></script>');
        html.push('<script type="text/javascript" src="/DAP_Appl_FrameworkWebResource_WEB/js/jquery-ui.js"></script>');
        html.push('<script type="text/javascript" src="/DAP_Appl_FrameworkWebResource_WEB/js/timeoutnotice.js"></script>');
        html.push('</head>');
        html.push('<body class="popup">');
        html.push('<div id="content">');
        html.push('<div class="section system">');
        html.push('<div class="header">');
        html.push('<h3><span>Driftmeddelande</span></h3>');
        html.push('</div>'); //header
        html.push('<div class="content">');
        html.push('<p><span>' + this.getLocalizedPopupTextMap().text1 + ' </span>15<span> ' + this.getLocalizedPopupTextMap().text2 + '</span></p>');
        html.push('<p><span>' + this.getLocalizedPopupTextMap().text3 + '</span></p>');
        html.push('</div>'); //content
        html.push('<div class="footer">');
        html.push('<input id="refreshButton" title="refreshButton" type="button" value="Aktivera" >');
        html.push('<input id="logoutButton" title="logoutButton" type="button" value="Logga ut" >');
        html.push('</div>'); //footer
        html.push('</div>'); //section system
        html.push('</div>'); //content	
        html.push('</body>');
        html.push('</html>');
        var doc = this.popupWindow.document;
        doc.open();
        doc.write(html.join("\n"));
        doc.close();
        return true;
    },
    showPopup: function() {
        this.performDoBeforeShowPopupHandlerList();
        this.logToConsole("suppressPopup=" + this.suppressPopup);
        if (!this.popupIsVisible && !this.suppressPopup) {
            //setting global for backwards compatibility
            medWin = true;
            this.popupIsVisible = true;
            this.logToConsole("showing popup");
            if (this.constructPopup()) {
                var tInstance = this;
                setTimeout(function() {
                    tInstance.popupWindow.popupEventHandlerManager.setHandlers(tInstance);
                }, 2000);
            }
        } else {
            this.suppressPopup = false;
            this.logToConsole("popup not showing: popupIsVisible=" + this.popupIsVisible + ", suppressPopup=" + this.suppressPopup);
        }
    },
    closePopup: function() {
        if (this.popupIsVisible && this.popupWindow !== null) {
            this.popupIsVisible = false;
            //setting global for backwards compatibility
            medWin = false;

            this.logToConsole("closing popup");
            this.popupWindow.close();
            //this.restart();
            return true;
        } else {
            return false;
        }
    },
    doProlongation: false,
    performLogout: function() {
        this.performDoBeforeLogoutHandlerList(); //NB a supplied function could restart the timer
        this.closePopup();
        if (this.doProlongation) {
            this.doProlongation = false;
            this.prolong();
        } else {
            //setting global for backwards compatibility
            logOut = true;
            this.logToConsole("performing logout");
            this.multiWindowLogout.onLinkClick(this.multiWindowLogout.af2LogoutUrl(this.parentWindow));
            this.multiWindowLogout.logoutCurrentAf2Window(this.parentWindow);
        }
    },
    prolong: function() {
        this.closePopup();
        this.logToConsole("performing prolongation");
        this.restart();
    },
    logToConsole: function(message) {
        this.logToConsoleHandler(message);
    },
    /**
     * Used by clients that wants a restart. Need to assure
     * that clients that have scheduled handlers are not 
     * affected. Initial hypothesis is that they are not 
     * affected 
     */
    requestRestart: function() {
        this.logToConsole("restart requested from client");
        this.restart();
    },
    /**
     * The function that handles the logging, 
     * could be overridden with another one
     * @param {type} message
     * @returns {undefined}
     */
    logToConsoleHandler: (function(message) {
        try {
            if (this.doLog && console && console.log) {
                console.log(timeConversionUtil.getFullTime(new Date().getTime()) + " " + message);
            }
        } catch (exception) {
            // silently ignore    
        }
    })
};


/**
 * Used in the popupWindow
 */
var popupEventHandlerManager = {
    setHandlers: function(openerTimeoutManager) {
        if (openerTimeoutManager) {
            $(document).ready(function() {
                var tRefreshButton = document.getElementById("refreshButton");
                if (tRefreshButton) {
                    $(tRefreshButton).click(function() {
                        //$.get("/TDE_DAP_Portal_Framework_WEB/timeout?command=refresh" + "&r=" + new Date().getTime());
                        $.get("/logout/timeout?command=refresh" + "&r=" + new Date().getTime());
                    });
                    $(tRefreshButton).click(function() {
                        setTimeout(function() {
                            openerTimeoutManager.prolong();
                        }, 1000);
                    });
                }
                var tLogoutButton = document.getElementById("logoutButton");
                if (tLogoutButton) {
                    $(tLogoutButton).click(function() {
                        openerTimeoutManager.performLogout();
                    });
                }
            });
        }
    }
};

var timeConversionUtil = {
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
    }
};
