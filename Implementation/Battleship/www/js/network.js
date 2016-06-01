var BATTLESHIP = BATTLESHIP || {};

// http://kdeubler.at:8082
// http://localhost:8082
BATTLESHIP.Network = function (connectionString) {
    var me = this;
    this.gameId = "";
    this.socket = io(connectionString);
    this.gameHostedCallback = null;
    this.gameStartCallback = null;
    this.gameOtherPlayerRequestsConfigCallback = null;
    this.gameOtherPlayerPlaceShipsFinishedCallback = null;
    this.gameOtherPlayerFieldSelectedCallback = null;
    this.gameOtherPlayerFiredCallback = null;
    this.gameOtherPlayerFireResultReceivedCallback = null;
    this.gameConfigReceivedCallback = null;
    this.gameOtherPlayerGameEndedCallback = null;
    this.errorCallback = null;

    this.hostGame = function (hostedCallback, gameStartCallback, otherPlayerRequestsConfigCallback, otherPlayerPlaceShipsFinishedCallback, otherPlayerFieldSelectedCallback, otherPlayerFiredCallback, otherPlayerFireResultReceivedCallback, otherPlayerGameEndedCallback, errorCallback) {
        console.log("Create game");

        me.gameHostedCallback = hostedCallback;
        me.gameStartCallback = gameStartCallback;
        me.gameOtherPlayerPlaceShipsFinishedCallback = otherPlayerPlaceShipsFinishedCallback;
        me.gameOtherPlayerRequestsConfigCallback = otherPlayerRequestsConfigCallback;
        me.gameOtherPlayerFiredCallback = otherPlayerFiredCallback;
        me.gameOtherPlayerFireResultReceivedCallback = otherPlayerFireResultReceivedCallback;
        me.gameOtherPlayerFieldSelectedCallback = otherPlayerFieldSelectedCallback;
        me.gameOtherPlayerGameEndedCallback = otherPlayerGameEndedCallback;
        me.errorCallback = errorCallback;

        me.socket.emit('hostCreateNewGame');
    };

// Callback of hostGame()
// Receive GameId of created game
    this.gameHosted = function (gameHostedData) {
        console.log("Game " + gameHostedData.gameId + " created.");

        me.gameId = gameHostedData.gameId;
        me.gameHostedCallback(gameHostedData.gameId);
    };

// call with gameId
    this.joinGame = function (gameId, gameConfigReceivedCallback, gameStartCallback, otherPlayerPlaceShipsFinishedCallback, otherPlayerFieldSelectedCallback, otherPlayerFiredCallback, otherPlayerFireResultReceivedCallback, otherPlayerGameEndedCallback, errorCallback) {
        console.log("Join game");
        me.gameConfigReceivedCallback = gameConfigReceivedCallback;
        me.gameOtherPlayerPlaceShipsFinishedCallback = otherPlayerPlaceShipsFinishedCallback;
        me.gameOtherPlayerFieldSelectedCallback = otherPlayerFieldSelectedCallback;
        me.gameOtherPlayerFireResultReceivedCallback = otherPlayerFireResultReceivedCallback;
        me.gameOtherPlayerFiredCallback = otherPlayerFiredCallback;
        me.gameOtherPlayerGameEndedCallback = otherPlayerGameEndedCallback;
        me.gameStartCallback = gameStartCallback;
        me.errorCallback = errorCallback;

        me.gameId = gameId;

        var gameData = {
            gameId: me.gameId,
            playerName: "Knusbert"
        };

        me.socket.emit('playerJoinGame', gameData);
    };

    this.beginGame = function (gameData) {
        console.log("Start game");
        me.gameStartCallback();
    };

    this.playerFire = function () {
        var fireData = {
            // get gameId from some storage
            gameId: me.gameId,
            playerName: "Knusbert"
        };

        me.socket.emit('playerFire', fireData);
    };

    this.playerFireResult = function (fireResult) {
        var fireResultData = {
            gameId: me.gameId,
            playerName: "Knusbert",
            result: fireResult
        };

        me.socket.emit('playerFireResult', fireResultData);
    };

    this.playerFieldSelection = function (position) {
        var selectionData = {
            gameId: me.gameId,
            playerName: "Knusbert",
            field: position
        };

        me.socket.emit('playerFieldSelection', selectionData);
    };

    this.playerGameEnded = function () {
        var gameEndData = {
            gameId: me.gameId,
            playerName: "Knusbert",
            winner: "Knusbert"
        };

        me.socket.emit('playerGameEnded', gameEndData);
    };

    this.playerSendConfig = function (gameConfig) {
        me.socket.emit('playerSendConfig', gameConfig);
    };

    this.playerFinishedPlacingShips = function () {
        var data = {
            gameId: me.gameId
        };

        me.socket.emit('playerPlaceShipsFinished', data);
    };

    this.otherPlayerFired = function (fireData) {
        console.log("Shot received at " + fireData.field);

        me.gameOtherPlayerFiredCallback();
    };

    this.otherPlayerRequestsConfig = function (data) {
        console.log("Other player requested config");
        me.gameOtherPlayerRequestsConfigCallback(me.gameId);
    };

    this.otherPlayerSendsConfig = function (gameConfig) {
        console.log("Host player sent config");
        me.gameConfigReceivedCallback(gameConfig);
        me.socket.emit('startGame', gameConfig.gameId);
    };

    this.otherPlayerFieldSelected = function (selectionData) {
        console.log("Enemy selected Field " + selectionData.field);

        me.gameOtherPlayerFieldSelectedCallback(selectionData.field);
    };

    this.otherPlayerFireResultReceived = function (fireResultData) {
        console.log("Result from our shot: " + fireResultData.result);

        me.gameOtherPlayerFireResultReceivedCallback(fireResultData.result);
    };

    this.otherPlayerPlaceShipsFinished = function (placeShipsFinishedData) {
        console.log("Other player finished placing ships");

        me.gameOtherPlayerPlaceShipsFinishedCallback();
    };

    this.otherPlayerGameEnded = function (gameEndData) {
        console.log('Game has ended. Player ' + gameEndData.winner + ' has won');

        me.gameOtherPlayerGameEndedCallback();
    };

    this.onError = function (err) {
        me.errorCallback(err);
    };

    this.socket.on('gameHosted', me.gameHosted);
    this.socket.on('beginGame', me.beginGame);
    this.socket.on('onError', me.onError);

    this.socket.on('otherPlayerFired', me.otherPlayerFired);
    this.socket.on('otherPlayerGameEnded', me.otherPlayerGameEnded);
    this.socket.on('otherPlayerFireResultReceived', me.otherPlayerFireResultReceived);
    this.socket.on('otherPlayerFieldSelected', me.otherPlayerFieldSelected);
    this.socket.on('otherPlayerSendsConfig', me.otherPlayerSendsConfig);
    this.socket.on('otherPlayerPlaceShipsFinished', me.otherPlayerPlaceShipsFinished);
    this.socket.on('otherPlayerRequestsConfig', me.otherPlayerRequestsConfig);

    return {
        hostGame: this.hostGame,
        gameHosted: this.gameHosted,
        joinGame: this.joinGame,
        beginGame: this.beginGame,
        playerFire: this.playerFire,
        playerFireResult: this.playerFireResult,
        playerSendConfig: this.playerSendConfig,
        playerFieldSelection: this.playerFieldSelection,
        playerGameEnded: this.playerGameEnded,
        playerFinishedPlacingShips: this.playerFinishedPlacingShips,
        otherPlayerPlaceShipsFinished: this.otherPlayerPlaceShipsFinished,
        otherPlayerRequestsConfig: this.otherPlayerRequestsConfig,
        otherPlayerSendsConfig: this.otherPlayerSendsConfig,
        otherPlayerFired: this.otherPlayerFired,
        otherPlayerFieldSelected: this.otherPlayerFieldSelected,
        otherPlayerFireResultReceived: this.otherPlayerFireResultReceived,
        otherPlayerGameEnded: this.otherPlayerGameEnded,
        onError: this.onError
    };
};