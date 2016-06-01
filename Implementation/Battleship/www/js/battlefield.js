var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.FireResult = {
    NONE: "none",
    HIT: "ship",
    SUNK: "sunk",
    ERROR: "error"
};

BATTLESHIP.Battlefield = function (size, fleet, id) {
    this.id = id;
    this.size = size;
    this.fields = new Array(size);
    this.selectedField = null;
    for(var x=0; x<size; x++){
        this.fields[x] = new Array(size);
        for(var y=0; y<size; y++){
            this.fields[x][y]=new BATTLESHIP.Field(x, y);
        }
    }
    this.ships = [];

    //ships added on bottom of Ctor becauso fo function usage

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

    this.addShip=function(size){
        var ship = new BATTLESHIP.Ship("ship"+this.ships.length, size);
        this.ships.push(ship);
        return ship;
    };

    this.addShips=function (fleet) {
        for(var i=0; i<fleet.length; ++i){
            this.addShip(fleet[i]);
        }
        return this.ships;
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

    this.autoSetShips=function () {
        this.removeAllShips();
        var i = 0; //ship iterator
        var n = 0; //limiter iterator for tries
        while (n < 1000 && i<this.ships.length) { //TODO remove magic numbers
            var coordinates = this.getRandomCoordinates();
            var direction = this._getRandomShipDirection();
            if (this.setShip(this.ships[i], coordinates, direction)) {
                if (this.allShipsSet()) {
                    break;
                }
                i++;
            }
            n++;
        }

        if(this.allShipsSet()){
            return true;
        }
        return false;
    };

    this.getRandomCoordinates=function () {
        var x= this._getRandomCoordinate();
        var y= this._getRandomCoordinate();
        return {x:x, y:y};
    };

    this._getRandomCoordinate=function () {
        return Math.floor((Math.random() * this.size-1) + 1);
    }

    this._getRandomShipDirection=function () {
        if(Math.random()<.5){
            return BATTLESHIP.ShipDirection.HORIZONTAL;
        }
        return BATTLESHIP.ShipDirection.VERTICAL;
    }

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
        if(!ship || !ship.isSet || this.ships.indexOf(ship)<0) {
            return;
        }
        this._setOccupied(ship, false);
        for (var i = 0; i < ship.fields.length; i++) {
            ship.fields[i].ship = null;
        }
        ship.fields = [];
        ship.isSet = false;
    };

    this.removeAllShips=function () {
        for(var i=0; i<this.ships.length; i++){
            this.removeShip(this.ships[i]);
        }
    }

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
        if(position.x >= this.size || position.y >= this.size){
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
            this.addShipEnemyOnSunk(field);
        }
        return true;
    };

    //TODO finish implementation
    this.addShipEnemyOnSunk=function(field) {
        if (!field) {
            return false;
        }

        var x = field.position.x;
        var y = field.position.y;
        var size = 1;

        var direction = BATTLESHIP.ShipDirection.HORIZONTAL;
        if ((x+1) < this.size && this.fields[x+1][y].state.state===BATTLESHIP.FieldState.HIT_SHIP) {
            direction = BATTLESHIP.ShipDirection.HORIZONTAL;
        } else if ((x-1) >= 0 && this.fields[x-1][y].state===BATTLESHIP.FieldState.HIT_SHIP) {
            direction = BATTLESHIP.ShipDirection.HORIZONTAL;
        } else if ((y+1) < this.size && this.fields[x][y+1].state===BATTLESHIP.FieldState.HIT_SHIP) {
            direction = BATTLESHIP.ShipDirection.VERTICAL;
        } else if ((y-1) >= 0 && this.fields[x][y-1].state===BATTLESHIP.FieldState.HIT_SHIP) {
            direction = BATTLESHIP.ShipDirection.VERTICAL;
        }

        if (direction === BATTLESHIP.ShipDirection.HORIZONTAL) {
            while ((x+1) < this.size && this.fields[x+1][y].state===BATTLESHIP.FieldState.HIT_SHIP) {
                x++;
            }
            while ((x-1) >= 0 && this.fields[x-1][y].state===BATTLESHIP.FieldState.HIT_SHIP) {
                x--;
                size++;
            }
        }else if(direction===BATTLESHIP.ShipDirection.VERTICAL){
            while ((y+1) < this.size && this.fields[x][y+1].state===BATTLESHIP.FieldState.HIT_SHIP) {
                y++;
            }
            while ((y-1) >= 0 && this.fields[x][y-1].state===BATTLESHIP.FieldState.HIT_SHIP) {
                y--;
                size++;
            }
        }
        this.setShip(this.addShip(size), {x:x, y:y},direction);
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
    };

    if(fleet){
        this.addShips(fleet);
    }
};