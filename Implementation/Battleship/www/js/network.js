/**
 * Created by Konrad on 28.05.2016.
 */


// http://kdeubler.at:8082
// http://localhost:8082
var Network = function (connectionString) {
    var socket = io(connectionString);

    var hostGame = function () {
        console.log("Create game");
        socket.emit('hostCreateNewGame');
        // callback newGameCreated
    };

// Callback of hostGame()
// Receive GameId of created game
    var gameHosted = function (gameHostedData) {
        console.log("Game " + gameHostedData.gameId + " created.");
        document.getElementById("myConsole").value = gameHostedData.gameId;
        // display gameId to user
    };

// call with gameId
    var joinGame = function () {
        console.log("Join game");

        var gameData = {
            gameId: document.getElementById("myConsole").value,
            playerName: "Knusbert"
        };

        socket.emit('playerJoinGame', gameData);
    };

    var beginGame = function (gameData) {
        console.log("Start game");
        // start game - move to place ships screen
    };

    var playerFire = function () {
        var fireData = {
            // get gameId from some storage
            gameId: document.getElementById("myConsole").value,
            playerName: "Knusbert",
            field: "A8"
        };

        socket.emit('playerFire', fireData);
    };

    var playerFieldSelection = function () {
        var selectionData = {
            gameId: document.getElementById("myConsole").value,
            playerName: "Knusbert",
            field: "D3"
        };

        socket.emit('playerFieldSelection', selectionData);
    };

    var playerGameEnded = function () {
        var gameEndData = {
            gameId: document.getElementById("myConsole").value,
            playerName: "Knusbert",
            winner: "Knusbert"
        };

        socket.emit('playerGameEnded', gameEndData);
    };

    var otherPlayerFired = function (fireData) {
        console.log("Shot received at " + fireData.field);

        // handle incoming shot
        // send back result

        var fireResultData = {
            gameId: document.getElementById("myConsole").value,
            playerName: "Knusbert",
            field: fireData.field,
            result: "Hit"
        };
        socket.emit('playerFireResult', fireResultData);
    };

    var otherPlayerFieldSelected = function (selectionData) {
        console.log("Enemy selected Field " + selectionData.field);

        // handle selection
    };

    var otherPlayerFireResultReceived = function (fireResultData) {
        console.log("Result from our shot: " + fireResultData.result);

        // handle hit, miss, sunk
    };

    var otherPlayerGameEnded = function (gameEndData) {
        console.log('Game has ended. Player ' + gameEndData.winner + ' has won');

        // handle game end
    };

    var onError = function (err) {
        console.log(err.message);
    };

    return {
        hostGame: hostGame,
        gameHosted: gameHosted,
        joinGame: joinGame,
        beginGame: beginGame,
        playerFire: playerFire,
        playerFieldSelection: playerFieldSelection,
        playerGameEnded: playerGameEnded,
        otherPlayerFired: otherPlayerFired,
        otherPlayerFieldSelected: otherPlayerFieldSelected,
        otherPlayerFireResultReceived: otherPlayerFireResultReceived,
        otherPlayerGameEnded: otherPlayerGameEnded,
        onError: onError
    };
};