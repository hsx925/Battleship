/**
 * Created by ralfkralicek on 31/05/16.
 */
var BATTLESHIP = BATTLESHIP || {};


BATTLESHIP.achievementsConrollter = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        $(document).on("pagebeforeshow", "#achievementPage", this.onPageBeforeShow); // Before entering main-menu
        console.log("Achievements Controller triggered");

    },
    onPageBeforeShow:function () {
        console.log("onBeforePageShow");
        var google = BATTLESHIP.google;
        google.isLoggedIn(function (result){
             if (result !== -1) {
                google.getAllAchievements(function (data) {
                    createList(data,function (result1) {
                        if (result1===1){
                            google.getAchievementsForMe(function (data){
                                var myAchievements = JSON.parse(JSON.stringify(data));
                                //alert(JSON.stringify(myAchievements));
                                for(var i in myAchievements.items){ //myAchievements.items[i].id
                                    var div = $("#"+myAchievements.items[i].id);
                                    if(myAchievements.items[i].achievementState =="UNLOCKED"){
                                        div.removeClass();
                                        div.addClass("unlocked");
                                    }
                                    var stepsDiv = $("#Steps"+myAchievements.items[i].id);
                                    var text = stepsDiv.text();
                                    if(myAchievements.items[i].currentSteps){
                                        stepsDiv.text(myAchievements.items[i].currentSteps+text);
                                    }else{
                                        stepsDiv.text(0+text);
                                    }
                                }
                            });
                        }
                    })
                });
             }
         });
    },
    /*loginOutAchievements: function () {
        alert("loginOutClicked");
        BATTLESHIP.google.isLoggedIn(function (result) {
            if(result === -1){
                BATTLESHIP.google.startSignin(function (result1) {
                });
            }else{
                BATTLESHIP.google.logOut()
                BATTLESHIP.achievementsConrollter.dropAchievements()
            }
        });
    },*/
    var: createList = function (data,callback) {
        var achievementsList = $('#achievementList');
        var allAchievements = JSON.parse(JSON.stringify(data));

        for (var i in allAchievements.items) {
            if(allAchievements.items[i].achievementType === "INCREMENTAL"){
                var divListItem = createListItem(allAchievements.items[i].id,allAchievements.items[i].revealedIconUrl,allAchievements.items[i].name,allAchievements.items[i].description,allAchievements.items[i].achievementType,allAchievements.items[i].totalSteps);
            }else{
                var divListItem = createListItem(allAchievements.items[i].id,allAchievements.items[i].revealedIconUrl,allAchievements.items[i].name,allAchievements.items[i].description);
            }
            achievementsList.append(divListItem);
        }
        callback(1);
    },

    var: createListItem = function (id,image,title,description,type,totalCount) {
        var divListItem = $('<div>');
        divListItem.attr("id", id);

        if (type === "INCREMENTAL") {
            divListItem.addClass("unlocked");
        } else {
            divListItem.addClass("locked");
        }

        var divGrid = $('<div>');
        divGrid.addClass("ui-grid-a");

        var divBlockA = $('<div>');
        divBlockA.addClass("ui-block-a");

        var divBlockB = $('<div>');
        divBlockB.addClass("ui-block-b");

        var imgImage = $('<img src="dynamic">');
        imgImage.addClass("imageAch");
        imgImage.attr('src', image);

        var divTitle = $('<div>');
        divTitle.addClass("titleAch");
        divTitle.text(title);

        var divDescription = $('<div>');
        divDescription.addClass("descriptionAch");
        divDescription.text(description);


        divBlockA.append(imgImage);

        divBlockB.append(divTitle);
        divBlockB.append(divDescription);

        if (type === "INCREMENTAL") {

            var divSteps = $('<div>');
            divSteps.attr("id","Steps"+id);
            divSteps.addClass("descriptionAch");
            divSteps.text(" of " + totalCount + " reached");
            divBlockB.append(divSteps);
        }

        divGrid.append(divBlockA);
        divGrid.append(divBlockB);

        divListItem.append(divGrid);

        return divListItem;

    },
    dropAchievements: function () {
        $('#achievementList').empty();
    }


}