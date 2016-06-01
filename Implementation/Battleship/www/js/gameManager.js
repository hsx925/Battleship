var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.GameType = {
    SINGLEPLAYER: "singleplayer",
    NETWORKPLAYER: "networkplayer"
};

BATTLESHIP.NetworkType = {
    HOST: "host",
    JOIN: "join"
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
    this.networkType = BATTLESHIP.NetworkType.HOST; //TODO set in menucontroller
    this.difficultyAI = BATTLESHIP.DifficultyAI.NORMAL;
    this.fleet = BATTLESHIP.FleetType.STANDARD;
    this.battlefieldSize = BATTLESHIP.BattlefieldType.STANDARD;
    this.gameStarted=false;
    this.battleStarted=false;
    this.readyForBattleCount=0;

    this.startGame = function () {
        console.log("gamemanager start game");
        this.gameStarted=true;
        this.humanPlayer = new BATTLESHIP.HumanPlayer(this.battlefieldSize, this.fleet, this.onReadyForBattle, this.onFieldSelected, this.onFieldFire, this.onLoose);
        if(this.gameType === BATTLESHIP.GameType.SINGLEPLAYER){
            this.enemyPlayer = new BATTLESHIP.AiPlayer(this.battlefieldSize, this.fleet, this.difficultyAI, this.onReadyForBattle, this.onFieldSelected, this.onFieldFire, this.onLoose)
        }else if(this.gameType === BATTLESHIP.GameType.NETWORKPLAYER){
            if(this.networkType==BATTLESHIP.NetworkType.HOST){
                //TODO host logic
            }else if(this.networkType===BATTLESHIP.NetworkType.JOIN){
                //TODO join logic
            }
        }else{
            //TODO error
        }
    }.bind(this);

    this.startBattle = function () {
        console.log("gamemanager start battle");
        this.battleStarted=true;

        if(this.gameType === BATTLESHIP.GameType.SINGLEPLAYER) {
            if (Math.random() < .5) {
                this.enemyPlayer.endTurn(); //because of set text
                this.humanPlayer.startTurn();
            } else {
                this.humanPlayer.endTurn()//because of set text
                this.enemyPlayer.startTurn();
            }
        }else if(this.gameType === BATTLESHIP.GameType.NETWORKPLAYER){
            //TODO network stuff
        }
    }.bind(this);
    
    this.onReadyForBattle=function(player){
        this.readyForBattleCount++;
        if(this.readyForBattleCount===2 && !this.battleStarted){
            this.startBattle();
        }
    }.bind(this);

    this.onFieldSelected=function (player, position) {
        if(this.gameType === BATTLESHIP.GameType.SINGLEPLAYER) {
            if (player === this.humanPlayer) {
                this.enemyPlayer.selectFieldHuman(position);
            } else if (player === this.enemyPlayer) {
                this.humanPlayer.selectFieldHuman(position);
            }
        }else if(this.gameType === BATTLESHIP.GameType.NETWORKPLAYER){
            //TODO network stuff
        }
    }.bind(this);

    this.onFieldFire=function (player) {
        if(this.gameType === BATTLESHIP.GameType.SINGLEPLAYER) {
            if (player === this.humanPlayer) {
                var result = this.enemyPlayer.fireFieldHuman();
                if (result === BATTLESHIP.FireResult.NONE) {
                    this.humanPlayer.endTurn();
                    this.enemyPlayer.startTurn();
                }
                this.humanPlayer.fireFieldEnemyResult(result);
            } else if (player === this.enemyPlayer) {
                var result = this.humanPlayer.fireFieldHuman();
                if (result === BATTLESHIP.FireResult.NONE) {
                    this.enemyPlayer.endTurn();
                    this.humanPlayer.startTurn();
                }
                this.enemyPlayer.fireFieldEnemyResult(result);
            }
        }else if(this.gameType === BATTLESHIP.GameType.NETWORKPLAYER){
            //TODO network stuff
        }
    }.bind(this);

    this.onLoose=function (player) {
        if(this.gameType === BATTLESHIP.GameType.SINGLEPLAYER) {
            if (player === this.humanPlayer) {
                this.humanPlayer.endTurn();
                this.humanPlayer.loose();
                this.enemyPlayer.win();
            } else if (player === this.enemyPlayer) {
                this.enemyPlayer.endTurn();
                this.enemyPlayer.loose();
                this.humanPlayer.win();
            }
        }else if(this.gameType === BATTLESHIP.GameType.NETWORKPLAYER){
            //TODO network stuff
        }
    }.bind(this);
    
};
