
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

        //TODO remove after implementing controller for placeships and battle pages
        new BATTLESHIP.Battlefield($("#battleBattlefieldUser"), 10);
        new BATTLESHIP.Battlefield($("#battleBattlefieldEnemy"), 20);
    },
    onDeviceReady: function () { //trigger after document ready ;)
        // add stuff from cordova plugins
        console.log('deviceready_test');
    }

};

BATTLESHIP.app.initialize();
