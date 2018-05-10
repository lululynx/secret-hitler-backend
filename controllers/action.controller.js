'use strict';

const actionHelpers = require('./action.helpers');

// playerId: the player suggested as chancellor
const beginNewTurn = (game) => {
  game.currentPresident = actionHelpers.setNextPresident(game);
  game.currentChancellor = null;
  actionHelpers.drawThreePolicies(game);
  game.message = 'showPresident';
  return game;
}

const shouldPresidentExecutePlayer = (game) => {
  if (game.numberOfFascistPolicies === 4 || game.numberOfFascistPolicies === 5) {
    game.message = 'askPresidentToExecutePlayer';
    return game;
  }
  else beginNewTurn(game);
}

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
exports.suggestChancellor = (game, playerId) => {
  game.suggestedChancellor = playerId;
  game.message = 'voteChancellor';
  return game;
}

// playerId: the player who voted
exports.voteOnChancellor = (game, playerId, vote) => {
  if (vote !== 'ja' || vote !== 'nein') return 'Invalid vote';
  if (game.voteCount === game.playerList.length) {
    actionHelpers.resetVotes(game);
  }
  const player = game.playerList.find(player => player.user.id === playerId);
  if (!player) return 'No player found with id ' + playerId;
  player.chancellorVote = vote;
  game.voteCount++;
  if (game.voteCount === game.playerList.length) {
    actionHelpers.evaluateVotes(game);
  }
  return game;
}

// used for both president and chancellor
exports.pickPolicies = (game, playerId, rejectedPolicy) => {
  if (game.currentPresident === playerId) {
    if (![0,1,2].includes(rejectedPolicy)) return 'Invalid excluded policy';
    game.eligiblePolicies.splice(rejectedPolicy, 1);
    if (game.numberOfFascistPolicies === 5) game.message = 'showChancellorPolicyCardsAndVetoButton';
    else game.message = 'showChancellorPolicyCards';
  } else if (game.currentChancellor === playerId) {
    if (![0,1].includes(rejectedPolicy)) return 'Invalid excluded policy';
    game.eligiblePolicies.splice(rejectedPolicy, 1);
    game.eligiblePolicies.pop() === 'fascist'
      ? ++game.numberOfFascistPolicies
      : ++game.numberOfLiberalPolicies;
    if (game.numberOfFascistPolicies === 5) game.vetoPowerUnlocked = true;
    game.message = 'showPlayersChosenPolicy';
  } else return 'Player is neither president nor chancellor and hence may not pick policies.';
  return game;
}

exports.executePlayer = (game, playerId) => {
  const playerIndex = game.playerList.findIndex(player => player.user.id === playerId);
  game.executedPlayers.push(game.playerList[playerIndex]);
  game.playerList[playerIndex].executed = true;
  game.playerList.splice(playerIndex, 1);
  return beginNewTurn(game);
}

exports.chancellorVetoPolicy = (game, playerId) => {
  if (!game.currentChancellor === playerId) return 'Only chancellor can veto a policy';
  game.message = 'givePresidentChanceToConfirmVeto';
  return game;
}

exports.presidentVetoPolicy = (game, playerId, veto) => {
  if (!game.currentPresident === playerId) return 'Only president can veto a policy';
  game.electionFailCount++;
  game.eligiblePolicies = [];
  return beginNewTurn(game);
}