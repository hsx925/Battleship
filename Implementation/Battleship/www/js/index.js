
var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        $(document).ready(this.onDocumentReady);
    },
    onDocumentReady: function () {
        // add listener and stuff which should be executed after DOM is complete
        console.log('documentready');
        BATTLESHIP.menuController.initialize();
        BATTLESHIP.placeshipsController.initialize();
        BATTLESHIP.battleController.initialize();
        BATTLESHIP.winLooseController.initialize();
        BATTLESHIP.achievementsConrollter.initialize();
    },
    onDeviceReady: function () { //trigger after document ready ;)
        console.log('deviceready');

        document.addEventListener("backbutton", function(e){
            if($.mobile.activePage.is('#main-menu')){
                e.preventDefault();
                navigator.app.exitApp();
            }
            else {
                e.preventDefault();
                $.mobile.changePage("#main-menu");
            }
        }, false);
    }

};

BATTLESHIP.app.initialize();
