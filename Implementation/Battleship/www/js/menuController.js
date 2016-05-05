var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.menuController = {

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        $(document).on("pagebeforeshow","#main-menu", this.onPageBeforeShow); // Before entering main-menu
        $(document).on("pageshow","#main-menu", this.onPageShow); // When entering main-menu
        //add all listner function bindings for main menu button
    },

    onPageBeforeShow: function() {
        console.log('main-menu pagebeforeshow');
        BATTLESHIP.gameManager = new BATTLESHIP.GameManager(); //create new game on loading menu page
    },

    onPageShow: function() {
        console.log('main-menu pageshow');
    }
    //add listener functions for all buttons on main menu
};