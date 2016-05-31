var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.battleController = {

    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        $(document).on("pagebeforeshow", "#battle", this.onPageBeforeShow); // Before entering battle page
        $(document).on("pageshow", "#battle", this.onPageShow); // When entering battle page
        $(document).on("pagebeforehide","#battle", this.onPageBeforeHide); // When leave battle page

        $('#shootButton').click(this.onShootClick);

    },
    onPageBeforeShow: function () {
        console.log('battle pagebeforeshow');
    },
    onPageShow: function () {
        console.log('battle pageshow');

        $(window).on('resize', BATTLESHIP.battleController.onResize);

        if(BATTLESHIP.gameManager && BATTLESHIP.gameManager.humanPlayer && BATTLESHIP.gameManager.humanPlayer.battlefield.allShipsSet()) {
            console.log(BATTLESHIP.gameManager);

            BATTLESHIP.uiUtils.createBattlefield($("#battleBattlefieldHuman"), BATTLESHIP.gameManager.humanPlayer.battlefield.size);
            BATTLESHIP.uiUtils.createBattlefield($("#battleBattlefieldEnemy"), BATTLESHIP.gameManager.humanPlayer.battlefieldEnemy.size);

            var ships = BATTLESHIP.gameManager.humanPlayer.battlefield.ships;
            for(var i=0; i<ships.length; i++){
                BATTLESHIP.battleController.addShipHuman(ships[i]);
            }

            $("#battleBattlefieldEnemy .field").each(function () {
                $(this).click(BATTLESHIP.battleController.onFieldClick)
            });

            BATTLESHIP.gameManager.humanPlayer.readyForBattle();

        }else{
            $(':mobile-pagecontainer').pagecontainer('change', '#main-menu');
        }
    },

    onPageBeforeHide:function () {
        console.log('battle pagebeforehide');
        $(window).off('resize', BATTLESHIP.battleController.onResize);
    },

    onResize: function () {
        BATTLESHIP.battleController.updateAllShipsHuman(BATTLESHIP.gameManager.humanPlayer.battlefield.ships);
        BATTLESHIP.battleController.updateAllShipsEnemy(BATTLESHIP.gameManager.humanPlayer.battlefieldEnemy.ships);
    },

    onFieldClick: function (e) {
        var x = parseInt($(this).attr("data-x"));
        var y = parseInt($(this).attr("data-y"));
        BATTLESHIP.gameManager.humanPlayer.selectFieldEnemy({x:x, y:y});
        
    },

    onShootClick: function (e) {
        BATTLESHIP.gameManager.humanPlayer.fireFieldEnemy();
    },

    enableShootButton: function (enable) {
      if(enable){
          $("#shootButton").removeClass("shootButtonDisabled");
      }else {
          $("#shootButton").addClass("shootButtonDisabled");
      }
    },

    updateFieldHuman: function (field) {
        if(field){
            this._updateField(field, $('#battleBattlefieldHuman [data-x="'+field.position.x+'"][data-y="'+field.position.y+'"]'));
        }
    },

    updateFieldEnemy: function (field) {
        if(field) {
            this._updateField(field, $('#battleBattlefieldEnemy [data-x="' + field.position.x + '"][data-y="' + field.position.y + '"]'));
        }
    },

    _updateField: function (field, uiField) {
        switch (field.state) {
            case BATTLESHIP.FieldState.DEFAULT:
                uiField.removeClass("battlefieldFieldSelected");
                uiField.removeClass("battlefieldFieldHit");
                uiField.removeClass("battlefieldFieldHitShip");
                break;
            case BATTLESHIP.FieldState.HIT:
                uiField.removeClass("battlefieldFieldSelected");
                uiField.addClass("battlefieldFieldHit");
                uiField.removeClass("battlefieldFieldHitShip");
                break;
            case BATTLESHIP.FieldState.HIT_SHIP:
                uiField.removeClass("battlefieldFieldSelected");
                uiField.removeClass("battlefieldFieldHit");
                uiField.addClass("battlefieldFieldHitShip");
                break;
            case BATTLESHIP.FieldState.SELECTED:
                uiField.addClass("battlefieldFieldSelected");
                uiField.removeClass("battlefieldFieldHit");
                uiField.removeClass("battlefieldFieldHitShip");
                break;
        }
    },

    addShipHuman:function (ship) {
        var fieldSize = BATTLESHIP.uiUtils.getBattlefieldFieldSize($("#battleBattlefieldHuman"));
        var fieldUi = $('#battleBattlefieldHuman [data-x="'+ship.position.x+'"][data-y="'+ship.position.y+'"]');
        this._addShip($('#battleBattlefieldHuman'), ship, fieldUi, fieldSize-1);
        this.updateShipHuman(ship); //Do not remove, because of rotaion issues
    },

    addShipEnemy:function (ship) {
        var fieldSize = BATTLESHIP.uiUtils.getBattlefieldFieldSize($("#battleBattlefieldEnemy"));
        var fieldUi = $('#battleBattlefieldEnemy [data-x="'+ship.position.x+'"][data-y="'+ship.position.y+'"]');
        this._addShip($('#battleBattlefieldEnemy'), ship, fieldUi, fieldSize-1);
        this.updateShipEnemy(ship); //Do not remove, because of rotaion issues
    },

    _addShip:function (container, ship, fieldUi, height) {
        if (ship && ship.isSet) {
            var shipUi = $(BATTLESHIP.uiUtils.createShip(ship, height, "shipBattle"));

            container.append(shipUi);

            if (ship.direction === BATTLESHIP.ShipDirection.VERTICAL) {
                shipUi.addClass("shipRotated");
            }

            shipUi.position({ of: fieldUi, my: 'left+1 top+1', at: 'left top' });
        }
    },

    updateShipHuman:function (ship) {
        var fieldSize = BATTLESHIP.uiUtils.getBattlefieldFieldSize($("#battleBattlefieldHuman"));
        var fieldUi = $('#battleBattlefieldHuman [data-x="'+ship.position.x+'"][data-y="'+ship.position.y+'"]');
        var shipUi = $('#battleBattlefieldHuman [data-id="'+ship.id+'"]');
        this._updateShip(ship, shipUi, fieldUi, fieldSize-1);
    },

    updateShipEnemy:function (ship) {
        var fieldSize = BATTLESHIP.uiUtils.getBattlefieldFieldSize($("#battleBattlefieldEnemy"));
        var fieldUi = $('#battleBattlefieldEnemy [data-x="'+ship.position.x+'"][data-y="'+ship.position.y+'"]');
        var shipUi = $('#battleBattlefieldEnemy [data-id="'+ship.id+'"]');
        this._updateShip(ship, shipUi, fieldUi, fieldSize-1);
    },

    _updateShip:function (ship, shipUi, fieldUi, height) {
        if(ship && ship.isSet){
            //var offset = fieldUi.offset();
            //shipUi.offset({left:offset.left+1, top:offset.top+1});
            //var shipOffset = shipUi.offset();
            shipUi.position({ of: fieldUi, my: 'left+1 top+1', at: 'left top' });
            shipUi.height(height);
        }
    },

    updateAllShipsHuman:function (ships) {
        for(var i=0; i<ships.length; i++){
            this.updateShipHuman(ships[i]);
        }
    },

    updateAllShipsEnemy:function (ships) {
        for(var i=0; i<ships.length; i++){
            this.updateShipEnemy(ships[i]);
        }
    },

    loose:function () {
        location.href = "#lost";
    },

    win:function () {
        location.href = "#won";
    }
};