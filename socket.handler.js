'use strict';

const io = require('./index');

const metaController = require('./controllers/meta.controller');
const actionController = require('./controllers/action.controller');

const games = metaController.games;

exports.socketHandler = (io) => {
  io.on('connection', (client) => {
    console.log(`connected to client ${client.id}`);

    // meta methods
    client.on('createGame', (user) => {
      console.log('created game with id ', client.id);
      client.join(client.id);
      io.to(client.id).emit('gameCreated', metaController.createGame(client.id, user));
    });

    client.on('joinGame', (gameId, user) => {
      client.join(gameId);
      io.to(gameId).emit('playerJoinedGame', metaController.joinGame(gameId, user));
    });

    client.on('startGame', (gameId) => {
      io.to(gameId).emit('gameStarted', metaController.startGame(gameId));
    });

    client.on('leaveGame', (gameId, user) => {
      io.to(gameId).emit('playerLeftGame', metaController.leaveGame());
    });


    // action methods
    client.on('messageFromFrontEnd', (message, payload) => {
      const {gameId, playerId} = payload;
      const game = games[gameId];
      if (!game) io.to(gameId).emit('gameNotFound', 'No game found with id ' + gameId);
      if (playerId && !game.getPlayer(playerId)) {
        io.to(gameId).emit('playerNotFound', `Invalid player id ${playerId} for game with id ${gameId}`);
      }
      payload.game = game;
      actionController[message](payload);
      io.to(gameId).emit('newGameState', game);
    })

    client.on('disconnect', () => {
      console.log(`client ${client.id} disconnected`);
    });

    client.on('error', (err) => {
      console.log('received error from client:', client.id);
      console.log(err);
    });
  });
}