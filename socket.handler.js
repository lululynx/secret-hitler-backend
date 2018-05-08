'use strict';

const io = require('./index');

const metaController = require('./controllers/meta.controller');
const actionController = require('./controllers/action.controller');

exports.socketHandler = (io) => {
  io.on('connection', (client) => {
    console.log(`connected to client ${client.id}`);

    // game methods
    client.on('createGame', (user) => {
      console.log('created game with id ', client.id);
      const game = metaController.createGame(client.id, user);
      client.join(client.id);
      io.to(client.id).emit('gameCreated', game);
    });

    client.on('joinGame', (gameId, user) => {
      client.join(gameId);
      const game = metaController.joinGame(gameId, user);
      io.to(gameId).emit('playerJoinedGame', game);
    });

    client.on('startGame', (gameId) => {
      const game = metaController.startGame(gameId);
      io.to(gameId).emit('gameStarted', game);
    });

    client.on('leaveGame', (gameId, user) => {
      io.to(gameId).emit('playerLeftGame', metaController.leaveGame());
    });

    // player methods
    client.on('suggestChancellor', actionController.suggestChancellor);
    client.on('voteOnChancellor', actionController.voteOnChancellor);
    client.on('pickPolicies', actionController.pickPolicies);
    client.on('executePlayer', actionController.executePlayer);
    client.on('vetoPolicy', actionController.vetoPolicy);

    client.on('disconnect', () => {
      console.log(`client ${client.id} disconnected`);
    });

    client.on('error', (err) => {
      console.log('received error from client:', client.id);
      console.log(err);
    });
  });
}