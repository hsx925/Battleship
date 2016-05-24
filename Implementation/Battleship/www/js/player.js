var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.PlayerType = {
    HUMAN_LOCAL: "human_local",
    HUMAN_NETWORK: "human_network",
    ENEMY_AI: "enemy_ai",
    ENEMY_NETWORK: "enemy_network"
};

BATTLESHIP.Player = function (type, battlefieldSize, fleet, difficultyAI) {
    this.type = type;
    var ships = new Array(fleet.length);
    for(var i=0; i<fleet.length; ++i){
        ships[i]=new BATTLESHIP.Ship("ship"+(i+1), fleet[i]);
    }
    this.battlefield = new BATTLESHIP.Battlefield(battlefieldSize, ships);
    this.battlefieldEnemy = new BATTLESHIP.Battlefield(battlefieldSize, ships);
    this.difficultyAI = difficultyAI;
};