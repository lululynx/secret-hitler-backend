'use strict';

require('dotenv').config();

const server = require('http').createServer();
const io = require('socket.io')(server);

const gameController = require('./controllers/game.controller');
const playerController = require('./controllers/player.controller');

io.on('connection', (client) => {
  console.log(`connected to client ${client.id}`);
  // meta methods
  client.on('createGame', (user) => {
    client.broadcast.emit('gameCreated', gameController.createGame(user));
  });
  client.on('joinGame', (user, gameId) => {
    client.broadcast.emit('playerJoinedGame', gameController.joinGame(user, gameId));
  });
  client.on('startGame', (gameId) => {
    client.broadcast.emit('gameStarted', gameController.startGame());
  });
  client.on('leaveGame', (user, gameId) => {
    client.broadcast.emit('leftGame', gameController.leaveGame());
  });

  // player methods
  client.on('voteOnChancellor', playerController.voteOnChancellor);
  client.on('suggestChancellor', playerController.suggestChancellor);
  client.on('pickPolicies', playerController.pickPolicies);
  client.on('executePlayer', playerController.executePlayer);
  client.on('vetoPolicy', playerController.vetoPolicy);

  client.on('disconnect', () => {
    console.log(`client ${client.id} disconnected`);
  })

  client.on('error', (err) => {
    console.log('received error from client:', client.id);
    console.log(err);
  })
})

if (!module.parent) {
  const ip = process.env.localIp || 'localhost';
  const port = process.env.localPort || 3000;
  server.listen(port, ip, (err) => {
    if (err) throw err;
    console.log(`Server running at http://${ip}:${port}`);
  });
}