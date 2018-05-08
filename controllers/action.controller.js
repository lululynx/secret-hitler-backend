'use strict';

const actionHelpers = require('./action.helpers');

// playerId: the player suggested as chancellor
exports.suggestChancellor = (gameId, playerId) => {
  const game = games[gameId];
  if (!game) return 'No game found with id ' + gameId;
  game.suggestedChancellor = playerId;
  return game;
}

// playerId: the player who voted
exports.voteOnChancellor = (gameId, playerId, vote) => {
  const game = games[gameId];
  if (!game) return 'No game found with id ' + gameId;
  if (game.voteCount === game.playerList.length) {
    actionHelpers.resetVotes(game);
  }
  if (!vote === 'ja' || !vote === 'nein') return 'Invalid vote';
  const player = game.playerList.find(player => player.user.id === playerId);
  if (!player) return 'No player found with id ' + playerId;
  player.chancellorVote = vote;
  game.voteCount++;
  if (game.voteCount === game.playerList.length) {
    actionHelpers.evaluateVotes(game);
  }
  return game;
}

exports.pickPolicies = (socket) => {
  console.log(socket);
}

exports.executePlayer = (socket) => {
  console.log(socket);
}

exports.vetoPolicy = (socket) => {
  console.log(socket);
}