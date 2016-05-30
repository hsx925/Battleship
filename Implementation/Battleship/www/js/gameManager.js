var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.GameType = {
    SINGLEPLAYER: "singleplayer",
    NETWORKPLAYER: "networkplayer"
};

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
    GFY: true,
    OSO: false,
    EASYFIELD: true,
    EVILFIELD: false
};

BATTLESHIP.GameManager = function () {
    this.gameType = BATTLESHIP.GameType.SINGLEPLAYER;
    this.difficultyAI = BATTLESHIP.DifficultyAI.NORMAL;
    this.fleet = BATTLESHIP.FleetType.STANDARD;
    this.battlefieldSize = BATTLESHIP.BattlefieldType.STANDARD;
    this.placeShipsFinished = false;
    this.menuFinished = false;

    this.startGame = function () {
        console.log("gamemanager start game");
        this.humanPlayer = new BATTLESHIP.HumanPlayer(this.battlefieldSize, this.fleet, this.onPlaceShipsFinished, this.onFieldSelected, this.onFieldFire, this.onLoose);
        if(this.gameType === BATTLESHIP.GameType.SINGLEPLAYER){
            //this.enemyPlayer = new BATTLESHIP.Player(BATTLESHIP.PlayerType.AI,this.battlefieldSize, this.fleet, this.difficultyAI);
            this.enemyPlayer = new BATTLESHIP.AiPlayer(this.battlefieldSize, this.fleet, this.difficultyAI, this.onPlaceShipsFinished, this.onFieldSelected, this.onFieldFire, this.onLoose)
        }else if(this.gameType === BATTLESHIP.GameType.NETWORKPLAYER){
            //setup network connection?
        }else{
            //TODO error
        }
    };

    this.startBattle = function () {
        console.log("gamemanager start battle");
    };
    
    
    this.onPlaceShipsFinished=function(player){
        
    };

    this.onFieldSelected=function (player, position) {

    };

    this.onFieldFire=function (player) {

    };

    this.onLoose=function (player) {

    };
    
};
