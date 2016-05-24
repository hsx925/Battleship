var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.placeshipsController = {

    rotation: false,

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        $(document).on("pagebeforeshow","#placeships", this.onPageBeforeShow); // Before entering placeships page
        $(document).on("pageshow","#placeships", this.onPageShow); // When entering placeships page
        //add all listener function bindings for placing ships
        $(window).on('resize', this.onResize);
        $('#autoPlaceShips').click(this.onAutoPlaceShipsClick);
        $('#rotatePlaceShips').click(this.onRotatePlaceShipsClick);
        $('#fightButton').click(this.onFightClick);
    },

    onResize: function () {
        var fieldSize = BATTLESHIP.uiUtils.getBattlefieldFieldSize($("#placeShipsBattlefield"));
        $(".ship").each(function() {
            $(this).height(fieldSize-1);
        });
        //TODO update position of ships on field
    },

    onPageBeforeShow: function() {
        console.log('placeships pagebeforeshow');
    },

    onPageShow: function() {
        console.log('placeships pageshow');
        if(BATTLESHIP.gameManager) {
            console.log(BATTLESHIP.gameManager);
            BATTLESHIP.gameManager.startGame();
            BATTLESHIP.uiUtils.createBattlefield($("#placeShipsBattlefield"), BATTLESHIP.gameManager.humanPlayer.battlefield.size);
            BATTLESHIP.uiUtils.createShips($("#shipContainer"), BATTLESHIP.gameManager.humanPlayer.battlefield.ships, BATTLESHIP.uiUtils.getBattlefieldFieldSize($("#placeShipsBattlefield"))-1);
            //Add draggable on ships
            $(".ship").each(function () {
                $(this).draggable({
                    containment: '#placeShipsContainer',
                    stack: '#shipContainer img',
                    cursor: 'move',
                    revert: BATTLESHIP.placeshipsController._handleRevert,
                    start: BATTLESHIP.placeshipsController._handleDragStart,
                    stop: BATTLESHIP.placeshipsController._handleDragStop
                });
            });
            //Add droppable on fields
            $(".field").each(function () {
                $(this).droppable({
                    accept: '#shipContainer img',
                    hoverClass: 'battlefieldFieldHovered',
                    drop: BATTLESHIP.placeshipsController._handleShipDrop
                });
            });
            $("#fightButton").addClass("fightButtonDisabled");
        }else {
            $(':mobile-pagecontainer').pagecontainer('change', '#main-menu');
        }
    },

    _handleRevert: function(event, ui) {
        // on older version of jQuery use "draggable"
        // $(this).data("draggable")
        // on 2.x versions of jQuery use "ui-draggable"
        // $(this).data("ui-draggable")
        $(this).data("uiDraggable").originalPosition = {
            top : 0,
            left : 0
        };

        var ship = BATTLESHIP.gameManager.humanPlayer.battlefield.getShipById($(this).attr("id"));
        if(!ship){
            return true;
        }
        if(!ship.isSet){
            return true;
        }
        // return boolean
        return !event;
        // that evaluate like this:
        // return event !== false ? false : true;
    },

    _handleDragStart: function (event, ui) {
        $("#fightButton").addClass("fightButtonDisabled");
        var ship = BATTLESHIP.gameManager.humanPlayer.battlefield.getShipById($(this).attr("id"));
        if(!ship){
            return;
        }
        if(ship.isSet){
            BATTLESHIP.gameManager.humanPlayer.battlefield.removeShip(ship);
        }

        BATTLESHIP.placeshipsController._updateBattlefield();

        if(BATTLESHIP.placeshipsController.rotation){
            $(this).addClass("shipRotated");
        }else{
            $(this).removeClass("shipRotated");
        }
    },

    _handleDragStop: function (event, ui) {
        console.log("Stop");
        var ship = BATTLESHIP.gameManager.humanPlayer.battlefield.getShipById($(this).attr("id"));
        if(!ship){
            return;
        }
        if(!ship.isSet){
            $(this).removeClass("shipRotated");
        }
    },

    _handleShipDrop: function (event, ui) {
        var x = parseInt($(this).attr("data-x"));
        var y = parseInt($(this).attr("data-y"));
        var ship = BATTLESHIP.gameManager.humanPlayer.battlefield.getShipById(ui.draggable.attr("id"));
        if(!ship){
            return;
        }
        var offset = parseInt((ship.size-1)/2);
        var success = false;
        if(BATTLESHIP.placeshipsController.rotation){
            y=y-offset;
            success = BATTLESHIP.gameManager.humanPlayer.battlefield.trySetShip(ship,{x:x,y:y}, BATTLESHIP.ShipDirection.VERTICAL);
        }else{
            x=x-offset;
            success = BATTLESHIP.gameManager.humanPlayer.battlefield.trySetShip(ship,{x:x,y:y}, BATTLESHIP.ShipDirection.HORIZONTAL);
        }

        if(success){
            ui.draggable.position( { of: $('div[data-x="'+x+'"][data-y="'+y+'"]'), my: 'left+1 top+1', at: 'left top' } );
            if(BATTLESHIP.gameManager.humanPlayer.battlefield.allShipsSet()){
                $("#fightButton").removeClass("fightButtonDisabled");
            }
        }

        BATTLESHIP.placeshipsController._updateBattlefield();
    },

    _updateBattlefield: function () {
        var fields = BATTLESHIP.gameManager.humanPlayer.battlefield.fields;
        $(".field").each(function () {
            var x = $(this).attr("data-x");
            var y = $(this).attr("data-y");
            if(fields[x][y].isOccupied()){
                $(this).droppable( 'disable' );
                $(this).addClass("battlefieldFieldOccupied");
            }else{
                $(this).droppable( 'enable' );
                $(this).removeClass("battlefieldFieldOccupied");
            }
        });

    },

    onAutoPlaceShipsClick: function (e) {
        alert("Not implemented yet!");
    },

    onRotatePlaceShipsClick: function (e) {
        BATTLESHIP.placeshipsController.rotation = !BATTLESHIP.placeshipsController.rotation;
        if(BATTLESHIP.placeshipsController.rotation){
            $("#rotatePlaceShips").addClass("shipControlEnabled");
        }else{
            $("#rotatePlaceShips").removeClass("shipControlEnabled");
        }
    },

    onFightClick: function (e) {
        if(!$("#fightButton").hasClass("fightButtonDisabled")){
            location.href = "#battle";
        }
    }

};