/**
 * Created by Konrad on 24.05.2016.
 */
// Used code from https://github.com/valenzia10/PhonegapGoogleLogin with adaptions

// ID: 708702485042-s11v7gp2s8uhbs7fksveljn6ijspmknc.apps.googleusercontent.com
// Secret: 5byGeQmZ9cOa4NuL_4lQmisQ

var Google = function (id, secret) {
    var clientId = id;
    var clientSecret = secret;
    var accessToken = {};
    var authWindow = null;
    var endSignin = {};

    var openAuthWindow = function () {
        var urlAuth = "https://accounts.google.com/o/oauth2/auth?"
            + "scope=https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/games&"
            + "redirect_uri=http://localhost&"
            + "response_type=code&"
            + "client_id=" + clientId;


        // Open InAppBrowser to get authorization code
        authWindow = window.open(urlAuth, '_blank', 'location=yes,toolbar=no');
        authWindow.addEventListener('loadstart', parseRedirectUrl);

    };

    var parseRedirectUrl = function (e) {
        var url = e.url;
        var thereIsCode = url.indexOf("code=");
        var thereIsError = url.indexOf("error=");

        if (thereIsCode != -1) {
            authWindow.close();
            var toMatch = "code=([^&#]*)";
            var regex = new RegExp(toMatch);
            var result = regex.exec(url);
            if (result != null) {
                var code = result[1];
                exchangeCodeForTokens(code);
            }
        } else if (thereIsError != -1) {
            authWindow.close();
            localStorage["accessToken"] = null;
            endSignin = -1;
            alert("Login Error")
        }
    };

    var exchangeCodeForTokens = function (code) {
        var dataQuery = "code=" + code + "&"
            + "client_id=" + clientId + "&"
            + "client_secret=" + clientSecret + "&"
            + "redirect_uri=http://localhost&"
            + "grant_type=authorization_code";
        requestTokens("https://accounts.google.com/o/oauth2/token", dataQuery, callBackTokens);
    };

    var callBackTokens = function (resp) {
        var tokensResp = eval('(' + resp + ')');
        if (tokensResp.access_token) {
            localStorage["accessToken"] = tokensResp.access_token;
            localStorage["refreshToken"] = tokensResp.refresh_token;
            localStorage["refreshTime"] = (new Date()).getTime() + 1000 * tokensResp.expires_in;

            accessToken = tokensResp.access_token;
            //alert("Login Successful");
            endSignin = accessToken;
            //return 1;
        } else {
            accessToken = null;
            localStorage["accessToken"] = null;
            alert("Login Error");
            endSignin = -1;
            //return -1;
        }
    };

    var getAccessToken = function (refreshToken) {
        var dataQuery = "client_id=" + clientId + "&"
            + "client_secret=" + clientSecret + "&"
            + "refresh_token=" + refreshToken + "&"
            + "grant_type=refresh_token";

        requestTokens("https://accounts.google.com/o/oauth2/token", dataQuery, callBackRefreshToken);
    };

    var callBackRefreshToken = function (resp) {
        var tokensResp = eval('(' + resp + ')');

        if (tokensResp.access_token) {
            localStorage["accessToken"] = tokensResp.access_token;
            localStorage["refreshTime"] = (new Date()).getTime() + 1000 * tokensResp.expires_in;

            accessToken = tokensResp.access_token;
            alert("Login successful");
            endSignin = accessToken;
        } else {
            accessToken = null;
            localStorage["accessToken"] = null;
            alert("Login Error");
            endSignin = -1;
        }
    };

    var requestTokens = function (url, data, callback) {
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

    var isLoggedIn = function (callback) {
        endSignin = callback;
        accessToken = localStorage["accessToken"];

        if (accessToken == "null") {
            accessToken = null;
        }

        if (accessToken !== null && typeof(accessToken) !== 'undefined') {
            var refreshTime = localStorage["refreshTime"];
            var refreshToken = localStorage["refreshToken"];
            var currentTime = (new Date()).getTime();

            if (currentTime < refreshTime) {
                //alert("Logged in");
                endSignin(accessToken);
            } else {
                getAccessToken(refreshToken);
            }
        } else {
            //alert("Not logged in yet");
            endSignin(-1);
        }
    };

    var startSignin = function (callbackEnd) {
        endSignin = callbackEnd;
        openAuthWindow();
    };

    var logOut = function () {
        accessToken = null;
        localStorage["accessToken"] = null;
        localStorage["refreshToken"] = null;
        alert("Logged out");
    };

    // https://developers.google.com/games/services/web/api/achievements/list#http-request
    var getAchievementsForMe = function (callback) {
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
               // alert("Achivements downloaded");
                callback(data);
                //var allAchievements = JSON.parse(JSON.stringify(data));
                /*for (var i in allAchievements.items) {
                    alert(allAchievements.items[i].id + ' : ' + allAchievements.items[i].achievementState);
                }*/
            }
        });
    };

    // https://developers.google.com/games/services/web/api/achievementDefinitions/list
    var getAllAchievements = function (callback) {
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
                var allAchievements = JSON.parse(JSON.stringify(data));

                /*for (var i in allAchievements.items) {
                    alert(allAchievements.items[i].name);
                }*/
            }
        });
    };

    // https://developers.google.com/games/services/web/api/achievements/increment#request-body
    // https://play.google.com/apps/publish/?dev_acc=17036200129010867503#AchievementsPlace:gt=708702485042
    // Fleet Admiral - CgkIsvTWj9AUEAIQAw - Play 50 Games
    // Captain Jack Sparrow - CgkIsvTWj9AUEAIQBA - Lose 20 Games
    // Multiplayer Master - CgkIsvTWj9AUEAIQBg - Win 30 Multiplayer Games
    var incrementAchievement = function (achievementId) {
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
                //alert(steps);
            }
        });
    };

    // https://developers.google.com/games/services/web/api/achievements/unlock#request
    // https://play.google.com/apps/publish/?dev_acc=17036200129010867503#AchievementsPlace:gt=708702485042
    // Beginner - CgkIsvTWj9AUEAIQAQ - Finish first game
    // Multiplayer - CgkIsvTWj9AUEAIQAg - Finish first multiplayer game
    var unlockAchievement = function (achievementId) {
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
                alert(newlyUnlocked);
            }
        });
    };

    return {
        startSignin: startSignin,
        isLoggedIn: isLoggedIn,
        logOut: logOut,
        getAchievementsForMe: getAchievementsForMe,
        getAllAchievements: getAllAchievements,
        incrementAchievement: incrementAchievement,
        unlockAchievement: unlockAchievement
    };
};
