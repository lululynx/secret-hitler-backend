class GameList {
  constructor() {
   if (!GameList.instance) {
     this._games = {};
     GameList.instance = this;
   }
   return GameList.instance;
  }

  add(game) {
    this._games[game.id] = game;
  }

  get(id) {
    return this._games[game.id];
  }
}

const instance = new GameList();
Object.freeze(instance);

export default instance;