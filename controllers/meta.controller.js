'use strict';

const GameList = require('../models/gameList.model');
const createPlayer = require('../models/player.model').createPlayer;

const games = exports.games = new GameList();

exports.createGame = (clientId, user) => {
  return new Game(clientId, user);
}

exports.joinGame = (game, user) => {
  const player = createPlayer(user);
  game.playerList.push(player);
}

exports.startGame = (game) => {
  game.setRoles();
  game.assignPlayersFactions();
  actionHelpers.drawThreePolicies(game);
  game.message = 'showRoles';
}

exports.leaveGame = (game, user) => {
  const index = game.playerList.findIndex(player => player.user.id === user.id);
  game.playerList.splice(index, 1);
}