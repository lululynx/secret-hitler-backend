'use strict';

exports.getInitialGameState = () => {
  return {
    numberOfLiberals: 0,
    numberOfFascists: 0,
    numberOfLiberalPolicies: 0,
    numberOfFascistPolicies: 0,
    acknowledgeCounts: {
      playerRole: 0,
      otherFascists: 0,
      president: 0,
      chancellor: 0,
      chosenPolicy: 0,
      vetoPower: 0,
    },
    turnCount: 0,
    hitler: undefined,
    currentPresident: undefined,
    currentChancellor: undefined,
    suggestedChancellor: null,
    voteCount: 0,
    eligiblePolicies: [undefined, undefined, undefined],
    electionFailCount: 0,
    vetoPowerUnlocked: false,
    gameOver: false,
    winningFaction: undefined,
    askPresidentToExecutePlayer: true,
    executedPlayers: []
  }
}