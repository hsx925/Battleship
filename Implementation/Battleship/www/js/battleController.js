var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.battleController = {
    fireEnabled: true,

    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        $(document).on("pagebeforeshow", "#battle", this.onPageBeforeShow); // Before entering battle page
        $(document).on("pageshow", "#battle", this.onPageShow); // When entering battle page
        //add all listener function bindings for the battle itself

    },
    onPageBeforeShow: function () {
        console.log('battle pagebeforeshow');
    },
    onPageShow: function () {
        console.log('battle pageshow');
        if(BATTLESHIP.gameManager && BATTLESHIP.gameManager.placeShipsFinished) {
            console.log(BATTLESHIP.gameManager);
            BATTLESHIP.gameManager.startBattle();
            BATTLESHIP.uiUtils.createBattlefield($("#battleBattlefieldHuman"), BATTLESHIP.gameManager.humanPlayer.battlefield.size);
            BATTLESHIP.uiUtils.createBattlefield($("#battleBattlefieldEnemy"), BATTLESHIP.gameManager.humanPlayer.battlefieldEnemy.size);

            $("#battleBattlefieldEnemy .field").each(function () {
                $(this).click(BATTLESHIP.battleController.onFieldClick)
            });

        }else{
            $(':mobile-pagecontainer').pagecontainer('change', '#main-menu');
        }
    },

    onFieldClick: function (e) {
        //$("#battleBattlefieldEnemy .battlefieldFieldSelected").removeClass("battlefieldFieldSelected");
        //$(this).addClass("battlefieldFieldSelected");
        var x = parseInt($(this).attr("data-x"));
        var y = parseInt($(this).attr("data-y"));
        BATTLESHIP.gameManager.humanPlayer.selectFieldEnemy({x:x, y:y});
        //BATTLESHIP.gameManager.humanPlayer.battlefieldEnemy.fields[x][y]
        
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
        uiField.removeClass("battlefieldFieldSelected");
        //TODO add all other classes to remove later
        switch (field.state) {
            case BATTLESHIP.FieldState.DEFAULT:
                //TODO
                break;
            case BATTLESHIP.FieldState.HIT:
                //TODO
                break;
            case BATTLESHIP.FieldState.HIT_SHIP:
                //TODO
                break;
            case BATTLESHIP.FieldState.SELECTED:
                uiField.addClass("battlefieldFieldSelected");
                break;
        }
    },

    addShipHuman:function (ship, field) {
        this._updateField($('#battleBattlefieldHuman'), ship, $('#battleBattlefieldHuman [data-x="'+field.position.x+'"][data-y="'+field.position.y+'"]'));
    },

    addShipEnemy:function (ship, field) {
        this._updateField($('#battleBattlefieldEnemy'), ship, $('#battleBattlefieldEnemy [data-x="'+field.position.x+'"][data-y="'+field.position.y+'"]'));
    },

    _addShip:function (container, ship, fieldUi) {
        var fieldSize = BATTLESHIP.uiUtils.getBattlefieldFieldSize($("#placeShipsBattlefield"));
        var shipUi = BATTLESHIP.uiUtils.createShip(ship, fieldSize-1, "shipBattle");

        container.append(shipUi)

        if(ship && ship.isSet){
            $(shipUi).position({ of: fieldUi, my: 'left+1 top+1', at: 'left top' });
        }
    },

    updateShip:function (ship) {
        var shipUi = $("#"+ship.id);
        var fieldSize = BATTLESHIP.uiUtils.getBattlefieldFieldSize($("#placeShipsBattlefield"));
        shipUi.height(fieldSize-1);
        if(ship && ship.isSet){
            shipUi.position({ of: $('div[data-x="'+ship.position.x+'"][data-y="'+ship.position.y+'"]'), my: 'left+1 top+1', at: 'left top' });
        }
    },
};