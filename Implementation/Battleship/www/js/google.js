/**
 * Created by Konrad on 24.05.2016.
 */
// Used code from https://github.com/valenzia10/PhonegapGoogleLogin with adaptions

// ID: 708702485042-s11v7gp2s8uhbs7fksveljn6ijspmknc.apps.googleusercontent.com
// Secret: 5byGeQmZ9cOa4NuL_4lQmisQ

var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.google = function (id, secret) {
    var me  = this;
    this.clientId = id;
    this.clientSecret = secret;
    this.accessToken = {};
    this.authWindow = null;
    this.endSignin = function(){};
    this.inAppBrowser = window;

    this.openAuthWindow = function () {
        var urlAuth = "https://accounts.google.com/o/oauth2/auth?"
            + "scope=https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/games&"
            + "redirect_uri=http://localhost&"
            + "response_type=code&"
            + "client_id=" + me.clientId;

        me.authWindow = me.inAppBrowser.open(urlAuth, '_blank', 'location=yes,toolbar=yes');
        me.authWindow.addEventListener('loadstart', me.parseRedirectUrl);

    };

    this.parseRedirectUrl = function (e) {
        var url = e.url;
        var thereIsCode = url.indexOf("code=");
        var thereIsError = url.indexOf("error=");

        if (thereIsCode != -1) {
            me.authWindow.close();
            var toMatch = "code=([^&#]*)";
            var regex = new RegExp(toMatch);
            var result = regex.exec(url);
            if (result != null) {
                var code = result[1];
                me.exchangeCodeForTokens(code);
            }
        } else if (thereIsError != -1) {
            me.authWindow.close();
            localStorage["accessToken"] = null;
            me.endSignin(-1);
            alert("Login Error")
        }
    };

    this.exchangeCodeForTokens = function (code) {
        var dataQuery = "code=" + code + "&"
            + "client_id=" + me.clientId + "&"
            + "client_secret=" + me.clientSecret + "&"
            + "redirect_uri=http://localhost&"
            + "grant_type=authorization_code";
        me.requestTokens("https://accounts.google.com/o/oauth2/token", dataQuery, me.callBackTokens);
    };

    this.callBackTokens = function (resp) {
        var tokensResp = eval('(' + resp + ')');
        if (tokensResp.access_token) {
            localStorage["accessToken"] = tokensResp.access_token;
            localStorage["refreshToken"] = tokensResp.refresh_token;
            localStorage["refreshTime"] = (new Date()).getTime() + 1000 * tokensResp.expires_in;

            me.accessToken = tokensResp.access_token;
            //alert("Login Successful");
            me.endSignin(me.accessToken);
        } else {
            me.accessToken = null;
            localStorage["accessToken"] = null;
            alert("Login Error");
            me.endSignin(-1);

        }
    };

    this.getAccessToken = function (refreshToken) {
        var dataQuery = "client_id=" + me.clientId + "&"
            + "client_secret=" + me.clientSecret + "&"
            + "refresh_token=" + refreshToken + "&"
            + "grant_type=refresh_token";

        me.requestTokens("https://accounts.google.com/o/oauth2/token", dataQuery, me.callBackRefreshToken);
    };

    this.callBackRefreshToken = function (resp) {
        var tokensResp = eval('(' + resp + ')');

        if (tokensResp.access_token) {
            localStorage["accessToken"] = tokensResp.access_token;
            localStorage["refreshTime"] = (new Date()).getTime() + 1000 * tokensResp.expires_in;

            me.accessToken = tokensResp.access_token;
            //alert("Login successful");
            me.endSignin(me.accessToken);
        } else {
            me.accessToken = null;
            localStorage["accessToken"] = null;
            alert("Login Error");
            me.endSignin(-1);
        }
    };

    this.requestTokens = function (url, data, callback) {
        var xmlreq = new XMLHttpRequest();

        xmlreq.onreadystatechange = function () {
            if (xmlreq.readyState == 4) {
                callback(xmlreq.responseText);
            }
        };
        xmlreq.open("POST", url, true);
        xmlreq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlreq.send(data);
    };

    this.isLoggedIn = function (callback) {
        me.endSignin = callback;
        me.accessToken = localStorage["accessToken"];

        if (me.accessToken == "null") {
            me.accessToken = null;
        }
        if (me.accessToken !== null && typeof(me.accessToken) !== 'undefined') {
            var refreshTime = localStorage["refreshTime"];
            var refreshToken = localStorage["refreshToken"];
            var currentTime = (new Date()).getTime();

            if (currentTime < refreshTime) {
                me.endSignin(me.accessToken);
                return 1;
            } else {
                me.getAccessToken(refreshToken);
            }
        } else {
            //alert("Not logged in yet");
            me.endSignin(-1);
            return -1;
        }
    };

    this.startSignin = function (callbackEnd) {

        me.endSignin = callbackEnd;
        me.openAuthWindow();
    };

    this.logOut = function () {
        me.accessToken = null;
        localStorage["accessToken"] = null;
        localStorage["refreshToken"] = null;
        alert("Logged out");
    };

    // https://developers.google.com/games/services/web/api/achievements/list#http-request
    this.getAchievementsForMe = function (callback) {
        var term = null;
        $.ajax({
            url: 'https://www.googleapis.com/games/v1/players/me/achievements?alt=json&access_token=' + localStorage["accessToken"],
            type: 'GET',
            data: term,
            dataType: 'json',
            error: function (jqXHR, text_status, strError) {
                alert("Error retrieving Achievements. Are you logged in to Google?");
            },
            success: function (data) {
                callback(data);
            }
        });
    };

    // https://developers.google.com/games/services/web/api/achievementDefinitions/list
    this.getAllAchievements = function (callback) {
        var term = null;
        $.ajax({
            url: 'https://www.googleapis.com/games/v1/achievements?alt=json&access_token=' + localStorage["accessToken"],
            type: 'GET',
            data: term,
            dataType: 'json',
            error: function (jqXHR, text_status, strError) {
                alert("Error retrieving Achievements. Are you logged in to Google?");
            },
            success: function (data) {
                callback(data);
            }
        });
    };

    // https://developers.google.com/games/services/web/api/achievements/increment#request-body
    // https://play.google.com/apps/publish/?dev_acc=17036200129010867503#AchievementsPlace:gt=708702485042
    // Fleet Admiral - CgkIsvTWj9AUEAIQAw - Play 50 Games
    // Captain Jack Sparrow - CgkIsvTWj9AUEAIQBA - Lose 20 Games
    // Multiplayer Master - CgkIsvTWj9AUEAIQBg - Win 30 Multiplayer Games
    this.incrementAchievement = function (achievementId) {
        //var achievementId = 'CgkIsvTWj9AUEAIQBg';
        var term = null;
        $.ajax({
            url: 'https://www.googleapis.com/games/v1/achievements/' + achievementId + '/increment?alt=json&stepsToIncrement=1&access_token=' + localStorage["accessToken"],
            type: 'POST',
            data: term,
            dataType: 'json',
            error: function (jqXHR, text_status, strError) {
                alert("Error retrieving Achievements. Are you logged in to Google?");
            },
            success: function (data) {
                var response = JSON.parse(JSON.stringify(data));
                var steps = response.currentSteps;
                var newlyUnlocked = response.newlyUnlocked;
            }
        });
    };

    // https://developers.google.com/games/services/web/api/achievements/unlock#request
    // https://play.google.com/apps/publish/?dev_acc=17036200129010867503#AchievementsPlace:gt=708702485042
    // Beginner - CgkIsvTWj9AUEAIQAQ - Finish first game
    // Multiplayer - CgkIsvTWj9AUEAIQAg - Finish first multiplayer game
    this.unlockAchievement = function (achievementId) {
        //var achievementId = 'CgkIsvTWj9AUEAIQAQ';
        var term = null;
        $.ajax({
            url: 'https://www.googleapis.com/games/v1/achievements/' + achievementId + '/unlock?alt=json&access_token=' + localStorage["accessToken"],
            type: 'POST',
            data: term,
            dataType: 'json',
            error: function (jqXHR, text_status, strError) {
                alert("Error retrieving Achievements. Are you logged in to Google?");
            },
            success: function (data) {
                var response = JSON.parse(JSON.stringify(data));
                var newlyUnlocked = response.newlyUnlocked;
                //alert(newlyUnlocked);
            }
        });
    };

    this.onGameStart = function (multiplayer) {
        //multiplayer true for multiplayer false for singleplayer
        if(multiplayer){
            me.unlockAchievement("CgkIsvTWj9AUEAIQAg");
        }else{
            me.unlockAchievement("CgkIsvTWj9AUEAIQAQ");
        }
        me.incrementAchievement("CgkIsvTWj9AUEAIQAw");

    };
    this.onGameGameFinished = function (multiplayer,win) {
        // win true for win false for lose
        //multiplayer true for multiplayer false for singleplayer
        if(multiplayer){
            if(win){ // multiplayer game won
                me.incrementAchievement("CgkIsvTWj9AUEAIQBg");
            }else{ // multiplayer lose
                me.incrementAchievement("CgkIsvTWj9AUEAIQBA");
            }
        }else{
            if(!win){ // singleplayer game won
                me.incrementAchievement("CgkIsvTWj9AUEAIQBA");
            }
        }

    };
    this.initialLogin = function () {
        me.isLoggedIn(function (result) {
            if(result === -1){
                me.startSignin(function (result1) {
                });
            }
        });
    };
    return {
        startSignin: this.startSignin,
        isLoggedIn: this.isLoggedIn,
        logOut: this.logOut,
        getAchievementsForMe: this.getAchievementsForMe,
        getAllAchievements: this.getAllAchievements,
        incrementAchievement: this.incrementAchievement,
        unlockAchievement: this.unlockAchievement,
        onGameStart:this.onGameStart,
        onGameFinished:this.onGameGameFinished,
        initialLogin:this.initialLogin
    };
};
