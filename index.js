'use strict';

const server = require('http').createServer();
const io = require('socket.io')(server);

const metaController = require('./controllers/meta.controller');
const playerController = require('./controllers/player.controller');

io.on('connection', (client) => {

  // meta methods
  client.on('newGame', metaController.newGame);
  client.on('joinGame', metaController.joinGame);
  client.on('leaveGame', metaController.leaveGame);

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
  const ip = process.env.ip || 'localhost';
  const port = process.env.port || 3000;
  server.listen(port, ip, (err) => {
    // if (err) throw err;
    console.log(`Server running at http://${ip}:${port}`);
  });
}