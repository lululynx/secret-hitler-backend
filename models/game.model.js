'use strict';

exports.getInitialGameState = () => {
  return {
    numberOfLiberals: 0,
    numberOfFascists: 0,
    numberOfLiberalPolicies: 0,
    numberOfFascistPolicies: 0,
    playerRoleAcknowledgedCount: 0,
    otherFascistsAcknowledgedCount: 0,
    presidentAcknowledgedCount: 0,
    chancellorAcknowledgedCount: 0,
    chosenPolicyAcknowledgedCount: 0,
    vetoPowerAcknowledgedCount: 0,
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
  }
}