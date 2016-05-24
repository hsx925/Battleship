var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.FieldState = {
    DEFAULT: "default",
    SELECTED: "selected",
    HIT: "hit",
    FIRE: "fire"
};

BATTLESHIP.Field = function (x, y) {
    this.state = BATTLESHIP.FieldState.DEFAULT;
    this.occupyCount=0;
    this.position = {x:x, y:y};
    this.ship = null;

    this.isOccupied = function () {
        return (this.occupyCount>0);
    };

};