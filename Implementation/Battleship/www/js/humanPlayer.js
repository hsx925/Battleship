var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.HumanPlayer = function (battlefieldSize, fleet, onPlaceShipsFinishedCallback, onFieldSelectedCallback, onFieldFireCallback, onLooseCallback) {
    var ships = new Array(fleet.length);
    for(var i=0; i<fleet.length; ++i){
        ships[i]=new BATTLESHIP.Ship("ship"+(i+1), fleet[i]);
    }
    this.battlefield = new BATTLESHIP.Battlefield(battlefieldSize, ships);
    this.battlefieldEnemy = new BATTLESHIP.Battlefield(battlefieldSize);
    this.active = false;
    this.onPlaceShipsFinishedCallback=onPlaceShipsFinishedCallback;
    this.onFieldSelectedCallback=onFieldSelectedCallback;
    this.onFieldFireCallback=onFieldFireCallback;
    this.onLooseCallback=onLooseCallback;

    //############################
    // Placeships
    //############################

    this.removeShip=function (ship) {
        this.battlefield.removeShip(ship);
        BATTLESHIP.placeshipsController.updateBattlefield();
    };

    this.setShip=function (ship, position, direction) {
        var result = this.battlefield.setShip(ship, position, direction);
        BATTLESHIP.placeshipsController.updateBattlefield();
        BATTLESHIP.placeshipsController.updateShip(ship);
        return result;
    };

    this.autoSetShips=function () {
        if(!this.battlefield.autoSetShips()){
            //TODO set message if fails
        }
        BATTLESHIP.placeshipsController.updateAllShips(this.battlefield.ships);
        BATTLESHIP.placeshipsController.updateBattlefield();
    };

    this.placeShipsFinished=function () {
        this.onPlaceShipsFinishedCallback(this);
    };

    //############################
    // Battle
    //############################

    this.startTurn=function(){
        this.active=true;
        BATTLESHIP.battleController.enableShootButton(true);
        //TODO set message
    };

    this.setTime=function (time) {
        //TODO set timer
    };

    this.endTurn=function () {
        this.active=false;
        BATTLESHIP.battleController.enableShootButton(false);
        //TODO set message
    };

    this.selectFieldEnemy=function (position) {
        if(!this.active){
            return false;
        }
        this.onFieldSelectedCallback(this, position);

        var lastField=this.battlefieldEnemy.selectedField;
        var result=this.battlefieldEnemy.selectField(position);
        BATTLESHIP.battleController.updateFieldEnemy(lastField);

        if(result){
            var field=this.battlefieldEnemy.selectedField;
            BATTLESHIP.battleController.updateFieldEnemy(field);
        }
        return result;
    };

    this.selectFieldHuman=function (position) {
        var lastField=this.battlefield.selectedField;
        var result=this.battlefield.selectField(position);
        BATTLESHIP.battleController.updateFieldHuman(lastField);

        if(result){
            var field=this.battlefield.selectedField;
            BATTLESHIP.battleController.updateFieldHuman(field);
        }
        return result;
    };

    this.fireFieldEnemy=function(){
        var field = this.battlefieldEnemy.selectedField;
        this.battlefieldEnemy.selectedField=null;
        if(!field){
            return false;
        }
        var fireResult = this.onFieldFireCallback(this);
        if(this.battlefieldEnemy.fireWithResult(fireResult)){
            BATTLESHIP.battleController.updateFieldEnemy(field);
            if(fireResult===BATTLESHIP.FireResult.SUNK){
                //TODO draw ship on field
            }
            return true;
        }
        return false;
    };

    this.fireFieldHuman=function () {
        var field = this.battlefield.selectedField;
        var result = this.battlefield.fire();
        BATTLESHIP.battleController.updateFieldHuman(field);
        if(this.battlefield.allShipsSunk()){
            this.onLooseCallback(this);
        }
        return result;
    };

    this.win=function () {
        BATTLESHIP.battleController.win();
    };

    this.loose=function () {
        BATTLESHIP.battleController.loose();
    };

};