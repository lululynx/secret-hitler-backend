'use strict';

const Game = require('../models/game.model').Game;
const Player = require('../models/player.model').Player;

exports.createGame = (clientId, user) => {
  return new Game(clientId, user);
}

exports.joinGame = ({game, user}) => {
  const player = new Player(user);
  game.addPlayer(player);
}

exports.startGame = ({game}) => {
  game.setRoles();
  game.assignPlayersFactions();
  game.drawThreePolicies();
  game.setMessage('showRoles');
}

exports.leaveGame = ({game, user}) => {
  game.removePlayer(player);
}