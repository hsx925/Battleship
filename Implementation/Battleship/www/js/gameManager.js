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
    //STANDARD: [4,3,3,2,2,2,1], //"standard",
    STANDARD: [5,4,4,3,3,3,2,2,2,2], //"standard",
    BIGSHIPS: [5,5,4,4,4,3,3], //"bigships",
    SMALLSHIPS: [3,3,2,2,2,1,1,1,1,1,1], //"smallships",
    ONESHIP: [3], //"oneship"
};

BATTLESHIP.BattlefieldType = {
    STANDARD: 10,
    EASY: 5,
    HARD: 15
};

BATTLESHIP.InAppPurchase = {
    BIGSHIPS: true,
    GFY: true,
    OSO: true,
    EASYFIELD: true,
    EVILFIELD: true
};

BATTLESHIP.GameManager = function () {
    this.gameType = BATTLESHIP.GameType.SINGLEPLAYER;
    this.networkType = BATTLESHIP.NetworkType.HOST;
    this.difficultyAI = BATTLESHIP.DifficultyAI.NORMAL;
    this.fleet = BATTLESHIP.FleetType.STANDARD;
    this.battlefieldSize = BATTLESHIP.BattlefieldType.STANDARD;
    this.gameStarted = false;
    this.battleStarted = false;
    this.readyForBattleCount = 0;
    this.networkEnemyPlaceFinishedMutex = false;
    this.networkEnemySelection = false;
    this.networkEnemyFire = false;

    this.startGame = function () {
        console.log("gamemanager start game");
        this.gameStarted = true;
        this.humanPlayer = new BATTLESHIP.HumanPlayer(this.battlefieldSize, this.fleet, this.onReadyForBattle, this.onFieldSelected, this.onFieldFire, this.onLoose);
        if (this.gameType === BATTLESHIP.GameType.SINGLEPLAYER) {
            this.enemyPlayer = new BATTLESHIP.AiPlayer(this.battlefieldSize, this.fleet, this.difficultyAI, this.onReadyForBattle, this.onFieldSelected, this.onFieldFire, this.onLoose)
        } else {
            //TODO error
        }
    }.bind(this);

    this.startBattle = function () {
        console.log("gamemanager start battle");
        this.battleStarted = true;

        if (this.gameType === BATTLESHIP.GameType.SINGLEPLAYER) {
            if (Math.random() < .5) {
                this.enemyPlayer.endTurn(); //because of set text
                this.humanPlayer.startTurn();
            } else {
                this.humanPlayer.endTurn()//because of set text
                this.enemyPlayer.startTurn();
            }
        } else if (this.gameType === BATTLESHIP.GameType.NETWORKPLAYER) {
            if (this.networkType === BATTLESHIP.NetworkType.HOST) {
                this.humanPlayer.startTurn();
            } else {
                this.humanPlayer.endTurn();
            }
        }
    }.bind(this);

    this.onReadyForBattle = function (player) {
        this.readyForBattleCount++;
        if (this.gameType === BATTLESHIP.GameType.NETWORKPLAYER && !this.networkEnemyPlaceFinishedMutex) {
            BATTLESHIP.network.playerFinishedPlacingShips();
        }
        if (this.readyForBattleCount === 2 && !this.battleStarted) {
            this.startBattle();
        }
    }.bind(this);

    this.onFieldSelected = function (player, position) {
        if (this.gameType === BATTLESHIP.GameType.SINGLEPLAYER) {
            if (player === this.humanPlayer) {
                this.enemyPlayer.selectFieldHuman(position);
            } else if (player === this.enemyPlayer) {
                this.humanPlayer.selectFieldHuman(position);
            }
        } else if (this.gameType === BATTLESHIP.GameType.NETWORKPLAYER) {
            if (this.networkEnemySelection) {
                this.humanPlayer.selectFieldHuman(position);
            } else {
                BATTLESHIP.network.playerFieldSelection(position);
            }
        }
    }.bind(this);

    this.onFieldFire = function (player) {
        if (this.gameType === BATTLESHIP.GameType.SINGLEPLAYER) {
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
        } else if (this.gameType === BATTLESHIP.GameType.NETWORKPLAYER) {
            if (this.networkEnemyFire) {
                var result = this.humanPlayer.fireFieldHuman();
                BATTLESHIP.network.playerFireResult(result);
                if (result === BATTLESHIP.FireResult.NONE) {
                    this.humanPlayer.startTurn();
                }
                this.humanPlayer.fireFieldEnemyResult(result);
            } else {
                BATTLESHIP.network.playerFire();
            }
        }
    }.bind(this);

    this.onLoose = function (player) {
        if (this.gameType === BATTLESHIP.GameType.SINGLEPLAYER) {
            if (player === this.humanPlayer) {
                this.humanPlayer.endTurn();
                this.humanPlayer.loose();
                this.enemyPlayer.win();
            } else if (player === this.enemyPlayer) {
                this.enemyPlayer.endTurn();
                this.enemyPlayer.loose();
                this.humanPlayer.win();
            }
        } else if (this.gameType === BATTLESHIP.GameType.NETWORKPLAYER) {
            this.humanPlayer.endTurn();
            this.humanPlayer.loose();
            BATTLESHIP.network.playerGameEnded();
        }
    }.bind(this);

    this.otherPlayerPlaceShipsFinishedCallback = function () {
        this.networkEnemyPlaceFinishedMutex = true;
        this.onReadyForBattle();
        this.networkEnemyPlaceFinishedMutex = false;
    }.bind(this);

    this.gameHostedCallback = function (gameId) {
        // show overlay
        $('#idInfo ').show();

        $('.idvalue').html(gameId);
    }.bind(this);

    this.gameStartCallback = function () {
        $('#idInfo').hide();
        this.gameType = BATTLESHIP.GameType.NETWORKPLAYER;
        this.startGame();
        location.href = "#placeships";
    }.bind(this);

    this.otherPlayerRequestsConfigCallback = function (gameId) {
        var gameConfig = {
            fleet: BATTLESHIP.gameManager.fleet,
            battlefieldSize: BATTLESHIP.gameManager.battlefieldSize,
            gameId: gameId
        };

        BATTLESHIP.network.playerSendConfig(gameConfig);
    }.bind(this);

    this.gameConfigReceivedCallback = function (gameConfig) {
        this.fleet = gameConfig.fleet;
        this.battlefieldSize = gameConfig.battlefieldSize;
        this.networkType = BATTLESHIP.NetworkType.JOIN;
        this.gameType = BATTLESHIP.GameType.NETWORKPLAYER;
    }.bind(this);

    this.otherPlayerFieldSelectedCallback = function (position) {
        this.networkEnemySelection = true;
        this.onFieldSelected(null, position);
        this.networkEnemySelection = false;
    }.bind(this);

    this.otherPlayerFiredCallback = function () {
        this.networkEnemyFire = true;
        this.onFieldFire(null);
        this.networkEnemyFire = false;
    }.bind(this);

    this.otherPlayerFireResultReceivedCallback = function (result) {
        if (result === BATTLESHIP.FireResult.NONE) {
            this.humanPlayer.endTurn();
        }
        this.humanPlayer.fireFieldEnemyResult(result);
    }.bind(this);

    this.otherPlayerGameEndedCallback = function () {
        this.humanPlayer.win();
    }.bind(this);

    this.errorCallback = function (error) {
        alert(error.message);
    }.bind(this);

};
