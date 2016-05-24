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
    STANDARD: [4,3,3,2,2,2,1], //"standard",
    BIGSHIPS: [5,4,4,3,3,3,2,2], //"bigships",
    GOODFORYOU: [5], //"goodforyou",
    ONESHIP: [1], //"oneship"
};

BATTLESHIP.BattlefieldType = {
    STANDARD: 10,
    EASY: 5,
    HARD: 20
};

BATTLESHIP.InAppPurchase = {
    BIGSHIPS: false,
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
        if(this.gameType === BATTLESHIP.GameType.SINGLEPLAYER){
            this.humanPlayer = new BATTLESHIP.Player(BATTLESHIP.PlayerType.HUMAN_LOCAL,this.battlefieldSize, this.fleet);
            this.enemyPlayer = new BATTLESHIP.Player(BATTLESHIP.PlayerType.ENEMY_AI,this.battlefieldSize, this.fleet, this.difficultyAI);
        }else if(this.gameType === BATTLESHIP.GameType.NETWORKPLAYER){
            this.humanPlayer = new BATTLESHIP.Player(BATTLESHIP.PlayerType.HUMAN_NETWORK,this.battlefieldSize, this.fleet);
            this.enemyPlayer = new BATTLESHIP.Player(BATTLESHIP.PlayerType.ENEMY_NETWORK,this.battlefieldSize, this.fleet);
        }
    };

    this.startBattle = function () {
        console.log("gamemanager start battle");
    };
};
