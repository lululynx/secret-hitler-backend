'use strict';

const GameList = require('../models/gameList.model');
const createPlayer = require('../models/player.model').createPlayer;

const actionHelpers = require('./action.helpers');

const games = exports.games = new GameList();

const setPlayerFactions = (numberOfFascists, playerList) => {
  let numberOfLiberals = playerList.length - numberOfFascists - 1;
  playerList.forEach(player => {
    if (player.hitler) return;
    if (Math.random() * numberOfFascists > Math.random() * (numberOfLiberals)) {
      player.faction = 'fascist';
      --numberOfFascists;
    } else {
      player.faction = 'liberal';
      --numberOfLiberals;
    }
  })
}

const setRoles = (game) => {
  const playerList = game.playerList;
  const numberOfPlayers = playerList.length;

  //sets number of fascists (excluding hitler)
  const numberOfFascists = (numberOfPlayers > 8 ? 3 : numberOfPlayers > 6 ? 2 : 1);

  //choose president
  const presidentIndex = Math.floor(numberOfPlayers * Math.random());
  playerList[presidentIndex].president = true;

  //choose hitler
  const hitlerIndex = Math.floor(numberOfPlayers * Math.random());
  playerList[hitlerIndex].hitler = true;
  playerList[hitlerIndex].faction = 'fascist';

  setPlayerFactions(numberOfFascists, playerList);
}

exports.createGame = (clientId, user) => {
  return new Game(clientId, user);
}

exports.joinGame = (game, user) => {
  const player = createPlayer(user);
  game.playerList.push(player);
}

exports.startGame = (game) => {
  setRoles(game);
  actionHelpers.drawThreePolicies(game);
  game.message = 'showRoles';
}

exports.leaveGame = (game, user) => {
  const index = game.playerList.findIndex(player => player.user.id === user.id);
  game.playerList.splice(index, 1);
}