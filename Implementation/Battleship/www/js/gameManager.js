var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.GameType = {
    SINGLEPLAYER: "singleplayer",
    NETWORKPLAYER: "networkplayer"
}

BATTLESHIP.DifficultyAI = {
    EASY: "easy",
    NORMAL: "normal",
    HARD: "hard"
};

BATTLESHIP.FleetType = {
    STANDARD: "standard",
    BIGSHIPS: "bigships",
    GOODFORYOU: "goodforyou",
    ONESHIP: "oneship"
};

BATTLESHIP.BattlefieldType = {
    STANDARD: 10,
    EASY: 5,
    HARD: 20
};

BATTLESHIP.InAppPurchase = {
    BIGSHIPS: true,
    GFY: false,
    OSO: false,
    EASYFIELD: false,
    EVILFIELD: false
};

BATTLESHIP.GameManager = function () {
    this.gameType = BATTLESHIP.GameType.SINGLEPLAYER;
    this.difficultyAI = BATTLESHIP.DifficultyAI.NORMAL;
    this.fleet = BATTLESHIP.FleetType.STANDARD;
    this.battlefieldSize = BATTLESHIP.BattlefieldType.STANDARD;

    this.startGame = function () {
        console.log("gamemanager start game");
        //TODO init players, battlefields and ships
    };

    this.startBattle = function () {
        console.log("gamemanager start battle");
    };
};
