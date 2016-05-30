var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.ShipState = {
    GOOD: "good",
    HIT: "hit",
    SUNK: "sunk"
};

BATTLESHIP.ShipDirection = {
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical"
};

BATTLESHIP.Ship = function (id, size) {
    this.id = id;
    this.size = size;
    this.state = BATTLESHIP.ShipState.GOOD;
    this.direction = BATTLESHIP.ShipDirection.HORIZONTAL;
    this.position = {x:-1, y:-1};
    this.fields = new Array();
    this.isSet = false;

    this.updateState=function () {
        if(!fields){
            return;
        }
        var hits = 0;
        for(var i=0; i<fields.length; i++){
            if(fields[i].state===BATTLESHIP.FieldState.HIT_SHIP){
                hits++;
            }
        }
        if(hits===0){
            this.state=BATTLESHIP.ShipState.GOOD;
        }else if(hits===this.size){
            this.state=BATTLESHIP.ShipState.SUNK;
        }else{
            this.state=BATTLESHIP.ShipState.HIT;
        }
    }

};