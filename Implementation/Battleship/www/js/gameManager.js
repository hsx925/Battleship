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
    this.gameStarted=false;
    this.battleStarted=false;
    this.readyForBattleCount=0;

    this.startGame = function () {
        console.log("gamemanager start game");
        this.gameStarted=true;
        this.humanPlayer = new BATTLESHIP.HumanPlayer(this.battlefieldSize, this.fleet, this.onReadyForBattle, this.onFieldSelected, this.onFieldFire, this.onFinishTurn, this.onLoose);
        if(this.gameType === BATTLESHIP.GameType.SINGLEPLAYER){
            this.enemyPlayer = new BATTLESHIP.AiPlayer(this.battlefieldSize, this.fleet, this.difficultyAI, this.onReadyForBattle, this.onFieldSelected, this.onFieldFire, this.onFinishTurn, this.onLoose)
        }else if(this.gameType === BATTLESHIP.GameType.NETWORKPLAYER){
            //TODO setup network connection?
        }else{
            //TODO error
        }
    }.bind(this);

    this.startBattle = function () {
        console.log("gamemanager start battle");
        this.battleStarted=true;

        //TODO setup timer
        //TODO set texts

        this.enemyPlayer.startTurn();

        if(Math.random()<.5){
            this.humanPlayer.startTurn();
        }else{
            this.enemyPlayer.startTurn();
        }
    }.bind(this);
    
    
    this.onReadyForBattle=function(player){
        this.readyForBattleCount++;
        if(this.readyForBattleCount===2 && !this.battleStarted){
            this.startBattle();
        }
    }.bind(this);

    this.onFieldSelected=function (player, position) {
        if(player===this.humanPlayer){
            return this.enemyPlayer.selectFieldHuman(position);
        }else if(player===this.enemyPlayer){
            return this.humanPlayer.selectFieldHuman(position);
        }
    }.bind(this);

    this.onFieldFire=function (player) {
        var me = this; //TODO
        if(player===this.humanPlayer){
            return this.enemyPlayer.fireFieldHuman();
        }else if(player===this.enemyPlayer){
            return this.humanPlayer.fireFieldHuman();
        }
    }.bind(this);

    this.onFinishTurn=function (player) {
        if(player===this.humanPlayer){
            this.humanPlayer.endTurn();
            this.enemyPlayer.startTurn();
        }else if(player===this.enemyPlayer){
            this.enemyPlayer.endTurn();
            this.humanPlayer.startTurn();
        }
    }.bind(this);

    this.onLoose=function (player) {
        if(player===this.humanPlayer){
            this.humanPlayer.endTurn();
            this.humanPlayer.loose();
            this.enemyPlayer.win();
        }else if(player===this.enemyPlayer){
            this.enemyPlayer.endTurn();
            this.enemyPlayer.loose();
            this.humanPlayer.win();
        }
    }.bind(this);
    
};
