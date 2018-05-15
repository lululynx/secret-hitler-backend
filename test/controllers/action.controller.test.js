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
