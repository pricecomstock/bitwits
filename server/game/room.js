const Game = require("./game");
const generateBase64Id = require("./util").generateBase64Id;

class Room {
  constructor(code, data) {
    //TODO: Add game options
    this._code = code;

    // TODO: Maybe hash this but it definitely does not matter for first demo
    this._adminKey = generateBase64Id(30);
    this._playerSockets = [];

    // Room state
    this._game = new Game();
  }

  get adminKey() {
    return this._adminKey;
  }

  get code() {
    return this._code;
  }

  get choices() {
    return this._choices;
  }

  getPlayerWithId(playerId) {
    return this._playerSockets.find((player) => {
      return player.playerId === playerId;
    });
  }

  // TODO: Add player object and use that to track player votes and states.
  // It would probably work ok across different games and stuff too.
  addPlayer(player) {
    this._playerSockets.push(player);
  }

  get players() {
    return this._playerSockets;
  }

  get playerData() {
    return this._playerSockets.map((playerSocket) => {
      return playerSocket.playerData;
    });
  }

  get gameState() {
    return this._game.state;
  }

  summary() {
    let state = {
      players: this._players, // TODO probably map just the data
    };
    return state;
  }
}

module.exports = Room;
