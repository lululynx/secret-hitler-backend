'use strict';

exports.getInitialGameState = () => {
  return {
    turnCount: 0,
    numberOfLiberals: 0,
    numberOfFascists: 0,
    numberOfLiberalPolicies: 0,
    numberOfFascistPolicies: 0,
    currentPresident: undefined,
    currentChancellor: undefined,
    hitler: undefined,
    electionFailCount: 0,
    vetoPowerUnlocked: false,
  }
}