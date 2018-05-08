'use strict';

const server = require('http').createServer();

require('dotenv').config();

const io = require('socket.io')(server);

const gameController = require('./controllers/game.controller');
const playerController = require('./controllers/player.controller');

io.on('connection', (client) => {
  console.log(`connected to client ${client.id}`);

  // game methods
  client.on('createGame', (user) => {
    console.log('create game with id ', client.id);
    const playerList = gameController.createGame(client.id, user);
    client.join(client.id);
    io.to(client.id).emit('gameCreated', playerList);
  });

  client.on('joinGame', (gameId, user) => {
    client.join(gameId);
    const playerList = gameController.joinGame(gameId, user);
    io.to(gameId).emit('playerJoinedGame', playerList);
  });

  client.on('startGame', (gameId) => {
    const game = gameController.startGame(gameId);
    io.to(game.id).emit('gameStarted', game);
  });

  client.on('leaveGame', (user, gameId) => {
    io.to(gameId).emit('playerLeftGame', gameController.leaveGame());
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
  const ip = 'localhost';
  const port = process.env.localPort || 3000;
  server.listen(port, ip, (err) => {
    if (err) throw err;
    console.log(`Server running at http://${ip}:${port}`);
  });
}