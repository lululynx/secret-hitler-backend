'use strict';

exports.drawThreePolicies = (game) => {
  game.eligiblePolicies = [...Array(3)].map(policy => {
    return Math.random() < 2/3 ? 'fascist' : 'liberal';
  });
  return game;
}

exports.setNextPresident = (game) => {
  const presidentIndex = game.playerList.findIndex(player => {
    return player.id === game.currentPresident;
  });
  if (presidentIndex === (playerList.length - 1)) {
    game.currentPresident = game.playerList[0].user.id;
  } else {
    game.currentPresident = game.playerList[presidentIndex + 1].user.id;
  }
}

exports.evaluateVotes = (game) => {
  const jaVotes = game.playerList.filter(player => player.chancellorVote === 'ja');
  if (jaVotes.length/voteCount > 0.5) {
    game.chancellor = game.suggestChancellor;
  } else {
    // TODO: remove setNextPresident once calling beginNewTurn
    game.currentPresident = setNextPresident(game);
    game.electionFailCount++;
    // TODO: if electionFailCount reaches 4 serve the next policy immediately
  }
}

exports.resetVotes = (game) => {
  game.voteCount = 0;
  game.playerList.forEach(player => player.chancellorVote = null);
}