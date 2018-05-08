'use strict';

const io = require('./index');

const gameController = require('./controllers/game.controller');
const playerController = require('./controllers/player.controller');

exports.socketHandler = (io) => {
  io.on('connection', (client) => {
    console.log(`connected to client ${client.id}`);

    // game methods
    client.on('createGame', (user) => {
      console.log('create game with id ', client.id);
      const game = gameController.createGame(client.id, user);
      client.join(client.id);
      io.to(client.id).emit('gameCreated', game);
    });

    client.on('joinGame', (gameId, user) => {
      client.join(gameId);
      const game = gameController.joinGame(gameId, user);
      io.to(gameId).emit('playerJoinedGame', game);
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
    });

    client.on('error', (err) => {
      console.log('received error from client:', client.id);
      console.log(err);
    });
  });
}