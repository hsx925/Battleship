/**
 * Created by ralfkralicek on 31/05/16.
 */
var BATTLESHIP = BATTLESHIP || {};


BATTLESHIP.achievementsConrollter = {
    initialize: function () {
        this.bindEvents();
        //this.beforeStart();
    },
    bindEvents: function () {
        $(document).on("pagebeforeshow", "#achievementPage", this.onPageBeforeShow); // Before entering main-menu
        console.log("Achievements Controller triggered");

    },
    onPageBeforeShow:function () {
        console.log("onBeforePageShow");
        var google = BATTLESHIP.google;

        var achievementsList = $('#achievementList');

        google.isLoggedIn(function (result){
            if (result != -1) {
                google.getAllAchievements(function (data) {
                    var allAchievements = JSON.parse(JSON.stringify(data));
                    alert(JSON.stringify(allAchievements.items[0]));
                    /*alert(allAchievements.items[0].id);
                    alert(allAchievements.items[0].name);
                    alert(allAchievements.items[0].description);
                    alert(allAchievements.items[0].revealedIconUrl);
                    alert(allAchievements.items[0].initialState);
                    */
                    for (var i in allAchievements.items) {
                        var divListItem = createListItem(allAchievements.items[i].id,"Image",allAchievements.items[i].name,allAchievements.items[i].description);

                        achievementsList.append(divListItem);
                    }
                });
            }
        });




        
    },

    var: createListItem = function (id,image,title,description){
        var divListItem = $('<div>');
        divListItem.attr("id",id);
        divListItem.addClass("locked");

        var divGrid = $('<div>');
        divGrid.addClass("ui-grid-a");

        var divBlockA = $('<div>');
        divBlockA.addClass("ui-block-a");

        var divBlockB = $('<div>');
        divBlockB.addClass("ui-block-b");

        var divImage = $("<div>");
        divImage.addClass("imageAch");
        divImage.text(image);

        var divTitle = $('<div>');
        divTitle.addClass("titleAch");
        divTitle.text(title);

        var divDescription = $('<div>');
        divDescription.addClass("descriptionAch");
        divDescription.text(description);

        divBlockA.append(divImage);

        divBlockB.append(divTitle);
        divBlockB.append(divDescription);

        divGrid.append(divBlockA);
        divGrid.append(divBlockB);
        divListItem.append(divGrid);

        return divListItem;

    }

}