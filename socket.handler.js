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
      const {gameId, playerId, vote, rejectedPolicy} = payload;
      const game = games[gameId];
      if (!game) io.to(gameId).emit('gameNotFound', 'No game found with id ' + gameId);

      switch (message) {
        case 'acknowledgePlayerRole':
          io.to(gameId).emit('newGameState', actionController.acknowledgePlayerRole(game, message));
        case 'acknowledgeOtherFascists':
          io.to(gameId).emit('newGameState', actionController.acknowledgeOtherFascists(game, message));
        case 'acknowledgePresident':
          io.to(gameId).emit('newGameState', actionController.acknowledgePresident(game, message));
        case 'suggestChancellor':
          io.to(gameId).emit('newGameState', actionController.suggestChancellor(game, playerId));
        case 'voteOnChancellor':
          io.to(gameId).emit('newGameState', actionController.voteOnChancellor(game, playerId, vote));
        case 'acknowledgeChancellor':
          io.to(gameId).emit('newGameState', actionController.acknowledgeChancellor(game, message));
        case 'pickPolicies':
          io.to(gameId).emit('newGameState', actionController.pickPolicies(game, playerId, rejectedPolicy));
        case 'acknowledgeChosenPolicy':
          io.to(gameId).emit('newGameState', actionController.acknowledgeChosenPolicy(game, message));
        case 'executePlayer':
          io.to(gameId).emit('newGameState', actionController.executePlayer(game, playerId));
        case 'chancellorVetoPolicy':
          io.to(gameId).emit('newGameState', actionController.chancellorVetoPolicy(game, playerId));
        case 'presidentVetoPolicy':
          io.to(gameId).emit('newGameState', actionController.presidentVetoPolicy(game, playerId, veto));
      }
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