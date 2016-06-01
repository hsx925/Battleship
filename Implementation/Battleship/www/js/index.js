
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
    },
    onDeviceReady: function () { //trigger after document ready ;)
        // add stuff from cordova plugins
        console.log('deviceready');
    }

};

BATTLESHIP.app.initialize();
