var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.HumanPlayer = function (battlefieldSize, fleet, onReadyForBattleCallback, onFieldSelectedCallback, onFieldFireCallback, onFinishTurnCallback, onLooseCallback) {
    var ships = new Array(fleet.length);
    for(var i=0; i<fleet.length; ++i){
        ships[i]=new BATTLESHIP.Ship("ship"+(i+1), fleet[i]);
    }
    this.battlefield = new BATTLESHIP.Battlefield(battlefieldSize, ships, "human");
    this.battlefieldEnemy = new BATTLESHIP.Battlefield(battlefieldSize, [], "human-enemy");
    this.active = false;
    this.onReadyForBattle=onReadyForBattleCallback;
    this.onFieldSelectedCallback=onFieldSelectedCallback;
    this.onFieldFireCallback=onFieldFireCallback;
    this.onFinishTurn=onFinishTurnCallback;
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

    this.readyForBattle=function () {
        this.onReadyForBattle(this);
    };

    //############################
    // Battle
    //############################

    this.startTurn=function(){
        this.active=true;
        BATTLESHIP.battleController.enableShootButton(true);
        //TODO remove selection
        //TODO set message
    };

    this.setTime=function (time) {
        //TODO set timer
    };

    this.endTurn=function () {
        this.active=false;
        BATTLESHIP.battleController.enableShootButton(false);
        //TODO remove selection;
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

        //console.log("human-enemy");
        //console.log(BATTLESHIP.gameManager.humanPlayer.battlefieldEnemy);

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

        //console.log("human");
        //console.log(BATTLESHIP.gameManager.humanPlayer.battlefield);

        return result;
    };

    this.fireFieldEnemy=function(){
        //console.log("human-enemy");
        //console.log(BATTLESHIP.gameManager.humanPlayer.battlefieldEnemy);
        var field = this.battlefieldEnemy.selectedField;
        if(!field){
            return false;
        }
        var fireResult = this.onFieldFireCallback(this);
        if(this.battlefieldEnemy.fireWithResult(fireResult)){
            BATTLESHIP.battleController.updateFieldEnemy(field);
            if(fireResult===BATTLESHIP.FireResult.SUNK){
                //TODO draw ship on field
            }
            if(fireResult===BATTLESHIP.FireResult.NONE){
                this.onFinishTurn(this);
            }
            return true;
        }
        return false;
    };

    this.fireFieldHuman=function () {
        //console.log("human");
        //console.log(BATTLESHIP.gameManager.humanPlayer.battlefield);
        var field = this.battlefield.selectedField;
        var result = this.battlefield.fire();
        BATTLESHIP.battleController.updateFieldHuman(field);
        console.log("human");
        console.log(this);
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