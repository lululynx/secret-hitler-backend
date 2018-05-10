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
    this.chancellorVoteCount = 0;
    this.playerList.forEach(player => player.chancellorVote = null);
  }

  incrementChancellorVoteCount() {
    ++this.chancellorVoteCount;
  }

  getPlayer(playerId) {
    return this.playerList.find(player => player.user.id === playerId);
  }

  drawThreePolicies() {
    this.eligiblePolicies = [...Array(3)].map(policy => {
      return Math.random() < 2/3 ? 'fascist' : 'liberal';
    });
  }

  resetChancellor() {
    this.currentChancellor = null;
  }

  evaluateElection() {
    const jaVotes = this.playerList.filter(player => player.chancellorVote === 'ja');
    if (jaVotes.length/this.chancellorVoteCount > 0.5) {
      this.chancellor = this.suggestedChancellor;
      this.suggestedChancellor = null;
      return true;
    } else {
      ++this.electionFailCount;
      return false;
      // TODO: if electionFailCount reaches 4 serve the next policy immediately
    }
  }

  setNextPresident() {
    const presidentIndex = this.playerList.findIndex(player => {
      return player.id === this.currentPresident;
    });
    if (presidentIndex === (playerList.length - 1)) {
      this.currentPresident = this.playerList[0].user.id;
    } else {
      this.currentPresident = this.playerList[presidentIndex + 1].user.id;
    }
  }

  rejectEligiblePolicy(rejectedPolicy) {
    this.eligiblePolicies.splice(rejectedPolicy, 1);
  }

  enactPolicy() {
    this.eligiblePolicies.pop() === 'fascist'
      ? ++game.numberOfFascistPolicies
      : ++game.numberOfLiberalPolicies;
  }

  playerIsPresident(playerId) {
    return this.currentPresident === playerId;
  }

  playerIsChancellor(playerId) {
    return this.currentPresident === playerId;
  }

  activateVetoPowerIfAppropriate() {
    if (this.numberOfFascistPolicies === 5) this.vetoPowerUnlocked = true;
  }

  executePlayer(playerId) {
    const playerIndex = this.playerList.findIndex(player => player.user.id === playerId);
    const player = this.playerList[playerIndex];
    player.execute();
    this.executedPlayers.push(player);
    this.playerList.splice(playerIndex, 1);
  }

  incrementElectionFailCount() {
    ++this.electionFailCount;
  }

  presidentShouldExecutePlayer() {
    if (this.numberOfFascistPolicies === 4 || this.numberOfFascistPolicies === 5) return true;
    else return false;
  }

  incrementAcknowledgeCount(message, countName) {
    ++this.acknowledgeCounts[countName];
    if (this.acknowledgeCounts[countName] === this.playerList.length) {
      return this.handleAcknowledgeCountReached(message);
    }
  }

  handleAcknowledgeCountReached(message) {
    this.acknowledgeCounts[countName] = 0;
    const messageMap = {
      acknowledgePlayerRole: 'showFascists',
      acknowledgeFascists: 'showPresident',
      acknowledgePresident: 'suggestChancellor',
      acknowledgeChancellor: 'showPresidentPolicyCards',
      acknowledgeChosenPolicy: presidentShouldExecutePlayer() ? 'askPresidentToExecutePlayer' : 'showPresident',
    }
    return messageMap[message];
  }
}