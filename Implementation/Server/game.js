var io;
var gameSocket;

/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */
exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
	
	gameSocket.on('hostCreateNewGame', hostCreateNewGame);
	gameSocket.on('startGame', startGame);
	gameSocket.on('playerJoinGame', playerJoinGame);
	gameSocket.on('playerPlaceShipsFinished', playerPlaceShipsFinished);
	
	gameSocket.on('playerFire', playerFire);
	gameSocket.on('playerFireResult', playerFireResult);
	gameSocket.on('playerFieldSelection', playerFieldSelection);
	gameSocket.on('playerGameEnded', playerGameEnded);
	gameSocket.on('playerSendConfig', playerSendConfig);
}

/**
 * The 'START' button was clicked and 'hostCreateNewGame' event occurred.
 */
function hostCreateNewGame() {
    // Create a unique Socket.IO Room
    var thisGameId = ( Math.random() * 100000 ) | 0;

	console.log("New game " + thisGameId + " created");
    // Return the Room ID (gameId) and the socket ID (mySocketId) to the host
    this.emit('gameHosted', {gameId: thisGameId, mySocketId: this.id});

    // Join the Room and wait for other player
    this.join(thisGameId.toString());
	console.log(io.sockets.adapter.rooms);
};

/*
 * Chooses random player to start and starts the game
 * @param gameId The game ID / room ID
 */
function startGame(gameId) {
	console.log("All Players Present. Starting game...");
	var sock = this;
    var data = {
        mySocketId : sock.id,
        gameId : gameId,
    };
    
    io.sockets.in(data.gameId).emit('beginGame', data);
};

/**
 * A player clicked the 'JOIN GAME' button.
 * Attempt to connect them to the room that matches
 * the gameId entered by the player.
 * @param data Contains data entered via player's input - playerName and gameId.
 */
function playerJoinGame(data) {
    console.log('Player ' + data.playerName + ' attempting to join game: ' + data.gameId );
    
	// A reference to the player's Socket.IO socket object
    var sock = this;
	
	try {
		// Look up the room ID in the Socket.IO manager object.
		var room = io.sockets.adapter.rooms[data.gameId];
	
		if (room != undefined){	
			// attach the socket id to the data object.
			data.mySocketId = sock.id;
		
			// Join the room
			sock.join(data.gameId);
		
			console.log('Player ' + data.playerName + ' joined game: ' + data.gameId );
			
			// after join, request config for the game
			this.broadcast.to(data.gameId).emit('otherPlayerRequestsConfig', data);
			
			// Directly start game
			//startGame(data.gameId);
		} else {
			console.log('Room does not exist');
			this.emit('onError',{message: "This room does not exist."} );
		}
    } catch(err) {
        // Otherwise, send an error message back to the player.
		console.log('Room does not exist');
        this.emit('onError',{message: "This room does not exist."} );
    }
}

function playerSendConfig(gameConfig) {
	console.log('Hosts ' + gameConfig.playerName + ' sends config with size ' + gameConfig.boardSize + ' and shipmode ' + gameConfig.shipMode);
	
	this.broadcast.to(gameConfig.gameId).emit('otherPlayerSendsConfig', gameConfig);
}

function playerFire(fireData) {
	console.log('Player ' + fireData.playerName + ' fired at: ' + fireData.field + ' in game ' + fireData.gameId + " (" + this.id + ")");
	//console.log(io.sockets.adapter.rooms);
	
	this.broadcast.to(fireData.gameId).emit('otherPlayerFired', fireData);
}

function playerFireResult(fireResultData) {
	// result:
	// miss
	// hit
	// hit and sunk
	console.log('Shot at ' + fireResultData.playerName + 's field ' + fireResultData.field + ' ' + fireResultData.result);
	
	this.broadcast.to(fireResultData.gameId).emit('otherPlayerFireResultReceived', fireResultData);
}

function playerFieldSelection(fieldSelectionData) {
	console.log('Player ' + fieldSelectionData.playerName + ' selected field ' + fieldSelectionData.field);
	
	this.broadcast.to(fieldSelectionData.gameId).emit('otherPlayerFieldSelected', fieldSelectionData);
}

function playerPlaceShipsFinished(placeShipsFinishedData) {
	console.log('Player ' + placeShipsFinishedData.playerName + ' has finished placing ships');
	
	this.broadcast.to(placeShipsFinishedData.gameId).emit('otherPlayerPlaceShipsFinished', placeShipsFinishedData);
}

function playerGameEnded(gameEndData) {
	console.log('Game has ended. Player ' + gameEndData.winner + ' has won');
	
	this.broadcast.to(gameEndData.gameId).emit('otherPlayerGameEnded' , gameEndData);
	
	// remove all players from the room
	io.sockets.in(gameEndData.gameId).leave(gameEndData.gameId);
}