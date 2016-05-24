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

    

};