const Player = require('./player.model').Player;

const getInitialGameState = () => {
  return {
    numberOfLiberals: 0,
    numberOfFascists: 0,
    numberOfLiberalPolicies: 0,
    numberOfFascistPolicies: 0,
    acknowledgeCounts: {
      playerRole: 0,
      fascists: 0,
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
    chancellorVoteCount: 0,
    eligiblePolicies: [undefined, undefined, undefined],
    electionFailCount: 0,
    vetoPowerUnlocked: false,
    gameOver: false,
    winningFaction: undefined,
    askPresidentToExecutePlayer: true,
    executedPlayers: [],
  }
}

exports.Game = class Game {
  constructor(clientId, user) {
    this.id = clientId;
    this.initiator = user;
    this.playerList = [new Player(user)];
    this.message = null;
    Object.assign(this, getInitialGameState());
  }

  setMessage(message) {
    this.message = message;
  }

  setSuggestedChancellor(playerId) {
    this.suggestedChancellor = playerId;
  }

  voteComplete() {
    return this.chancellorVoteCount === this.playerList.length;
  }

  resetVotes() {
  }

  set(prop, value) {
    this[prop] = value;
  }

  get(prop) {
    if (prop) return this[prop];
    return {
      id: this.id,
      initiator: this.initiator,
      playerList: this.playerList,
      ...this.gameState,
    }
  }
}