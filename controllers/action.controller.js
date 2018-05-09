'use strict';

const actionHelpers = require('./action.helpers');

// playerId: the player suggested as chancellor
const beginNewTurn = (gameId) => {
  const game = games[gameId];
  if (!game) return 'No game found with id ' + gameId;
  game.currentPresident = actionHelpers.setNextPresident(game);
  game.currentChancellor = null;
  actionHelpers.drawThreePolicies(game);

exports.acknowledge = (game, message) => {
  switch (message) {
    case 'acknowledgePlayerRole':
      game.acknowledgeCounts.playerRole++;
      if (game.acknowledgeCounts.playerRole === game.playerList.length) {
        game.message = 'showFascists';
        return game;
      };
      break;
    case 'acknowledgeOtherFascists':
      game.acknowledgeCounts.otherFascists++;
      if (game.acknowledgeCounts.otherFascists === game.playerList.length) {
        game.message = 'showPresident';
        return game;
      };
      break;
    case 'acknowledgePresident':
      game.acknowledgeCounts.president++;
      if (game.acknowledgeCounts.president === game.playerList.length) {
        game.acknowledgeCounts.president = 0;
        game.message = 'suggestChancellor';
        return game;
      };
      break;
    case 'acknowledgeChancellor':
      game.acknowledgeCounts.chancellor++;
      if (game.acknowledgeCounts.chancellor === game.playerList.length) {
        game.acknowledgeCounts.chancellor = 0;
        game.message = 'showPresidentPolicyCards';
        return game;
      };
      break;
    case 'acknowledgeChosenPolicy':
      game.acknowledgeCounts.chosenPolicy++;
      if (game.acknowledgeCounts.chosenPolicy === game.playerList.length) {
        game.acknowledgeCounts.chosenPolicy = 0;
        return shouldPresidentExecutePlayer(game);
      };
      break;
    default:
      return 'Unknown acknowledged message';
}
}

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
  if (!vote === 'ja' || !vote === 'nein') return 'Invalid vote';
  if (game.voteCount === game.playerList.length) {
    actionHelpers.resetVotes(game);
  }
  const player = game.playerList.find(player => player.user.id === playerId);
  if (!player) return 'No player found with id ' + playerId;
  player.chancellorVote = vote;
  game.voteCount++;
  if (game.voteCount === game.playerList.length) {
    actionHelpers.evaluateVotes(game);
    // TODO: handle execute player special power when numberOfFascistPolicies equals 4 or 5
  }
  return game;
}

exports.pickPolicies = (gameId, playerId, rejectedPolicy) => {
  const game = games[gameId];
  if (!game) return 'No game found with id ' + gameId;
  if (game.currentPresident === playerId) {
    if (![0,1,2].includes(rejectedPolicy)) return 'Invalid excluded policy';
    game.eligiblePolicies.splice(rejectedPolicy, 1);
  } else if (game.currentChancellor === playerId) {
    if (![0,1].includes(rejectedPolicy)) return 'Invalid excluded policy';
    game.eligiblePolicies.splice(rejectedPolicy, 1);
    game.eligiblePolicies.pop() === 'fascist'
      ? ++game.numberOfFascistPolicies
      : ++game.numberOfLiberalPolicies;
  } else {
    return 'Player is neither president nor chancellor and hence may not pick policies.';
  }
  return game;
}

exports.askToExecutePlayer = (socket) => {
  console.log(socket);
}

exports.executePlayer = (socket) => {
  console.log(socket);
}

exports.vetoPolicy = (socket) => {
  console.log(socket);
}