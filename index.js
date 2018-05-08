'use strict';

require('dotenv').config();

const server = require('http').createServer();
const io = require('socket.io')(server);

require('./socket.handler').socketHandler(io);

if (!module.parent) {
  const ip = 'localhost';
  const port = process.env.localPort || 3000;
  server.listen(port, ip, (err) => {
    if (err) throw err;
    console.log(`Server running at http://${ip}:${port}`);
  });
}