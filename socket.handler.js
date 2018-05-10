'use strict';

const io = require('./index');

const metaController = require('./controllers/meta.controller');
const actionController = require('./controllers/action.controller');
const {validatePayload}  = require('./socket.validation');

exports.socketHandler = (io) => {
  io.on('connection', (client) => {
    console.log(`connected to client ${client.id}`);

    // meta methods
    client.on('metaChannel', (message, payload) => {
      const err = validatePayload(client, payload);
      if (err) return client.emit('error', err);
      payload.clientId = client.id;
      if (message === 'createGame') client.join(client.id);
      else if (message === 'joinGame') client.join(payload.gameId);
      else if (message === 'leaveGame') client.leave(payload.gameId);
      metaController[message](payload);
      io.in(payload.game.id).emit('metaChannel', payload.game);
    });

    // action methods
    client.on('gameChannel', (message, payload) => {
      validatePayload(payload);
      actionController[message](payload);
      io.in(payload.gameId).emit('gameChannel', payload.game);
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