const expect = require('chai').expect;
const io = require('socket.io-client');

const server = require('../../index');

const mocks = require('../mocks');
const socketUrl = 'http://localhost:3000';

const options = {  
  transports: ['websocket'],
  'force new connection': true
};

const connectClients = (n) => {
  const clients = [];
  for (let i = 0; i < n; i++) {
    const client = io.connect(socketUrl, options)
    clients.push(client);
  }
  return clients
}

const createGame = (client) => {
  client.emit('data', {type: 'createGame', payload: {user: mocks.users[0]}});
}

const joinGame = (clients, game, n, index) => {
  for (let i = 0; i < n; i++) {
    clients[i].emit('data', {type:'joinGame', payload: {gameId: game.id, user: mocks.users[i+index]}});
  }
}

const startGame = (clients, game) => {
  clients[0].emit('data', {type: 'startGame', payload: {gameId: game.id, user: mocks.users[0]}});
}

const disconnectClients = (clients) => {
  clients.forEach(client => client && client.disconnect());
}


describe.only('Sockets', function () {  
  let clients = [];
  let currentGame;

  after(() => {
    server.close();
  })

  afterEach(done => {
    disconnectClients(clients);
    done();
  });

  it('should send a game object back when type is "createGame"', done => {
    clients = connectClients(1);
    clients[0].on('data', data => {
      currentGame = data.payload;
      expect(currentGame).to.be.a('object');
      done();
    });
    createGame(clients[0]);
  });

  it('should be able to join existing game and listen to backend', done => {
    clients = connectClients(1);
    clients[0].on('data', data => {
      currentGame = data.payload;
      expect(currentGame.playerList.length).to.equal(2);
      done();
    });
    joinGame(clients, currentGame, 1, 1)
  });

  it('should be able to start game when five or more people', done => {
    clients = connectClients(4);
    clients[0].on('data', data => {
      currentGame = data.payload;
      if (currentGame.numberOfLiberals) {
        expect(currentGame.message).to.equal('showRoles');
        done();
      }
    });
    joinGame(clients, currentGame, 3, 2);
    startGame(clients, currentGame);
  });
});

