'use strict';

const Game = require('../models/game.model');
const Player = require('../models/player.model');

const beginNewTurn = ({game}) => {
  game.resetChancellor();
  game.setNextPresident();
  game.drawThreePolicies();
  game.setMessage('showPresident');
}

exports.acknowledge = ({game, message, countName}) => {
  const response = game.incrementAcknowledgeCount(message, countName);
  if (response) {
    if (response === 'showPresident') beginNewTurn(game);
    else game.setMessage(response)
  }
}

// playerId: the player suggested as chancellor
exports.suggestChancellor = ({game, playerId}) => {
  game.setSuggestedChancellor(playerId);
  game.setMessage('voteChancellor');
}

// playerId: the player who voted
exports.voteOnChancellor = ({game, playerId, vote}) => {
  if (vote !== 'ja' || vote !== 'nein') return 'Invalid vote';
  if (game.voteComplete()) game.resetVotes();
  const player = game.getPlayer(playerId);
  player.castVote(vote);
  game.incrementChancellorVoteCount();
  if (game.voteComplete()) {
    const electionPassed = game.evaluateElection();
    if (electionPassed) game.setMessage('acknowledgeChancellor');
    else beginNewTurn(game);
  }
  }

// used for both president and chancellor
exports.pickPolicies = ({game, playerId, rejectedPolicy}) => {
  if (!game.playerIsPresident(playerId) && !game.playerIsChancellor(playerId)) {
    return 'Player is neither president nor chancellor and hence may not pick policies.'
  }
    if (![0,1,2].includes(rejectedPolicy)) return 'Invalid excluded policy';
  game.rejectEligiblePolicy(rejectedPolicy);
  if (game.playerIsPresident(playerId)) {
    if (game.vetoPowerUnlocked) game.setMessage('showChancellorPolicyCardsAndVetoButton');
    else game.setMessage('showChancellorPolicyCards');
  } else if (game.playerIsChancellor(playerId)) {
    game.enactPolicy();
    game.activateVetoPowerIfAppropriate();
    game.setMessage('showPlayersChosenPolicy');
  };
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