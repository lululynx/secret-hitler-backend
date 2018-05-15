const should = require('chai').should()

const server = require('../../index');

const actionController = require('./../../controllers/action.controller');
const metaController = require('./../../controllers/meta.controller');
const {gameList} = require('./../../models/gameList.model');


const users = {
  user1: {
    name: 'Eric',
    id: 'abc123'
  },
  user2: {
    name: 'Batman',
    id: 'qwe123'
  },
  user3: {
    name: 'Emma',
    id: 'qwe523'
  },
  user4: {
    name: 'Martin',
    id: 'qwe122'
  },
  user5: {
    name: 'Dan',
    id: 'qwe178'
  },
  
}

const startGamePayload = {
  clientId: '1234',
  user: users.user1
}

metaController.createGame(startGamePayload);

const gameId = '1234';
const game = gameList.get(gameId);

for (let i = 2; i < 6; i++) metaController.joinGame({game: game, user: users['user' + i]});

metaController.startGame({game: game});

const acknowledgeFascistsPayload = {
  game: game,
  message: 'acknowledgeFascists',
  countName: 'fascists'
}
const acknowledgePlayerRolePayload = {
  game: game,
  message: 'acknowledgePlayerRole',
  countName: 'playerRole'
}
const acknowledgePresidentPayload = {
  game: game,
  message: 'acknowledgePresident',
  countName: 'president'
}
const acknowledgeChancellorPayload = {
  game: game,
  message: 'acknowledgeChancellor',
  countName: 'chancellor'
}
const acknowledgeChosenPolicyPayload = {
  game: game,
  message: 'acknowledgeChosenPolicy',
  countName: 'chosenPolicy'
}
  message: 'acknowledgeChancellor',
  countName: 'chancellor'
}
const acknowledgeChosenPolicyPayload = {
  game: game,
  message: 'acknowledgeChosenPolicy',
  countName: 'chosenPolicy'
}

const allPlayersVote = (vote) => {
  actionController.voteOnChancellor({game: game, playerId: users.user1.id, vote: vote});
  actionController.voteOnChancellor({game: game, playerId: users.user2.id, vote: vote});
  actionController.voteOnChancellor({game: game, playerId: users.user3.id, vote: vote});
  actionController.voteOnChancellor({game: game, playerId: users.user4.id, vote: vote});
  actionController.voteOnChancellor({game: game, playerId: users.user5.id, vote: vote});
}

let suggestedChancellorId;

describe.only('Action controllers', function() {

  after(() => {
    server.close();
  })

  it('should set game message to correct game messages when acknowledging roles, fascists and president are done', () => {
    for (let i = 0; i < 5; i++) actionController.acknowledge(acknowledgePlayerRolePayload);
    game.message.should.equal('showFascists');

    for (let i = 0; i < 5; i++) actionController.acknowledge(acknowledgeFascistsPayload);
    game.message.should.equal('showPresident');

    for (let i = 0; i < 5; i++) actionController.acknowledge(acknowledgePresidentPayload);
    game.message.should.equal('suggestChancellor');

  });

  it('should set suggestedChancellor when president has suggested a chancellor and game message to "voteOnChancellor', () => {
    suggestedChancellorId = game.playerList[2].president ? users.user1.id : users.user3.id;
    actionController.suggestChancellor({game: game, playerId: suggestedChancellorId});
    game.suggestedChancellor.should.equal(suggestedChancellorId);
    game.message.should.equal('voteChancellor');
  });

  it('should set game.currentChancellor to new chancellor and game message to acknowledgeChancellor if vote is successful', () => {
    allPlayersVote('ja');
    game.currentChancellor.should.equal(suggestedChancellorId);
    game.message.should.equal('acknowledgeChancellor');
  });

  it('should get next player as president and set game message to showPresident if vote is not successful', () => {
    const presidentIndex = game.playerList.findIndex(player => {
      return player.user.id === game.currentPresident;
    });
    allPlayersVote('nein');
    const newPresidentIndex = game.playerList.findIndex(player => {
      return player.user.id === game.currentPresident;
    });
    if (presidentIndex === game.playerList.length - 1) {
      newPresidentIndex.should.equal(0);
    } else {
      newPresidentIndex.should.equal(presidentIndex + 1);
    }
    game.message.should.equal('showPresident');
  });

  it('should set game message to "showPresidentPolicyCard" when acknowledging Chancellor is done', () => {
    for (let i = 0; i < 5; i++) {
      actionController.acknowledge(acknowledgeChancellorPayload);
    }
    game.message.should.equal('showPresidentPolicyCards');
  });
  
});
