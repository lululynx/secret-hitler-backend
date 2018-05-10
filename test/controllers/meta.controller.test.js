const assert = require('assert');
const expect = require('chai').expect;
const io = require('socket.io-client');

const app = require('../../index');

const SocketTester = require('../index');
const socketUrl = 'http://localhost:3000';

const options = {  
  transports: ['websocket'],
  'force new connection': true
};

const socketTester = new SocketTester(io, socketUrl, options);
const room = 'lobby';

describe('Sockets', function() {
  describe('createGame()', function() {
    it('should send and receive a message', function(done){  
      const client1 = {
        on: {
          'message': socketTester.shouldBeCalledWith('test')
        },
        emit: {
          'join room': room
        }
      };
  
      const client2 = { 
        emit: {
          'join room': room,
          'message': 'test'
        }
      };
  
      socketTester.run([client1, client2], done);
    });
  
    it('should send and recieve a message only to users in the same room', function (done) {
  
      const client1 = {
        on: {
          'message': socketTester.shouldBeCalledNTimes(1)
        },
        emit: {
          'join room': room,
        }
      };
  
      const client2 = {
        emit: {
          'join room': room,
          'message': 'test'
        }
      };
  
      const client3 = { 
        on: {
          'message': socketTester.shouldNotBeCalled()
        },
        emit: {
          'join room': 'room'
        }
      };
  
      socketTester.run([client1, client2, client3], done);
    });




    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});