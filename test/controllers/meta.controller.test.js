const expect = require('chai').expect;
const io = require('socket.io-client');

const server = require('../../index');

const socketUrl = 'http://localhost:3000';

const options = {  
  transports: ['websocket'],
  'force new connection': true
};

const room = 'lobby';

describe('Sockets', function () {  
  let client1, client2, client3, client4, client5;
  let currentGame;

  afterEach(done => {
    client1 && client1.disconnect();
    client2 && client2.disconnect();
    client3 && client3.disconnect();
    client4 && client4.disconnect();
    client5 && client5.disconnect();
    server.close();
    done();
  });

  it('should send a game object back when message is "createGame"', done => {
    client1 = io.connect(socketUrl, options);
    client1.on('metaChannel', game => {
      currentGame = game;
      expect(game).to.be.a('object');
      done();
    });
    client1.emit('metaChannel', 'createGame', {user: {name: 'Pelle', id: '1234'}});
  });

  it('should be able to join existing game and listen to backend', done => {
    client2 = io.connect(socketUrl, options);
    client2.on('metaChannel', game => {
      expect(game.playerList.length).to.equal(2);
      done();
    });
    client2.emit('metaChannel', 'joinGame', {gameId: currentGame.id, user: {name: 'Martin', id: '3242'}});
  });

  it('should be able to start game', done => {
    client1 = io.connect(socketUrl, options);   
    
    client1.on('metaChannel', game => {
      expect(game.message).to.equal('showRoles');
      done();
    });

    client1.emit('metaChannel', 'startGame', {gameId: currentGame.id, user: {name: 'Pelle', id: '1234'}});
  });
});

