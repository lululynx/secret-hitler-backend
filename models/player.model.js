exports.Player = class Player {
  constructor(user) {
    this.user = user;
    this.faction = undefined;
    this.hitler = false;
    this.president = false;
    this.chancellor = false;
    this.executed = false;
    this.chancellorVote = null;
  }
}