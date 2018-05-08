'use strict';

const getInitialGameState = require('../models/game.model').getInitialGameState;
const createPlayer = require('../models/player.model').createPlayer;

const games = {};

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

const setRoles = (gameId) => {
  const game = games[gameId];
  if (!game) return 'No game found with id ' + gameId;
  const playerList = game.playerList;
  const numberOfPlayers = playerList.length;

  //sets number of fascists (excluding hitler)
  const numberOfFascists = (numberOfPlayers > 8 ? 3 : numberOfPlayers > 6 ? 2 : 1)

  //choose president
  const presidentIndex = Math.floor(numberOfPlayers * Math.random());
  playerList[presidentIndex].president = true;

  //choose hitler
  const hitlerIndex = Math.floor(numberOfPlayers * Math.random());
  playerList[hitlerIndex].hitler = true;
  playerList[hitlerIndex].faction = 'fascist';

  setPlayerFactions(numberOfFascists, playerList);
  return game;
}

exports.createGame = (clientId, user) => {
  const player = createPlayer(user);
  const game = {
    id: clientId,
    initiator: user,
    playerList: [player],
    gameState: getInitialGameState(),
    gameOver: false
  }
  games[game.id] = game;
  return game.playerList;
}

exports.joinGame = (gameId, user) => {
  const player = createPlayer(user);
  if (!games[gameId]) return 'No game found with id ' + gameId;
  games[gameId].playerList.push(player);
  return games[gameId].playerList;
}

exports.startGame = (gameId) => {
  return setRoles(gameId);
}

exports.leaveGame = (user, gameId) => {
  const index = games[gameId].playerList.findIndex(player => player.user.id === user.id);
  games[gameId].playerList.splice(index, 1);
  return games[gameId].playerList;
}