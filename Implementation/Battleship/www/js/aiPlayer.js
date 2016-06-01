var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.AiPlayer = function (battlefieldSize, fleet, difficulty, onReadyForBattleCallback, onFieldSelectedCallback, onFieldFireCallback, onLooseCallback) {
    this.battlefield = new BATTLESHIP.Battlefield(battlefieldSize, fleet, "ai");
    this.battlefieldEnemy = new BATTLESHIP.Battlefield(battlefieldSize, [], "ai-enemy");
    this.difficulty = difficulty;
    this.active = false;
    this.onReadyForBattle=onReadyForBattleCallback;
    this.onFieldSelectedCallback=onFieldSelectedCallback;
    this.onFieldFireCallback=onFieldFireCallback;
    this.onLooseCallback=onLooseCallback;

    //this._setShips(); on bottom of class ;)

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
            this.readyForBattle();
        }else{
            console.log("AI: Error placing ships");
        }
    };

    this._selectFieldsAndFire=function () {
        var selectionCount = 3 //TODO remove magic numbers
        console.log(selectionCount);
        setTimeout(function(){this._selectFieldsAndFireHelper(selectionCount)}.bind(this), 2000); //TODO remove magic numbers
    };

    this._getTimeout=function (min, max) {
        var timeout = (Math.floor((Math.random() * max-min)+1)+min)*1000;
        console.log(timeout);
        return timeout;
    };

    this._selectFieldsAndFireHelper=function (count) {
        this._selectField();
        if(count>1) {
            setTimeout(function(){this._selectFieldsAndFireHelper(count - 1, this.battlefieldEnemy)}.bind(this), 2000); //TODO remove magic numbers
        }else{
            setTimeout(this._fire.bind(this), 1000); //TODO remove magic numbers
        }
    };

    //TODO difficulty
    this._selectField=function () {
        var result = false;
        while(!result){ //TODO could be infinity
            var coordinates = this.battlefieldEnemy.getRandomCoordinates();
            result = this.selectFieldEnemy(coordinates);
        }

    };

    this._fire=function () {
        this.fireFieldEnemy();
        if(this.active){
            console.log("extra fire");
            this._selectFieldsAndFire();
        }
    };

    //############################
    // Placeships
    //############################

    this.readyForBattle=function () {
        this.onReadyForBattle(this);
    };

    //############################
    // Battle
    //############################

    this.startTurn=function(){
        this.active=true;
        this._selectFieldsAndFire();
    };
    
    this.setText=function (text) {
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
        if(!field){
            return;
        }
        var fireResult = this.onFieldFireCallback(this);
    };

    this.fireFieldEnemyResult=function (fireResult) {
        var field = this.battlefieldEnemy.selectedField;
        if(!field){
            return false;
        }
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

    this._setShips();

};