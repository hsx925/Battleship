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

    this._setShips();

    //############################
    // AI
    //############################

    this._setShips=function () {
        for(var i=0; i<100; i++){ //TODO remove magic numbers
            if(this.battlefield.autoSetShips()){
                break;
            }
        }
        if(this.battlefield.allShipsSet()){
            this.placeShipsFinished();
        }else{
            console.log("AI: Error placing ships");
        }
    };

    this._selectFields=function () {
        var selectionCount = Math.floor((Math.random() * 5) + 1); //TODO remove magic numbers
        for(var i=0; i<selectionCount; i++){
            var timeout = (Math.floor((Math.random() * 2) + 1)+1)*1000; // 1-3 sec //TODO remove magic numbers
            setTimeout(this._selectField, timeout);
        }
    };

    //TODO difficulty
    this._selectField=function () {
        var result = false;
        while(!result){ //TODO could be infinity
            var coordinates = this.battlefieldEnemy.getRandomCoordinates();
            this.selectFieldEnemy(coordinates);
        }
    };

    this._fire=function () {
        this.fireFieldEnemy();
    };

    //############################
    // Placeships
    //############################

    this.placeShipsFinished=function () {
        this.onPlaceShipsFinishedCallback(this);
    };

    //############################
    // Battle
    //############################

    this.startTurn=function(){
        this.active=true;
        this._selectFields();
        this._fire();
    };

    this.setTime=function (time) {
        //not necessary in ai
    };

    this.endTurn=function () {
        this.active=false;
    };

    this.selectFieldEnemy=function (position) {
        this.onFieldSelectedCallback(this, position);
        return this.battlefieldEnemy.selectField(position);
    };

    this.selectFieldHuman=function (position) {
        return this.battlefield.selectField(position);
    };

    this.fireFieldEnemy=function(){
        var field = this.battlefieldEnemy.selectedField;
        this.battlefieldEnemy.selectedField=null;
        if(!field){
            return false;
        }
        var fireResult = this.onFieldFireCallback(this);
        return this.battlefieldEnemy.fireWithResult(fireResult);
    };

    this.fireFieldHuman=function () {
        var result = this.battlefield.fire();
        if(this.battlefield.allShipsSunk()){
            this.onLooseCallback(this);
        }
        return result;
    };

    this.win=function () {
        //nothing
    };

    this.loose=function () {
        //nothing
    };

};