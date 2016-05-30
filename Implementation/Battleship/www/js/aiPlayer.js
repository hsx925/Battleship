var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.AiPlayer = function (battlefieldSize, fleet, difficulty, onPlaceShipsFinishedCallback, onFieldSelectedCallback, onFieldFireCallback, onLooseCallback) {
    var ships = new Array(fleet.length);
    for(var i=0; i<fleet.length; ++i){
        ships[i]=new BATTLESHIP.Ship("ship"+(i+1), fleet[i]);
    }
    this.battlefield = new BATTLESHIP.Battlefield(battlefieldSize, ships);
    this.battlefieldEnemy = new BATTLESHIP.Battlefield(battlefieldSize);
    this.difficulty = difficulty;
    this.active = false;
    this.onPlaceShipsFinishedCallback=onPlaceShipsFinishedCallback;
    this.onFieldSelectedCallback=onFieldSelectedCallback;
    this.onFieldFireCallback=onFieldFireCallback;
    this.onLooseCallback=onLooseCallback;

    //############################
    // Placeships
    //############################

    this.placeShipsFinished=function () {
        this.onPlaceShipsFinishedCallback(this);
    }

    //############################
    // Battle
    //############################

    this.startTurn=function(){
        this.active=true;

        //TODO ai
    };

    this.setTime=function (time) {
        //TODO nothing
    };

    this.endTurn=function () {
        this.active=false;
        //TODO set message
    };

    this.selectFieldEnemy=function (position) {
        this.onFieldSelectedCallback(this, position);

        var lastField=this.battlefieldEnemy.selectedField;
        var result=this.battlefieldEnemy.selectField(position);

        if(result){
            var field=this.battlefieldEnemy.selectedField;
        }
        return result;
    };

    this.selectFieldHuman=function (position) {
        var lastField=this.battlefield.selectedField;
        var result=this.battlefield.selectField(position);

        if(result){
            var field=this.battlefield.selectedField;
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
            if(fireResult===BATTLESHIP.FireResult.SUNK){
                //TODO draw ship
            }
            return true;
        }
        return false;
    };

    this.fireFieldHuman=function () {
        var field = this.battlefield.selectedField;
        var result = this.battlefield.fire();
        if(this.battlefield.allShipsSunk()){
            this.onLooseCallback(this);
        }
        return result;
    };

    this.win=function () {
        //TODO nothing
    }

    this.loose=function () {
        //TODO nothing
    }

};