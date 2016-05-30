var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.FireResult = {
    NONE: "none",
    HIT: "ship",
    SUNK: "sunk",
    ERROR: "error"
};

BATTLESHIP.Battlefield = function (size, ships) {
    this.size = size;
    this.fields = new Array(size);
    this.selectedField = null;
    for(var x=0; x<size; x++){
        this.fields[x] = new Array(size);
        for(var y=0; y<size; y++){
            this.fields[x][y]=new BATTLESHIP.Field(x, y);
        }
    }
    if(ships){
        this.ships = ships;
    }else {
        this.ships = [];
    }


    this.getShipById = function(shipId){
        for(var i=0; i<this.ships.length; ++i){
            if(this.ships[i].id===shipId){
                return this.ships[i];
            }
        }
        return null;
    };

    this.allShipsSet = function () {
        for(var i=0; i<this.ships.length; i++) {
            if (!this.ships[i].isSet) {
                return false;
            }
        }
        return true;
    };

    this.allShipsSunk = function () {
        for(var i=0; i<this.ships.length; i++) {
            if (!(this.ships[i].state === BATTLESHIP.ShipState.SUNK)) {
                return false;
            }
        }
        return true;
    };

    this.setShip = function (ship, position, direction) {
        if(!ship || this.ships.indexOf(ship)<0){
            return false;
        }
        if(ship.isSet){
            this.removeShip(ship);
        }
        ship.direction = direction;
        ship.position = position;
        if(this._canPlaceShip(ship)){
            this._setShip(ship);
            return true;
        }

        return false;
    };

    this._canPlaceShip=function(ship){
        var x = ship.position.x;
        var y = ship.position.y;
        var size = ship.size;
        var direction = ship.direction;
        var fieldSize = this.size;

        if(direction===BATTLESHIP.ShipDirection.HORIZONTAL && x+ship.size>fieldSize ||
            direction===BATTLESHIP.ShipDirection.VERTICAL && y+ship.size>fieldSize ||
            x<0 || y<0){
            return false;
        }

        for(var i=0; i<size; i++){
            if(this.fields[x][y].isOccupied()){
                return false;
            }
            if(direction===BATTLESHIP.ShipDirection.HORIZONTAL){
                x++;
            }else{
                y++;
            }
        }
        return true;
    }

    this._setShip=function(ship){
        var x=ship.position.x;
        var y=ship.position.y;
        var direction=ship.direction;
        var size = ship.size;

        this._setOccupied(ship, true);

        for(var i=0; i<size; i++){
            this.fields[x][y].ship=ship;
            ship.fields[i]=this.fields[x][y];
            if(direction===BATTLESHIP.ShipDirection.HORIZONTAL){
                x++;
            }else{
                y++;
            }
        }
        ship.isSet=true;
    };

    this.removeShip=function(ship){
        this._setOccupied(ship, false);
        for(var i=0; i<ship.fields.length; i++){
            ship.fields[i].ship=null;
        }
        ship.fields=[];
        ship.isSet=false;
    };

    this._setOccupied=function (ship, occupied) {
        var x=ship.position.x;
        var y=ship.position.y;
        var size = ship.size;
        var direction = ship.direction;
        var fieldSize = this.size;

        var startX = x > 0 ? x-1 : 0;
        var startY = y > 0 ? y-1 : 0;
        var endX = direction === BATTLESHIP.ShipDirection.HORIZONTAL ? x+size : x+1;
        var endY = direction === BATTLESHIP.ShipDirection.HORIZONTAL ? y+1 : y+size;

        //console.log({startX:startX, endX:endX, startY:startY, endY:endY});

        if(endX >= fieldSize) endX = fieldSize-1;
        if(endY >= fieldSize) endY = fieldSize-1;
        for(var i=startX; i<=endX; i++){
            for(var j=startY; j<=endY; j++){
                if(occupied){
                    this.fields[i][j].occupyCount++;
                }else{
                    this.fields[i][j].occupyCount--;
                }
                //console.log(this.fields[i][j].occupyCount);
            }
        }
    };

    this.selectField=function (position) {
        if(position.x >= this.size-1 || position.y >= this.size-1){
            return false;
        }
        var field = this.fields[position.x][position.y];
        var lastField = this.selectedField;
        if(lastField && lastField.state === BATTLESHIP.FieldState.SELECTED) {
            lastField.state = BATTLESHIP.FieldState.DEFAULT;
        }
        if(!(field.state === BATTLESHIP.FieldState.HIT || field.state === BATTLESHIP.FieldState.HIT_SHIP)){
            field.state = BATTLESHIP.FieldState.SELECTED;
            this.selectedField=field;
            return true;
        }
        this.selectedField=null;
        return false;
    };

    this.fireWithResult=function (fireResult) {
        var field = this.selectedField;
        this.selectedField=null;
        if(!field){
            return false;
        }
        switch(fireResult){
            case BATTLESHIP.FireResult.NONE:
                field.state=BATTLESHIP.FieldState.HIT;
                break;
            case BATTLESHIP.FireResult.HIT:
            case BATTLESHIP.FireResult.SUNK:
                field.state=BATTLESHIP.FieldState.HIT_SHIP;
                break;
            case BATTLESHIP.FireResult.ERROR:
                console.log("Error shooting on field!");
                return false;
                break;
        }

        if(fireResult===BATTLESHIP.FireResult.SUNK){
            //TODO add ship model
        }
        return true;
    };

    this.fire=function () {
        var field = this.selectedField;
        this.selectedField=null;
        if(!field){
            return BATTLESHIP.FireResult.ERROR;
        }
        var ship = field.ship;
        if(ship){
            field.state = BATTLESHIP.FieldState.HIT_SHIP;
            ship.updateState();
            switch(ship.state){
                case BATTLESHIP.ShipState.GOOD:
                    return BATTLESHIP.FireResult.ERROR;
                case BATTLESHIP.ShipState.HIT:
                    return BATTLESHIP.FireResult.HIT;
                case BATTLESHIP.ShipState.SUNK:
                    return BATTLESHIP.FireResult.SUNK;
            }
        }else{
            field.state = BATTLESHIP.FieldState.HIT;
            return BATTLESHIP.FireResult.NONE;
        }
    }
};