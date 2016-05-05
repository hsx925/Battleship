var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.battleController = {

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        $(document).on("pagebeforeshow","#battle", this.onPageBeforeShow); // Before entering battle page
        $(document).on("pageshow","#battle", this.onPageShow); // When entering battle page
        //add all listener function bindings for the battle itself
    },

    onPageBeforeShow: function() {
        console.log('battle pagebeforeshow');
    },

    onPageShow: function() {
        console.log('battle pageshow');
    }
    //add listener functions for the battle
};