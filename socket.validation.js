const {gameList} = require('./models/gameList.model');

const validateUser = (client, user) => {
  if (!user.id) return 'A user must have an id';
  if (!user.name) return 'A user must have a name';
}

exports.validatePayload = (client, payload) => {
  const {gameId, playerId, user} = payload;
  if (gameId) {
    const game = gameList.get(gameId);
    if (!game) return 'No game found with id ' + gameId;
    if (playerId && !game.getPlayer(playerId)) {
      return `Invalid player id ${playerId} for game with id ${gameId}`;
    }
    payload.game = game;
  }
  if (user) return validateUser(client, user);
}