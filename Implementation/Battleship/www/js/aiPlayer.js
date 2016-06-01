var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.AiPlayer = function (battlefieldSize, fleet, difficulty, onReadyForBattleCallback, onFieldSelectedCallback, onFieldFireCallback, onLooseCallback) {
    this.selectCountMin = 2;
    this.selectCountMax = 4;
    this.selectTimeoutMin = 500;
    this.selectTimeoutMax = 1500
    this.fireTimeout = 500;
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
        setTimeout(function(){this._selectFieldsAndFireHelper(this.getSelectionCount())}.bind(this), this.getSelectionTimeout());
    };

    this.getSelectionCount=function () {
      var result = this.getRandomNumber(this.selectCountMin, this.selectCountMax);
        console.log(result);
        return result;
    };

    this.getRandomNumber=function randomIntFromInterval(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    };

    this.getSelectionTimeout=function () {
        var result = this.getRandomNumber(this.selectTimeoutMin, this.selectTimeoutMax);
        console.log(result);
        return result;
    };

    this._selectFieldsAndFireHelper=function (count) {
        this._selectField();
        if(count>1) {
            setTimeout(function(){this._selectFieldsAndFireHelper(count - 1, this.battlefieldEnemy)}.bind(this), this.getSelectionTimeout());
        }else{
            setTimeout(this._fire.bind(this), this.fireTimeout);
        }
    };

    //TODO difficulty
    this._selectField=function () {
        var result = false;
        var count=0;
        while(!result){ //TODO could be infinity
            var coordinates = this.battlefieldEnemy.getRandomCoordinates();
            //console.log(coordinates);
            result = this.selectFieldEnemy(coordinates);
            count++;
        }
        //console.log(count);
    };

    this._fire=function () {
        this.fireFieldEnemy();
        if(this.active){
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