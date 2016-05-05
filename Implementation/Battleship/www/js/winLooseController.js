var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.winLooseController = {

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        $(document).on("pagebeforeshow","#won", this.onPageBeforeShow); // Before entering won page
        $(document).on("pageshow","#won", this.onPageShow); // When entering won page
        $(document).on("pagebeforeshow","#lost", this.onPageBeforeShow); // Before entering lost page
        $(document).on("pageshow","#lost", this.onPageShow); // When entering lost page
        //add all listener function bindings for the battle itself
    },

    onPageBeforeShow: function() {
        console.log('won/lost pagebeforeshow');
    },

    onPageShow: function() {
        console.log('won/lost pageshow');
    }
    //add listener functions for the battle
};