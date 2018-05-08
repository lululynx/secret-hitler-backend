'use strict';

const games = {};

const getInitialGameState = () => {
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

const createPlayer = (user) => {
  return {
    user: user,
    faction: undefined,
    hitler: false,
    president: false,
    chancellor: false,
    executed: false
  }
}

const setPlayerFactions = (numberOfFascists, playerList) => {
  let numberOfLiberals = playerList.length - numberOfFascists - 1;
  playerList.forEach(player => {
    if (player.hitler) return;
    if (Math.random() * numberOfFascists > Math.random() * (numberOfLiberals)) {
      player.faction = 'fascist';
      --numberOfFascists;
    } else {
      player.faction = 'liberal';
      --numberOfLiberals;
    }
  })
}

const setRoles = (gameId) => {
  const game = games[gameId];
  if (!game) return 'No game found with id ' + gameId;
  const playerList = game.playerList;
  const numberOfPlayers = playerList.length;

  //sets number of fascists (excluding hitler)
  const numberOfFascists = (numberOfPlayers > 8 ? 3 : numberOfPlayers > 6 ? 2 : 1)

  //choose president
  const presidentIndex = Math.floor(numberOfPlayers * Math.random());
  playerList[presidentIndex].president = true;

  //choose hitler
  const hitlerIndex = Math.floor(numberOfPlayers * Math.random());
  playerList[hitlerIndex].hitler = true;
  playerList[hitlerIndex].faction = 'fascist';

  setPlayerFactions(numberOfFascists, playerList);
  return game;
}

module.exports.createGame = (clientId, user) => {
  const player = createPlayer(user);
  const game = {
    id: clientId,
    initiator: user,
    playerList: [player],
    gameState: getInitialGameState(),
    gameOver: false
  }
  games[game.id] = game;
  return game.playerList;
}

module.exports.joinGame = (gameId, user) => {
  const player = createPlayer(user);
  if (!games[gameId]) return 'No game found with id ' + gameId;
  games[gameId].playerList.push(player);
  return games[gameId].playerList;
}

module.exports.startGame = (gameId) => {
  return setRoles(gameId);
}

module.exports.leaveGame = (user, gameId) => {
  const index = games[gameId].playerList.findIndex(player => player.user.id === user.id);
  games[gameId].playerList.splice(index, 1);
  return games[gameId].playerList;
}