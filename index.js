'use strict';

const server = require('http').createServer();

require('dotenv').config();


const io = require('socket.io')(server);

const gameController = require('./controllers/game.controller');
const playerController = require('./controllers/player.controller');

io.on('connection', (client) => {
  console.log(`connected to client ${client.id}`);
  const clientId = client.id;

  // game methods
  client.on('createGame', (user) => {
    console.log('create game, gameId: ', clientId);
    const game = gameController.createGame(user, clientId);
    client.join(game.id);
    client.to(game.id).emit('gameCreated', 'hej');
  });
  client.on('joinGame', (user, gameId) => {
    client.join(gameId)
    const playerList = gameController.joinGame(user, gameId);
    client.to(gameId).emit('playerJoinedGame', playerList);
  });
  client.on('startGame', (gameId) => {
    const game = gameController.startGame();
    client.to(game.id).emit('gameStarted', game);
  });
  client.on('leaveGame', (user, gameId) => {
    client.to(gameId).emit('playerLeftGame', gameController.leaveGame());
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