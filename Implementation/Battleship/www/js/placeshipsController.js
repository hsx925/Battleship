var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.placeshipsController = {

    rotation: false,

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        $(document).on("pagebeforeshow","#placeships", this.onPageBeforeShow); // Before entering placeships page
        $(document).on("pageshow","#placeships", this.onPageShow); // When entering placeships page
        $(document).on("pagebeforehide","#placeships", this.onPageBeforeHide); // When left placeships page

        $('#autoPlaceShips').click(this.onAutoPlaceShipsClick);
        $('#rotatePlaceShips').click(this.onRotatePlaceShipsClick);
        $('#fightButton').click(this.onFightClick);
    },

    onResize: function () {
        BATTLESHIP.placeshipsController.updateAllShips(BATTLESHIP.gameManager.humanPlayer.battlefield.ships);
    },

    onPageBeforeShow: function() {
        console.log('placeships pagebeforeshow');

    },

    onPageShow: function() {
        console.log('placeships pageshow');

        $(window).on('resize', BATTLESHIP.placeshipsController.onResize);

        //TODO use callback instead of bool for menu finished
        if(BATTLESHIP.gameManager && BATTLESHIP.gameManager.gameStarted) {
            console.log(BATTLESHIP.gameManager);
            BATTLESHIP.uiUtils.createBattlefield($("#placeShipsBattlefield"), BATTLESHIP.gameManager.humanPlayer.battlefield.size);
            BATTLESHIP.uiUtils.createShipsInBay($("#shipContainer"), BATTLESHIP.gameManager.humanPlayer.battlefield.ships, BATTLESHIP.uiUtils.getBattlefieldFieldSize($("#placeShipsBattlefield"))-1);
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

    onPageBeforeHide:function () {
        console.log('placeships pagebeforehide');
        $(window).off('resize', BATTLESHIP.placeshipsController.onResize);
        $("#placeShipsBattlefield").empty();
        $("#shipContainer").empty();
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

        var ship = BATTLESHIP.gameManager.humanPlayer.battlefield.getShipById($(this).attr("data-id"));
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
        var ship = BATTLESHIP.gameManager.humanPlayer.battlefield.getShipById($(this).attr("data-id"));
        if(!ship){
            return;
        }
        if(ship.isSet){
            //BATTLESHIP.gameManager.humanPlayer.battlefield.removeShip(ship);
            BATTLESHIP.gameManager.humanPlayer.removeShip(ship);
        }

        //BATTLESHIP.placeshipsController._updateBattlefield();

        if(BATTLESHIP.placeshipsController.rotation){
            $(this).addClass("shipRotated");
        }else{
            $(this).removeClass("shipRotated");
        }
    },

    _handleDragStop: function (event, ui) {
        var ship = BATTLESHIP.gameManager.humanPlayer.battlefield.getShipById($(this).attr("data-id"));
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
        var ship = BATTLESHIP.gameManager.humanPlayer.battlefield.getShipById(ui.draggable.attr("data-id"));
        if(!ship){
            return;
        }
        var offset = parseInt((ship.size-1)/2);
        var success = false;
        if(BATTLESHIP.placeshipsController.rotation){
            y=y-offset;
            success = BATTLESHIP.gameManager.humanPlayer.setShip(ship,{x:x,y:y}, BATTLESHIP.ShipDirection.VERTICAL);
        }else{
            x=x-offset;
            success = BATTLESHIP.gameManager.humanPlayer.setShip(ship,{x:x,y:y}, BATTLESHIP.ShipDirection.HORIZONTAL);
        }

        if(success){
            if(BATTLESHIP.gameManager.humanPlayer.battlefield.allShipsSet()){
                $("#fightButton").removeClass("fightButtonDisabled");
            }
        }

        //BATTLESHIP.placeshipsController._updateBattlefield();
    },

    updateBattlefield: function () {
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

    updateShip:function (ship) {
        if(ship && ship.isSet){
            var shipUi = $('#placeShipsContainer [data-id="'+ship.id+'"]');
            var fieldSize = BATTLESHIP.uiUtils.getBattlefieldFieldSize($("#placeShipsBattlefield"));
            if(ship.direction===BATTLESHIP.ShipDirection.VERTICAL){
                shipUi.addClass("shipRotated")
            }else if(ship.direction===BATTLESHIP.ShipDirection.HORIZONTAL){
                shipUi.removeClass("shipRotated")
            }
            shipUi.height(fieldSize-1);
            shipUi.position({ of: $('div[data-x="'+ship.position.x+'"][data-y="'+ship.position.y+'"]'), my: 'left+1 top+1', at: 'left top' });
        }
    },

    updateAllShips:function (ships) {
        if(!ships){
            return;
        }
        for(var i=0; i<ships.length; i++){
            this.updateShip(ships[i]);
        }
    },

    onAutoPlaceShipsClick: function (e) {
        BATTLESHIP.gameManager.humanPlayer.autoSetShips();
        if(BATTLESHIP.gameManager.humanPlayer.battlefield.allShipsSet()){
            $("#fightButton").removeClass("fightButtonDisabled");
        }
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