var server = require('http').createServer();
var io = require('socket.io')(server);

var battleship = require('./game');

io.sockets.on('connection', function (socket) {
    console.log('Client connected');

    battleship.initGame(io, socket);
});

server.listen(8082);