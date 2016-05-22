var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.placeshipsController = {

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        $(document).on("pagebeforeshow","#placeships", this.onPageBeforeShow); // Before entering placeships page
        $(document).on("pageshow","#placeships", this.onPageShow); // When entering placeships page
        //add all listener function bindings for placing ships
        $(window).on('resize', this.onResize);
    },

    onResize: function () {
        BATTLESHIP.uiUtils.createFleet($("#shipContainer"),BATTLESHIP.gameManager.fleet, BATTLESHIP.uiUtils.getBattlefieldFieldSize($("#placeShipsBattlefield")));
    },

    onPageBeforeShow: function() {
        console.log('placeships pagebeforeshow');
    },

    onPageShow: function() {
        console.log('placeships pageshow');
        if(BATTLESHIP.gameManager){
            BATTLESHIP.gameManager.startGame();
            console.log(BATTLESHIP.gameManager);
            BATTLESHIP.uiUtils.createBattlefield($("#placeShipsBattlefield"), BATTLESHIP.gameManager.battlefieldSize);
            BATTLESHIP.uiUtils.createFleet($("#shipContainer"),BATTLESHIP.gameManager.fleet, BATTLESHIP.uiUtils.getBattlefieldFieldSize($("#placeShipsBattlefield")));
            //Add draggable on ships
            $(".ship").each(function() {
                $(this).draggable({
                    containment: '#placeShipsContainer',
                    stack: '#shipContainer img',
                    cursor: 'move',
                    revert: true
                });
            });
            //Add droppable on fields
            $(".field").each(function() {
                $(this).droppable( {
                    accept: '#shipContainer img',
                    hoverClass: 'battlefieldFieldHovered',
                    drop: function(event, ui ) {
                        console.log("spaß mit shiffen");
                        ui.draggable.draggable( 'disable' );
                        $(this).droppable( 'disable' );
                        //TODO also diable underlying field
                        ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
                        ui.draggable.draggable( 'option', 'revert', false );
                    }
                } );
            });
        }else {
            $(':mobile-pagecontainer').pagecontainer('change', '#main-menu');
        }
    }

};