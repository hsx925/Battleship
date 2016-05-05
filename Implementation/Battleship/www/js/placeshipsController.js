var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.placeshipsController = {

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        $(document).on("pagebeforeshow","#placeships", this.onPageBeforeShow); // Before entering placeships page
        $(document).on("pageshow","#placeships", this.onPageShow); // When entering placeships page
        //add all listener function bindings for placing ships
    },

    onPageBeforeShow: function() {
        console.log('placeships pagebeforeshow');
    },

    onPageShow: function() {
        console.log('placeships pageshow');
    }
    //add listener functions for placing ships on the battlefield
};