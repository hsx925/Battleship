var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.HumanPlayer = function (battlefieldSize, fleet, onReadyForBattleCallback, onFieldSelectedCallback, onFieldFireCallback, onLooseCallback) {
    this.battlefield = new BATTLESHIP.Battlefield(battlefieldSize, fleet, "human");
    this.battlefieldEnemy = new BATTLESHIP.Battlefield(battlefieldSize, [], "human-enemy");
    this.active = false;
    this.onReadyForBattle=onReadyForBattleCallback;
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
        if(!field){
            return;
        }
        this.onFieldFireCallback(this);
    };

    this.fireFieldEnemyResult=function (result) {
        var field = this.battlefieldEnemy.selectedField;
        if(!field){
            return;
        }
        if(this.battlefieldEnemy.fireWithResult(result)){
            BATTLESHIP.battleController.updateFieldEnemy(field);
            if(result===BATTLESHIP.FireResult.SUNK){
                if(field.ship){
                    BATTLESHIP.battleController.addShipEnemy(field.ship);
                }else{
                    console.log("Human: Error adding enmey ship!")
                }
            }
        }
    };


    this.fireFieldHuman=function () {
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