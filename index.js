'use strict';

const server = require('http').createServer()
const io = require('socket.io')(server)

io.on('connection', (client) => {
  client.on('register', handleRegister)

  client.on('join', handleJoin)

  client.on('leave', handleLeave)

  client.on('message', handleMessage)

  client.on('chatrooms', handleGetChatrooms)

  client.on('availableUsers', handleGetAvailableUsers)

  client.on('disconnect', () => {
    console.log('client disconnect...', client.id)
    handleDisconnect()
  })

  client.on('error', (err) => {
    console.log('received error from client:', client.id)
    console.log(err)
  })
})

if (!module.parent) {
  const ip = process.env.ip || 'localhost';
  const port = process.env.port || 3000;
  server.listen(port, (err) => {
    if (err) throw err
    console.log(`Server running at http://${ip}:${port}`);
  });
}